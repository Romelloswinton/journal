// app/rosebud/page.tsx
"use client"

import { useState, useEffect } from "react"
import useRosebudStore from "@/app/store/rosebudStore"
import useJournalStore from "@/app/store/journalStore"
import RosebudSidebar from "./_components/RosebudSidebar"
import RosebudChat from "./_components/RosebudChat"

export default function RosebudPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const {
    conversations,
    fetchConversations,
    clearCurrentConversation,
    loadConversation,
    currentQuery,
    currentResponse,
    loadedConversation,
  } = useRosebudStore()

  const { entries, fetchEntries } = useJournalStore()

  // Fetch data on mount
  useEffect(() => {
    fetchConversations()
    fetchEntries()
  }, [fetchConversations, fetchEntries])

  // Handle selecting a conversation
  const handleSelectConversation = (id: string, query: string) => {
    try {
      console.log("🔍 Selecting conversation:", id)

      // Find and load the conversation
      const conversation = conversations.find((c) => c.id === id)
      if (conversation) {
        loadConversation(conversation)
        setSelectedConversation(id)

        // On mobile, automatically close the sidebar when a conversation is selected
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          setIsSidebarOpen(false)
        }

        console.log("✅ Conversation loaded successfully")
      } else {
        console.error("❌ Conversation not found:", id)
      }
    } catch (error) {
      console.error("❌ Error selecting conversation:", error)
    }
  }

  // 🔧 NEW: Handle starting a new chat from sidebar
  const handleStartNewChat = () => {
    try {
      console.log("🚀 Starting new chat session...")

      // Clear current conversation state from store
      clearCurrentConversation()

      // Reset selected conversation in local state
      setSelectedConversation(null)

      // Optional: Close sidebar on mobile for better UX
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }

      console.log("✅ New chat started successfully")
    } catch (error) {
      console.error("❌ Error starting new chat:", error)
    }
  }

  // Handle conversation completion (refresh sidebar and reset selection)
  const handleConversationComplete = () => {
    try {
      // Refresh conversations list to show the new conversation
      fetchConversations()

      // Reset selection since we now have a new current conversation
      setSelectedConversation(null)

      console.log("✅ Conversation completed and sidebar refreshed")
    } catch (error) {
      console.error("❌ Error handling conversation completion:", error)
    }
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // 🔧 NEW: Determine if there's an active conversation for enhanced UI
  const hasActiveConversation = Boolean(
    currentResponse ||
      loadedConversation ||
      currentQuery.trim() ||
      selectedConversation
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header that adjusts with sidebar */}
      <header
        className={`border-b border-border bg-card z-10 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-80" : "ml-0"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Rosebud AI Assistant
            </h1>

            {/* Optional: Show active conversation indicator */}
            {hasActiveConversation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Active Session</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex overflow-hidden">
        {/* 🔧 FIXED: Sidebar with all required props */}
        <RosebudSidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onStartNewChat={handleStartNewChat} // ✅ NOW PROPERLY PASSED
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          hasActiveConversation={hasActiveConversation} // ✅ Enhanced UI state
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
              onConversationComplete={handleConversationComplete}
            />
          </div>
        </main>
      </div>

      {/* 🔧 NEW: Mobile overlay for better UX */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </div>
  )
}
