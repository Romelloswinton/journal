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
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch journal entries")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching journal entries:", error)
      throw error
    }
  }

  // Get a single journal entry by ID
  async getEntry(id: string): Promise<JournalEntry> {
    try {
      const response = await fetch(`/api/journal/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch journal entry")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching journal entry ${id}:`, error)
      throw error
    }
  }

  // Create a new journal entry
  async createEntry(data: CreateJournalInput): Promise<JournalEntry> {
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create journal entry")
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
  ): Promise<JournalEntry> {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update journal entry")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error updating journal entry ${id}:`, error)
      throw error
    }
  }

  // Delete a journal entry
  async deleteEntry(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete journal entry")
      }
    } catch (error) {
      console.error(`Error deleting journal entry ${id}:`, error)
      throw error
    }
  }

  // Generate an AI journal entry
  async generateAIEntry(prompt: string): Promise<JournalEntry> {
    try {
      const response = await fetch("/api/ai/generate-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || "Failed to generate AI journal entry"
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
