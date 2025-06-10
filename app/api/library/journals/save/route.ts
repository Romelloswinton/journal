// app/api/library/journals/save/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const saveJournalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  image: z.string().min(1),
  category: z.string().optional(),
})

// POST /api/library/journals/save - Save a journal for user
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const journalData = saveJournalSchema.parse(body)

    // Check if journal exists in library
    const journal = await prisma.libraryJournal.findUnique({
      where: { id: journalData.id },
    })

    if (!journal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 })
    }

    // Save journal for user (upsert to handle duplicates)
    const savedJournal = await prisma.savedLibraryJournal.upsert({
      where: {
        userId_journalId: {
          userId: user.id,
          journalId: journal.id,
        },
      },
      update: {
        lastUsed: new Date(),
      },
      create: {
        userId: user.id,
        journalId: journal.id,
        lastUsed: new Date(),
      },
      include: {
        journal: true,
      },
    })

    return NextResponse.json({
      ...savedJournal.journal,
      lastUsed: savedJournal.lastUsed.toISOString(),
    })
  } catch (error) {
    console.error("Error saving journal:", error)
    return NextResponse.json(
      { error: "Failed to save journal" },
      { status: 500 }
    )
  }
}
