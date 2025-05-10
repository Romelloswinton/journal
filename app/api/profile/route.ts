// app/api/user/profile/route.ts

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      goal: true,
    },
  })

  return NextResponse.json(profile || {})
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const body = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if profile already exists
    const existingProfile = await db.userProfile.findUnique({
      where: {
        userId,
      },
    })

    if (existingProfile) {
      return new NextResponse("Profile already exists", { status: 400 })
    }

    const {
      goalId,
      ageGroup,
      gender,
      occupation,
      relationshipStatus,
      faithOrientation,
      struggle,
      journalTime,
      onboardingCompleted,
    } = body

    const profile = await db.userProfile.create({
      data: {
        userId,
        goalId,
        ageGroup,
        gender,
        occupation,
        relationshipStatus,
        faithOrientation,
        struggle,
        journalTime,
        onboardingCompleted: onboardingCompleted || false,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[PROFILE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth()
    const body = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const {
      goalId,
      ageGroup,
      gender,
      occupation,
      relationshipStatus,
      faithOrientation,
      struggle,
      journalTime,
      onboardingCompleted,
    } = body

    const profile = await db.userProfile.update({
      where: {
        userId,
      },
      data: {
        goalId,
        ageGroup,
        gender,
        occupation,
        relationshipStatus,
        faithOrientation,
        struggle,
        journalTime,
        onboardingCompleted,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[PROFILE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
