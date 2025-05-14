// app/api/rosebud/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// PUT: Update a conversation with new messages
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find the user in our database using Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const data = await request.json()
    const { messages, label } = data

    // Update the conversation with new messages and update timestamp
    const updatedConversation = await db.rosebudConversation.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        messages: messages ? JSON.stringify(messages) : undefined,
        label,
        updatedAt: new Date(), // Update the timestamp to now
      },
    })

    // Parse messages if they exist
    let parsedMessages = undefined
    if (updatedConversation.messages) {
      try {
        parsedMessages = JSON.parse(updatedConversation.messages.toString())
      } catch (e) {
        console.error(`Failed to parse messages for conversation ${id}:`, e)
      }
    }

    return NextResponse.json({
      ...updatedConversation,
      messages: parsedMessages,
    })
  } catch (error) {
    console.error("[ROSEBUD_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH: Update a conversation (for labeling)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find the user in our database using Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { label } = body

    // Update the conversation with the new label
    const updatedConversation = await db.rosebudConversation.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        label,
        updatedAt: new Date(), // Also update the timestamp when labeling
      },
    })

    return NextResponse.json(updatedConversation)
  } catch (error) {
    console.error("[ROSEBUD_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// DELETE: Delete a conversation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find the user in our database using Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete the conversation
    await db.rosebudConversation.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ROSEBUD_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
