// app/api/user/profile/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const profile = await prisma.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      goal: true,
    },
  })

  return NextResponse.json(profile || {})
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

    const profile = await prisma.userProfile.update({
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
