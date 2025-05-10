// app/api/webhook/clerk/route.ts
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
      // Create a user in your database when a user is created in Clerk
      await prisma.user.create({
        data: {
          id: evt.data.id,
          name: `${evt.data.first_name || ""} ${
            evt.data.last_name || ""
          }`.trim(),
          email: evt.data.email_addresses?.[0]?.email_address,
          image: evt.data.image_url,
        },
      })
      break

    case "user.updated":
      // Update user in your database when they update in Clerk
      await prisma.user.update({
        where: {
          id: evt.data.id,
        },
        data: {
          name: `${evt.data.first_name || ""} ${
            evt.data.last_name || ""
          }`.trim(),
          email: evt.data.email_addresses?.[0]?.email_address,
          image: evt.data.image_url,
        },
      })
      break

    case "user.deleted":
      // Delete user from your database when they're deleted in Clerk
      await prisma.user.delete({
        where: {
          id: evt.data.id,
        },
      })
      break
  }

  return new NextResponse("Webhook received", { status: 200 })
}
