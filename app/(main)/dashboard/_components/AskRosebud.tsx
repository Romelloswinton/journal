// app/dashboard/_components/AskRosebud.tsx
"use client"

import { useState } from "react"
import { Search, Loader2, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import useRosebudStore from "@/app/store/rosebudStore"

export default function AskRosebud() {
  const router = useRouter()
  const { currentQuery, currentResponse, isGenerating, setQuery, askRosebud } =
    useRosebudStore()

  // Suggested reflection prompts
  const suggestedPrompts = [
    "What are my coping mechanisms?",
    "What patterns appear in my good days?",
    "What recurring themes are in my entries?",
    "How have my priorities changed recently?",
    "What habits impact my wellbeing most?",
  ]

  // Handle prompt submission
  const handleSubmit = async (promptText: string) => {
    if (!promptText.trim()) return

    try {
      // Generate response with Rosebud
      await askRosebud(promptText)
    } catch (error) {
      console.error("Error asking Rosebud:", error)
      toast.error("Failed to get a response. Please try again.")
    }
  }

  // Handle creating a journal entry from response
  const handleCreateJournalEntry = () => {
    if (!currentResponse) return

    // Store the response in session storage to use on the journal create page
    sessionStorage.setItem("rosebudInsight", currentResponse)
    sessionStorage.setItem(
      "rosebudQuery",
      currentQuery || "Reflection with Rosebud"
    )

    // Navigate to journal creation page
    router.push("/journal/new")
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-4">
        💬 ASK ROSEBUD
      </h3>
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4 h-[400px] flex flex-col">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ask Rosebud anything about yourself..."
              className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm"
              value={currentQuery}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(currentQuery)}
              disabled={isGenerating}
            />

            {isGenerating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Flex-grow div to push content to the top and button to the bottom */}
          <div className="flex-grow overflow-y-auto pr-1">
            {!isGenerating && !currentResponse && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-medium">
                  Suggested reflections:
                </p>
                <div className="space-y-1.5">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="w-full text-left text-foreground hover:text-primary transition-colors text-xs py-1"
                      onClick={() => handleSubmit(prompt)}
                      disabled={isGenerating}
                    >
                      • {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="bg-pink-50 dark:bg-pink-950/30 p-3 rounded-md text-center">
                <p className="text-pink-800 dark:text-pink-300 mb-1 text-sm">
                  Creating your reflection...
                </p>
                <p className="text-xs text-pink-600 dark:text-pink-400">
                  Rosebud is looking through your past entries and generating a
                  thoughtful reflection based on your prompt.
                </p>
              </div>
            )}

            {currentResponse && !isGenerating && (
              <div className="bg-pink-50 dark:bg-pink-950/30 p-3 rounded-md">
                <p className="text-pink-800 dark:text-pink-300 mb-1 text-sm font-medium">
                  Rosebud's Response:
                </p>
                <p className="text-sm text-pink-700 dark:text-pink-400 mb-3 whitespace-pre-line">
                  {currentResponse}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                  onClick={handleCreateJournalEntry}
                >
                  Add to journal
                </Button>
              </div>
            )}
          </div>

          {/* Button always at the bottom */}
          {!isGenerating && !currentResponse && (
            <div className="mt-3">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white h-9 text-sm"
                onClick={() => handleSubmit(currentQuery)}
                disabled={!currentQuery.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask Rosebud
              </Button>
            </div>
          )}

          {/* Link to full Rosebud experience */}
          <div className="flex justify-end mt-2">
            <Link href="/rosebud">
              <Button
                variant="link"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View full experience →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
