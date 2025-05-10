import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// POST handler for creating a new tag
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse request body
    const { name } = await request.json()

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      )
    }

    // Check if tag already exists
    const normalizedName = name.trim().toLowerCase()
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: normalizedName,
        userId: user.id,
      },
    })

    // If tag already exists, just return it
    if (existingTag) {
      return NextResponse.json({
        id: existingTag.id,
        name: existingTag.name,
        existing: true,
      })
    }

    // Create the tag if it doesn't exist
    const newTag = await prisma.tag.create({
      data: {
        name: normalizedName,
        userId: user.id,
      },
    })

    return NextResponse.json({
      id: newTag.id,
      name: newTag.name,
      existing: false,
    })
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}

// GET handler for fetching all tags
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all tags for this user
    const tags = await prisma.tag.findMany({
      where: {
        userId: user.id,
      },
    })

    // Count entries for each tag
    const tagCounts = new Map()

    // Get all entries with tags for this user
    const entriesWithTags = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Count entries per tag
    entriesWithTags.forEach((entry) => {
      entry.tags.forEach((tagRel) => {
        const tagId = tagRel.tagId
        tagCounts.set(tagId, (tagCounts.get(tagId) || 0) + 1)
      })
    })

    // Format response
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: tagCounts.get(tag.id) || 0,
    }))

    return NextResponse.json(formattedTags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
