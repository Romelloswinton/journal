import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to retrieve all happiness ingredients for the current user
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

    // Get all happiness ingredients for this user
    const ingredients = await prisma.happinessIngredient.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(ingredients)
  } catch (error) {
    console.error("Error fetching happiness ingredients:", error)
    return NextResponse.json(
      { error: "Failed to fetch happiness ingredients" },
      { status: 500 }
    )
  }
}

// POST endpoint to create a new happiness ingredient
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
    const { name, category, frequency, importance } = await request.json()

    // Validate required fields
    if (!name || !category || !frequency || !importance) {
      return NextResponse.json(
        { error: "Name, category, frequency, and importance are required" },
        { status: 400 }
      )
    }

    // Validate values
    const validFrequencies = ["daily", "weekly", "monthly"]
    const validImportance = ["high", "medium", "low"]

    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: "Frequency must be one of: daily, weekly, monthly" },
        { status: 400 }
      )
    }

    if (!validImportance.includes(importance)) {
      return NextResponse.json(
        { error: "Importance must be one of: high, medium, low" },
        { status: 400 }
      )
    }

    // Create the happiness ingredient
    const ingredient = await prisma.happinessIngredient.create({
      data: {
        name,
        category,
        frequency,
        importance,
        userId: user.id,
      },
    })

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error("Error creating happiness ingredient:", error)
    return NextResponse.json(
      { error: "Failed to create happiness ingredient" },
      { status: 500 }
    )
  }
}
