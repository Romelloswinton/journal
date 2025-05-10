import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    })

    if (!existingUser) {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          email: user.emailAddresses[0]?.emailAddress || null,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
          image: user.imageUrl || null,
        },
      })

      return NextResponse.json({
        user: newUser,
        isNewUser: true,
        onboardingCompleted: false,
      })
    }

    return NextResponse.json({
      user: existingUser,
      isNewUser: false,
      onboardingCompleted: existingUser.profile?.onboardingCompleted || false,
    })
  } catch (error) {
    console.error("Error initializing user:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
