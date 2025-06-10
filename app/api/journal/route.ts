// app/api/journal/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// GET: Fetch all journal entries for the current user
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find or create the user in our database using Clerk ID
    let user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      // Auto-create user if they don't exist
      try {
        user = await db.user.create({
          data: {
            clerkId: clerkUserId,
            // Add other required fields based on your User model
            // email: "", // Add if required by your schema
            // name: "", // Add if required by your schema
          },
        })
        console.log(`Auto-created user profile for ${clerkUserId}`)
      } catch (createError) {
        console.error("Failed to auto-create user:", createError)
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        )
      }
    }

    // Support for old journal entries (could be expanded for migration later)
    const oldEntries = await db.journalEntry.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Transform old entries to new format
    const transformedOldEntries = oldEntries.map((entry) => {
      return {
        id: entry.id,
        title: entry.title || "Untitled Entry",
        content: entry.content,
        tags: entry.tags.map((t) => t.tag.name),
        metrics: {
          mood: entry.mood ? parseInt(entry.mood) : 5,
          energy: 5, // Default values for old entries
          clarity: 5,
        },
        insights: [], // No insights in old entries
        isAIGenerated: false, // Old entries weren't AI generated
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      }
    })

    // Get new format entries
    const newEntries = await db.journalEntry2.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Combine both, giving preference to new entries
    // This approach helps during the transition period
    const combinedEntries = [...newEntries, ...transformedOldEntries]

    return NextResponse.json(combinedEntries)
  } catch (error) {
    console.error("[JOURNAL_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// POST: Create a new journal entry
export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      content,
      tags,
      metrics,
      insights,
      isAIGenerated = false,
    } = body

    if (!title || !content) {
      return new NextResponse("Title and content are required", { status: 400 })
    }

    // Find or create the user in our database using Clerk ID
    let user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      // Auto-create user if they don't exist
      try {
        user = await db.user.create({
          data: {
            clerkId: clerkUserId,
            // Add other required fields based on your User model
            // email: "", // Add if required by your schema
            // name: "", // Add if required by your schema
          },
        })
        console.log(`Auto-created user profile for ${clerkUserId}`)
      } catch (createError) {
        console.error("Failed to auto-create user:", createError)
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        )
      }
    }

    // Create a new journal entry
    const entry = await db.journalEntry2.create({
      data: {
        title,
        content,
        tags: tags || [],
        metrics: metrics || { mood: 5, energy: 5, clarity: 5 },
        insights: insights || [],
        isAIGenerated,
        userId: user.id,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("[JOURNAL_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
