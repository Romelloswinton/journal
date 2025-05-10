// app/lib/services/userStatsService.ts
import axios from "axios"

// Update interface to match dashboard store expectations
export interface UserStats {
  id: string
  userId: string
  totalEntries: number
  currentStreak: number
  longestStreak: number
  hasTodayEntry: boolean
  wordCount: number // Required property
  entriesCount: number // Required property
  insightsCount?: number // Optional for backward compatibility
  createdAt: string
  updatedAt: string
}

// Fetch user stats including today's check-in status
export async function fetchUserStats(): Promise<UserStats> {
  try {
    console.log("Fetching user stats from API...")
    const response = await axios.get("/api/user/stats")

    console.log("Raw API response:", response.data)

    // Ensure all required properties exist
    const statsWithDefaults = {
      id: response.data.id || "",
      userId: response.data.userId || "",
      totalEntries:
        response.data.totalEntries || response.data.entriesCount || 0,
      currentStreak: response.data.currentStreak || 0,
      longestStreak: response.data.longestStreak || 0,
      hasTodayEntry: response.data.hasTodayEntry || false,
      wordCount: response.data.wordCount || 0,
      entriesCount:
        response.data.entriesCount || response.data.totalEntries || 0,
      insightsCount: response.data.insightsCount || 0,
      createdAt: response.data.createdAt || new Date().toISOString(),
      updatedAt: response.data.updatedAt || new Date().toISOString(),
    }

    console.log("User stats processed with defaults:", statsWithDefaults)
    console.log("Word count in processed stats:", statsWithDefaults.wordCount)

    return statsWithDefaults
  } catch (error) {
    console.error("Error fetching user stats:", error)
    // Return default stats if API fails
    return {
      id: "",
      userId: "",
      totalEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      hasTodayEntry: false,
      wordCount: 0,
      entriesCount: 0,
      insightsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}

// Perform a daily check-in
export async function performDailyCheckIn(): Promise<UserStats> {
  try {
    console.log("Performing daily check-in...")
    const response = await axios.post("/api/user/stats")

    console.log("Raw check-in response:", response.data)

    // Ensure all required properties exist
    const statsWithDefaults = {
      id: response.data.id || "",
      userId: response.data.userId || "",
      totalEntries:
        response.data.totalEntries || response.data.entriesCount || 0,
      currentStreak: response.data.currentStreak || 0,
      longestStreak: response.data.longestStreak || 0,
      hasTodayEntry: true,
      wordCount: response.data.wordCount || 0,
      entriesCount:
        response.data.entriesCount || response.data.totalEntries || 0,
      insightsCount: response.data.insightsCount || 0,
      createdAt: response.data.createdAt || new Date().toISOString(),
      updatedAt: response.data.updatedAt || new Date().toISOString(),
    }

    console.log("Check-in stats processed with defaults:", statsWithDefaults)
    console.log(
      "Word count in processed check-in stats:",
      statsWithDefaults.wordCount
    )

    return statsWithDefaults
  } catch (error) {
    console.error("Error performing daily check-in:", error)
    throw error
  }
}

// Calculate word count from journal entries
export function calculateWordCount(entries: any[]): number {
  if (!entries || entries.length === 0) {
    console.log("No entries provided for word count calculation")
    return 0
  }

  let totalWords = 0

  for (const entry of entries) {
    if (!entry.content) continue

    const words = entry.content
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0)

    totalWords += words.length
    console.log(`Entry ${entry.id || "unknown"} has ${words.length} words`)
  }

  console.log(`Total calculated word count: ${totalWords}`)
  return totalWords
}
