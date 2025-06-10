// app/rosebud/_components/RosebudSidebar.tsx
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  ChevronLeft,
  Menu,
  Plus,
  MessageSquarePlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import ConversationHistory from "./ConversationHistory"
import PopularTopics from "./PopularTopics"

interface RosebudSidebarProps {
  conversations: any[]
  selectedConversation: string | null
  onSelectConversation: (id: string, query: string) => void
  onStartNewChat: () => void // ✅ REQUIRED: Function to handle starting new chat
  isOpen: boolean
  onToggle: () => void
  hasActiveConversation?: boolean // Optional: Indicates if there's an active conversation
}

export default function RosebudSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  onStartNewChat, // NEW: Prop for new chat functionality
  isOpen,
  onToggle,
  hasActiveConversation = false, // NEW: Default to false
}: RosebudSidebarProps) {
  const [activeTab, setActiveTab] = useState("history")
  const [isHoveringToggle, setIsHoveringToggle] = useState(false)

  // Keyboard shortcut for new chat (Ctrl/Cmd + N)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "n" && isOpen) {
        event.preventDefault()
        handleStartNewChat()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Handle starting a new chat with enhanced functionality and safety checks
  const handleStartNewChat = async () => {
    try {
      // 🔧 SAFETY CHECK: Ensure onStartNewChat function exists
      if (typeof onStartNewChat !== "function") {
        console.error(
          "❌ onStartNewChat is not a function. Check parent component props."
        )
        toast.error("Configuration error. Please check the component setup.")
        return
      }

      // Show loading state briefly for better UX
      toast.loading("Starting new chat session...", { id: "new-chat" })

      // Add small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Call the parent function to reset state
      onStartNewChat()

      // Clear any existing toasts and show success
      toast.success("✨ Ready for a new conversation!", {
        id: "new-chat",
        duration: 2000,
        description: "All previous context has been cleared",
      })

      // Optionally close sidebar on mobile/smaller screens
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        onToggle()
      }

      // Optional: Analytics tracking (uncomment if you have analytics)
      // trackEvent('new_chat_started', { source: 'sidebar' })

      // Auto-focus on input after state reset (with small delay)
      setTimeout(() => {
        const chatInput = document.querySelector(
          'textarea[placeholder*="Ask"], input[placeholder*="Ask"]'
        ) as HTMLElement
        if (chatInput) {
          chatInput.focus()
        }
      }, 400)
    } catch (error) {
      console.error("❌ Error starting new chat:", error)
      toast.error("Failed to start new chat. Please try again.", {
        id: "new-chat",
      })
    }
  }

  return (
    <>
      {/* Toggle button that's always visible - overlaps sidebar when open */}
      <div
        className="fixed top-20 left-0 z-30"
        onMouseEnter={() => setIsHoveringToggle(true)}
        onMouseLeave={() => setIsHoveringToggle(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-12 w-12 rounded-full transition-all duration-300 ease-in-out shadow-lg bg-card/95 backdrop-blur-md border border-border",
            "[transition-property:transform,background-color,box-shadow]",
            isOpen
              ? "translate-x-72" // Circle floating over sidebar when open
              : isHoveringToggle
              ? "translate-x-2"
              : "translate-x-0"
          )}
          style={{
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen bg-card/95 backdrop-blur-md border-r border-border transition-all duration-300 ease-in-out z-20 shadow-xl",
          isOpen ? "w-80 translate-x-0" : "w-80 -translate-x-full"
        )}
      >
        {/* Solid background overlay to ensure no transparency */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

        {/* Content with relative positioning to appear above the background */}
        <div className="relative flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-foreground">Rosebud</h2>
            </div>
          </div>

          {/* Sidebar content */}
          <div className="flex-grow overflow-auto p-4 bg-card/50">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full mb-4 bg-muted/80">
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-background"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="topics"
                  className="data-[state=active]:bg-background"
                >
                  Topics
                </TabsTrigger>
              </TabsList>

              {/* Start New Chat Button - Enhanced with better UX */}
              <div className="mb-6">
                <Button
                  onClick={handleStartNewChat}
                  className={cn(
                    "w-full justify-start gap-2 transition-all duration-200 h-11 text-sm font-medium group",
                    "hover:scale-[1.02] active:scale-[0.98]", // Subtle animation feedback
                    hasActiveConversation
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border hover:border-border/80"
                  )}
                  variant={hasActiveConversation ? "default" : "secondary"}
                  disabled={false} // Always enabled for better UX
                >
                  <MessageSquarePlus className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="flex-1 text-left">Start New Chat</span>
                  {hasActiveConversation && (
                    <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-pulse" />
                  )}
                </Button>

                {/* Helpful hint when there's an active conversation */}
                {hasActiveConversation && (
                  <p className="text-xs text-muted-foreground mt-2 px-2 leading-relaxed">
                    This will clear your current conversation and start fresh
                    <span className="block mt-1 font-mono">
                      Shortcut: Ctrl+N
                    </span>
                  </p>
                )}
              </div>

              <TabsContent value="history" className="mt-2">
                <ConversationHistory
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={onSelectConversation}
                />
              </TabsContent>

              <TabsContent value="topics" className="mt-2">
                <PopularTopics />
              </TabsContent>
            </Tabs>
          </div>

          {/* Optional: Footer with conversation count */}
          {conversations.length > 0 && (
            <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground text-center">
                {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""} saved
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
