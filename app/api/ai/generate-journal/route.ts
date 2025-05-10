// app/api/ai/generate-journal/route.ts

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "@/lib/db"

// Initialize Gemini API
async function getGeminiClient() {
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
      const genAI = new GoogleGenerativeAI(apiKey.keyValue)
      return genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    }

    // Fall back to environment variable
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      return genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    }

    return null
  } catch (error) {
    console.error("Error initializing Gemini client:", error)
    return null
  }
}

// Local fallback generator in case Gemini API fails
function generateLocalJournalEntry(prompt: string, userResponse: string) {
  // Create a basic title based on the prompt
  const title = "Reflection: " + prompt.split(" ").slice(0, 5).join(" ") + "..."

  // Combine user's response with some additional text
  const content = `${userResponse}\n\n${getRandomInsight()}`

  // Extract potential tags from the prompt and response
  const potentialTags = [...prompt.split(" "), ...userResponse.split(" ")]
    .filter((word) => word.length > 4)
    .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(
      (word) =>
        ![
          "about",
          "would",
          "could",
          "should",
          "their",
          "there",
          "where",
          "which",
          "because",
          "through",
        ].includes(word)
    )

  // Take up to 3 unique potential tags
  const uniqueTags = [...new Set(potentialTags)].slice(0, 3)

  return {
    title,
    content,
    tags: uniqueTags,
    metrics: {
      mood: Math.floor(Math.random() * 4) + 5, // 5-8 range
      energy: Math.floor(Math.random() * 4) + 4, // 4-7 range
      clarity: Math.floor(Math.random() * 4) + 5, // 5-8 range
    },
    insights: [
      getRandomInsight(),
      "Reflection helps develop self-awareness.",
      "Journaling regularly improves mental clarity.",
    ],
  }
}

// Generate a random insight for local fallback
function getRandomInsight() {
  const insights = [
    "Taking time to reflect on our experiences helps us grow.",
    "Acknowledging our feelings is the first step to understanding them.",
    "Writing thoughts down creates space for new perspectives.",
    "Regular journaling reveals patterns in our thinking and behavior.",
    "Self-reflection builds emotional intelligence over time.",
    "Our challenges often contain valuable lessons when we pause to examine them.",
  ]
  return insights[Math.floor(Math.random() * insights.length)]
}

export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
      )
    }

    // Parse the request body
    let body
    try {
      body = await req.json()
      console.log("Received journal enhancement request:", body)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { prompt, userResponse } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (!userResponse || userResponse.trim().length === 0) {
      return NextResponse.json(
        { error: "User response is required" },
        { status: 400 }
      )
    }

    // Get Gemini model
    const model = await getGeminiClient()

    // If model is unavailable, use local generation
    if (!model) {
      console.log("Gemini API unavailable, using local generation")
      const localEntry = generateLocalJournalEntry(prompt, userResponse)
      return NextResponse.json(localEntry)
    }

    // Create the system prompt for Gemini
    const systemPrompt = `
      You are an AI assistant that helps users enhance their journal entries.
      
      The user has responded to this prompt: "${prompt}"
      
      Their response is: "${userResponse}"
      
      Your task is to enhance their journal entry by:
      1. Creating a meaningful title that captures the essence of their writing
      2. Expanding on their thoughts with deeper insights while preserving their original voice and ideas
      3. Suggesting 2-4 relevant tags
      4. Providing metrics for mood, energy, and clarity (on a scale of 1-10) based on the content
      5. Extracting 2-4 key insights from the reflection
      
      Format your response as a JSON object with the following structure:
      {
        "title": "A meaningful title for the journal entry",
        "content": "The enhanced journal content that preserves the user's original writing but adds depth and insight",
        "tags": ["tag1", "tag2", "tag3"],
        "metrics": {
          "mood": 7,
          "energy": 6,
          "clarity": 8
        },
        "insights": ["Insight 1", "Insight 2", "Insight 3"]
      }

      Important guidelines:
      - Always preserve the user's original thoughts and voice
      - Never contradict or change the meaning of what they wrote
      - Add thoughtful expansions that build on their ideas
      - Create natural transitions between their writing and your enhancements
      - The content should feel like one cohesive piece of writing
      - Respect the user's emotional tone while adding depth
      - Never include placeholder text like "user's original content here" - actually incorporate their writing
    `

    try {
      // Generate the enhanced journal entry using Gemini
      const result = await model.generateContent([{ text: systemPrompt }])

      const response = await result.response
      const text = response.text()

      console.log("Generated content:", text.substring(0, 100) + "...")

      try {
        // Try to parse the response as JSON
        const jsonData = JSON.parse(text)
        return NextResponse.json(jsonData)
      } catch (jsonError) {
        console.error("Error parsing Gemini JSON response:", jsonError)
        console.log("Raw response:", text)

        // Try to extract JSON using regex as fallback
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0])
            return NextResponse.json(extractedJson)
          } catch (extractError) {
            console.error("Error parsing extracted JSON:", extractError)
          }
        }

        // If all parsing fails, use local generation
        const localEntry = generateLocalJournalEntry(prompt, userResponse)
        return NextResponse.json(localEntry)
      }
    } catch (aiError) {
      console.error("Error generating with Gemini:", aiError)

      // Use local generation as fallback
      const localEntry = generateLocalJournalEntry(prompt, userResponse)
      return NextResponse.json(localEntry)
    }
  } catch (error) {
    console.error("[GENERATE_JOURNAL] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    )
  }
}
