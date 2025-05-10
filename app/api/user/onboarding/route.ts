import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.id) {
      return NextResponse.json(
        { error: "You must be logged in to save onboarding data" },
        { status: 401 }
      )
    }

    // Parse the request body
    const data = await req.json()

    // Get the user ID from the session
    const userId = session.user.id

    // Check if user profile already exists
    const existingProfile = await db.userProfile.findUnique({
      where: { userId },
    })

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await db.userProfile.update({
        where: { userId },
        data: {
          goalId: data.goal,
          ageGroup: data.ageGroup,
          gender: data.gender,
          occupation: data.occupation,
          relationshipStatus: data.relationshipStatus,
          faithOrientation: data.faithOrientation,
          struggle: data.struggle,
          journalTime: data.journalTime,
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
      })

      // If first entry data is provided, create a journal entry
      if (
        data.firstEntryPriority ||
        data.firstEntryWorry ||
        data.firstEntryPositive
      ) {
        const journalEntry = await db.journalEntry.create({
          data: {
            userId,
            title: "My First Journal Entry",
            content: JSON.stringify({
              priority: data.firstEntryPriority || "",
              worry: data.firstEntryWorry || "",
              positive: data.firstEntryPositive || "",
            }),
            isFirstEntry: true,
          },
        })
      }

      return NextResponse.json(
        {
          success: true,
          message: "Profile updated successfully",
          profile: updatedProfile,
        },
        { status: 200 }
      )
    } else {
      // Create new profile
      const newProfile = await db.userProfile.create({
        data: {
          userId,
          goalId: data.goal,
          ageGroup: data.ageGroup,
          gender: data.gender,
          occupation: data.occupation,
          relationshipStatus: data.relationshipStatus,
          faithOrientation: data.faithOrientation,
          struggle: data.struggle,
          journalTime: data.journalTime,
          onboardingCompleted: true,
        },
      })

      // If first entry data is provided, create a journal entry
      if (
        data.firstEntryPriority ||
        data.firstEntryWorry ||
        data.firstEntryPositive
      ) {
        const journalEntry = await db.journalEntry.create({
          data: {
            userId,
            title: "My First Journal Entry",
            content: JSON.stringify({
              priority: data.firstEntryPriority || "",
              worry: data.firstEntryWorry || "",
              positive: data.firstEntryPositive || "",
            }),
            isFirstEntry: true,
          },
        })
      }

      return NextResponse.json(
        {
          success: true,
          message: "Profile created successfully",
          profile: newProfile,
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error("Error saving onboarding data:", error)
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.id) {
      return NextResponse.json(
        { error: "You must be logged in to access your profile" },
        { status: 401 }
      )
    }

    // Get the user ID from the session
    const userId = session.user.id

    // Fetch user profile
    const profile = await db.userProfile.findUnique({
      where: { userId },
    })

    // Fetch first journal entry if it exists
    const firstJournalEntry = await db.journalEntry.findFirst({
      where: {
        userId,
        isFirstEntry: true,
      },
    })

    let firstEntryData = null
    if (firstJournalEntry) {
      try {
        firstEntryData = JSON.parse(firstJournalEntry.content)
      } catch (e) {
        console.error("Error parsing journal entry content:", e)
      }
    }

    return NextResponse.json({
      profile,
      firstEntry: firstEntryData,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}
