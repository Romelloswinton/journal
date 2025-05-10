// app/api/cron/streak-maintenance/route.ts
import { NextRequest, NextResponse } from "next/server"
import { processStreaks } from "@/lib/jobs/streakMaintenance"

// This route can be called by a cron job service like Vercel Cron
// Set it to run daily at midnight to process all user streaks
export async function GET(request: NextRequest) {
  try {
    // Verify the request is authenticated if needed
    // For example, you could check for a secret token
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.CRON_SECRET

    // Skip token check in development
    if (process.env.NODE_ENV === "production") {
      if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Process streaks
    await processStreaks()

    return NextResponse.json({
      success: true,
      message: "Streak maintenance completed successfully",
    })
  } catch (error) {
    console.error("Error in streak maintenance cron job:", error)
    return NextResponse.json(
      { error: "Failed to process streaks" },
      { status: 500 }
    )
  }
}
