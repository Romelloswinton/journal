// app/lib/jobs/streakMaintenance.ts
import { prisma } from "@/lib/prisma"
import { endOfDay, startOfDay, subDays } from "date-fns"

/**
 * Processes streaks for all users, resetting streaks if they missed a day's check-in
 */
export async function processStreaks() {
  try {
    // Get all users
    const users = await prisma.user.findMany()

    for (const user of users) {
      // Get the latest entry date for this user
      const latestEntry = await prisma.journalEntry.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })

      // If no entries exist, set currentStreak to 0
      if (!latestEntry) {
        await prisma.userStat.update({
          where: { userId: user.id },
          data: { currentStreak: 0 },
        })
        continue
      }

      // Check if the latest entry is from yesterday or today
      const today = new Date()
      const latestEntryDate = new Date(latestEntry.createdAt)
      const yesterday = subDays(today, 1)

      const isFromToday =
        latestEntryDate >= startOfDay(today) &&
        latestEntryDate <= endOfDay(today)

      const isFromYesterday =
        latestEntryDate >= startOfDay(yesterday) &&
        latestEntryDate <= endOfDay(yesterday)

      // If the latest entry is not from today or yesterday, reset the streak
      if (!isFromToday && !isFromYesterday) {
        await prisma.userStat.update({
          where: { userId: user.id },
          data: { currentStreak: 0 },
        })
      }
    }

    console.log("Streak maintenance completed successfully")
  } catch (error) {
    console.error("Error processing streaks:", error)
  }
}

// This function can be called from a scheduled job
// For example, with a package like node-cron:
// cron.schedule('0 0 * * *', processStreaks); // Run at midnight every day
