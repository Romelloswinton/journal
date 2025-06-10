// app/api/happiness-ingredients/[id]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to retrieve a specific happiness ingredient
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ingredientId = params.id

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the happiness ingredient
    const ingredient = await prisma.happinessIngredient.findUnique({
      where: {
        id: ingredientId,
        userId: user.id, // Ensure the ingredient belongs to the user
      },
    })

    if (!ingredient) {
      return NextResponse.json(
        { error: "Happiness ingredient not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error("Error fetching happiness ingredient:", error)
    return NextResponse.json(
      { error: "Failed to fetch happiness ingredient" },
      { status: 500 }
    )
  }
}

// PATCH endpoint to update a happiness ingredient
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ingredientId = params.id

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if ingredient exists and belongs to user
    const existingIngredient = await prisma.happinessIngredient.findUnique({
      where: {
        id: ingredientId,
        userId: user.id,
      },
    })

    if (!existingIngredient) {
      return NextResponse.json(
        { error: "Happiness ingredient not found" },
        { status: 404 }
      )
    }

    // Parse request body
    const { name, category, frequency, importance, isCompleted } =
      await request.json()

    // Update the happiness ingredient
    const updatedIngredient = await prisma.happinessIngredient.update({
      where: {
        id: ingredientId,
      },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(frequency && { frequency }),
        ...(importance && { importance }),
        ...(isCompleted !== undefined && { isCompleted }),
      },
    })

    return NextResponse.json(updatedIngredient)
  } catch (error) {
    console.error("Error updating happiness ingredient:", error)
    return NextResponse.json(
      { error: "Failed to update happiness ingredient" },
      { status: 500 }
    )
  }
}

// DELETE endpoint to delete a happiness ingredient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ingredientId = params.id

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email: clerkUserId }],
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if ingredient exists and belongs to user
    const existingIngredient = await prisma.happinessIngredient.findUnique({
      where: {
        id: ingredientId,
        userId: user.id,
      },
    })

    if (!existingIngredient) {
      return NextResponse.json(
        { error: "Happiness ingredient not found" },
        { status: 404 }
      )
    }

    // Delete the happiness ingredient
    await prisma.happinessIngredient.delete({
      where: {
        id: ingredientId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting happiness ingredient:", error)
    return NextResponse.json(
      { error: "Failed to delete happiness ingredient" },
      { status: 500 }
    )
  }
}
