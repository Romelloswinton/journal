// services/geminiAiService.ts

import geminiService from "@/app/api/geminiConfig"

interface CategorySuggestionRequest {
  text: string
  existingCategories?: string[]
  maxResults?: number
  sourceType?: "note" | "category" // Add source type to differentiate between notes and categories
}

interface CategorySuggestionResponse {
  suggestions: string[]
  reasoning?: string
}

/**
 * Get category suggestions from Gemini AI
 */
export async function getSuggestedCategories({
  text,
  existingCategories = [],
  maxResults = 5,
  sourceType = "category", // Default to category for backward compatibility
}: CategorySuggestionRequest): Promise<CategorySuggestionResponse> {
  try {
    // Check if Gemini is configured
    if (!geminiService.isConfigured()) {
      throw new Error("Gemini API key not configured")
    }

    // Get the appropriate model based on source type
    // For note analysis, we use the more capable pro model
    // For category generation, we use the faster flash model
    const model =
      sourceType === "note"
        ? geminiService.getCompletionModel()
        : geminiService.getChatModel({
            temperature: 0.7,
            topP: 0.9,
          })

    // Format existing categories for the prompt
    const existingCategoriesText =
      existingCategories.length > 0
        ? `\nExisting categories: ${existingCategories.join(", ")}`
        : "\nThere are no existing categories yet."

    // Use different prompts based on the source type
    let prompt

    if (sourceType === "note") {
      // Prompt optimized for analyzing note content
      prompt = `
        Analyze this note content and suggest ${maxResults} appropriate category tags:
        "${text.trim()}"
        ${existingCategoriesText}
        
        Requirements:
        - Extract categories DIRECTLY from topics mentioned in the note
        - Each category should be 1-3 words
        - Categories should be specific to the note content, not generic
        - Timestamp: ${Date.now()} (to prevent repeated results)
        
        Return only:
        {
          "suggestions": ["Category1", "Category2", ...],
          "reasoning": "Brief explanation of how these categories relate to the note content"
        }
      `
    } else {
      // Original prompt for category name suggestions
      prompt = `
        Generate ${maxResults} category tags for:
        "${text.trim()}"
        ${existingCategoriesText}
        
        Requirements:
        - 1-3 words per category
        - General but relevant 
        - JSON format
        - Timestamp: ${Date.now()} (to prevent repeated results)
        
        Return only:
        {
          "suggestions": ["Category1", "Category2", ...],
          "reasoning": "Brief rationale"
        }
      `
    }

    // Generate content
    const result = await model.generateContent(prompt)
    const response = result.response
    const textResponse = response.text()

    // Extract JSON from the response
    // The AI might wrap the JSON in markdown code blocks, so we need to extract it
    const jsonMatch =
      textResponse.match(/```json\n([\s\S]*?)\n```/) ||
      textResponse.match(/```\n([\s\S]*?)\n```/) ||
      textResponse.match(/{[\s\S]*}/)

    let jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse

    // Clean up any potential non-JSON content
    jsonStr = jsonStr.replace(/^[^{]*/, "").replace(/[^}]*$/, "")

    // Parse the JSON
    const data = JSON.parse(jsonStr) as CategorySuggestionResponse

    // Ensure we have the expected properties
    if (!data.suggestions || !Array.isArray(data.suggestions)) {
      throw new Error("Invalid response format from AI")
    }

    // Limit the number of suggestions
    data.suggestions = data.suggestions.slice(0, maxResults)

    return data
  } catch (error) {
    console.error("Error getting category suggestions from Gemini:", error)

    // Return a fallback response with basic categories
    return {
      suggestions: [
        "General",
        "Notes",
        "Miscellaneous",
        "Reference",
        "Personal",
      ],
      reasoning: "Failed to get AI suggestions, providing default categories.",
    }
  }
}

/**
 * Check if a new category name would create a duplicate with existing categories
 */
export async function checkCategoryDuplication({
  newCategoryName,
  existingCategories = [],
}: {
  newCategoryName: string
  existingCategories: string[]
}): Promise<{
  isDuplicate: boolean
  similarCategories: { name: string; similarityScore: number }[]
  reasoning?: string
}> {
  try {
    // Check if Gemini is configured
    if (!geminiService.isConfigured()) {
      throw new Error("Gemini API key not configured")
    }

    // Use the completion model with default settings
    const model = geminiService.getCompletionModel()

    // Create the optimized prompt for the AI
    const prompt = `
      Check if "${newCategoryName}" duplicates: ${existingCategories.join(", ")}
      
      Score similarity (0-1):
      - 1.0: identical
      - 0.7+: redundant
      - 0.5-0.7: similar
      - <0.5: different
      
      Consider: semantics, hierarchy, scope
      
      Return only:
      {
        "isDuplicate": boolean,
        "similarCategories": [{"name": "Category", "similarityScore": N}],
        "reasoning": "Brief explanation"
      }
      
      Include scores >0.5, sorted descending.
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = result.response
    const textResponse = response.text()

    // Extract JSON from the response
    const jsonMatch =
      textResponse.match(/```json\n([\s\S]*?)\n```/) ||
      textResponse.match(/```\n([\s\S]*?)\n```/) ||
      textResponse.match(/{[\s\S]*}/)

    let jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse

    // Clean up any potential non-JSON content
    jsonStr = jsonStr.replace(/^[^{]*/, "").replace(/[^}]*$/, "")

    // Parse the JSON
    const data = JSON.parse(jsonStr)

    return {
      isDuplicate: !!data.isDuplicate,
      similarCategories: data.similarCategories || [],
      reasoning: data.reasoning,
    }
  } catch (error) {
    console.error("Error checking category duplication with Gemini:", error)

    // Perform basic similarity check as fallback
    const similarCategories = existingCategories
      .map((category) => {
        const lowerCaseNew = newCategoryName.toLowerCase()
        const lowerCaseExisting = category.toLowerCase()

        let score = 0
        // Exact match
        if (lowerCaseNew === lowerCaseExisting) {
          score = 1.0
        }
        // One contains the other
        else if (
          lowerCaseNew.includes(lowerCaseExisting) ||
          lowerCaseExisting.includes(lowerCaseNew)
        ) {
          score = 0.8
        }
        // Simple word matching
        else {
          const newWords = lowerCaseNew.split(/\s+/)
          const existingWords = lowerCaseExisting.split(/\s+/)
          const commonWords = newWords.filter((word) =>
            existingWords.includes(word)
          )
          if (commonWords.length > 0) {
            score =
              0.6 *
              (commonWords.length /
                Math.max(newWords.length, existingWords.length))
          }
        }

        return { name: category, similarityScore: score }
      })
      .filter((item) => item.similarityScore >= 0.5)
      .sort((a, b) => b.similarityScore - a.similarityScore)

    return {
      isDuplicate: similarCategories.some((cat) => cat.similarityScore > 0.8),
      similarCategories,
      reasoning: "Similarity check performed using basic text comparison.",
    }
  }
}
