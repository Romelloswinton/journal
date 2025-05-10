// lib/gemini/geminiApiClient.ts

import { GoogleGenerativeAI } from "@google/generative-ai"
import { AllReflections } from "./types"

interface EntryData {
  priority: string
  worry: string
  positive: string
}

interface ReflectionData {
  priority: string
  worry: string
  positive: string
}

interface DeeperInsight {
  title: string
  insight: string
  practicalSteps: string[]
  connectionToOtherAreas: string
}

interface InsightsData {
  overallPattern: string
  keyInsights: DeeperInsight[]
  personalizedGrowthPath: string
}

class GeminiApiClient {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  }

  async generateAllReflections(entries: EntryData): Promise<AllReflections> {
    const prompt = `
      You are an AI wellness companion providing thoughtful reflections on a user's journal entries. Analyze the following three entries and provide:
      
      1. An upgraded reflection for each entry (2-3 sentences that expands on their thought)
      2. A follow-up question (spark) for each entry to encourage deeper thinking

      User's Entries:
      Priority: "${entries.priority}"
      Worry: "${entries.worry}"
      Positive Action: "${entries.positive}"

      Respond in JSON format:
      {
        "priority": {
          "upgrade": "Your upgraded reflection...",
          "spark": "Your follow-up question..."
        },
        "worry": {
          "upgrade": "Your upgraded reflection...",
          "spark": "Your follow-up question..."
        },
        "positive": {
          "upgrade": "Your upgraded reflection...",
          "spark": "Your follow-up question..."
        }
      }
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini")
      }

      const reflections = JSON.parse(jsonMatch[0])
      return reflections
    } catch (error) {
      console.error("Error generating reflections:", error)
      throw error
    }
  }

  async generateDeeperInsights(data: {
    originalEntries: EntryData
    reflections: ReflectionData
  }): Promise<InsightsData> {
    const prompt = `
      You are an AI wellness companion providing deeper insights based on the user's journal entries and their reflections. 
      
      Original entries:
      Priority: "${data.originalEntries.priority}"
      Worry: "${data.originalEntries.worry}"
      Positive Action: "${data.originalEntries.positive}"
      
      User's reflections:
      On Priority: "${data.reflections.priority}"
      On Worry: "${data.reflections.worry}"
      On Positive Action: "${data.reflections.positive}"
      
      Analyze the patterns, connections, and growth opportunities. Provide:
      
      1. An overall pattern or theme you notice across all entries and reflections
      2. Three key insights with:
         - A title for the insight
         - The insight itself (3-4 sentences)
         - 2-3 practical steps they can take
         - How this connects to other areas of their life
      3. A personalized growth path recommendation
      
      Respond in JSON format:
      {
        "overallPattern": "The overall pattern...",
        "keyInsights": [
          {
            "title": "Insight title",
            "insight": "The insight explanation...",
            "practicalSteps": ["Step 1", "Step 2", "Step 3"],
            "connectionToOtherAreas": "How this connects..."
          }
        ],
        "personalizedGrowthPath": "Your personalized recommendation..."
      }
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini")
      }

      const insights = JSON.parse(jsonMatch[0])
      return insights
    } catch (error) {
      console.error("Error generating deeper insights:", error)
      throw error
    }
  }
}

const geminiApiClient = new GeminiApiClient()
export default geminiApiClient
