// app/store/libraryStore.ts
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { toast } from "sonner"

// Define types that match our API responses
export interface Journal {
  id: string
  title: string
  author: string
  image: string
  category?: string
  description?: string
  content?: any
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

interface LibraryState {
  // Journal data
  situationalJournals: Journal[]
  dailyJournals: Journal[]
  frameworkJournals: Journal[]
  savedJournals: SavedJournal[]

  // Prompt data
  prompts: Prompt[]
  savedPrompts: SavedPrompt[]
  selectedCategory: string

  // UI state
  isLoading: boolean
  error: string | null

  // Actions
  fetchJournals: () => Promise<void>
  fetchPrompts: () => Promise<void>
  toggleSavePrompt: (id: string) => Promise<void>
  saveJournal: (journal: Journal) => Promise<void>
  removeSavedJournal: (id: string) => Promise<void>
  removeSavedPrompt: (id: string) => Promise<void>
  setSelectedCategory: (category: string) => void
}

export const useLibraryStore = create<LibraryState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        situationalJournals: [],
        dailyJournals: [],
        frameworkJournals: [],
        savedJournals: [],
        prompts: [],
        savedPrompts: [],
        selectedCategory: "All",
        isLoading: false,
        error: null,

        // Fetch journals from API
        fetchJournals: async () => {
          set({ isLoading: true, error: null })
          try {
            const response = await fetch("/api/library/journals")

            if (!response.ok) {
              if (response.status === 401) {
                console.warn("User not authenticated")
                set({
                  situationalJournals: [],
                  dailyJournals: [],
                  frameworkJournals: [],
                  savedJournals: [],
                  isLoading: false,
                  error: "Please sign in to view journals",
                })
                return
              }
              throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()

            set({
              situationalJournals: data.situational || [],
              dailyJournals: data.daily || [],
              frameworkJournals: data.frameworks || [],
              savedJournals: data.saved || [],
              isLoading: false,
              error: null,
            })
          } catch (error) {
            console.error("Error fetching journals:", error)
            set({
              error: "Failed to load journals",
              isLoading: false,
              // Set empty arrays as fallback
              situationalJournals: [],
              dailyJournals: [],
              frameworkJournals: [],
              savedJournals: [],
            })
            toast.error("Failed to load journals")
          }
        },

        // Fetch prompts from API
        fetchPrompts: async () => {
          set({ isLoading: true, error: null })
          try {
            const response = await fetch("/api/library/prompts")

            if (!response.ok) {
              if (response.status === 401) {
                console.warn("User not authenticated")
                set({
                  prompts: [],
                  savedPrompts: [],
                  isLoading: false,
                  error: "Please sign in to view prompts",
                })
                return
              }
              throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()

            set({
              prompts: data.prompts || [],
              savedPrompts: data.saved || [],
              isLoading: false,
              error: null,
            })
          } catch (error) {
            console.error("Error fetching prompts:", error)
            set({
              error: "Failed to load prompts",
              isLoading: false,
              prompts: [],
              savedPrompts: [],
            })
            toast.error("Failed to load prompts")
          }
        },

        // Toggle prompt saved status
        toggleSavePrompt: async (id: string) => {
          const prompts = get().prompts
          const prompt = prompts.find((p) => p.id === id)

          if (!prompt) return

          try {
            if (!prompt.isSaved) {
              // Save the prompt
              const response = await fetch("/api/library/prompts/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prompt),
              })

              if (!response.ok) throw new Error("Failed to save prompt")

              const savedPrompt = await response.json()

              // Update local state
              const updatedPrompts = prompts.map((p) =>
                p.id === id ? { ...p, isSaved: true } : p
              )

              set({
                prompts: updatedPrompts,
                savedPrompts: [...get().savedPrompts, savedPrompt],
              })

              toast.success("Prompt saved")
            } else {
              // Remove the saved prompt
              const response = await fetch(`/api/library/prompts/${id}`, {
                method: "DELETE",
              })

              if (!response.ok) throw new Error("Failed to remove prompt")

              // Update local state
              const updatedPrompts = prompts.map((p) =>
                p.id === id ? { ...p, isSaved: false } : p
              )

              set({
                prompts: updatedPrompts,
                savedPrompts: get().savedPrompts.filter((p) => p.id !== id),
              })

              toast.success("Prompt removed from saved")
            }
          } catch (error) {
            console.error("Error toggling prompt save status:", error)
            toast.error("Failed to update prompt")
          }
        },

        // Save a journal
        saveJournal: async (journal: Journal) => {
          try {
            const response = await fetch("/api/library/journals/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(journal),
            })

            if (!response.ok) throw new Error("Failed to save journal")

            const savedJournal = await response.json()

            set({
              savedJournals: [...get().savedJournals, savedJournal],
            })

            toast.success("Journal saved")
          } catch (error) {
            console.error("Error saving journal:", error)
            toast.error("Failed to save journal")
          }
        },

        // Remove saved journal
        removeSavedJournal: async (id: string) => {
          try {
            const response = await fetch(`/api/library/journals/${id}`, {
              method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to remove journal")

            set({
              savedJournals: get().savedJournals.filter(
                (journal) => journal.id !== id
              ),
            })

            toast.success("Journal removed from saved")
          } catch (error) {
            console.error("Error removing saved journal:", error)
            toast.error("Failed to remove journal")
          }
        },

        // Remove saved prompt
        removeSavedPrompt: async (id: string) => {
          try {
            const response = await fetch(`/api/library/prompts/${id}`, {
              method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to remove prompt")

            // Also update the main prompts list to reflect unsaved status
            const updatedPrompts = get().prompts.map((prompt) =>
              prompt.id === id ? { ...prompt, isSaved: false } : prompt
            )

            set({
              savedPrompts: get().savedPrompts.filter(
                (prompt) => prompt.id !== id
              ),
              prompts: updatedPrompts,
            })

            toast.success("Prompt removed from saved")
          } catch (error) {
            console.error("Error removing saved prompt:", error)
            toast.error("Failed to remove prompt")
          }
        },

        // Set selected category for filtering
        setSelectedCategory: (category: string) => {
          set({ selectedCategory: category })
        },
      }),
      {
        name: "library-store",
        // Only persist non-sensitive UI state
        partialize: (state) => ({
          selectedCategory: state.selectedCategory,
        }),
      }
    )
  )
)
