// app/api/library/journals/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET /api/library/journals - Get all journals with user's saved status
export async function GET(request: NextRequest) {
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

    // Get all active library journals
    const journals = await prisma.libraryJournal.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })

    // Get user's saved journals
    const savedJournals = await prisma.savedLibraryJournal.findMany({
      where: { userId: user.id },
      include: {
        journal: true,
      },
      orderBy: { lastUsed: "desc" },
    })

    // Categorize journals
    const categorizedJournals = {
      situational: journals.filter((j) => j.category === "Situational"),
      daily: journals.filter((j) => j.category === "Daily"),
      frameworks: journals.filter((j) => j.category === "Framework"),
      saved: savedJournals.map((sj) => ({
        ...sj.journal,
        lastUsed: sj.lastUsed.toISOString(),
      })),
    }

    return NextResponse.json(categorizedJournals)
  } catch (error) {
    console.error("Error fetching journals:", error)
    return NextResponse.json(
      { error: "Failed to fetch journals" },
      { status: 500 }
    )
  }
}
