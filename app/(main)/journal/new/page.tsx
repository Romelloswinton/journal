// app/journal/new/page.tsx
"use client"

import { useState } from "react"
import RosebudInsightCard from "../../rosebud/_components/RosebudInsightCard"
import { JournalForm } from "../_components/JournalForm"
import Header from "@/components/layout/Header"

export default function NewJournalEntryPage() {
  const [journalContent, setJournalContent] = useState("")

  // Handler for adding Rosebud insights to the journal content
  const handleAddRosebudInsight = (insight: string) => {
    setJournalContent((prev) => (prev ? `${prev}\n\n${insight}` : insight))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header component */}
      <Header />

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Rosebud insight card will appear if there's an insight in session storage */}
        <RosebudInsightCard onAddToContent={handleAddRosebudInsight} />

        <JournalForm initialContent={journalContent} />
      </main>
    </div>
  )
}
