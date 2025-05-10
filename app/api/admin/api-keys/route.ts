// app/api/admin/api-keys/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  errorResponse,
  parseRequestBody,
  successResponse,
  validateAuth,
} from "@/lib/api-utils"
import crypto from "crypto"

// Function to encrypt sensitive data
function encrypt(text: string): string {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set in environment variables")
  }

  // Create a 16-byte initialization vector
  const iv = crypto.randomBytes(16)

  // Create a cipher using the encryption key
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  )

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  // Return the IV and encrypted data as a single string
  return `${iv.toString("hex")}:${encrypted}`
}

// Function to decrypt sensitive data
function decrypt(encryptedText: string): string {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set in environment variables")
  }

  // Split the encrypted text into IV and data
  const [ivHex, encryptedData] = encryptedText.split(":")

  // Convert the IV from hex to a buffer
  const iv = Buffer.from(ivHex, "hex")

  // Create a decipher using the encryption key
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  )

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

/**
 * Check if the user has admin permissions
 */
async function isAdmin(userId: string): Promise<boolean> {
  // In a real application, you would have a proper role-based access control system
  // For now, we'll use a simple check using the first user in the database
  const firstUser = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
  })

  return firstUser?.id === userId
}

/**
 * GET /api/admin/api-keys
 * Get all API keys (admin only)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication
    const authResult = await validateAuth(req)
    if (authResult instanceof NextResponse) return authResult
    const userId = authResult

    // Check admin permissions
    if (!(await isAdmin(userId))) {
      return errorResponse("Unauthorized", 403)
    }

    // Get all API keys without showing the full key value
    const apiKeys = await prisma.aPIKey.findMany({
      select: {
        id: true,
        service: true,
        keyName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return successResponse(apiKeys)
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return errorResponse("Failed to fetch API keys", 500)
  }
}

/**
 * POST /api/admin/api-keys
 * Creates or updates an API key (admin only)
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication
    const authResult = await validateAuth(req)
    if (authResult instanceof NextResponse) return authResult
    const userId = authResult

    // Check admin permissions
    if (!(await isAdmin(userId))) {
      return errorResponse("Unauthorized", 403)
    }

    // Parse request body
    const body = await parseRequestBody<{
      service: string
      keyName: string
      keyValue: string
      isActive?: boolean
    }>(req)

    if (!body || !body.service || !body.keyName || !body.keyValue) {
      return errorResponse("Service, key name, and key value are required", 400)
    }

    // Encrypt the key value
    const encryptedKeyValue = encrypt(body.keyValue)

    // Upsert the API key (create or update)
    const apiKey = await prisma.aPIKey.upsert({
      where: {
        service_keyName: {
          service: body.service,
          keyName: body.keyName,
        },
      },
      update: {
        keyValue: encryptedKeyValue,
        isActive: body.isActive ?? true,
      },
      create: {
        service: body.service,
        keyName: body.keyName,
        keyValue: encryptedKeyValue,
        isActive: body.isActive ?? true,
      },
    })

    // Return the API key without the value
    return successResponse(
      {
        id: apiKey.id,
        service: apiKey.service,
        keyName: apiKey.keyName,
        isActive: apiKey.isActive,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
      },
      "API key saved successfully"
    )
  } catch (error) {
    console.error("Error saving API key:", error)
    return errorResponse("Failed to save API key", 500)
  }
}

/**
 * GET /api/admin/api-keys/active
 * Get the active API key for a service (accessible to the application)
 */
export async function getActiveApiKey(service: string): Promise<string | null> {
  try {
    // Find the active API key for the given service
    const apiKey = await prisma.aPIKey.findFirst({
      where: {
        service,
        isActive: true,
      },
    })

    if (!apiKey) {
      return null
    }

    // Decrypt the key value
    return decrypt(apiKey.keyValue)
  } catch (error) {
    console.error(`Error getting active API key for ${service}:`, error)
    return null
  }
}
