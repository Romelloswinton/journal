// app/api/journal/prompt/route.ts

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Define prompt categories to help guide Gemini
const PROMPT_CATEGORIES = {
  reflection: "personal reflection and self-awareness",
  growth: "personal growth and development",
  relationships: "relationships and social connections",
  wellbeing: "mental health and wellbeing",
  purpose: "life purpose and meaning",
  creativity: "creativity and imagination",
}

// Fallback prompts in case the API is unavailable
const FALLBACK_PROMPTS = [
  "What emotions have been most present for you lately?",
  "What are you grateful for today?",
  "Describe a challenge you're currently facing and how you might overcome it.",
  "What would your future self want you to know right now?",
  "What brings you joy, and how can you incorporate more of it into your life?",
  "Reflect on a recent interaction that affected you. What did you learn from it?",
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
 * Generate a random prompt when Gemini API fails
 */
function getRandomFallbackPrompt(): string {
  const index = Math.floor(Math.random() * FALLBACK_PROMPTS.length)
  return FALLBACK_PROMPTS[index]
}

/**
 * GET endpoint to generate a journal prompt
 */
export async function GET(request: Request) {
  try {
    // Get authenticated user
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
      )
    }

    // Parse any query parameters
    const url = new URL(request.url)
    const category = url.searchParams.get("category") || "all"

    // Get the API key
    const apiKey = await getApiKey()

    // If no API key, fall back to a predefined prompt
    if (!apiKey) {
      return NextResponse.json({ prompt: getRandomFallbackPrompt() })
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Construct the prompt for Gemini
    let promptText =
      "Generate a thoughtful, insightful journaling prompt that encourages self-reflection. "

    // Add category context if specified
    if (
      category !== "all" &&
      PROMPT_CATEGORIES[category as keyof typeof PROMPT_CATEGORIES]
    ) {
      promptText += `The prompt should focus on ${
        PROMPT_CATEGORIES[category as keyof typeof PROMPT_CATEGORIES]
      }. `
    }

    promptText +=
      "The prompt should be a single question or statement that encourages deep thinking, about 15-30 words long. Don't include any prefixes like 'Prompt:' or similar - just provide the prompt itself."

    // Generate content with Gemini
    try {
      const result = await model.generateContent(promptText)
      const response = await result.response
      const text = response.text().trim()

      // Log and return the response
      console.log("Generated prompt:", text)
      return NextResponse.json({ prompt: text })
    } catch (aiError) {
      console.error("Error generating with Gemini:", aiError)
      return NextResponse.json({ prompt: getRandomFallbackPrompt() })
    }
  } catch (error) {
    console.error("Error in GET /api/journal/prompt:", error)
    return NextResponse.json(
      { error: "Failed to generate prompt", prompt: getRandomFallbackPrompt() },
      { status: 500 }
    )
  }
}
