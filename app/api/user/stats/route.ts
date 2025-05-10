// app/api/user/stats/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { endOfDay, startOfDay } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    // If the user doesn't exist, return default stats
    if (!user) {
      console.log("User not found in database, returning default stats")
      return NextResponse.json({
        totalEntries: 0,
        entriesCount: 0,
        currentStreak: 0,
        longestStreak: 0,
        wordCount: 0,
        insightsCount: 0,
        hasTodayEntry: false,
      })
    }

    // Find or create user stats
    let userStats = await prisma.userStat.findUnique({
      where: { userId: user.id },
    })

    if (!userStats) {
      userStats = await prisma.userStat.create({
        data: {
          userId: user.id,
          totalEntries: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
      })
    }

    // Get all journal entries for the user
    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    })

    // Debug the entries
    console.log(`Found ${entries.length} entries for user ${user.id}`)
    if (entries.length > 0) {
      console.log(`First entry title: ${entries[0].title}`)
      console.log(
        `First entry content preview: ${entries[0].content.substring(0, 50)}...`
      )
    }

    // Calculate total entries
    const totalEntries = entries.length

    // Calculate total words in all entries - using a more detailed approach for debugging
    let wordCount = 0
    for (const entry of entries) {
      if (entry.content) {
        const words = entry.content
          .split(/\s+/)
          .filter((word) => word.length > 0)
        wordCount += words.length

        // Debug individual entry word counts
        console.log(`Entry ${entry.id} has ${words.length} words`)
      }
    }

    console.log(
      `Total word count calculation for user ${user.id}: ${wordCount} words across ${totalEntries} entries`
    )

    // Check if user has an entry for today
    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)

    const todayEntry = entries.find((entry) => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= todayStart && entryDate <= todayEnd
    })

    // Calculate streak using the algorithm from your existing implementation
    let currentStreak = 0

    if (entries.length > 0) {
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
      if (uniqueDates.length > 0 && uniqueDates[0] === todayStart.getTime()) {
        currentStreak = 1

        // Check previous days
        for (let i = 1; i < uniqueDates.length; i++) {
          // Calculate expected previous day
          const expectedPrevDay = new Date(todayStart)
          expectedPrevDay.setDate(todayStart.getDate() - i)
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

    // Check if we need to update the longest streak
    const longestStreak = Math.max(currentStreak, userStats.longestStreak || 0)

    // Check if user has a reflection
    let insightsCount = 0
    try {
      const reflection = await prisma.reflection.findUnique({
        where: { userId: user.id },
      })

      // Count valid reflection fields as insights
      if (reflection) {
        if (reflection.priorityReflection) insightsCount++
        if (reflection.worryReflection) insightsCount++
        if (reflection.positiveReflection) insightsCount++
      }
    } catch (error) {
      console.error("Error fetching reflections:", error)
      // Continue with insightsCount as 0
    }

    // Update user stats if anything has changed
    if (
      totalEntries !== userStats.totalEntries ||
      currentStreak !== userStats.currentStreak ||
      longestStreak !== userStats.longestStreak
    ) {
      userStats = await prisma.userStat.update({
        where: { userId: user.id },
        data: {
          totalEntries,
          currentStreak,
          longestStreak,
        },
      })
    }

    // Create the response object with all stats
    const responseObj = {
      id: userStats.id,
      userId: userStats.userId,
      totalEntries,
      entriesCount: totalEntries, // Alias for backward compatibility
      currentStreak,
      longestStreak,
      wordCount,
      insightsCount,
      hasTodayEntry: !!todayEntry,
      createdAt: userStats.createdAt.toISOString(),
      updatedAt: userStats.updatedAt.toISOString(),
    }

    // Debug the final response object
    console.log("Sending user stats response:", responseObj)

    // Return the user stats with all fields
    return NextResponse.json(responseObj)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    )
  }
}

// Handle check-in updates
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get current user stats
    let userStats = await prisma.userStat.findUnique({
      where: { userId: user.id },
    })

    if (!userStats) {
      userStats = await prisma.userStat.create({
        data: {
          userId: user.id,
          totalEntries: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
      })
    }

    // Check if user has a journal entry for today
    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)

    const todayEntry = await prisma.journalEntry.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    })

    // If user doesn't have a today entry, create a minimal one for check-in
    let newEntry = null
    if (!todayEntry) {
      newEntry = await prisma.journalEntry.create({
        data: {
          userId: user.id,
          title: "Daily Check-in",
          content: "Daily check-in completed",
        },
      })

      // Update current streak
      const newCurrentStreak = userStats.currentStreak + 1
      const newLongestStreak = Math.max(
        newCurrentStreak,
        userStats.longestStreak
      )

      userStats = await prisma.userStat.update({
        where: { userId: user.id },
        data: {
          totalEntries: userStats.totalEntries + 1,
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
        },
      })
    }

    // Get all entries to calculate word count
    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        content: true,
      },
    })

    // Debug the entries
    console.log(`Found ${entries.length} entries for word count calculation`)

    // Calculate word count with detailed logging
    let wordCount = 0
    for (const entry of entries) {
      if (entry.content) {
        const words = entry.content
          .split(/\s+/)
          .filter((word) => word.length > 0)
        wordCount += words.length

        // Debug individual entry word counts
        console.log(`Entry ${entry.id} has ${words.length} words`)
      }
    }

    console.log(
      `Updated word count for user ${user.id} after check-in: ${wordCount}`
    )

    // Calculate total entries
    const totalEntries = entries.length

    // Check if user has a reflection
    let insightsCount = 0
    try {
      const reflection = await prisma.reflection.findUnique({
        where: { userId: user.id },
      })

      // Count valid reflection fields as insights
      if (reflection) {
        if (reflection.priorityReflection) insightsCount++
        if (reflection.worryReflection) insightsCount++
        if (reflection.positiveReflection) insightsCount++
      }
    } catch (error) {
      console.error("Error fetching reflections:", error)
      // Continue with insightsCount as 0
    }

    // Create the response object
    const responseObj = {
      id: userStats.id,
      userId: userStats.userId,
      totalEntries,
      entriesCount: totalEntries,
      currentStreak: userStats.currentStreak,
      longestStreak: userStats.longestStreak,
      wordCount,
      insightsCount,
      hasTodayEntry: true,
      createdAt: userStats.createdAt.toISOString(),
      updatedAt: userStats.updatedAt.toISOString(),
    }

    // Debug the final response
    console.log("Sending check-in response:", responseObj)

    return NextResponse.json(responseObj)
  } catch (error) {
    console.error("Error updating check-in:", error)
    return NextResponse.json(
      { error: "Failed to update check-in" },
      { status: 500 }
    )
  }
}
