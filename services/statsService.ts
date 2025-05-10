// lib/services/statsService.ts

import { JournalEntry } from "@/app/store/journalStore"

export interface UserStats {
  currentStreak: number
  longestStreak: number
  totalEntries: number
  wordCount: number
  hasTodayEntry: boolean
}

class StatsService {
  // Calculate user stats based on journal entries
  calculateStats(entries: JournalEntry[]): UserStats {
    const sortedEntries = [...entries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Calculate if user has an entry today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const hasTodayEntry = sortedEntries.some((entry) => {
      const entryDate = new Date(entry.createdAt)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === today.getTime()
    })

    // Calculate current streak
    const currentStreak = this.calculateCurrentStreak(sortedEntries)

    // Calculate longest streak
    const longestStreak = this.calculateLongestStreak(sortedEntries)

    // Calculate total entries
    const totalEntries = entries.length

    // Calculate total word count
    const wordCount = this.calculateTotalWordCount(entries)

    return {
      currentStreak,
      longestStreak,
      totalEntries,
      wordCount,
      hasTodayEntry,
    }
  }

  // Calculate current streak of consecutive days with entries
  private calculateCurrentStreak(sortedEntries: JournalEntry[]): number {
    if (sortedEntries.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if there's an entry today
    const firstEntryDate = new Date(sortedEntries[0].createdAt)
    firstEntryDate.setHours(0, 0, 0, 0)

    // If the most recent entry isn't from today or yesterday, streak is 0 or 1
    if (firstEntryDate.getTime() !== today.getTime()) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      // If the most recent entry is from yesterday, streak is 1
      if (firstEntryDate.getTime() === yesterday.getTime()) {
        return 1
      }

      // If the most recent entry is older than yesterday, streak is 0
      if (firstEntryDate < yesterday) {
        return 0
      }
    }

    // Track dates we've seen entries for
    const datesWithEntries = new Set<string>()

    sortedEntries.forEach((entry) => {
      const entryDate = new Date(entry.createdAt)
      entryDate.setHours(0, 0, 0, 0)
      datesWithEntries.add(entryDate.toISOString().split("T")[0])
    })

    // Count consecutive days
    let currentDate = today

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0]

      if (datesWithEntries.has(dateStr)) {
        streak++
        // Move to previous day
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  // Calculate longest streak of consecutive days with entries
  private calculateLongestStreak(sortedEntries: JournalEntry[]): number {
    if (sortedEntries.length === 0) return 0

    // Track dates we've seen entries for
    const datesWithEntries = new Set<string>()

    sortedEntries.forEach((entry) => {
      const entryDate = new Date(entry.createdAt)
      entryDate.setHours(0, 0, 0, 0)
      datesWithEntries.add(entryDate.toISOString().split("T")[0])
    })

    // Sort dates chronologically
    const sortedDates = Array.from(datesWithEntries).sort()

    let longestStreak = 1
    let currentStreak = 1

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i])
      const prevDate = new Date(sortedDates[i - 1])

      // Check if dates are consecutive
      const dayDiff =
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (dayDiff === 1) {
        // Consecutive day
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        // Break in streak
        currentStreak = 1
      }
    }

    return longestStreak
  }

  // Calculate total word count across all entries
  private calculateTotalWordCount(entries: JournalEntry[]): number {
    return entries.reduce((total, entry) => {
      // Count words in title
      const titleWords = entry.title.trim().split(/\s+/).length

      // Count words in content
      const contentWords = entry.content.trim().split(/\s+/).length

      return total + titleWords + contentWords
    }, 0)
  }

  // Submit stats to the API
  async submitStats(stats: UserStats): Promise<void> {
    try {
      await fetch("/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stats),
      })
    } catch (error) {
      console.error("Error submitting stats:", error)
      throw error
    }
  }
}

export const statsService = new StatsService()
