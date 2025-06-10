// app/api/admin/journals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const journalUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  image: z.string().url().optional(),
  category: z.enum(["Situational", "Daily", "Framework"]).optional(),
  description: z.string().optional(),
  content: z
    .object({
      prompts: z.array(z.string()).min(1),
      duration: z.string().optional(),
      benefits: z.array(z.string()).optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
})

// GET /api/admin/journals/[id] - Get single journal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const journal = await prisma.libraryJournal.findUnique({
      where: { id: params.id },
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

// PUT /api/admin/journals/[id] - Update journal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = journalUpdateSchema.parse(body)

    const journal = await prisma.libraryJournal.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(journal)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating journal:", error)
    return NextResponse.json(
      { error: "Failed to update journal" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/journals/[id] - Delete journal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.libraryJournal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting journal:", error)
    return NextResponse.json(
      { error: "Failed to delete journal" },
      { status: 500 }
    )
  }
}
