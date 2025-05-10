import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Add this at the top of your file to extend the Session type
import { Session } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

/**
 * Type for API response
 */
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Validates that a user is authenticated and returns their ID
 * @param req The Next.js request object
 * @returns User ID if authenticated, null otherwise
 */
export async function getUserId(req: NextRequest): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id || null
}

/**
 * Creates a successful API response
 * @param data The data to return
 * @param message Optional success message
 * @returns NextResponse with successful response
 */
export function successResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

/**
 * Creates an error API response
 * @param error Error message or object
 * @param status HTTP status code
 * @returns NextResponse with error response
 */
export function errorResponse(
  error: string | Error,
  status = 400
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : error

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status }
  )
}

/**
 * Validates that a user is authenticated and returns an error response if not
 * @param req The Next.js request object
 * @returns User ID if authenticated, or null if not authenticated
 */
export async function validateAuth(
  req: NextRequest
): Promise<string | NextResponse<ApiResponse>> {
  const userId = await getUserId(req)

  if (!userId) {
    return errorResponse("Unauthorized", 401)
  }

  return userId
}

/**
 * Safely parses JSON from request body
 * @param req The Next.js request object
 * @returns Parsed body or null if invalid
 */
export async function parseRequestBody<T>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T
  } catch (error) {
    return null
  }
}
