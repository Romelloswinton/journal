// app/api/rosebud/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Define the message structure
interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

// Fallback responses in case the API is unavailable
const FALLBACK_RESPONSES = [
  "Based on your journal entries, I notice you've been reflecting deeply on your experiences. This kind of self-awareness is valuable for personal growth.\n\nI've observed patterns of thoughtfulness in your writing. Continue exploring these reflections as they help build understanding.\n\nConsider journaling about specific moments that made you feel strongly, as these can provide valuable insights about your values and priorities.",
  "It seems from your entries that you're navigating some changes in your life. Remember that periods of transition often bring valuable opportunities for growth.\n\nYou appear to be conscientious about how you respond to challenges. This mindfulness serves you well as you process your experiences.\n\nTry exploring how your current situation connects to your broader life goals and values. This perspective might offer useful insights.",
  "Your journal shows thoughtful reflection on your relationships and connections. The way you consider others' perspectives demonstrates emotional intelligence.\n\nI notice you frequently mention moments of gratitude. Continuing this practice can build resilience during challenging times.\n\nConsider exploring how your past experiences have shaped your current approach to situations. This historical lens might reveal interesting patterns.",
]

/**
 * Fetch the Gemini API key from our database or environment variables
 */
async function getApiKey(): Promise<string | null> {
  try {
    // Try to get the key from database first
    const apiKey = await db.aPIKey.findFirst({
      where: {
        service: "gemini",
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    if (apiKey?.keyValue) {
      return apiKey.keyValue
    }

    // Fall back to environment variable
    return process.env.GEMINI_API_KEY || null
  } catch (error) {
    console.error("Error fetching Gemini API key:", error)
    return null
  }
}

/**
 * Get mood value safely from entry metrics
 */
function getMoodFromEntry(entry: any): number {
  try {
    if (!entry.metrics) return 5 // Default if no metrics

    // Handle if metrics is a string (JSON)
    if (typeof entry.metrics === "string") {
      try {
        const parsedMetrics = JSON.parse(entry.metrics)
        return parsedMetrics.mood || 5
      } catch (e) {
        return 5
      }
    }

    // Handle if metrics is an object
    if (typeof entry.metrics === "object" && entry.metrics !== null) {
      return entry.metrics.mood || 5
    }

    return 5 // Default fallback
  } catch (error) {
    return 5 // Default on any error
  }
}

/**
 * Generate a random response when Gemini API fails
 */
function getRandomFallbackResponse(): string {
  const index = Math.floor(Math.random() * FALLBACK_RESPONSES.length)
  return FALLBACK_RESPONSES[index]
}

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { query, messages, conversationId, continueConversation } = body

    if (!query || typeof query !== "string") {
      return new NextResponse("Query is required", { status: 400 })
    }

    // Find the user in our database using Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get recent entries to provide context for Gemini
    const recentEntries = await db.journalEntry2.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit to 5 recent entries for context
    })

    // Also check old entries format for completeness
    const oldEntries = await db.journalEntry.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Transform old entries to new format and combine with new ones
    const transformedOldEntries = oldEntries.map((entry) => {
      return {
        id: entry.id,
        title: entry.title || "Untitled Entry",
        content: entry.content,
        tags: entry.tags.map((t) => t.tag.name),
        metrics: {
          mood: entry.mood ? parseInt(entry.mood.toString()) : 5,
          energy: 5,
          clarity: 5,
        },
        insights: [],
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      }
    })

    // Combine both types of entries and sort by date
    const allRecentEntries = [...recentEntries, ...transformedOldEntries]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5) // Keep only the 5 most recent

    // Get the API key
    const apiKey = await getApiKey()

    // If no API key, fall back to a predefined response
    if (!apiKey) {
      const fallbackResponse = getRandomFallbackResponse()

      // Check if we're continuing an existing conversation
      if (continueConversation && conversationId) {
        // Find the existing conversation
        const existingConversation = await db.rosebudConversation.findUnique({
          where: {
            id: conversationId,
            userId: user.id,
          },
        })

        if (!existingConversation) {
          return NextResponse.json(
            { error: "Conversation not found" },
            { status: 404 }
          )
        }

        // Update the conversation with the fallback response
        // Store messages if provided, otherwise create basic structure
        const storedMessages: ConversationMessage[] = messages || [
          { role: "user", content: existingConversation.query },
          { role: "assistant", content: existingConversation.response },
          { role: "user", content: query },
          { role: "assistant", content: fallbackResponse },
        ]

        // Update the existing conversation
        const updatedConversation = await db.rosebudConversation.update({
          where: {
            id: conversationId,
          },
          data: {
            // No need to update query/response fields as they stay the same for the initial exchange
            updatedAt: new Date(),
            // Store the entire message history
            messages: JSON.stringify(storedMessages),
          },
        })

        return NextResponse.json({
          id: updatedConversation.id,
          query: existingConversation.query,
          response: existingConversation.response,
          messages: storedMessages,
          createdAt: existingConversation.createdAt,
          updatedAt: updatedConversation.updatedAt,
          latestResponse: fallbackResponse, // Renamed to avoid duplicate properties
        })
      } else {
        // Create a new conversation with fallback response
        const savedConversation = await db.rosebudConversation.create({
          data: {
            userId: user.id,
            query,
            response: fallbackResponse,
            messages: JSON.stringify([
              { role: "user", content: query },
              { role: "assistant", content: fallbackResponse },
            ]),
          },
        })

        return NextResponse.json({
          id: savedConversation.id,
          query,
          response: fallbackResponse,
          messages: [
            { role: "user", content: query },
            { role: "assistant", content: fallbackResponse },
          ],
          createdAt: savedConversation.createdAt,
        })
      }
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Construct context for the AI from recent entries
    let entriesContext = ""
    if (allRecentEntries.length > 0) {
      entriesContext = allRecentEntries
        .map((entry) => {
          // Get mood safely, handling potential type issues
          const moodValue = getMoodFromEntry(entry)

          return `Entry Title: ${entry.title}\nDate: ${new Date(
            entry.createdAt
          ).toLocaleDateString()}\nContent: ${
            entry.content
          }\nMood: ${moodValue}/10\n\n`
        })
        .join("")
    } else {
      entriesContext = "No journal entries available yet."
    }

    // Additional context for conversation history if we're continuing a thread
    let conversationContext = ""
    if (continueConversation && messages && messages.length > 2) {
      // Get the previous conversation history, excluding the most recent user query
      const previousMessages = messages.slice(0, -1)

      conversationContext =
        "\nHere is our conversation history so far:\n\n" +
        previousMessages
          .map(
            (msg: ConversationMessage) =>
              `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
          )
          .join("\n\n") +
        "\n\nPlease provide a coherent follow-up to this conversation based on the latest query."
    }

    // Build the prompt for Gemini
    const promptText = `You are Rosebud, an insightful journaling assistant. Your task is to provide thoughtful, personalized responses based on the user's journal entries and questions.
    
Here are some recent journal entries from the user to provide context for your response:

${entriesContext}
${conversationContext}

Based on these entries, provide an insightful, empathetic response to the user's question: "${query}"

Identify patterns, suggest reflections, or offer gentle guidance as appropriate. 
Keep your response supportive, non-judgmental, and focused on self-discovery.
Your goal is to help the user gain deeper insights about themselves through your response.
If you don't have enough information from their entries, you can acknowledge that and ask thoughtful follow-up questions.
Limit your response to 3-4 paragraphs.`

    try {
      // Generate content with Gemini
      const result = await model.generateContent(promptText)
      const response = await result.response
      const text = response.text().trim()

      // If continuing a conversation, update the existing one
      if (continueConversation && conversationId) {
        // Find the existing conversation
        const existingConversation = await db.rosebudConversation.findUnique({
          where: {
            id: conversationId,
            userId: user.id,
          },
        })

        if (!existingConversation) {
          return NextResponse.json(
            { error: "Conversation not found" },
            { status: 404 }
          )
        }

        // Update the conversation with the new response
        // Store messages if provided, otherwise create basic structure
        const storedMessages: ConversationMessage[] = messages
          ? [...messages, { role: "assistant", content: text }]
          : [
              { role: "user", content: existingConversation.query },
              { role: "assistant", content: existingConversation.response },
              { role: "user", content: query },
              { role: "assistant", content: text },
            ]

        // Update the existing conversation
        const updatedConversation = await db.rosebudConversation.update({
          where: {
            id: conversationId,
          },
          data: {
            // No need to update query/response fields as they stay the same for the initial exchange
            updatedAt: new Date(),
            // Store the entire message history
            messages: JSON.stringify(storedMessages),
          },
        })

        return NextResponse.json({
          id: updatedConversation.id,
          query: existingConversation.query,
          response: existingConversation.response,
          messages: storedMessages,
          createdAt: existingConversation.createdAt,
          updatedAt: updatedConversation.updatedAt,
          latestResponse: text, // Renamed to avoid duplicate properties
        })
      } else {
        // Create a new conversation
        const savedConversation = await db.rosebudConversation.create({
          data: {
            userId: user.id,
            query,
            response: text,
            messages: JSON.stringify([
              { role: "user", content: query },
              { role: "assistant", content: text },
            ]),
          },
        })

        return NextResponse.json({
          id: savedConversation.id,
          query,
          response: text,
          messages: [
            { role: "user", content: query },
            { role: "assistant", content: text },
          ] as ConversationMessage[],
          createdAt: savedConversation.createdAt,
        })
      }
    } catch (aiError) {
      console.error("Error generating with Gemini:", aiError)

      // Use fallback if Gemini fails
      const fallbackResponse = getRandomFallbackResponse()

      // If continuing an existing conversation, update instead of creating new
      if (continueConversation && conversationId) {
        // Find the existing conversation
        const existingConversation = await db.rosebudConversation.findUnique({
          where: {
            id: conversationId,
            userId: user.id,
          },
        })

        if (!existingConversation) {
          return NextResponse.json(
            { error: "Conversation not found" },
            { status: 404 }
          )
        }

        // Update the conversation with the fallback response
        const storedMessages: ConversationMessage[] = messages
          ? [...messages, { role: "assistant", content: fallbackResponse }]
          : [
              { role: "user", content: existingConversation.query },
              { role: "assistant", content: existingConversation.response },
              { role: "user", content: query },
              { role: "assistant", content: fallbackResponse },
            ]

        // Update the existing conversation
        const updatedConversation = await db.rosebudConversation.update({
          where: {
            id: conversationId,
          },
          data: {
            updatedAt: new Date(),
            messages: JSON.stringify(storedMessages),
          },
        })

        return NextResponse.json({
          id: updatedConversation.id,
          query: existingConversation.query,
          response: existingConversation.response,
          messages: storedMessages,
          createdAt: existingConversation.createdAt,
          updatedAt: updatedConversation.updatedAt,
          latestResponse: fallbackResponse, // Renamed to avoid duplicate properties
        })
      } else {
        // Create a new conversation with fallback response
        const savedConversation = await db.rosebudConversation.create({
          data: {
            userId: user.id,
            query,
            response: fallbackResponse,
            messages: JSON.stringify([
              { role: "user", content: query },
              { role: "assistant", content: fallbackResponse },
            ]),
          },
        })

        return NextResponse.json({
          id: savedConversation.id,
          query,
          response: fallbackResponse,
          messages: [
            { role: "user", content: query },
            { role: "assistant", content: fallbackResponse },
          ],
          createdAt: savedConversation.createdAt,
        })
      }
    }
  } catch (error) {
    console.error("[ROSEBUD_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// GET route to fetch past conversations
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find the user in our database using Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get past conversations, ordered by updatedAt to show recently active conversations first
    const conversations = await db.rosebudConversation.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc", // Order by last update time instead of creation time
      },
      take: 10, // Limit to 10 most recent conversations
    })

    // Parse messages field for each conversation if it exists
    const processedConversations = conversations.map((conversation) => {
      if (conversation.messages) {
        try {
          const parsedMessages = JSON.parse(conversation.messages.toString())
          return {
            ...conversation,
            messages: parsedMessages,
          }
        } catch (e) {
          // If parsing fails, return original conversation
          console.error(
            `Failed to parse messages for conversation ${conversation.id}:`,
            e
          )
          return conversation
        }
      }
      return conversation
    })

    return NextResponse.json(processedConversations)
  } catch (error) {
    console.error("[ROSEBUD_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
