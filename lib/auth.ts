// app/lib/auth.ts

import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "./db"

export const getCurrentUser = async () => {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  })

  return user
}

// Creates a user in your database if they don't exist already
export const createOrGetUser = async () => {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // Check if user exists in the database
  let user = await db.user.findUnique({
    where: {
      id: userId,
    },
  })

  // If user doesn't exist, create a new one
  if (!user) {
    // Use the currentUser helper from Clerk
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null
    }

    user = await db.user.create({
      data: {
        id: userId,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress,
        image: clerkUser.imageUrl,
      },
    })
  }

  return user
}
