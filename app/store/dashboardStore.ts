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

// 🔧 HELPER: Safe stats calculation functions
const safeCalculateStats = (entries: JournalEntry[]): UserStats => {
  try {
    if (!Array.isArray(entries)) {
      console.warn(
        "⚠️ DashboardStore: entries is not an array, using empty array"
      )
      entries = []
    }

    // Use the stats service if available, otherwise calculate basic stats
    if (statsService && typeof statsService.calculateStats === "function") {
      return statsService.calculateStats(entries)
    }

    // Fallback basic calculation
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const hasTodayEntry = entries.some((entry) => {
      const entryDate = new Date(entry.createdAt)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === today.getTime()
    })

    // Calculate word count
    const wordCount = entries.reduce((total, entry) => {
      const words = entry.content ? entry.content.split(/\s+/).length : 0
      return total + words
    }, 0)

    // Basic streak calculation (simplified)
    let currentStreak = 0
    if (hasTodayEntry) {
      currentStreak = 1
      // You could implement more sophisticated streak logic here
    }

    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, 0),
      totalEntries: entries.length,
      wordCount,
      hasTodayEntry,
    }
  } catch (error) {
    console.error("❌ Error in safeCalculateStats:", error)
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: entries?.length || 0,
      wordCount: 0,
      hasTodayEntry: false,
    }
  }
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

  // 🔧 UPDATED: Fetch dashboard data with better error handling
  fetchDashboardData: async (isSignedIn: boolean) => {
    console.log(
      "📊 DashboardStore: fetchDashboardData called, isSignedIn:",
      isSignedIn
    )

    // If not signed in, reset to default state
    if (!isSignedIn) {
      console.log("👤 DashboardStore: User not signed in, resetting state")
      set({
        userStats: {
          currentStreak: 0,
          longestStreak: 0,
          totalEntries: 0,
          wordCount: 0,
          hasTodayEntry: false,
        },
        error: null,
        isLoading: false,
      })
      return
    }

    set({ isLoading: true, error: null })

    try {
      console.log("📖 DashboardStore: Fetching journal entries...")

      // Fetch all journal entries to calculate stats
      let entries: JournalEntry[] = []

      try {
        entries = await journalService.getEntries()
        console.log(`✅ DashboardStore: Got ${entries.length} entries`)
      } catch (journalError: unknown) {
        console.error(
          "❌ DashboardStore: Failed to fetch journal entries:",
          journalError
        )

        // Check if it's an authentication error
        const errorMessage =
          journalError instanceof Error ? journalError.message : "Unknown error"
        if (
          errorMessage.includes("Unauthorized") ||
          errorMessage.includes("sign in")
        ) {
          console.log(
            "🔐 DashboardStore: Authentication error, showing auth modal"
          )
          set({ showAuthModal: true, isLoading: false })
          return
        }

        // For other errors, continue with empty entries but log the issue
        console.warn(
          "⚠️ DashboardStore: Proceeding with empty entries due to error:",
          errorMessage
        )
        entries = []
      }

      // Calculate stats with whatever entries we have (could be empty array)
      const calculatedStats = safeCalculateStats(entries)
      console.log("📈 DashboardStore: Calculated stats:", calculatedStats)

      set({
        userStats: calculatedStats,
        error: null,
        isLoading: false,
      })

      // Optionally save stats to the server (but don't fail if this doesn't work)
      if (statsService && typeof statsService.submitStats === "function") {
        try {
          await statsService.submitStats(calculatedStats)
          console.log("✅ DashboardStore: Stats saved to server")
        } catch (submitError) {
          console.error("❌ Error saving stats to server:", submitError)
          // Don't set error state for this to keep dashboard usable
        }
      }
    } catch (error: unknown) {
      console.error("❌ DashboardStore: fetchDashboardData failed:", error)

      const errorMessage =
        error instanceof Error ? error.message : "Failed to load dashboard data"

      set({
        error: errorMessage,
        isLoading: false,
        userStats: {
          currentStreak: 0,
          longestStreak: 0,
          totalEntries: 0,
          wordCount: 0,
          hasTodayEntry: false,
        },
      })
    }
  },

  // 🔧 UPDATED: Calculate user stats based on journal entries
  calculateStats: (entries: JournalEntry[]) => {
    try {
      console.log(
        `📊 DashboardStore: calculateStats called with ${
          entries?.length || 0
        } entries`
      )

      const calculatedStats = safeCalculateStats(entries)
      set({ userStats: calculatedStats })

      console.log(
        "✅ DashboardStore: Stats calculated and set:",
        calculatedStats
      )
    } catch (error: unknown) {
      console.error("❌ DashboardStore: Error in calculateStats:", error)

      // Set safe default stats
      set({
        userStats: {
          currentStreak: 0,
          longestStreak: 0,
          totalEntries: Array.isArray(entries) ? entries.length : 0,
          wordCount: 0,
          hasTodayEntry: false,
        },
      })
    }
  },

  // 🔧 UPDATED: Fetch user statistics from API
  fetchUserStats: async () => {
    console.log("📈 DashboardStore: fetchUserStats called")
    set({ isLoadingStats: true })

    try {
      const entries = await journalService.getEntries()
      console.log(
        `📊 DashboardStore: fetchUserStats got ${entries.length} entries`
      )

      get().calculateStats(entries)
    } catch (error: unknown) {
      console.error("❌ DashboardStore: Error fetching user stats:", error)

      // Check if it's an authentication error
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      if (
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("sign in")
      ) {
        set({ showAuthModal: true })
      }

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

  // 🔧 UPDATED: Perform daily check-in with better error handling
  performDailyCheckIn: async () => {
    try {
      console.log("✅ DashboardStore: Performing daily check-in")

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
        console.log(
          "✅ DashboardStore: Check-in entry created, refreshing stats"
        )

        // Get all entries to recalculate stats
        try {
          const entries = await journalService.getEntries()
          get().calculateStats(entries)
        } catch (statsError) {
          console.error("❌ Error refreshing stats after check-in:", statsError)
          // Don't fail the check-in if stats refresh fails
        }
      }

      return response
    } catch (error: unknown) {
      console.error(
        "❌ DashboardStore: Error performing daily check-in:",
        error
      )

      // Re-throw the error so the calling component can handle it
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error("Failed to perform daily check-in")
      }
    }
  },

  // Set whether to show the auth modal
  setShowAuthModal: (show: boolean) => {
    console.log("🔐 DashboardStore: setShowAuthModal:", show)
    set({ showAuthModal: show })
  },
}))

export default useDashboardStore
