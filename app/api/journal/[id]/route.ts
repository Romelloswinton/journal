import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// GET: Fetch a single journal entry by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!id) {
      return new NextResponse("Journal ID is required", { status: 400 })
    }

    // Find the user in our database using Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Try to find in new format first
    const newFormatEntry = await db.journalEntry2.findUnique({
      where: {
        id,
        userId: user.id,
      },
    })

    if (newFormatEntry) {
      return NextResponse.json(newFormatEntry)
    }

    // If not found, try to find in old format
    const oldFormatEntry = await db.journalEntry.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!oldFormatEntry) {
      return new NextResponse("Journal entry not found", { status: 404 })
    }

    // Transform to new format
    const transformedEntry = {
      id: oldFormatEntry.id,
      title: oldFormatEntry.title || "Untitled Entry",
      content: oldFormatEntry.content,
      tags: oldFormatEntry.tags.map((t) => t.tag.name),
      metrics: {
        mood: oldFormatEntry.mood ? parseInt(oldFormatEntry.mood) : 5,
        energy: 5, // Default values for old entries
        clarity: 5,
      },
      insights: [], // No insights in old entries
      createdAt: oldFormatEntry.createdAt.toISOString(),
      updatedAt: oldFormatEntry.updatedAt.toISOString(),
    }

    return NextResponse.json(transformedEntry)
  } catch (error) {
    console.error("[JOURNAL_GET_BY_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH: Update a journal entry by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!id) {
      return new NextResponse("Journal ID is required", { status: 400 })
    }

    const body = await request.json() // Fixed: Changed req to request
    const { title, content, tags, metrics, insights } = body

    if (!title && !content && !tags && !metrics && !insights) {
      return new NextResponse("No fields to update provided", { status: 400 })
    }

    // Find the user in our database using Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if this is a new format entry first
    const existingNewEntry = await db.journalEntry2.findUnique({
      where: {
        id,
        userId: user.id,
      },
    })

    if (existingNewEntry) {
      // Update new format entry
      const updatedEntry = await db.journalEntry2.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(tags !== undefined && { tags }),
          ...(metrics !== undefined && { metrics }),
          ...(insights !== undefined && { insights }),
        },
      })

      return NextResponse.json(updatedEntry)
    }

    // If not found in new format, check old format
    const existingOldEntry = await db.journalEntry.findUnique({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!existingOldEntry) {
      return new NextResponse("Journal entry not found", { status: 404 })
    }

    // For old format entries, we have two options:
    // 1. Update them in the old format
    // 2. Migrate them to the new format

    // Option 2: Migrate to new format
    const migratedEntry = await db.journalEntry2.create({
      data: {
        title: title || existingOldEntry.title || "Untitled Entry",
        content: content || existingOldEntry.content,
        tags: tags || [],
        metrics: metrics || {
          mood: existingOldEntry.mood ? parseInt(existingOldEntry.mood) : 5,
          energy: 5,
          clarity: 5,
        },
        insights: insights || [],
        userId: user.id,
        // Use the same ID if possible, or create a reference
        // This depends on your migration strategy
      },
    })

    // Optionally, mark the old entry as migrated or delete it
    // This depends on your migration strategy

    return NextResponse.json(migratedEntry)
  } catch (error) {
    console.error("[JOURNAL_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// DELETE: Delete a journal entry by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!id) {
      return new NextResponse("Journal ID is required", { status: 400 })
    }

    // Find the user in our database using Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Try to delete from new format first
    try {
      await db.journalEntry2.delete({
        where: {
          id,
          userId: user.id,
        },
      })
      return new NextResponse(null, { status: 204 })
    } catch (error) {
      // If not found in new format, try old format
      try {
        await db.journalEntry.delete({
          where: {
            id,
            userId: user.id,
          },
        })
        return new NextResponse(null, { status: 204 })
      } catch (innerError) {
        return new NextResponse("Journal entry not found", { status: 404 })
      }
    }
  } catch (error) {
    console.error("[JOURNAL_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
