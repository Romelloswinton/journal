import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// GET: Fetch a single reflection by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: "Reflection ID is required" },
        { status: 400 }
      )
    }

    try {
      // Find the user in our database using Clerk ID
      const user = await db.user.findUnique({
        where: { clerkId: clerkUserId },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Fetch the reflection entry
      const reflectionEntry = await db.reflectionEntry.findUnique({
        where: {
          id,
          userId: user.id,
        },
      })

      if (!reflectionEntry) {
        return NextResponse.json(
          { error: "Reflection not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(reflectionEntry)
    } catch (dbError) {
      console.error("Database error in GET reflection by ID:", dbError)
      return NextResponse.json(
        {
          error: "Failed to fetch reflection",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[REFLECTION_GET] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    )
  }
}

// PATCH: Update a reflection by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: "Reflection ID is required" },
        { status: 400 }
      )
    }

    // Parse the request body
    let body
    try {
      body = await request.json()
      console.log("Received reflection update data:", body)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { title, content, tags, metrics, insights } = body

    if (!title && !content && !tags && !metrics && !insights) {
      return NextResponse.json(
        { error: "No fields to update provided" },
        { status: 400 }
      )
    }

    try {
      // Find the user in our database using Clerk ID
      const user = await db.user.findUnique({
        where: { clerkId: clerkUserId },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Verify that the reflection belongs to the user
      const existingReflection = await db.reflectionEntry.findUnique({
        where: {
          id,
          userId: user.id,
        },
      })

      if (!existingReflection) {
        return NextResponse.json(
          { error: "Reflection not found or access denied" },
          { status: 404 }
        )
      }

      // Update the reflection
      const updatedReflection = await db.reflectionEntry.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(tags !== undefined && { tags }),
          ...(metrics !== undefined && { metrics }),
          ...(insights !== undefined && { insights }),
        },
      })

      console.log("Reflection updated successfully:", updatedReflection.id)
      return NextResponse.json(updatedReflection)
    } catch (dbError) {
      console.error("Database error in PATCH reflection:", dbError)
      return NextResponse.json(
        {
          error: "Failed to update reflection",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[REFLECTION_PATCH] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    )
  }
}

// DELETE: Delete a reflection by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth()
    const id = params.id

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: "Reflection ID is required" },
        { status: 400 }
      )
    }

    try {
      // Find the user in our database using Clerk ID
      const user = await db.user.findUnique({
        where: { clerkId: clerkUserId },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Verify that the reflection belongs to the user
      const existingReflection = await db.reflectionEntry.findUnique({
        where: {
          id,
          userId: user.id,
        },
      })

      if (!existingReflection) {
        return NextResponse.json(
          { error: "Reflection not found or access denied" },
          { status: 404 }
        )
      }

      // Delete the reflection
      await db.reflectionEntry.delete({
        where: {
          id,
          userId: user.id,
        },
      })

      console.log("Reflection deleted successfully:", id)
      return new NextResponse(null, { status: 204 })
    } catch (dbError) {
      console.error("Database error in DELETE reflection:", dbError)
      return NextResponse.json(
        {
          error: "Failed to delete reflection",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[REFLECTION_DELETE] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    )
  }
}
