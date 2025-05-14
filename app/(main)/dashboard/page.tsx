// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { SignUpModal } from "@/components/auth/SignUpModal"
import useOnboardingStore from "@/app/store/onboardingStore"
import useDashboardStore from "@/app/store/dashboardStore"
import useJournalStore from "@/app/store/journalStore"
import {
  Calendar,
  Flame,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format, subDays, isSameDay, startOfDay, endOfDay } from "date-fns"
import { WeeklyIndicator } from "./_components/WeeklyIndicator"
import { StatsCard } from "./_components/StatsCard"
import HappinessRecipe from "./_components/HappinessRecipe"
import AskRosebud from "./_components/AskRosebud"
import DailyCheckIn from "./_components/DailyCheckIn"
import { RecentEntries } from "./_components/RecentEntries"

export default function DashboardPage() {
  const { isSignedIn, isLoaded, userId } = useAuth()
  const { isOnboardingComplete } = useOnboardingStore()
  const [completedDays, setCompletedDays] = useState<Date[]>([])

  // Get state and actions from dashboard store
  const {
    userStats,
    isLoading,
    isLoadingStats,
    error,
    showAuthModal,
    setShowAuthModal,
    fetchDashboardData,
    fetchUserStats,
  } = useDashboardStore()

  // Use the new journal store for entries
  const { entries: journalEntries, fetchEntries } = useJournalStore()

  // Initialize data when component mounts
  useEffect(() => {
    if (isLoaded) {
      // Fetch dashboard data
      fetchDashboardData(isSignedIn)

      // Fetch journal entries if signed in
      if (isSignedIn) {
        fetchEntries()
        fetchUserStats()
      }
    }
  }, [isLoaded, isSignedIn, fetchDashboardData, fetchUserStats, fetchEntries])

  // Determine which days of the week have journal entries
  useEffect(() => {
    if (journalEntries.length > 0) {
      const today = new Date()
      const uniqueDays: Date[] = []

      // Look back at the last 7 days
      for (let i = 0; i < 7; i++) {
        const checkDate = subDays(today, i)
        const startDay = startOfDay(checkDate)
        const endDay = endOfDay(checkDate)

        // Check if any journal entry falls on this day
        const hasEntryOnDay = journalEntries.some((entry) => {
          const entryDate = new Date(entry.createdAt)
          return entryDate >= startDay && entryDate <= endDay
        })

        if (hasEntryOnDay) {
          uniqueDays.push(startDay)
        }
      }

      setCompletedDays(uniqueDays)
    }
  }, [journalEntries])

  // Show auth modal if user is not signed in but has completed onboarding
  useEffect(() => {
    if (isLoaded && !isSignedIn && isOnboardingComplete) {
      setShowAuthModal(true)
    } else if (isSignedIn) {
      setShowAuthModal(false)
    }
  }, [isLoaded, isSignedIn, isOnboardingComplete, setShowAuthModal])

  // Don't render anything until auth is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Get current date info
  const currentDate = new Date()

  // Check if there's an entry from today
  const hasTodayEntry = completedDays.some((date) =>
    isSameDay(date, currentDate)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={showAuthModal}
        onComplete={() => {
          setShowAuthModal(false)
        }}
      />

      {/* Main Dashboard Content - blurred when modal is open */}
      <div
        className={`transition-all duration-300 ${
          showAuthModal ? "blur-md pointer-events-none" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            {/* Date and Day Indicators */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {format(currentDate, "EEEE, MMMM do")}
              </h2>
              <div className="flex items-center">
                {/* Using the new WeeklyIndicator component */}
                <WeeklyIndicator
                  currentDate={currentDate}
                  completedDays={completedDays}
                />
                <div className="w-8 h-8 rounded-full border border-muted flex items-center justify-center ml-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Stats Boxes */}
            <div className="flex gap-4">
              {isLoadingStats ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : error ? (
                <div className="text-sm text-destructive">{error}</div>
              ) : (
                <>
                  <StatsCard
                    icon={Flame}
                    value={`${userStats.currentStreak} ${
                      userStats.currentStreak === 1 ? "day" : "days"
                    }`}
                    label="Streak"
                    iconColor="text-orange-500"
                  />
                  <StatsCard
                    icon={BookOpen}
                    value={userStats.totalEntries || 0}
                    label="Entries"
                    iconColor="text-blue-500"
                  />
                  <StatsCard
                    icon={FileText}
                    value={userStats.wordCount || 0}
                    label="Words"
                    iconColor="text-green-500"
                  />
                </>
              )}
            </div>
          </div>

          {/* Daily Journaling Banner */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-medium text-muted-foreground tracking-wider">
              DAILY JOURNALING
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Compact Journaling Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* First card: Ultra-compact Daily Check-in */}
            <DailyCheckIn />

            {/* Second card: Recent Entries or Discover Journals */}
            {journalEntries.length > 0 ? (
              <RecentEntries entries={journalEntries} />
            ) : (
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-lg font-semibold text-card-foreground">
                        Discover Journals
                      </h4>
                      <Sparkles className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Find guided prompts to inspire your journaling practice
                    </p>
                  </div>

                  <Link href="/journal/new" className="block mt-2">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm"
                      size="sm"
                    >
                      Explore Prompts
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Happiness Recipe and Ask Rosebud Section */}
          <h3 className="text-xs font-medium text-muted-foreground tracking-wider mb-4 mt-8">
            TOOLS & RESOURCES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <HappinessRecipe />
            <AskRosebud />
          </div>
        </div>
      </div>
    </div>
  )
}
