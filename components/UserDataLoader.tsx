"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import useOnboardingStore from "@/app/store/onboardingStore"
import { Loader2 } from "lucide-react"

interface UserDataLoaderProps {
  children: React.ReactNode
}

export default function UserDataLoader({ children }: UserDataLoaderProps) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    setUserId,
    selectedGoal,
    handleSelectGoal,
    handleSelectAge,
    handleSelectGender,
    handleSelectOccupation,
    handleSelectRelationship,
    handleSelectFaith,
    handleSelectStruggle,
    handleSelectJournalTime,
    saveFirstEntry,
    completeOnboarding,
    isOnboardingComplete,
  } = useOnboardingStore()

  useEffect(() => {
    const loadUserData = async () => {
      // Only proceed if authenticated
      if (status !== "authenticated" || !session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        // Set user ID in store
        setUserId(session.user.id)

        // Fetch user profile data
        const response = await fetch("/api/user/onboarding")

        if (!response.ok) {
          throw new Error("Failed to fetch user profile data")
        }

        const data = await response.json()

        // If profile exists and onboarding is completed, load the data
        if (data.profile && data.profile.onboardingCompleted) {
          // Load profile data into store
          if (data.profile.goalId) handleSelectGoal(data.profile.goalId)
          if (data.profile.ageGroup)
            handleSelectAge(data.profile.ageGroup, null)
          if (data.profile.gender) handleSelectGender(data.profile.gender, null)
          if (data.profile.occupation)
            handleSelectOccupation(data.profile.occupation, null)
          if (data.profile.relationshipStatus)
            handleSelectRelationship(data.profile.relationshipStatus, null)
          if (data.profile.faithOrientation)
            handleSelectFaith(data.profile.faithOrientation, null)
          if (data.profile.struggle)
            handleSelectStruggle(data.profile.struggle, null)
          if (data.profile.journalTime)
            handleSelectJournalTime(data.profile.journalTime, null)

          // If first entry data exists, load that too
          if (data.firstEntry) {
            saveFirstEntry(
              data.firstEntry.priority || "",
              data.firstEntry.worry || "",
              data.firstEntry.positive || "",
              null
            )
          }

          // Mark onboarding as complete
          if (!isOnboardingComplete) {
            completeOnboarding()
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setError("Failed to load your profile data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [
    status,
    session,
    setUserId,
    handleSelectGoal,
    handleSelectAge,
    handleSelectGender,
    handleSelectOccupation,
    handleSelectRelationship,
    handleSelectFaith,
    handleSelectStruggle,
    handleSelectJournalTime,
    saveFirstEntry,
    completeOnboarding,
    isOnboardingComplete,
  ])

  // Show loading UI if data is being fetched
  if (isLoading && status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    )
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Render children once data is loaded or if not authenticated
  return <>{children}</>
}
