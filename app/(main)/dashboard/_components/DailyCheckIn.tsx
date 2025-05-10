"use client"

import { Check, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import useDashboardStore from "@/app/store/dashboardStore"
import useOnboardingStore from "@/app/store/onboardingStore"
import Link from "next/link"

export default function DailyCheckIn() {
  const { userStats } = useDashboardStore()
  const { selectedJournalTime } = useOnboardingStore()

  // Get shortened reflection time based on user preference
  const getReflectionTime = () => {
    switch (selectedJournalTime) {
      case "morning":
        return "Morning"
      case "afternoon":
        return "Afternoon"
      case "evening":
        return "Evening"
      case "no-preference":
      default:
        return "Daily"
    }
  }

  return (
    <Card className="bg-card border-border shadow-sm h-full">
      <CardContent className="p-4 flex items-center justify-between h-full">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-card-foreground">
              {getReflectionTime()} Reflection
            </h4>
            {userStats.hasTodayEntry ? (
              <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                <Check className="w-3 h-3" /> Completed
              </span>
            ) : (
              <span className="text-muted-foreground text-xs font-medium">
                Incomplete
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {!userStats.hasTodayEntry ? (
          <Link href="/journal/new" className="block">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white"
            >
              <PenLine className="mr-1 h-3 w-3" /> Write Entry
            </Button>
          </Link>
        ) : (
          <Link href="/journal" className="block">
            <Button variant="outline" size="sm">
              View Journal
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
