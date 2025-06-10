// app/api/webhooks/clerk/route.ts
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { Webhook } from "svix"

// This is your Clerk Webhook secret
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable")
    return new NextResponse("Missing Webhook Secret", { status: 500 })
  }

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // Verify webhook is from Clerk
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new NextResponse("Error verifying webhook", { status: 400 })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type

  console.log(`Webhook with ID: ${id} and type: ${eventType}`)

  // Process the event based on its type
  switch (eventType) {
    case "user.created":
      try {
        // Create a user in your database when a user is created in Clerk
        await prisma.user.create({
          data: {
            clerkId: evt.data.id, // Use clerkId field to store Clerk's user ID
            name:
              `${evt.data.first_name || ""} ${
                evt.data.last_name || ""
              }`.trim() || null,
            email: evt.data.email_addresses?.[0]?.email_address || null,
            image: evt.data.image_url || null,
          },
        })
        console.log(`✅ User created: ${evt.data.id}`)
      } catch (error) {
        console.error("Error creating user:", error)
        return new NextResponse("Error creating user", { status: 500 })
      }
      break

    case "user.updated":
      try {
        // Update user in your database when they update in Clerk
        await prisma.user.update({
          where: {
            clerkId: evt.data.id, // Use clerkId field
          },
          data: {
            name:
              `${evt.data.first_name || ""} ${
                evt.data.last_name || ""
              }`.trim() || null,
            email: evt.data.email_addresses?.[0]?.email_address || null,
            image: evt.data.image_url || null,
          },
        })
        console.log(`✅ User updated: ${evt.data.id}`)
      } catch (error) {
        console.error("Error updating user:", error)
        return new NextResponse("Error updating user", { status: 500 })
      }
      break

    case "user.deleted":
      try {
        // Delete user from your database when they're deleted in Clerk
        await prisma.user.delete({
          where: {
            clerkId: evt.data.id, // Use clerkId field
          },
        })
        console.log(`✅ User deleted: ${evt.data.id}`)
      } catch (error) {
        console.error("Error deleting user:", error)
        return new NextResponse("Error deleting user", { status: 500 })
      }
      break

    default:
      console.log(`Unhandled webhook event type: ${eventType}`)
  }

  return new NextResponse("Webhook received", { status: 200 })
}
