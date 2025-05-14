import { create } from "zustand"
import { JournalEntry } from "@/app/store/journalStore"
import { statsService, UserStats } from "@/services/statsService"
import { journalService } from "@/services/journalService"

interface DashboardState {
  // State
  userStats: UserStats
  isLoading: boolean
  isLoadingStats: boolean
  error: string | null
  showAuthModal: boolean

  // Actions
  fetchDashboardData: (isSignedIn: boolean) => Promise<void>
  fetchUserStats: () => Promise<void>
  calculateStats: (entries: JournalEntry[]) => void
  performDailyCheckIn: () => Promise<JournalEntry>
  setShowAuthModal: (show: boolean) => void
}

// Create dashboard store
const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  userStats: {
    currentStreak: 0,
    longestStreak: 0,
    totalEntries: 0,
    wordCount: 0,
    hasTodayEntry: false,
  },
  isLoading: false,
  isLoadingStats: false,
  error: null,
  showAuthModal: false,

  // Fetch dashboard data - summary info and journal highlights
  fetchDashboardData: async (isSignedIn: boolean) => {
    // If not signed in, we can skip fetching user-specific data
    if (!isSignedIn) return

    set({ isLoading: true, error: null })

    try {
      // Fetch all journal entries to calculate stats
      const entries = await journalService.getEntries()
      get().calculateStats(entries)
    } catch (err) {
      set({ error: "Failed to load dashboard data" })
      console.error("Error fetching dashboard data:", err)
    } finally {
      set({ isLoading: false })
    }
  },

  // Calculate user stats based on journal entries
  calculateStats: (entries: JournalEntry[]) => {
    const calculatedStats = statsService.calculateStats(entries)
    set({ userStats: calculatedStats })

    // Optionally save stats to the server
    try {
      statsService.submitStats(calculatedStats)
    } catch (error) {
      console.error("Error saving stats to server:", error)
      // Don't set error state for this to keep dashboard usable
    }
  },

  // Fetch user statistics from API
  fetchUserStats: async () => {
    set({ isLoadingStats: true })

    try {
      const entries = await journalService.getEntries()
      get().calculateStats(entries)
    } catch (err) {
      console.error("Error fetching user stats:", err)
      // Don't set error state for stats to keep dashboard usable
    } finally {
      set({ isLoadingStats: false })
    }
  },

  // Perform daily check-in (quick journal entry)
  performDailyCheckIn: async () => {
    try {
      // Create a basic journal entry using the service
      const today = new Date()
      const response = await journalService.createEntry({
        title: `Quick Check-in ${today.toLocaleDateString()}`,
        content: "I checked in today.",
        tags: ["check-in"],
        metrics: {
          mood: 5,
          energy: 5,
          clarity: 5,
        },
        insights: ["Daily check-in completed"],
        isAIGenerated: false,
      })

      if (response) {
        // Get all entries to recalculate stats
        const entries = await journalService.getEntries()
        get().calculateStats(entries)
      }

      return response
    } catch (err) {
      console.error("Error performing daily check-in:", err)
      throw err
    }
  },

  // Set whether to show the auth modal
  setShowAuthModal: (show: boolean) => {
    set({ showAuthModal: show })
  },
}))

export default useDashboardStore
