// app/rosebud/page.tsx
"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import useRosebudStore from "@/app/store/rosebudStore"
import useJournalStore from "@/app/store/journalStore"
import RosebudSidebar from "./_components/RosebudSidebar"
import RosebudChat from "./_components/RosebudChat"

export default function RosebudPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const { conversations, fetchConversations, clearCurrentConversation } =
    useRosebudStore()

  const { entries, fetchEntries } = useJournalStore()

  // Fetch data on mount
  useEffect(() => {
    fetchConversations()
    fetchEntries()
  }, [fetchConversations, fetchEntries])

  // Handle selecting a conversation
  const handleSelectConversation = (id: string, query: string) => {
    setSelectedConversation(id)
    // On mobile, automatically close the sidebar when a conversation is selected
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">
            Rosebud AI Assistant
          </h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar */}
        <RosebudSidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />

        {/* Main chat area with padding that adjusts based on sidebar state */}
        <main
          className={`flex-grow overflow-auto transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-80" : "ml-0"
          }`}
        >
          <div className="max-w-4xl mx-auto p-4 h-full flex flex-col">
            <RosebudChat
              selectedConversationId={selectedConversation}
              onConversationComplete={() => setSelectedConversation(null)}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
