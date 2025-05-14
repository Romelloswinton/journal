// app/rosebud/_components/RosebudSidebar.tsx
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, ChevronLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ConversationHistory from "./ConversationHistory"
import PopularTopics from "./PopularTopics"

interface RosebudSidebarProps {
  conversations: any[]
  selectedConversation: string | null
  onSelectConversation: (id: string, query: string) => void
  isOpen: boolean
  onToggle: () => void
}

export default function RosebudSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  isOpen,
  onToggle,
}: RosebudSidebarProps) {
  const [activeTab, setActiveTab] = useState("history")
  const [isHoveringToggle, setIsHoveringToggle] = useState(false)

  return (
    <>
      {/* Toggle button that's always visible when sidebar is closed */}
      {!isOpen && (
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
              "h-12 w-12 rounded-r-full rounded-l-none bg-background/80 backdrop-blur-sm border border-l-0 border-border transition-all duration-300",
              isHoveringToggle && "translate-x-2"
            )}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen bg-background border-r border-border transition-all duration-300 ease-in-out z-20",
          isOpen ? "w-80 translate-x-0" : "w-80 -translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with close button */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Rosebud</h2>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar content */}
          <div className="flex-grow overflow-auto p-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
              </TabsList>

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
        </div>
      </div>
    </>
  )
}
