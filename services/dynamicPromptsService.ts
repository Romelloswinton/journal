// lib/services/dynamicPromptsService.ts

import { GoogleGenerativeAI } from "@google/generative-ai"

// Define prompt categories that we'll send to Gemini
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
 * Fetch an API key from our database or env vars
 * (This would connect to your actual key storage system)
 */
async function getApiKey(): Promise<string | null> {
  try {
    // Try to get the key from your database first
    const response = await fetch("/api/keys/gemini")
    if (response.ok) {
      const { key } = await response.json()
      return key
    }

    // Fall back to environment variable if database fetch fails
    return process.env.GEMINI_API_KEY || null
  } catch (error) {
    console.error("Error fetching Gemini API key:", error)
    return null
  }
}

/**
 * Generate a journal prompt using Gemini API
 * @param category Optional category to focus the prompt on
 * @returns A journaling prompt
 */
export async function generateJournalPrompt(
  category?: string
): Promise<string> {
  try {
    const apiKey = await getApiKey()

    // If no API key is available, return a fallback prompt
    if (!apiKey) {
      return getRandomFallbackPrompt()
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Construct the prompt for Gemini
    let promptText =
      "Generate a thoughtful, insightful journaling prompt that encourages self-reflection. "

    // Add category context if specified
    if (
      category &&
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
    const result = await model.generateContent(promptText)
    const response = await result.response
    const text = response.text().trim()

    // Return the generated prompt or fall back if empty
    return text || getRandomFallbackPrompt()
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error)
    return getRandomFallbackPrompt()
  }
}

/**
 * Get a random fallback prompt when API is unavailable
 */
function getRandomFallbackPrompt(): string {
  const randomIndex = Math.floor(Math.random() * FALLBACK_PROMPTS.length)
  return FALLBACK_PROMPTS[randomIndex]
}

/**
 * Get all available prompt categories
 */
export function getPromptCategories(): string[] {
  return ["all", ...Object.keys(PROMPT_CATEGORIES)]
}
