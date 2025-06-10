// app/api/library/prompts/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

// GET /api/library/prompts - Get all prompts with user's saved status
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

    // Get all active prompts
    const prompts = await prisma.libraryPrompt.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })

    // Get user's saved prompts
    const savedPrompts = await prisma.savedLibraryPrompt.findMany({
      where: { userId: user.id },
      include: {
        prompt: true,
      },
      orderBy: { lastUsed: "desc" },
    })

    // Mark which prompts are saved by this user
    const savedPromptIds = new Set(savedPrompts.map((sp) => sp.promptId))

    const promptsWithSavedStatus = prompts.map((prompt) => ({
      ...prompt,
      isSaved: savedPromptIds.has(prompt.id),
    }))

    return NextResponse.json({
      prompts: promptsWithSavedStatus,
      saved: savedPrompts.map((sp) => ({
        ...sp.prompt,
        lastUsed: sp.lastUsed.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching prompts:", error)
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    )
  }
}
