// app/api/user/[userId]/stats/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the requested userId matches the authenticated user
    if (params.userId !== clerkUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all journal entries for the user
    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    // Calculate total words in all entries
    const totalWords = entries.reduce((sum, entry) => {
      const wordCount = entry.content
        ? entry.content.split(/\s+/).filter(Boolean).length
        : 0
      return sum + wordCount
    }, 0)

    // Since JournalInsight doesn't exist in schema, we'll use reflection count instead
    // Check if user has a reflection
    const reflection = await prisma.reflection.findUnique({
      where: { userId: user.id },
    })

    // Count valid reflection fields as insights
    let insightsCount = 0
    if (reflection) {
      if (reflection.priorityReflection) insightsCount++
      if (reflection.worryReflection) insightsCount++
      if (reflection.positiveReflection) insightsCount++
    }

    // Calculate streak
    let currentStreak = 0

    if (entries.length > 0) {
      // Check if there's an entry today
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Sort entry dates from newest to oldest
      const entryDates = entries
        .map((entry) => {
          const date = new Date(entry.createdAt)
          date.setHours(0, 0, 0, 0)
          return date.getTime()
        })
        .sort((a, b) => b - a)

      // Remove duplicate dates (multiple entries on same day)
      const uniqueDates = [...new Set(entryDates)]

      // Check if there's an entry for today
      if (uniqueDates.length > 0 && uniqueDates[0] === today.getTime()) {
        currentStreak = 1

        // Check previous days
        for (let i = 1; i < uniqueDates.length; i++) {
          // Calculate expected previous day
          const expectedPrevDay = new Date(today)
          expectedPrevDay.setDate(today.getDate() - i)
          expectedPrevDay.setHours(0, 0, 0, 0)

          // If the dates match, increase streak
          if (uniqueDates[i] === expectedPrevDay.getTime()) {
            currentStreak++
          } else {
            break
          }
        }
      } else {
        // Check if there was an entry yesterday
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)

        if (uniqueDates.length > 0 && uniqueDates[0] === yesterday.getTime()) {
          currentStreak = 1

          // Check previous days
          for (let i = 1; i < uniqueDates.length; i++) {
            // Calculate expected previous day
            const expectedPrevDay = new Date(yesterday)
            expectedPrevDay.setDate(yesterday.getDate() - i)
            expectedPrevDay.setHours(0, 0, 0, 0)

            // If the dates match, increase streak
            if (uniqueDates[i] === expectedPrevDay.getTime()) {
              currentStreak++
            } else {
              break
            }
          }
        }
      }
    }

    // Return the user stats in the format expected by dashboardStore
    return NextResponse.json({
      entriesCount: entries.length,
      currentStreak,
      insightsCount,
      wordCount: totalWords,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    )
  }
}
