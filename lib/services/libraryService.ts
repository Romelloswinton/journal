// lib/services/libraryService.ts

export interface Journal {
  id: string
  title: string
  author: string
  image: string
  category?: string
}

export interface SavedJournal extends Journal {
  lastUsed: string
}

export interface Prompt {
  id: string
  text: string
  category: string
  isSaved: boolean
}

export interface SavedPrompt {
  id: string
  text: string
  category: string
  lastUsed: string
}

export interface JournalsResponse {
  situational: Journal[]
  daily: Journal[]
  frameworks: Journal[]
  saved: SavedJournal[]
}

export interface PromptsResponse {
  prompts: Prompt[]
  saved: SavedPrompt[]
}

class LibraryService {
  // Get all journals (situational, daily, frameworks, and saved)
  async getJournals(): Promise<JournalsResponse> {
    try {
      const response = await fetch("/api/library/journals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        // Handle different status codes appropriately
        if (response.status === 404) {
          // User not found or no journals - return empty arrays instead of throwing
          console.warn("No journals found for user, returning empty arrays")
          return {
            situational: [],
            daily: [],
            frameworks: [],
            saved: [],
          }
        }
        if (response.status === 401) {
          // Unauthorized - user not signed in
          console.warn("User not authorized to fetch journals")
          return {
            situational: [],
            daily: [],
            frameworks: [],
            saved: [],
          }
        }
        // For other errors, still throw
        const errorData = await response.json()
        throw new Error(
          errorData.error || `Failed to fetch journals: HTTP ${response.status}`
        )
      }

      const data = await response.json()

      // Ensure we always return the expected structure
      return {
        situational: Array.isArray(data.situational) ? data.situational : [],
        daily: Array.isArray(data.daily) ? data.daily : [],
        frameworks: Array.isArray(data.frameworks) ? data.frameworks : [],
        saved: Array.isArray(data.saved) ? data.saved : [],
      }
    } catch (error) {
      console.error("Error fetching journals:", error)
      // Instead of throwing, return empty arrays to prevent crashes
      return {
        situational: [],
        daily: [],
        frameworks: [],
        saved: [],
      }
    }
  }

  // Get all prompts and saved prompts
  async getPrompts(): Promise<PromptsResponse> {
    try {
      const response = await fetch("/api/library/prompts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        // Handle different status codes appropriately
        if (response.status === 404) {
          // User not found or no prompts - return empty arrays instead of throwing
          console.warn("No prompts found for user, returning empty arrays")
          return {
            prompts: [],
            saved: [],
          }
        }
        if (response.status === 401) {
          // Unauthorized - user not signed in
          console.warn("User not authorized to fetch prompts")
          return {
            prompts: [],
            saved: [],
          }
        }
        // For other errors, still throw
        const errorData = await response.json()
        throw new Error(
          errorData.error || `Failed to fetch prompts: HTTP ${response.status}`
        )
      }

      const data = await response.json()

      // Ensure we always return the expected structure
      return {
        prompts: Array.isArray(data.prompts) ? data.prompts : [],
        saved: Array.isArray(data.saved) ? data.saved : [],
      }
    } catch (error) {
      console.error("Error fetching prompts:", error)
      // Instead of throwing, return empty arrays to prevent crashes
      return {
        prompts: [],
        saved: [],
      }
    }
  }

  // Save a journal
  async saveJournal(journal: Journal): Promise<SavedJournal | null> {
    try {
      const response = await fetch("/api/library/journals/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(journal),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to save journals")
        }
        if (response.status === 404) {
          throw new Error(
            "User profile not found. Please complete your profile setup."
          )
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error || `Failed to save journal: HTTP ${response.status}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error("Error saving journal:", error)
      throw error
    }
  }

  // Remove a saved journal
  async removeSavedJournal(journalId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/library/journals/${journalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to remove saved journals")
        }
        if (response.status === 404) {
          throw new Error("Saved journal not found")
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            `Failed to remove saved journal: HTTP ${response.status}`
        )
      }

      return true
    } catch (error) {
      console.error("Error removing saved journal:", error)
      throw error
    }
  }

  // Save a prompt
  async savePrompt(prompt: Prompt): Promise<SavedPrompt | null> {
    try {
      const response = await fetch("/api/library/prompts/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prompt),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to save prompts")
        }
        if (response.status === 404) {
          throw new Error(
            "User profile not found. Please complete your profile setup."
          )
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error || `Failed to save prompt: HTTP ${response.status}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error("Error saving prompt:", error)
      throw error
    }
  }

  // Remove a saved prompt
  async removeSavedPrompt(promptId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/library/prompts/${promptId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to remove saved prompts")
        }
        if (response.status === 404) {
          throw new Error("Saved prompt not found")
        }
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            `Failed to remove saved prompt: HTTP ${response.status}`
        )
      }

      return true
    } catch (error) {
      console.error("Error removing saved prompt:", error)
      throw error
    }
  }

  // Get journal by ID
  async getJournal(journalId: string): Promise<Journal | null> {
    try {
      const response = await fetch(`/api/library/journals/${journalId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view journals")
        }
        if (response.status === 404) {
          return null // Journal not found
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching journal:", error)
      return null
    }
  }

  // Get prompt by ID
  async getPrompt(promptId: string): Promise<Prompt | null> {
    try {
      const response = await fetch(`/api/library/prompts/${promptId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view prompts")
        }
        if (response.status === 404) {
          return null // Prompt not found
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching prompt:", error)
      return null
    }
  }
}

export const libraryService = new LibraryService()
