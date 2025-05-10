// app/api/stats/route.ts

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// GET: Fetch a user's stats
export async function GET(request: Request) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUserId,
      },
      include: {
        userStats: true, // Using the new UserStats model
        userStat: true, // Include the old stats model for migration purposes
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user has new stats model data, return it
    if (user.userStats) {
      return NextResponse.json({
        currentStreak: user.userStats.currentStreak,
        longestStreak: user.userStats.longestStreak,
        totalEntries: user.userStats.totalEntries,
        wordCount: user.userStats.wordCount,
        hasTodayEntry: user.userStats.hasTodayEntry,
      })
    }

    // If user only has old stats model data, convert and return it
    if (user.userStat) {
      // Create a derived hasTodayEntry value based on lastCheckIn
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const lastCheckIn = user.userStat.lastCheckIn
      const hasTodayEntry = lastCheckIn
        ? new Date(lastCheckIn).setHours(0, 0, 0, 0) === today.getTime()
        : false

      return NextResponse.json({
        currentStreak: user.userStat.currentStreak,
        longestStreak: user.userStat.longestStreak,
        totalEntries: user.userStat.totalEntries,
        wordCount: user.userStat.wordCount,
        hasTodayEntry,
      })
    }

    // If user doesn't have stats yet, return default values
    return NextResponse.json({
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: 0,
      wordCount: 0,
      hasTodayEntry: false,
    })
  } catch (error) {
    console.error("[GET_STATS] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    )
  }
}

// POST: Update a user's stats
export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
      )
    }

    // Parse request body
    const stats = await request.json()

    // Validate stats data
    const {
      currentStreak,
      longestStreak,
      totalEntries,
      wordCount,
      hasTodayEntry,
    } = stats

    if (
      typeof currentStreak !== "number" ||
      typeof longestStreak !== "number" ||
      typeof totalEntries !== "number" ||
      typeof wordCount !== "number" ||
      typeof hasTodayEntry !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid stats data" }, { status: 400 })
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUserId,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Upsert user stats in the new UserStats model
    const updatedStats = await db.userStats.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        currentStreak,
        longestStreak,
        totalEntries,
        wordCount,
        hasTodayEntry,
        lastUpdateDate: new Date(),
      },
      update: {
        currentStreak,
        longestStreak,
        totalEntries,
        wordCount,
        hasTodayEntry,
        lastUpdateDate: new Date(),
      },
    })

    // Also update the old UserStat model for backward compatibility
    const today = new Date()
    await db.userStat.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        totalEntries,
        currentStreak,
        longestStreak,
        lastCheckIn: hasTodayEntry ? today : null,
        wordCount,
      },
      update: {
        totalEntries,
        currentStreak,
        longestStreak,
        lastCheckIn: hasTodayEntry ? today : null,
        wordCount,
      },
    })

    return NextResponse.json(updatedStats)
  } catch (error) {
    console.error("[POST_STATS] Error:", error)
    return NextResponse.json(
      { error: "Failed to update user stats" },
      { status: 500 }
    )
  }
}
