// app/api/library/prompts/save/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { auth } from "@clerk/nextjs/server"

const savePromptSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  category: z.string().min(1),
  isSaved: z.boolean().optional(),
})

// POST /api/library/prompts/save - Save a prompt for user
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
    const promptData = savePromptSchema.parse(body)

    // Check if prompt exists in library
    const prompt = await prisma.libraryPrompt.findUnique({
      where: { id: promptData.id },
    })

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
    }

    // Save prompt for user
    const savedPrompt = await prisma.savedLibraryPrompt.upsert({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: prompt.id,
        },
      },
      update: {
        lastUsed: new Date(),
      },
      create: {
        userId: user.id,
        promptId: prompt.id,
        lastUsed: new Date(),
      },
      include: {
        prompt: true,
      },
    })

    return NextResponse.json({
      ...savedPrompt.prompt,
      lastUsed: savedPrompt.lastUsed.toISOString(),
    })
  } catch (error) {
    console.error("Error saving prompt:", error)
    return NextResponse.json(
      { error: "Failed to save prompt" },
      { status: 500 }
    )
  }
}
