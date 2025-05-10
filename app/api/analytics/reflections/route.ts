// app/api/analytics/reflections/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get total reflection count
    const totalReflections = await db.reflection.count({
      where: {
        userId,
      },
    })

    // Get reflection count grouped by month
    const reflectionsByMonth = await db.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") AS month,
        COUNT(*) AS count
      FROM "Reflection"
      WHERE "userId" = ${userId}
      GROUP BY month
      ORDER BY month ASC
    `

    // Get reflection count grouped by journal entry (top 5)
    const reflectionsByJournalEntry = await db.journalEntry.findMany({
      where: {
        userId,
        reflections: {
          some: {},
        },
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            reflections: true,
          },
        },
      },
      orderBy: {
        reflections: {
          _count: "desc",
        },
      },
      take: 5,
    })

    return NextResponse.json({
      totalReflections,
      reflectionsByMonth,
      reflectionsByJournalEntry,
    })
  } catch (error) {
    console.error("[REFLECTIONS_ANALYTICS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
