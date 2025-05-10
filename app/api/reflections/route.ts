import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      console.error("No Clerk user ID found")
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
      )
    }

    // Parse the request body
    let body
    try {
      body = await request.json()
      console.log("Received reflection data:", body)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    // Find the user in our database using Clerk ID
    let user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    // Create the user if they don't exist
    if (!user) {
      console.log(
        `User not found for Clerk ID: ${clerkUserId}, creating new user`
      )
      user = await db.user.create({
        data: {
          clerkId: clerkUserId,
        },
      })
      console.log("Created new user:", user.id)
    }

    // Check if this is for the old reflection system or the new one
    if (body.reflections) {
      // Handle old reflection system (first entry reflections)
      const {
        firstEntryPriority,
        firstEntryWorry,
        firstEntryPositive,
        reflections,
      } = body

      // Validate required fields
      if (!reflections || typeof reflections !== "object") {
        console.error("Invalid reflections data:", reflections)
        return NextResponse.json(
          { error: "Invalid reflections data provided" },
          { status: 400 }
        )
      }

      try {
        // Save or update the reflections in the database
        const reflectionRecord = await db.oldReflection.upsert({
          where: {
            userId: user.id,
          },
          update: {
            firstEntryPriority,
            firstEntryWorry,
            firstEntryPositive,
            priorityReflection: reflections.priority,
            worryReflection: reflections.worry,
            positiveReflection: reflections.positive,
            updatedAt: new Date(),
          },
          create: {
            userId: user.id,
            firstEntryPriority,
            firstEntryWorry,
            firstEntryPositive,
            priorityReflection: reflections.priority,
            worryReflection: reflections.worry,
            positiveReflection: reflections.positive,
          },
        })

        console.log("Old reflection saved successfully:", reflectionRecord.id)
        return NextResponse.json(reflectionRecord)
      } catch (dbError) {
        console.error("Database error:", dbError)
        return NextResponse.json(
          {
            error: "Failed to save reflection to database",
            details:
              dbError instanceof Error ? dbError.message : String(dbError),
          },
          { status: 500 }
        )
      }
    } else {
      // Handle new reflection system (ReflectionEntry)
      const {
        title,
        content,
        tags = [],
        metrics = { mood: 5, energy: 5, clarity: 5 },
        insights = [],
        isAIGenerated = false,
      } = body

      // Validate required fields
      if (!title || !content) {
        return NextResponse.json(
          { error: "Title and content are required" },
          { status: 400 }
        )
      }

      try {
        // Create a new reflection entry
        const reflectionEntry = await db.reflectionEntry.create({
          data: {
            userId: user.id,
            title,
            content,
            tags,
            metrics,
            insights,
            isAIGenerated,
          },
        })

        console.log("New reflection entry created:", reflectionEntry.id)
        return NextResponse.json(reflectionEntry)
      } catch (dbError) {
        console.error("Database error:", dbError)
        return NextResponse.json(
          {
            error: "Failed to create reflection entry",
            details:
              dbError instanceof Error ? dbError.message : String(dbError),
          },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error("[REFLECTIONS_POST] Unexpected error:", error)
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

export async function GET(request: Request) {
  try {
    const { userId: clerkUserId } = await auth()
    const searchParams = new URL(request.url).searchParams
    const type = searchParams.get("type") || "entries" // Default to new entries

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized - No user session found" },
        { status: 401 }
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

      // Handle different reflection types
      if (type === "old") {
        // Fetch old reflection system data
        const reflection = await db.oldReflection.findUnique({
          where: {
            userId: user.id,
          },
        })

        if (!reflection) {
          return NextResponse.json({ reflections: null })
        }

        return NextResponse.json({
          reflections: {
            priority: reflection.priorityReflection,
            worry: reflection.worryReflection,
            positive: reflection.positiveReflection,
          },
        })
      } else {
        // Fetch new reflection entries
        const reflectionEntries = await db.reflectionEntry.findMany({
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        return NextResponse.json(reflectionEntries)
      }
    } catch (dbError) {
      console.error("Database error in GET:", dbError)
      return NextResponse.json(
        {
          error: "Failed to fetch reflections",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[REFLECTIONS_GET] Unexpected error:", error)
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
