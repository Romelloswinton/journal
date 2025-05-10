// lib/api-utils.ts
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Validates authentication with Clerk
 */
export async function validateAuth(
  req: NextRequest
): Promise<string | NextResponse> {
  const { userId } = await auth()

  if (!userId) {
    return errorResponse("Unauthorized", 401)
  }

  return userId
}

/**
 * Creates a standardized success response
 */
export function successResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  )
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
    },
    { status }
  )
}

/**
 * Safely parses request body
 */
export async function parseRequestBody<T>(req: NextRequest): Promise<T | null> {
  try {
    return await req.json()
  } catch (error) {
    return null
  }
}
