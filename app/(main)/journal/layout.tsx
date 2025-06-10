// app/journal/layout.tsx
"use client"

import { ReactNode, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { JournalSidebar } from "./_components/JournalSidebar"

interface JournalLayoutProps {
  children: ReactNode
}

export default function JournalLayout({ children }: JournalLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Set sidebar open by default on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    // Listen for window resize
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen bg-background">
        {/* Journal Sidebar */}
        <JournalSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Toggle Button - Positioned underneath navbar */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-20 z-[70] h-9 w-9 transition-all duration-300 ${
            isSidebarOpen
              ? "left-[300px] lg:left-[300px]" // Stay at sidebar edge when open
              : "left-4" // Move to main content area when closed
          }`}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            isSidebarOpen
              ? "lg:ml-10" // Push content right with more comfortable spacing
              : "ml-[-300px]" // Content takes full width when sidebar is closed
          }`}
        >
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pt-16">{children}</div>
        </div>
      </div>
    </div>
  )
}
