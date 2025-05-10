import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// PATCH handler for updating a tag
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const tagId = params.id

    // Find the tag to ensure it belongs to the user
    const existingTag = await prisma.tag.findUnique({
      where: {
        id: tagId,
        userId: user.id,
      },
    })

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Parse request body
    const { name } = await request.json()

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      )
    }

    // Check if a tag with the same new name already exists for this user
    const normalizedName = name.trim().toLowerCase()
    const duplicateTag = await prisma.tag.findFirst({
      where: {
        name: normalizedName,
        userId: user.id,
        id: {
          not: tagId, // Exclude the current tag
        },
      },
    })

    if (duplicateTag) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 400 }
      )
    }

    // Update the tag
    const updatedTag = await prisma.tag.update({
      where: {
        id: tagId,
      },
      data: {
        name: normalizedName,
      },
    })

    return NextResponse.json({
      id: updatedTag.id,
      name: updatedTag.name,
    })
  } catch (error) {
    console.error("Error updating tag:", error)
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 })
  }
}

// DELETE handler for deleting a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const tagId = params.id

    // Find the tag to ensure it belongs to the user
    const existingTag = await prisma.tag.findUnique({
      where: {
        id: tagId,
        userId: user.id,
      },
    })

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // First, remove all associations between this tag and journal entries
    // Using TagsOnEntries which is the correct model name from your schema
    await prisma.tagsOnEntries.deleteMany({
      where: {
        tagId,
      },
    })

    // Then delete the tag
    await prisma.tag.delete({
      where: {
        id: tagId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 })
  }
}
