// app/api/user/preferences/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  errorResponse,
  parseRequestBody,
  successResponse,
  validateAuth,
} from "@/lib/api-utils"

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication
    const authResult = await validateAuth(req)
    if (authResult instanceof NextResponse) return authResult
    const userId = authResult

    // Get the user's preferences
    let preferences = await prisma.userPreference.findUnique({
      where: { userId },
    })

    // If preferences don't exist, create default preferences
    if (!preferences) {
      preferences = await prisma.userPreference.create({
        data: {
          userId,
          theme: "system",
          fontSize: "medium",
          aiReflectionsEnabled: true,
          aiCategoriesEnabled: true,
          trackMood: true,
          trackCategories: true,
          emailNotifications: true,
          pushNotifications: false,
        },
      })
    }

    return successResponse(preferences)
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return errorResponse("Failed to fetch user preferences", 500)
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication
    const authResult = await validateAuth(req)
    if (authResult instanceof NextResponse) return authResult
    const userId = authResult

    // Parse request body
    const body = await parseRequestBody<{
      theme?: string
      fontSize?: string
      defaultJournalId?: string
      reminderTime?: string
      reminderEnabled?: boolean
      aiReflectionsEnabled?: boolean
      aiCategoriesEnabled?: boolean
      trackMood?: boolean
      trackCategories?: boolean
      emailNotifications?: boolean
      pushNotifications?: boolean
    }>(req)

    if (!body) {
      return errorResponse("Invalid request body", 400)
    }

    // If default journal is being set, verify it exists and belongs to user
    if (body.defaultJournalId) {
      const journal = await prisma.journal.findFirst({
        where: {
          id: body.defaultJournalId,
          userId,
        },
      })

      if (!journal) {
        return errorResponse("Journal not found or not owned by user", 404)
      }
    }

    // Convert reminderTime string to DateTime if provided
    let reminderTime = undefined
    if (body.reminderTime) {
      try {
        reminderTime = new Date(body.reminderTime)
      } catch (error) {
        return errorResponse("Invalid reminder time format", 400)
      }
    }

    // Upsert preferences (create if not exists, update if exists)
    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        theme: body.theme,
        fontSize: body.fontSize,
        defaultJournalId: body.defaultJournalId,
        reminderTime,
        reminderEnabled: body.reminderEnabled,
        aiReflectionsEnabled: body.aiReflectionsEnabled,
        aiCategoriesEnabled: body.aiCategoriesEnabled,
        trackMood: body.trackMood,
        trackCategories: body.trackCategories,
        emailNotifications: body.emailNotifications,
        pushNotifications: body.pushNotifications,
      },
      create: {
        userId,
        theme: body.theme || "system",
        fontSize: body.fontSize || "medium",
        defaultJournalId: body.defaultJournalId,
        reminderTime,
        reminderEnabled: body.reminderEnabled ?? false,
        aiReflectionsEnabled: body.aiReflectionsEnabled ?? true,
        aiCategoriesEnabled: body.aiCategoriesEnabled ?? true,
        trackMood: body.trackMood ?? true,
        trackCategories: body.trackCategories ?? true,
        emailNotifications: body.emailNotifications ?? true,
        pushNotifications: body.pushNotifications ?? false,
      },
    })

    return successResponse(preferences, "Preferences updated successfully")
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return errorResponse("Failed to update user preferences", 500)
  }
}
