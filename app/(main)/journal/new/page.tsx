// app/journal/new/page.tsx
"use client"

import RosebudInsightCard from "../../rosebud/_components/RosebudInsightCard"
import { JournalForm } from "../_components/JournalForm"
import { useState } from "react"

export default function NewJournalEntryPage() {
  const [journalContent, setJournalContent] = useState("")

  // Handler for adding Rosebud insights to the journal content
  const handleAddRosebudInsight = (insight: string) => {
    setJournalContent((prev) => (prev ? `${prev}\n\n${insight}` : insight))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Rosebud insight card will appear if there's an insight in session storage */}
      <RosebudInsightCard onAddToContent={handleAddRosebudInsight} />

      <JournalForm initialContent={journalContent} />
    </div>
  )
}
