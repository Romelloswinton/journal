// app/api/user/onboarding/status/route.ts

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
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
      include: {
        profile: true,
      },
    })

    // If the user doesn't exist or doesn't have a profile
    if (!user || !user.profile) {
      return NextResponse.json({
        onboardingCompleted: false,
      })
    }

    return NextResponse.json({
      onboardingCompleted: user.profile.onboardingCompleted,
    })
  } catch (error) {
    console.error("Error fetching onboarding status:", error)
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    )
  }
}
