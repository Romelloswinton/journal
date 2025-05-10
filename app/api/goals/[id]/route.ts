import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to retrieve a specific goal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goalId = params.id

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the goal
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: user.id, // Ensure the goal belongs to the user
      },
    })

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Error fetching goal:", error)
    return NextResponse.json({ error: "Failed to fetch goal" }, { status: 500 })
  }
}

// PATCH endpoint to update a goal
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goalId = params.id

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    // Parse request body
    const { name, type, description, deadline, progress } = await request.json()

    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
      },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(progress !== undefined && {
          progress: Math.min(Math.max(progress, 0), 100),
        }), // Ensure progress is between 0-100
      },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    )
  }
}

// DELETE endpoint to delete a goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goalId = params.id

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    // Delete the goal
    await prisma.goal.delete({
      where: {
        id: goalId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting goal:", error)
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    )
  }
}
