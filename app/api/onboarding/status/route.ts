import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find the user profile using the userId (which is the Clerk ID)
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: userId },
      select: { onboardingCompleted: true },
    })

    return NextResponse.json({
      isOnboardingComplete: userProfile?.onboardingCompleted || false,
    })
  } catch (error) {
    console.error("Error fetching onboarding status:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
