"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import useJournalStore from "@/app/store/journalStore"

export default function AskRosebud() {
  const [query, setQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { generateAIEntry } = useJournalStore()

  // Suggested reflection prompts
  const suggestedPrompts = [
    "What are my coping mechanisms?",
    "What ignites my passion and creativity?",
    "What are my potential blind spots?",
    "How have my priorities changed in the last year?",
    "What habits have been most impactful for me?",
  ]

  // Handle prompt submission
  const handleSubmit = async (promptText: string) => {
    if (!promptText.trim()) return

    setIsGenerating(true)
    try {
      // Generate the entry using journal store
      const generatedEntry = await generateAIEntry(promptText)

      // Redirect to the generated entry
      toast.success("Your AI reflection has been created!")
      router.push(`/journal/${generatedEntry.id}`)
    } catch (error) {
      console.error("Error generating reflection:", error)
      toast.error("Failed to generate reflection. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-4">
        💬 ASK ROSEBUD
      </h3>
      <Card className="bg-card border-border shadow-sm">
        {/* Added fixed height to match HappinessRecipe */}
        <CardContent className="p-4 h-[400px] flex flex-col">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ask Rosebud anything about yourself..."
              className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(query)}
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
            {!isGenerating && (
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
          </div>

          {/* Button always at the bottom */}
          {!isGenerating && (
            <div className="mt-3">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white h-9 text-sm"
                onClick={() => handleSubmit(query)}
                disabled={!query.trim()}
              >
                Generate Reflection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
