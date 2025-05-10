// store/libraryStore.ts
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { toast } from "sonner"
import { libraryService } from "@/services/libraryService"

// Define types
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
  toggleSavePrompt: (id: string) => void
  saveJournal: (journal: Journal) => void
  removeSavedJournal: (id: string) => void
  removeSavedPrompt: (id: string) => void
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

        // Fetch journals from service
        fetchJournals: async () => {
          set({ isLoading: true, error: null })
          try {
            const { situational, daily, frameworks, saved } =
              await libraryService.getJournals()

            set({
              situationalJournals: situational,
              dailyJournals: daily,
              frameworkJournals: frameworks,
              savedJournals: saved,
              isLoading: false,
            })
          } catch (error) {
            console.error("Error fetching journals:", error)
            set({
              error: "Failed to load journals",
              isLoading: false,
            })
            toast.error("Failed to load journals")
          }
        },

        // Fetch prompts from service
        fetchPrompts: async () => {
          set({ isLoading: true, error: null })
          try {
            const { prompts, saved } = await libraryService.getPrompts()

            set({
              prompts,
              savedPrompts: saved,
              isLoading: false,
            })
          } catch (error) {
            console.error("Error fetching prompts:", error)
            set({
              error: "Failed to load prompts",
              isLoading: false,
            })
            toast.error("Failed to load prompts")
          }
        },

        // Toggle prompt saved status
        toggleSavePrompt: (id: string) => {
          const prompts = get().prompts
          const updatedPrompts = prompts.map((prompt) =>
            prompt.id === id ? { ...prompt, isSaved: !prompt.isSaved } : prompt
          )

          // Find the prompt that was toggled
          const toggledPrompt = updatedPrompts.find((p) => p.id === id)

          if (toggledPrompt) {
            // If prompt was saved, add to savedPrompts
            if (toggledPrompt.isSaved) {
              const newSavedPrompt: SavedPrompt = {
                id: toggledPrompt.id,
                text: toggledPrompt.text,
                category: toggledPrompt.category,
                lastUsed: "Just now",
              }

              // Add to saved prompts
              set({
                prompts: updatedPrompts,
                savedPrompts: [...get().savedPrompts, newSavedPrompt],
              })

              toast.success("Prompt saved")
            } else {
              // If prompt was unsaved, remove from savedPrompts
              const filteredPrompts = get().savedPrompts.filter(
                (p) => p.id !== id
              )

              set({
                prompts: updatedPrompts,
                savedPrompts: filteredPrompts,
              })

              toast.success("Prompt removed from saved")
            }
          }
        },

        // Save a journal
        saveJournal: (journal: Journal) => {
          const savedJournal: SavedJournal = {
            ...journal,
            lastUsed: "Just now",
          }

          set({
            savedJournals: [...get().savedJournals, savedJournal],
          })

          toast.success("Journal saved")
        },

        // Remove saved journal
        removeSavedJournal: (id: string) => {
          set({
            savedJournals: get().savedJournals.filter(
              (journal) => journal.id !== id
            ),
          })

          toast.success("Journal removed from saved")
        },

        // Remove saved prompt
        removeSavedPrompt: (id: string) => {
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
        },

        // Set selected category for filtering
        setSelectedCategory: (category: string) => {
          set({ selectedCategory: category })
        },
      }),
      {
        name: "library-store", // Name for localStorage
      }
    )
  )
)
