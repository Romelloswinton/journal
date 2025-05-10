import { db } from "@/lib/db" // Assuming you have a db client setup
import { currentUser } from "@clerk/nextjs/server"

export async function createOrGetUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  // Check if user exists in the database
  let user = await db.user.findUnique({
    where: {
      id: clerkUser.id,
    },
  })

  // If user doesn't exist, create a new one
  if (!user) {
    user = await db.user.create({
      data: {
        id: clerkUser.id,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        image: clerkUser.imageUrl,
      },
    })
  }

  return user
}
