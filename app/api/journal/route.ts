// app/api/journal/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// GET: Fetch all journal entries for the current user
export async function GET() {
  try {
    console.log("📖 GET /api/journal - Starting request")

    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      console.log("❌ No authenticated user found")
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please sign in to access journal entries",
        },
        { status: 401 }
      )
    }

    console.log(`✅ Authenticated user: ${clerkUserId}`)

    // Find or create the user in our database using Clerk ID
    let user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      console.log("👤 User not found, auto-creating...")
      // Auto-create user if they don't exist
      try {
        user = await db.user.create({
          data: {
            clerkId: clerkUserId,
            // Add other required fields based on your User model
            // email: "", // Add if required by your schema
            // name: "", // Add if required by your schema
          },
        })
        console.log(`✅ Auto-created user profile for ${clerkUserId}`)
      } catch (createError: unknown) {
        console.error("❌ Failed to auto-create user:", createError)
        const errorMessage =
          createError instanceof Error
            ? createError.message
            : "Unknown error occurred"
        return NextResponse.json(
          {
            error: "Database Error",
            message: "Failed to create user profile",
            details:
              process.env.NODE_ENV === "development" ? errorMessage : undefined,
          },
          { status: 500 }
        )
      }
    }

    console.log(`📊 Fetching entries for user ID: ${user.id}`)

    // Support for old journal entries (could be expanded for migration later)
    const oldEntries = await db.journalEntry.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    console.log(`📝 Found ${oldEntries.length} old format entries`)

    // Transform old entries to new format
    const transformedOldEntries = oldEntries.map((entry) => {
      return {
        id: entry.id,
        title: entry.title || "Untitled Entry",
        content: entry.content,
        tags: entry.tags.map((t) => t.tag.name),
        metrics: {
          mood: entry.mood ? parseInt(entry.mood) : 5,
          energy: 5, // Default values for old entries
          clarity: 5,
        },
        insights: [], // No insights in old entries
        isAIGenerated: false, // Old entries weren't AI generated
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      }
    })

    // Get new format entries
    const newEntries = await db.journalEntry2.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log(`📋 Found ${newEntries.length} new format entries`)

    // Combine both, giving preference to new entries
    // This approach helps during the transition period
    const combinedEntries = [...newEntries, ...transformedOldEntries]

    console.log(`✅ Returning ${combinedEntries.length} total entries`)

    // 🔧 FIXED: Return proper JSON response that matches your store expectations
    return NextResponse.json(combinedEntries, { status: 200 })
  } catch (error: unknown) {
    console.error("❌ [JOURNAL_GET] Error:", error)

    // 🔧 FIXED: Properly handle unknown error type
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred"
    const errorDetails =
      process.env.NODE_ENV === "development"
        ? error instanceof Error
          ? error.message
          : String(error)
        : undefined

    // 🔧 FIXED: Return proper JSON error instead of plain text
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch journal entries",
        details: errorDetails,
      },
      { status: 500 }
    )
  }
}

// POST: Create a new journal entry
export async function POST(req: Request) {
  try {
    console.log("📝 POST /api/journal - Creating new entry")

    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      console.log("❌ No authenticated user found")
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please sign in to create journal entries",
        },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      title,
      content,
      tags,
      metrics,
      insights,
      isAIGenerated = false,
      templateId,
      colorScheme,
    } = body

    console.log("📋 Entry data:", {
      title: title?.substring(0, 50),
      contentLength: content?.length,
    })

    if (!title || !content) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Title and content are required",
        },
        { status: 400 }
      )
    }

    // Find or create the user in our database using Clerk ID
    let user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      console.log("👤 User not found during POST, auto-creating...")
      // Auto-create user if they don't exist
      try {
        user = await db.user.create({
          data: {
            clerkId: clerkUserId,
            // Add other required fields based on your User model
            // email: "", // Add if required by your schema
            // name: "", // Add if required by your schema
          },
        })
        console.log(`✅ Auto-created user profile for ${clerkUserId}`)
      } catch (createError: unknown) {
        console.error("❌ Failed to auto-create user:", createError)
        const errorMessage =
          createError instanceof Error
            ? createError.message
            : "Unknown error occurred"
        return NextResponse.json(
          {
            error: "Database Error",
            message: "Failed to create user profile",
            details:
              process.env.NODE_ENV === "development" ? errorMessage : undefined,
          },
          { status: 500 }
        )
      }
    }

    // ✅ FIXED: Now that schema supports all fields, we can use them directly
    const entry = await db.journalEntry2.create({
      data: {
        title,
        content,
        tags: tags || [],
        metrics: metrics || { mood: 5, energy: 5, clarity: 5 },
        insights: insights || [],
        isAIGenerated,
        templateId, // ✅ Now supported in schema
        colorScheme, // ✅ Now supported in schema
        userId: user.id,
      },
    })

    console.log(`✅ Created entry with ID: ${entry.id}`)

    // 🔧 FIXED: Return the created entry in proper format
    return NextResponse.json(entry, { status: 201 })
  } catch (error: unknown) {
    console.error("❌ [JOURNAL_POST] Error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred"
    const errorDetails =
      process.env.NODE_ENV === "development" ? errorMessage : undefined

    // 🔧 FIXED: Return proper JSON error instead of plain text
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create journal entry",
        details: errorDetails,
      },
      { status: 500 }
    )
  }
}

// PUT: Update an existing journal entry
export async function PUT(req: Request) {
  try {
    console.log("✏️ PUT /api/journal - Updating entry")

    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please sign in to update journal entries",
        },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: "Validation Error", message: "Entry ID is required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User Not Found", message: "User profile not found" },
        { status: 404 }
      )
    }

    // Update the entry (only if it belongs to the user)
    const updatedEntry = await db.journalEntry2.updateMany({
      where: {
        id: id,
        userId: user.id, // Ensure user owns the entry
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    })

    if (updatedEntry.count === 0) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Journal entry not found or access denied",
        },
        { status: 404 }
      )
    }

    // Fetch and return the updated entry
    const entry = await db.journalEntry2.findUnique({
      where: { id },
    })

    console.log(`✅ Updated entry with ID: ${id}`)

    return NextResponse.json(entry, { status: 200 })
  } catch (error: unknown) {
    console.error("❌ [JOURNAL_PUT] Error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred"
    const errorDetails =
      process.env.NODE_ENV === "development" ? errorMessage : undefined

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update journal entry",
        details: errorDetails,
      },
      { status: 500 }
    )
  }
}

// DELETE: Delete a journal entry
export async function DELETE(req: Request) {
  try {
    console.log("🗑️ DELETE /api/journal - Deleting entry")

    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please sign in to delete journal entries",
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Validation Error", message: "Entry ID is required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User Not Found", message: "User profile not found" },
        { status: 404 }
      )
    }

    // Delete the entry (only if it belongs to the user)
    const deletedEntry = await db.journalEntry2.deleteMany({
      where: {
        id: id,
        userId: user.id, // Ensure user owns the entry
      },
    })

    if (deletedEntry.count === 0) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Journal entry not found or access denied",
        },
        { status: 404 }
      )
    }

    console.log(`✅ Deleted entry with ID: ${id}`)

    return NextResponse.json(
      { success: true, message: "Journal entry deleted successfully" },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error("❌ [JOURNAL_DELETE] Error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred"
    const errorDetails =
      process.env.NODE_ENV === "development" ? errorMessage : undefined

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to delete journal entry",
        details: errorDetails,
      },
      { status: 500 }
    )
  }
}
