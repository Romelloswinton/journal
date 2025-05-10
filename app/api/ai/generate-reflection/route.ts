import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Import the Google Generative AI API
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Get API key from database if available
async function getApiKey(service: string) {
  try {
    // Import db only when needed to avoid circular dependencies
    const { db } = await import("@/lib/db")

    const apiKey = await db.aPIKey.findFirst({
      where: {
        service,
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return apiKey?.keyValue
  } catch (error) {
    console.error("Error fetching API key:", error)
    return null
  }
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
      console.log("Received AI generation prompt:", body)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    try {
      // Try to use Gemini API first
      try {
        // Try to get a fresh API key from the database
        const geminiApiKey =
          (await getApiKey("gemini")) || process.env.GEMINI_API_KEY

        if (!geminiApiKey) {
          throw new Error("No valid Gemini API key found")
        }

        // Initialize the Gemini API with the fetched key
        const geminiClient = new GoogleGenerativeAI(geminiApiKey)

        // Get the Gemini pro model
        const model = geminiClient.getGenerativeModel({
          model: "gemini-1.5-flash",
        })

        // Create the system prompt for the AI
        const fullPrompt = `
          You are an AI assistant that helps users create thoughtful reflections based on their prompts.
          Generate a reflective journal entry based on the following prompt: "${prompt}"
          
          Include the following components in your response:
          1. A relevant title
          2. Thoughtful content (300-500 words) with line breaks for readability
          3. 2-4 relevant tags
          4. Metrics for mood, energy, and clarity (on a scale of 1-10)
          5. 2-4 key insights from the reflection
          
          Format your response as a valid JSON object with the following structure:
          {
            "title": "The reflection title",
            "content": "The reflection content with line breaks",
            "tags": ["tag1", "tag2", "tag3"],
            "metrics": {
              "mood": 7,
              "energy": 6,
              "clarity": 8
            },
            "insights": ["Insight 1", "Insight 2", "Insight 3"]
          }
          
          Make sure the response is ONLY the JSON object and nothing else. No additional text before or after the JSON.
        `

        // Generate the content with Gemini
        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()

        console.log("Raw Gemini response:", text)

        // Extract JSON from the response
        // Sometimes Gemini might include markdown code blocks or extra text
        const jsonMatch =
          text.match(/```json\s*([\s\S]*?)\s*```/) ||
          text.match(/```\s*([\s\S]*?)\s*```/) ||
          text.match(/(\{[\s\S]*\})/)

        const jsonString = jsonMatch ? jsonMatch[1] : text

        // Parse the JSON response
        const reflectionData = JSON.parse(jsonString.trim())

        // Add isAIGenerated flag
        reflectionData.isAIGenerated = true

        // Ensure the metrics are in the correct range (1-10)
        if (reflectionData.metrics) {
          reflectionData.metrics.mood = Math.min(
            Math.max(reflectionData.metrics.mood || 5, 1),
            10
          )
          reflectionData.metrics.energy = Math.min(
            Math.max(reflectionData.metrics.energy || 5, 1),
            10
          )
          reflectionData.metrics.clarity = Math.min(
            Math.max(reflectionData.metrics.clarity || 5, 1),
            10
          )
        } else {
          reflectionData.metrics = { mood: 5, energy: 5, clarity: 5 }
        }

        // Ensure tags and insights are arrays
        reflectionData.tags = Array.isArray(reflectionData.tags)
          ? reflectionData.tags
          : []
        reflectionData.insights = Array.isArray(reflectionData.insights)
          ? reflectionData.insights
          : []

        console.log("Gemini-generated reflection:", reflectionData)
        return NextResponse.json(reflectionData)
      } catch (geminiError) {
        // Log the Gemini error
        console.error("Error with Gemini API:", geminiError)

        // Fall back to a local generation method
        console.log("Falling back to local generation method")

        // Implement a simple reflection generator
        const localReflection = generateLocalReflection(prompt)
        return NextResponse.json(localReflection)
      }
    } catch (aiError) {
      console.error("Error generating reflection:", aiError)
      return NextResponse.json(
        {
          error: "Failed to generate reflection",
          details: aiError instanceof Error ? aiError.message : String(aiError),
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[AI_GENERATE_REFLECTION] Unexpected error:", error)
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

// Helper function to generate a basic reflection locally without API calls
function generateLocalReflection(prompt: string) {
  // Extract some keywords from the prompt
  const keywords = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .filter(
      (word) =>
        ![
          "what",
          "when",
          "where",
          "which",
          "this",
          "that",
          "have",
          "about",
        ].includes(word)
    )

  // Determine sentiment (very basic approach)
  const positiveWords = [
    "happy",
    "joy",
    "exciting",
    "positive",
    "great",
    "good",
    "love",
    "grateful",
  ]
  const negativeWords = [
    "sad",
    "anxiety",
    "stress",
    "worry",
    "difficult",
    "challenging",
    "problem",
    "issue",
  ]

  const positiveCount = keywords.filter((word) =>
    positiveWords.some((pw) => word.includes(pw))
  ).length
  const negativeCount = keywords.filter((word) =>
    negativeWords.some((nw) => word.includes(nw))
  ).length

  const sentiment =
    positiveCount > negativeCount
      ? "positive"
      : negativeCount > positiveCount
      ? "negative"
      : "neutral"

  // Generate metrics based on sentiment
  const metrics = {
    mood: sentiment === "positive" ? 8 : sentiment === "negative" ? 4 : 6,
    energy: sentiment === "positive" ? 7 : sentiment === "negative" ? 5 : 6,
    clarity: sentiment === "positive" ? 8 : sentiment === "negative" ? 5 : 7,
  }

  // Extract some unique keywords for tags (up to 3)
  const uniqueKeywords = [...new Set(keywords)].slice(0, 3)
  const tags =
    uniqueKeywords.length >= 2 ? uniqueKeywords : ["reflection", "personal"]

  // Generate a simple title
  const title = `Reflection on ${
    uniqueKeywords[0]?.charAt(0).toUpperCase() + uniqueKeywords[0]?.slice(1) ||
    "My Thoughts"
  }`

  // Generate content
  const content = `I've been reflecting on ${prompt}. 
  
This has been on my mind lately, and I wanted to take some time to explore my thoughts and feelings about it. 

Through this reflection, I've come to realize that it's important to give myself space to process my experiences and emotions. Sometimes the simple act of writing down what I'm thinking helps bring clarity.

I'm going to keep exploring this topic and see what other insights emerge as I continue to reflect on it.`

  // Generate insights
  const insights = [
    "Taking time to reflect helps bring clarity to complex thoughts",
    "Writing down experiences helps process emotions more effectively",
  ]

  return {
    title,
    content,
    tags,
    metrics,
    insights,
    isAIGenerated: true,
  }
}
