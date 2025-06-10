// app/api/library/prompts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

// GET /api/library/prompts/[id] - Get single prompt
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const promptId = params.id

    // Get prompt from library
    const prompt = await prisma.libraryPrompt.findUnique({
      where: { id: promptId },
    })

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
    }

    return NextResponse.json(prompt)
  } catch (error) {
    console.error("Error fetching prompt:", error)
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 }
    )
  }
}

// DELETE /api/library/prompts/[id] - Remove saved prompt
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

    const promptId = params.id

    // Remove saved prompt
    await prisma.savedLibraryPrompt.deleteMany({
      where: {
        userId: user.id,
        promptId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing saved prompt:", error)
    return NextResponse.json(
      { error: "Failed to remove saved prompt" },
      { status: 500 }
    )
  }
}
