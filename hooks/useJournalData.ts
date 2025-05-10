import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood?: string
  createdAt: string
  updatedAt: string
  isFirstEntry?: boolean
}

interface UserProfile {
  id: string
  userId: string
  goalId?: string
  goal?: {
    id: string
    label: string
    emoji: string
    description: string
    benefits: string[]
  }
  ageGroup?: string
  gender?: string
  occupation?: string
  relationshipStatus?: string
  faithOrientation?: string
  struggle?: string
  journalTime?: string
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

interface FirstEntryContent {
  priority: string
  worry: string
  positive: string
}

interface ReflectionContent {
  priorityReflection: string
  worryReflection: string
  positiveReflection: string
}

interface UseJournalDataReturn {
  isLoading: boolean
  error: string | null
  profile: UserProfile | null
  journalEntries: JournalEntry[]
  firstEntry: FirstEntryContent | null
  reflections: ReflectionContent | null
  refreshData: () => Promise<void>
}

export function useJournalData(): UseJournalDataReturn {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [firstEntry, setFirstEntry] = useState<FirstEntryContent | null>(null)
  const [reflections, setReflections] = useState<ReflectionContent | null>(null)

  // Function to fetch all user data
  const fetchData = async () => {
    if (status === "unauthenticated") {
      setIsLoading(false)
      return
    }

    if (status === "loading") {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch user profile
      const profileRes = await fetch("/api/profile")
      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile")
      }
      const profileData = await profileRes.json()
      setProfile(profileData)

      // Fetch journal entries
      const entriesRes = await fetch("/api/journal/entries")
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json()
        setJournalEntries(entriesData)
      }

      // Fetch first entry and reflections
      const reflectionsRes = await fetch("/api/reflections")
      if (reflectionsRes.ok) {
        const { firstEntry: firstEntryData, reflections: reflectionsData } =
          await reflectionsRes.json()
        setFirstEntry(firstEntryData)
        setReflections(reflectionsData)
      }
    } catch (err) {
      console.error("Error fetching journal data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on mount and when authentication status changes
  useEffect(() => {
    if (status !== "loading") {
      fetchData()
    }
  }, [status])

  // Function to manually refresh data
  const refreshData = async () => {
    await fetchData()
  }

  return {
    isLoading,
    error,
    profile,
    journalEntries,
    firstEntry,
    reflections,
    refreshData,
  }
}
