// app/store/dashboardStore.ts

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
  performDailyCheckIn: () => Promise<JournalEntry | null>
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
    // If not signed in, reset to default state
    if (!isSignedIn) {
      set({
        userStats: {
          currentStreak: 0,
          longestStreak: 0,
          totalEntries: 0,
          wordCount: 0,
          hasTodayEntry: false,
        },
        error: null,
      })
      return
    }

    set({ isLoading: true, error: null })

    try {
      // Fetch all journal entries to calculate stats
      const entries = await journalService.getEntries()

      // Calculate stats even if entries is empty array
      get().calculateStats(entries)

      // Clear any previous errors
      set({ error: null })
    } catch (err) {
      console.error("Error fetching dashboard data:", err)

      // Set a user-friendly error message
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard data"
      set({ error: errorMessage })

      // Set default stats to prevent undefined values
      set({
        userStats: {
          currentStreak: 0,
          longestStreak: 0,
          totalEntries: 0,
          wordCount: 0,
          hasTodayEntry: false,
        },
      })
    } finally {
      set({ isLoading: false })
    }
  },

  // Calculate user stats based on journal entries
  calculateStats: (entries: JournalEntry[]) => {
    try {
      const calculatedStats = statsService.calculateStats(entries)
      set({ userStats: calculatedStats })

      // Optionally save stats to the server (but don't fail if this doesn't work)
      statsService.submitStats(calculatedStats).catch((error) => {
        console.error("Error saving stats to server:", error)
        // Don't set error state for this to keep dashboard usable
      })
    } catch (error) {
      console.error("Error calculating stats:", error)

      // Set safe default stats
      set({
        userStats: {
          currentStreak: 0,
          longestStreak: 0,
          totalEntries: entries.length || 0,
          wordCount: 0,
          hasTodayEntry: false,
        },
      })
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

      // Set default stats but don't set error state to keep dashboard usable
      set({
        userStats: {
          currentStreak: 0,
          longestStreak: 0,
          totalEntries: 0,
          wordCount: 0,
          hasTodayEntry: false,
        },
      })
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
