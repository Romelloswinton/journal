// app/api/admin/journals/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { auth } from "@clerk/nextjs/server"

// Schema for creating/updating journals
const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  image: z.string().url("Image must be a valid URL"),
  category: z.enum(["Situational", "Daily", "Framework"]),
  description: z.string().optional(),
  content: z
    .object({
      prompts: z.array(z.string()).min(1, "At least one prompt is required"),
      duration: z.string().optional(),
      benefits: z.array(z.string()).optional(),
    })
    .optional(),
})

// GET /api/admin/journals - Get all journals for admin
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Add admin role check here
    // const user = await prisma.user.findUnique({
    //   where: { clerkId: userId },
    //   select: { role: true }
    // })
    // if (user?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const journals = await prisma.libraryJournal.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(journals)
  } catch (error) {
    console.error("Error fetching admin journals:", error)
    return NextResponse.json(
      { error: "Failed to fetch journals" },
      { status: 500 }
    )
  }
}

// POST /api/admin/journals - Create new journal
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Add admin role check here

    const body = await request.json()
    const validatedData = journalSchema.parse(body)

    const journal = await prisma.libraryJournal.create({
      data: {
        title: validatedData.title,
        author: validatedData.author,
        image: validatedData.image,
        category: validatedData.category,
        description: validatedData.description,
        content: validatedData.content,
        isActive: true,
      },
    })

    return NextResponse.json(journal, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating journal:", error)
    return NextResponse.json(
      { error: "Failed to create journal" },
      { status: 500 }
    )
  }
}
