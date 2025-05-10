// app/journal/calendar/page.tsx
"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { JournalCalendar } from "@/components/journal/Calendar"
import useJournalStore from "@/app/store/journalStore"
import { Loader2, Calendar } from "lucide-react"

export default function CalendarPage() {
  const { entries, isLoading, fetchEntries } = useJournalStore()

  // Fetch entries when component mounts
  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Calendar View
              </h1>
              <p className="mt-1 text-muted-foreground">
                Visualize your journaling habits and track your writing streak
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 dark:text-amber-400 mb-4" />
              <p className="text-muted-foreground">Loading your calendar...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-lg shadow-sm">
              <Calendar className="h-12 w-12 text-amber-400 dark:text-amber-300 mb-3" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No journal entries yet
              </h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Start journaling to see your entries on the calendar. Regular
                journaling helps build consistency and makes it easier to track
                your thoughts over time.
              </p>
            </div>
          ) : (
            <JournalCalendar />
          )}

          {/* Calendar Insights */}
          {entries.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Current Streak
                </h3>
                <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                  {calculateStreak(entries)} days
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  This Month
                </h3>
                <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {entriesThisMonth(entries)} entries
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Total Entries
                </h3>
                <p className="text-2xl font-bold text-purple-500 dark:text-purple-400">
                  {entries.length}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

// Helper function to calculate current streak
function calculateStreak(entries: any[]): number {
  if (entries.length === 0) return 0

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Get today's date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if there's an entry today
  const latestEntryDate = new Date(sortedEntries[0].createdAt)
  latestEntryDate.setHours(0, 0, 0, 0)

  // If latest entry is not from today or yesterday, streak is 0
  if (latestEntryDate.getTime() < today.getTime() - 86400000) {
    return 0
  }

  // Calculate streak
  let streak = 1
  let currentDate = latestEntryDate

  // Create a map of dates with entries for faster lookup
  const datesWithEntries = new Map()
  sortedEntries.forEach((entry) => {
    const date = new Date(entry.createdAt)
    date.setHours(0, 0, 0, 0)
    datesWithEntries.set(date.getTime(), true)
  })

  // Count consecutive days
  while (true) {
    // Check the previous day
    const previousDate = new Date(currentDate)
    previousDate.setDate(previousDate.getDate() - 1)

    if (datesWithEntries.has(previousDate.getTime())) {
      streak++
      currentDate = previousDate
    } else {
      break
    }
  }

  return streak
}

// Helper function to count entries this month
function entriesThisMonth(entries: any[]): number {
  const today = new Date()
  return entries.filter((entry) => {
    const entryDate = new Date(entry.createdAt)
    return (
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    )
  }).length
}
