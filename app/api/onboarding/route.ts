// app/api/onboarding/route.ts
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find the user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      include: {
        profile: {
          select: { onboardingCompleted: true },
        },
      },
    })

    return NextResponse.json({
      isOnboardingComplete: user?.profile?.onboardingCompleted || false,
    })
  } catch (error) {
    console.error("Error fetching onboarding status:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const {
      goal,
      ageGroup,
      gender,
      occupation,
      relationshipStatus,
      faithOrientation,
      struggle,
      journalTime,
      firstEntryPriority,
      firstEntryWorry,
      firstEntryPositive,
    } = body

    // First, ensure the user exists
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      // Create the user if they don't exist
      user = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
        },
      })
    }

    // Find the goal category if one was selected
    let goalId = null
    if (goal) {
      const category = await prisma.journalCategory.findFirst({
        where: { id: goal },
      })
      if (category) {
        goalId = category.id
      }
    }

    // Create or update the user profile
    const userProfile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        goalId: goalId,
        ageGroup: ageGroup || null,
        gender: gender || null,
        occupation: occupation || null,
        relationshipStatus: relationshipStatus || null,
        faithOrientation: faithOrientation || null,
        struggle: struggle || null,
        journalTime: journalTime || null,
        onboardingCompleted: true,
      },
      create: {
        userId: user.id,
        goalId: goalId,
        ageGroup: ageGroup || null,
        gender: gender || null,
        occupation: occupation || null,
        relationshipStatus: relationshipStatus || null,
        faithOrientation: faithOrientation || null,
        struggle: struggle || null,
        journalTime: journalTime || null,
        onboardingCompleted: true,
      },
    })

    // Create the first journal entry if content was provided
    if (firstEntryPriority || firstEntryWorry || firstEntryPositive) {
      const entryContent = [
        firstEntryPriority ? `Priority: ${firstEntryPriority}` : "",
        firstEntryWorry ? `Worry: ${firstEntryWorry}` : "",
        firstEntryPositive ? `Positive action: ${firstEntryPositive}` : "",
      ]
        .filter(Boolean)
        .join("\n\n")

      if (entryContent) {
        await prisma.journalEntry.create({
          data: {
            userId: user.id,
            title: "My First Journal Entry",
            content: entryContent,
            isFirstEntry: true,
          },
        })
      }
    }

    return NextResponse.json({ success: true, userProfile })
  } catch (error) {
    console.error("Error saving onboarding data:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
