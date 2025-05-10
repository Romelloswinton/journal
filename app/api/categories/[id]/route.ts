// app/api/categories/[id]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authenticated user with Clerk
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to access categories" },
        { status: 401 }
      )
    }

    const categoryId = params.id

    // First, get the user from the database using their Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch the category from the database
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        entries: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Optional: limit to most recent 5 entries
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if the category belongs to the user
    if (category.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to access this category" },
        { status: 403 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}
