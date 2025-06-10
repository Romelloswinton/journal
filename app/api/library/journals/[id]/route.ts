// app/api/library/journals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

// GET /api/library/journals/[id] - Get single journal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const journalId = params.id

    // Get journal from library
    const journal = await prisma.libraryJournal.findUnique({
      where: { id: journalId },
    })

    if (!journal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 })
    }

    return NextResponse.json(journal)
  } catch (error) {
    console.error("Error fetching journal:", error)
    return NextResponse.json(
      { error: "Failed to fetch journal" },
      { status: 500 }
    )
  }
}

// DELETE /api/library/journals/[id] - Remove saved journal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user exists in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const journalId = params.id

    // Remove saved journal
    await prisma.savedLibraryJournal.deleteMany({
      where: {
        userId: user.id,
        journalId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing saved journal:", error)
    return NextResponse.json(
      { error: "Failed to remove saved journal" },
      { status: 500 }
    )
  }
}
