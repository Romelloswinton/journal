// app/store/journalStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import useDashboardStore from "./dashboardStore"
import { JournalTemplate } from "@/data/journalTemplatesData"
import { toast } from "sonner"
import { journalService } from "@/services/journalService"

// Types and interfaces
export interface JournalMetrics {
  mood: number
  energy: number
  clarity: number
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  tags: string[]
  metrics: JournalMetrics
  insights: string[]
  isAIGenerated: boolean
  createdAt: string
  updatedAt: string
  templateId?: string
  colorScheme?: string // For color theming (e.g. "amber", "blue", "green")
}

interface JournalEntryState {
  // State
  entries: JournalEntry[]
  isLoading: boolean
  error: string | null
  activeFilters: {
    search: string
    tags: string[]
    showAIGenerated: boolean | null
    moodRange: [number, number]
    energyRange: [number, number]
    clarityRange: [number, number]
    dateRange: [Date | null, Date | null]
  }
  preferredTemplate?: string // User's preferred template ID
  recentlyViewed: string[] // Recently viewed entry IDs

  // Actions
  fetchEntries: () => Promise<void>
  getEntry: (id: string) => JournalEntry | undefined
  createEntry: (
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => Promise<JournalEntry>
  createEntryFromTemplate: (
    template: JournalTemplate,
    content?: string
  ) => Promise<JournalEntry>
  updateEntry: (id: string, data: Partial<JournalEntry>) => Promise<void>
  deleteEntry: (id: string) => Promise<boolean>
  generateAIEntry: (prompt: string) => Promise<JournalEntry>
  viewEntry: (id: string) => void // Track entry view for recently viewed

  // Template-related functionality
  getRecentlyUsedTemplates: () => string[] // Returns array of recently used template IDs
  setPreferredTemplate: (templateId: string) => void

  // Appearance and theme
  getEntryColorScheme: (entry: JournalEntry) => string // Return appropriate color for entry

  // Filter actions
  setSearchFilter: (search: string) => void
  setTagFilter: (tags: string[]) => void
  setAIGeneratedFilter: (show: boolean | null) => void
  setMoodRange: (range: [number, number]) => void
  setEnergyRange: (range: [number, number]) => void
  setClarityRange: (range: [number, number]) => void
  setDateRange: (range: [Date | null, Date | null]) => void
  clearFilters: () => void

  // Helpers
  getFilteredEntries: () => JournalEntry[]
  updateStats: () => void
  getAllTags: () => string[] // Get unique tags across all entries
  getEntriesByDateRange: (startDate: Date, endDate: Date) => JournalEntry[]
  getRecentlyViewedEntries: (limit?: number) => JournalEntry[]
}

// Create journal store
const useJournalStore = create<JournalEntryState>()(
  persist(
    (set, get) => ({
      // Initial state
      entries: [],
      isLoading: false,
      error: null,
      activeFilters: {
        search: "",
        tags: [],
        showAIGenerated: null,
        moodRange: [1, 10],
        energyRange: [1, 10],
        clarityRange: [1, 10],
        dateRange: [null, null],
      },
      recentlyViewed: [],

      // Fetch all journal entries
      fetchEntries: async () => {
        set({ isLoading: true, error: null })

        try {
          const entries = await journalService.getEntries()
          set({ entries })

          // Update stats after fetching entries
          get().updateStats()
        } catch (error) {
          console.error("Failed to fetch journal entries:", error)
          set({ error: "Failed to load journal entries. Please try again." })
        } finally {
          set({ isLoading: false })
        }
      },

      // Update stats in the dashboard store
      updateStats: () => {
        const { calculateStats } = useDashboardStore.getState()
        const { entries } = get()

        // Update stats in dashboard store
        calculateStats(entries)
      },

      // Get a single entry by ID
      getEntry: (id: string) => {
        return get().entries.find((entry) => entry.id === id)
      },

      // View an entry (track in recently viewed)
      viewEntry: (id: string) => {
        const { recentlyViewed } = get()

        // Remove the id if it's already in the list
        const filteredIds = recentlyViewed.filter((entryId) => entryId !== id)

        // Add the id to the beginning of the list
        set({
          recentlyViewed: [id, ...filteredIds].slice(0, 10), // Keep only 10 most recent
        })
      },

      // Create a new journal entry
      createEntry: async (entryData) => {
        const optimisticEntry: JournalEntry = {
          ...entryData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Optimistic update
        set((state) => ({
          entries: [optimisticEntry, ...state.entries],
        }))

        try {
          // Actual API call
          const createdEntry = await journalService.createEntry(entryData)

          // Update with server data
          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === optimisticEntry.id ? createdEntry : entry
            ),
          }))

          // Add to recently viewed
          get().viewEntry(createdEntry.id)

          // Update stats after creating an entry
          get().updateStats()

          toast.success("Journal entry created successfully")
          return createdEntry
        } catch (error) {
          console.error("Failed to create journal entry:", error)

          // Remove optimistic entry on error
          set((state) => ({
            entries: state.entries.filter(
              (entry) => entry.id !== optimisticEntry.id
            ),
            error: "Failed to create journal entry. Please try again.",
          }))

          toast.error("Failed to create journal entry")
          throw error
        }
      },

      // Create a journal entry from a template
      createEntryFromTemplate: async (template, content) => {
        // Determine color scheme based on template category
        let colorScheme = "amber" // Default

        if (template.category === "SITUATIONAL") {
          colorScheme = "blue"
        } else if (template.category === "DAILY") {
          colorScheme = "amber"
        } else if (template.category === "FRAMEWORKS") {
          colorScheme = "purple"
        }

        // Extract template data for journal entry
        const entryData = {
          title: template.title,
          content: content || template.prompts.join("\n\n"),
          tags: [template.category.toLowerCase()], // Add category as a tag
          metrics: {
            mood: 5,
            energy: 5,
            clarity: 5,
          },
          insights: [],
          isAIGenerated: false,
          templateId: template.id, // Track which template was used
          colorScheme, // Set color scheme based on template type
        }

        // Create the entry
        return get().createEntry(entryData)
      },

      // Update an existing journal entry
      updateEntry: async (id, data) => {
        // Store original entry for rollback
        const originalEntry = get().entries.find((entry) => entry.id === id)

        if (!originalEntry) {
          toast.error("Entry not found")
          return Promise.reject(new Error("Entry not found"))
        }

        // Optimistic update
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...data, updatedAt: new Date().toISOString() }
              : entry
          ),
        }))

        try {
          // Actual API call
          await journalService.updateEntry(id, data)

          // Update stats after updating an entry
          get().updateStats()

          // Add to recently viewed
          get().viewEntry(id)

          toast.success("Journal entry updated successfully")
          return Promise.resolve()
        } catch (error) {
          console.error(`Failed to update journal entry ${id}:`, error)

          // Rollback on error
          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === id ? originalEntry : entry
            ),
            error: "Failed to update journal entry. Please try again.",
          }))

          toast.error("Failed to update journal entry")
          return Promise.reject(error)
        }
      },

      // Delete a journal entry
      deleteEntry: async (id: string) => {
        try {
          // Set loading state specifically for this deletion
          set((state) => ({
            isLoading: true,
            error: null,
          }))

          // Store deleted entry for rollback
          const deletedEntry = get().entries.find((entry) => entry.id === id)

          if (!deletedEntry) {
            set({ isLoading: false })
            toast.error("Entry not found")
            return false
          }

          // Make the API call BEFORE updating the local state
          await journalService.deleteEntry(id)

          // Only update state AFTER successful API call
          set((state) => ({
            entries: state.entries.filter((entry) => entry.id !== id),
            recentlyViewed: state.recentlyViewed.filter(
              (entryId) => entryId !== id
            ),
            isLoading: false,
          }))

          // Update stats after successful deletion
          get().updateStats()

          toast.success("Journal entry deleted successfully")
          return true
        } catch (error) {
          console.error(`Failed to delete journal entry ${id}:`, error)

          // Reset loading state on error
          set({
            isLoading: false,
            error: "Failed to delete journal entry. Please try again.",
          })

          toast.error("Failed to delete journal entry")
          return false
        }
      },

      // Generate an AI journal entry
      generateAIEntry: async (prompt: string) => {
        set({ isLoading: true, error: null })

        try {
          const generatedEntry = await journalService.generateAIEntry(prompt)

          // Add the generated entry to our list
          set((state) => ({
            entries: [generatedEntry, ...state.entries],
            isLoading: false,
          }))

          // Add to recently viewed
          get().viewEntry(generatedEntry.id)

          // Update stats after generating an entry
          get().updateStats()

          toast.success("AI journal entry generated successfully")
          return generatedEntry
        } catch (error) {
          console.error("Failed to generate AI journal entry:", error)
          set({
            error: "Failed to generate AI entry. Please try again.",
            isLoading: false,
          })

          toast.error("Failed to generate AI journal entry")
          throw error
        }
      },

      // Set preferred template
      setPreferredTemplate: (templateId: string) => {
        set({ preferredTemplate: templateId })
        toast.success("Default template set successfully")
      },

      // Get appropriate color scheme for entry
      getEntryColorScheme: (entry: JournalEntry) => {
        // If entry has a color scheme, use it
        if (entry.colorScheme) {
          return entry.colorScheme
        }

        // Otherwise, determine based on entry properties
        if (entry.isAIGenerated) {
          return "purple" // AI-generated entries
        }

        // Check mood for other entries
        const moodScore = entry.metrics.mood
        if (moodScore <= 3) {
          return "blue" // Low mood
        } else if (moodScore >= 8) {
          return "green" // High mood
        }

        // Default
        return "amber"
      },

      // Filter actions
      setSearchFilter: (search: string) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            search,
          },
        }))
      },

      setTagFilter: (tags: string[]) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            tags,
          },
        }))
      },

      setAIGeneratedFilter: (show: boolean | null) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            showAIGenerated: show,
          },
        }))
      },

      setMoodRange: (range: [number, number]) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            moodRange: range,
          },
        }))
      },

      setEnergyRange: (range: [number, number]) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            energyRange: range,
          },
        }))
      },

      setClarityRange: (range: [number, number]) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            clarityRange: range,
          },
        }))
      },

      setDateRange: (range: [Date | null, Date | null]) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            dateRange: range,
          },
        }))
      },

      clearFilters: () => {
        set({
          activeFilters: {
            search: "",
            tags: [],
            showAIGenerated: null,
            moodRange: [1, 10],
            energyRange: [1, 10],
            clarityRange: [1, 10],
            dateRange: [null, null],
          },
        })
      },

      // Get entries filtered by current active filters
      getFilteredEntries: () => {
        const { entries } = get()
        const {
          search,
          tags,
          showAIGenerated,
          moodRange,
          energyRange,
          clarityRange,
          dateRange,
        } = get().activeFilters

        return entries
          .filter((entry) => {
            // Filter by search term
            if (
              search &&
              !entry.title.toLowerCase().includes(search.toLowerCase()) &&
              !entry.content.toLowerCase().includes(search.toLowerCase()) &&
              !entry.tags.some((tag) =>
                tag.toLowerCase().includes(search.toLowerCase())
              )
            ) {
              return false
            }

            // Filter by tags
            if (
              tags.length > 0 &&
              !tags.some((tag) => entry.tags.includes(tag))
            ) {
              return false
            }

            // Filter by AI generated
            if (
              showAIGenerated !== null &&
              entry.isAIGenerated !== showAIGenerated
            ) {
              return false
            }

            // Filter by mood range
            if (
              entry.metrics.mood < moodRange[0] ||
              entry.metrics.mood > moodRange[1]
            ) {
              return false
            }

            // Filter by energy range
            if (
              entry.metrics.energy < energyRange[0] ||
              entry.metrics.energy > energyRange[1]
            ) {
              return false
            }

            // Filter by clarity range
            if (
              entry.metrics.clarity < clarityRange[0] ||
              entry.metrics.clarity > clarityRange[1]
            ) {
              return false
            }

            // Filter by date range
            if (dateRange[0] || dateRange[1]) {
              const entryDate = new Date(entry.createdAt)

              if (dateRange[0] && entryDate < dateRange[0]) {
                return false
              }

              if (dateRange[1]) {
                // Add one day to include entries from the end date
                const endDate = new Date(dateRange[1])
                endDate.setDate(endDate.getDate() + 1)

                if (entryDate > endDate) {
                  return false
                }
              }
            }

            return true
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      },

      // Get all unique tags across entries
      getAllTags: () => {
        const { entries } = get()
        const allTags = entries.flatMap((entry) => entry.tags)
        return [...new Set(allTags)].sort()
      },

      // Get entries within a specific date range
      getEntriesByDateRange: (startDate: Date, endDate: Date) => {
        const { entries } = get()

        return entries
          .filter((entry) => {
            const entryDate = new Date(entry.createdAt)
            return entryDate >= startDate && entryDate <= endDate
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      },

      // Get recently viewed entries
      getRecentlyViewedEntries: (limit = 5) => {
        const { entries, recentlyViewed } = get()

        // Get entries that match the recently viewed IDs
        return recentlyViewed
          .slice(0, limit)
          .map((id) => entries.find((entry) => entry.id === id))
          .filter((entry) => entry !== undefined) as JournalEntry[]
      },

      // Get recently used templates from journal entries
      getRecentlyUsedTemplates: () => {
        const { entries } = get()

        // Get entries with template IDs, sort by date, and extract unique template IDs
        const recentTemplateIds = entries
          .filter((entry) => entry.templateId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((entry) => entry.templateId as string)

        // Remove duplicates by using a Set
        return [...new Set(recentTemplateIds)].slice(0, 5) // Return up to 5 most recent
      },
    }),
    {
      name: "journal-storage",
      partialize: (state) => ({
        entries: state.entries,
        preferredTemplate: state.preferredTemplate,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
)

export default useJournalStore
