// services/journalService.ts

import { JournalEntry } from "@/app/store/journalStore"

export interface CreateJournalInput {
  title: string
  content: string
  tags: string[]
  metrics: {
    mood: number
    energy: number
    clarity: number
  }
  insights: string[]
  isAIGenerated: boolean
  templateId?: string
  colorScheme?: string
}

class JournalService {
  private baseUrl = "/api/journal"

  // Get all journal entries
  async getEntries(): Promise<JournalEntry[]> {
    try {
      console.log("📖 JournalService: Fetching entries from", this.baseUrl)

      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log(`📡 JournalService: Response status ${response.status}`)

      if (!response.ok) {
        // Handle different status codes appropriately
        if (response.status === 404) {
          console.warn(
            "No journal entries found for user, returning empty array"
          )
          return []
        }
        if (response.status === 401) {
          console.warn("User not authorized to fetch journal entries")
          return []
        }

        // Try to get error details
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error("❌ API Error Response:", errorData)
        } catch (parseError) {
          try {
            const textResponse = await response.text()
            console.error("❌ API Text Response:", textResponse)
            errorMessage = textResponse || errorMessage
          } catch (textError) {
            console.error("❌ Failed to read error response:", textError)
          }
        }

        throw new Error(errorMessage)
      }

      // Parse successful response
      let data
      try {
        data = await response.json()
        console.log(
          `✅ JournalService: Parsed response data (${typeof data}):`,
          Array.isArray(data) ? `Array[${data.length}]` : data
        )
      } catch (parseError) {
        console.error("❌ Failed to parse successful response:", parseError)
        throw new Error("Invalid JSON response from server")
      }

      // Ensure we always return an array
      if (!Array.isArray(data)) {
        console.error("❌ Expected array, got:", typeof data, data)
        throw new Error("Invalid response format: expected array of entries")
      }

      console.log(
        `✅ JournalService: Successfully fetched ${data.length} entries`
      )
      return data
    } catch (error: unknown) {
      console.error("❌ JournalService.getEntries failed:", error)

      // For authentication errors, re-throw to let the calling code handle
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        throw error
      }

      // For other errors, return empty array to prevent crashes
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      console.warn(
        "⚠️ JournalService: Returning empty array due to error:",
        errorMessage
      )
      return []
    }
  }

  // Get a single journal entry by ID
  async getEntry(id: string): Promise<JournalEntry | null> {
    try {
      // 🔧 FIXED: Use the correct endpoint structure
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view journal entries")
        }
        if (response.status === 404) {
          return null // Entry not found
        }

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          const textResponse = await response.text()
          errorMessage = textResponse || errorMessage
        }
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error: unknown) {
      console.error(`❌ Error fetching journal entry ${id}:`, error)
      if (error instanceof Error) {
        throw error
      }
      return null
    }
  }

  // Create a new journal entry
  async createEntry(data: CreateJournalInput): Promise<JournalEntry | null> {
    try {
      console.log("📝 JournalService: Creating entry with data:", {
        title: data.title?.substring(0, 50),
        contentLength: data.content?.length,
        tags: data.tags,
        templateId: data.templateId,
        colorScheme: data.colorScheme,
      })

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log(
        `📡 JournalService: Create response status ${response.status}`
      )

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to create journal entries")
        }

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error("❌ Journal creation failed:", errorData)
        } catch {
          try {
            const textResponse = await response.text()
            console.error("❌ Journal creation failed with text:", textResponse)
            errorMessage = textResponse || errorMessage
          } catch {
            console.error("❌ Journal creation failed, no readable response")
          }
        }

        // Provide user-friendly error messages
        if (response.status === 500) {
          throw new Error(
            "Server error occurred while creating your journal entry. Please try again in a moment."
          )
        } else if (response.status === 400) {
          throw new Error(
            "Please check that all required fields are filled out correctly."
          )
        } else {
          throw new Error(`Failed to create journal entry: ${errorMessage}`)
        }
      }

      const createdEntry = await response.json()
      console.log(`✅ JournalService: Created entry ${createdEntry.id}`)
      return createdEntry
    } catch (error: unknown) {
      console.error("❌ Error creating journal entry:", error)

      if (error instanceof Error) {
        throw error
      }

      throw new Error(
        "An unexpected error occurred while saving your journal entry. Please try again."
      )
    }
  }

  // Update an existing journal entry
  async updateEntry(
    id: string,
    data: Partial<JournalEntry>
  ): Promise<JournalEntry | null> {
    try {
      console.log(`✏️ JournalService: Updating entry ${id}`)

      const response = await fetch(this.baseUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...data }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to update journal entries")
        }
        if (response.status === 404) {
          throw new Error("Journal entry not found")
        }

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          const textResponse = await response.text()
          errorMessage = textResponse || errorMessage
        }
        throw new Error(errorMessage)
      }

      const updatedEntry = await response.json()
      console.log(`✅ JournalService: Updated entry ${id}`)
      return updatedEntry
    } catch (error: unknown) {
      console.error(`❌ Error updating journal entry ${id}:`, error)
      throw error instanceof Error ? error : new Error("Failed to update entry")
    }
  }

  // Delete a journal entry
  async deleteEntry(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ JournalService: Deleting entry ${id}`)

      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to delete journal entries")
        }
        if (response.status === 404) {
          throw new Error("Journal entry not found")
        }

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          const textResponse = await response.text()
          errorMessage = textResponse || errorMessage
        }
        throw new Error(errorMessage)
      }

      console.log(`✅ JournalService: Deleted entry ${id}`)
      return true
    } catch (error: unknown) {
      console.error(`❌ Error deleting journal entry ${id}:`, error)
      throw error instanceof Error ? error : new Error("Failed to delete entry")
    }
  }

  // Generate an AI journal entry
  async generateAIEntry(prompt: string): Promise<JournalEntry | null> {
    try {
      // For now, create a mock AI entry since you don't have the AI endpoint yet
      const aiEntryData: CreateJournalInput = {
        title: "AI Generated Entry",
        content: `Generated content based on: ${prompt}`,
        tags: ["ai-generated"],
        metrics: { mood: 7, energy: 6, clarity: 8 },
        insights: ["This is an AI-generated insight"],
        isAIGenerated: true,
        colorScheme: "purple",
      }

      // Create the actual entry using the regular create method
      return this.createEntry(aiEntryData)
    } catch (error: unknown) {
      console.error("❌ Error generating AI journal entry:", error)
      throw error instanceof Error
        ? error
        : new Error("Failed to generate AI journal entry")
    }
  }
}

export const journalService = new JournalService()
