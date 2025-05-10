"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { JournalForm } from "../../_components/JournalForm"
import useJournalStore from "@/app/store/journalStore"

export default function EditJournalEntryPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { getEntry, fetchEntries } = useJournalStore()
  const [isLoading, setIsLoading] = useState(true)
  const [entry, setEntry] = useState<any>(null)

  useEffect(() => {
    const loadEntry = async () => {
      try {
        // Ensure entries are loaded from the API
        await fetchEntries()

        // Get the entry from the store
        const entryData = getEntry(id)

        if (!entryData) {
          // Entry not found, redirect to journal list
          router.push("/journal")
          return
        }

        setEntry(entryData)
      } catch (error) {
        console.error("Error loading journal entry:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntry()
  }, [id, getEntry, fetchEntries, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 dark:text-amber-400" />
          <p className="text-muted-foreground">Loading journal entry...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <JournalForm initialData={entry} isEditing={true} />
    </div>
  )
}
