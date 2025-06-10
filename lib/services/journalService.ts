// lib/services/journalService.ts

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
}

class JournalService {
  // Get all journal entries
  async getEntries(): Promise<JournalEntry[]> {
    try {
      const response = await fetch("/api/journal")

      if (!response.ok) {
        // Handle different status codes appropriately
        if (response.status === 404) {
          // User not found or no journal entries - return empty array instead of throwing
          console.warn(
            "No journal entries found for user, returning empty array"
          )
          return []
        }
        if (response.status === 401) {
          // Unauthorized - user not signed in
          console.warn("User not authorized to fetch journal entries")
          return []
        }
        // For other errors, still throw
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            `Failed to fetch journal entries: HTTP ${response.status}`
        )
      }

      const data = await response.json()

      // Ensure we always return an array
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Error fetching journal entries:", error)
      // Instead of throwing, return empty array to prevent crashes
      return []
    }
  }

  // Get a single journal entry by ID
  async getEntry(id: string): Promise<JournalEntry | null> {
    try {
      const response = await fetch(`/api/journal/${id}`)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view journal entries")
        }
        if (response.status === 404) {
          return null // Entry not found
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            `Failed to fetch journal entry: HTTP ${response.status}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching journal entry ${id}:`, error)
      return null
    }
  }

  // Create a new journal entry
  async createEntry(data: CreateJournalInput): Promise<JournalEntry | null> {
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to create journal entries")
        }
        if (response.status === 404) {
          // Instead of throwing an error, try to create the user first
          console.warn("User not found, attempting to create user profile...")

          // Try to create user profile first
          try {
            const userResponse = await fetch("/api/user/profile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })

            if (userResponse.ok) {
              // Retry the journal entry creation
              const retryResponse = await fetch("/api/journal", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })

              if (retryResponse.ok) {
                return await retryResponse.json()
              }
            }
          } catch (userCreationError) {
            console.error("Failed to create user profile:", userCreationError)
          }

          throw new Error(
            "Unable to create journal entry. Please try refreshing the page or contact support."
          )
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            `Failed to create journal entry: HTTP ${response.status}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating journal entry:", error)
      throw error
    }
  }

  // Update an existing journal entry
  async updateEntry(
    id: string,
    data: Partial<JournalEntry>
  ): Promise<JournalEntry | null> {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to update journal entries")
        }
        if (response.status === 404) {
          throw new Error("Journal entry not found")
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            `Failed to update journal entry: HTTP ${response.status}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error(`Error updating journal entry ${id}:`, error)
      throw error
    }
  }

  // Delete a journal entry
  async deleteEntry(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to delete journal entries")
        }
        if (response.status === 404) {
          throw new Error("Journal entry not found")
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            `Failed to delete journal entry: HTTP ${response.status}`
        )
      }

      return true
    } catch (error) {
      console.error(`Error deleting journal entry ${id}:`, error)
      throw error
    }
  }

  // Generate an AI journal entry
  async generateAIEntry(prompt: string): Promise<JournalEntry | null> {
    try {
      const response = await fetch("/api/ai/generate-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to generate AI journal entries")
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            `Failed to generate AI journal entry: HTTP ${response.status}`
        )
      }

      const aiGeneratedData = await response.json()

      // Create the actual entry using the AI-generated content
      return this.createEntry({
        ...aiGeneratedData,
        isAIGenerated: true,
      })
    } catch (error) {
      console.error("Error generating AI journal entry:", error)
      throw error
    }
  }
}

export const journalService = new JournalService()
