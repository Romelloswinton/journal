// app/api/library/ideas/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { auth } from "@clerk/nextjs/server"

const ideaSchema = z.object({
  type: z.enum(["journal", "prompt"]),
  title: z.string().optional(),
  description: z.string().min(1, "Description is required"),
})

// POST /api/library/ideas - Submit an idea
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
    const validatedData = ideaSchema.parse(body)

    // Create idea submission
    const idea = await prisma.ideaSubmission.create({
      data: {
        userId: user.id,
        type: validatedData.type,
        title: validatedData.title,
        description: validatedData.description,
      },
    })

    return NextResponse.json({ success: true, id: idea.id })
  } catch (error) {
    console.error("Error submitting idea:", error)
    return NextResponse.json(
      { error: "Failed to submit idea" },
      { status: 500 }
    )
  }
}

// GET /api/library/ideas - Get user's submitted ideas
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

    // Get user's idea submissions
    const ideas = await prisma.ideaSubmission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error("Error fetching ideas:", error)
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    )
  }
}
