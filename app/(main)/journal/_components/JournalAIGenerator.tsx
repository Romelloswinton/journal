"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Sparkles,
  RefreshCw,
  Bot,
  Brain,
  ArrowUpCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import useJournalStore from "@/app/store/journalStore"
import { getPromptCategories } from "@/services/dynamicPromptsService"

export function JournalAIGenerator() {
  const router = useRouter()
  const { createEntry } = useJournalStore()
  const [journalResponse, setJournalResponse] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [activePrompt, setActivePrompt] = useState<string>("")

  // Get categories without duplicating "all"
  const promptCategories = getPromptCategories()
  // Ensure uniqueness by using a Set
  const uniqueCategories = [
    "all",
    ...promptCategories.filter((cat) => cat !== "all"),
  ]

  // Generate a random prompt when component mounts
  useEffect(() => {
    fetchNewPrompt()
  }, [])

  // Function to fetch a new prompt from the API
  const fetchNewPrompt = async (category?: string) => {
    setIsLoadingPrompt(true)
    try {
      const url = new URL("/api/journal/prompt", window.location.origin)
      if (category && category !== "all") {
        url.searchParams.append("category", category)
      }

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error("Failed to fetch prompt")
      }

      const data = await response.json()
      setCurrentPrompt(data.prompt)
      // Clear the active prompt when getting a new one
      setActivePrompt("")
    } catch (error) {
      console.error("Error fetching prompt:", error)
      toast.error("Failed to load a new prompt. Using a default one instead.")
    } finally {
      setIsLoadingPrompt(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!journalResponse.trim()) {
      toast.error("Please write your journal response before enhancing")
      return
    }

    if (!activePrompt && !currentPrompt) {
      toast.error("Please select a prompt to respond to")
      return
    }

    const promptToUse = activePrompt || currentPrompt

    setIsGenerating(true)

    try {
      // Send both the prompt and the user's response to the AI
      const response = await fetch("/api/ai/generate-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptToUse,
          userResponse: journalResponse,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to enhance journal entry")
      }

      const data = await response.json()

      // Create a new journal entry with the enhanced content
      const newEntry = await createEntry({
        title: data.title || `Response to: ${promptToUse.substring(0, 30)}...`,
        content: data.content,
        tags: data.tags,
        metrics: data.metrics,
        insights: data.insights,
        isAIGenerated: true,
      })

      toast.success("Journal entry enhanced and saved successfully!")
      router.push(`/journal/${newEntry.id}`)
    } catch (error) {
      console.error("Error enhancing journal entry:", error)
      toast.error("Failed to enhance journal entry. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate a new prompt
  const refreshPrompt = () => {
    fetchNewPrompt(activeCategory !== "all" ? activeCategory : undefined)
  }

  // Use the current prompt
  const useCurrentPrompt = () => {
    setActivePrompt(currentPrompt)
    // Focus the textarea
    const textarea = document.getElementById(
      "journalResponse"
    ) as HTMLTextAreaElement
    if (textarea) {
      textarea.focus()
    }
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    fetchNewPrompt(category !== "all" ? category : undefined)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="shadow-lg border-purple-100 dark:border-purple-800/50">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 pb-4 border-b border-purple-100 dark:border-purple-800/50">
          <CardTitle className="flex items-center text-xl text-purple-800 dark:text-purple-300">
            <Brain className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
            AI-Enhanced Journaling
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {/* AI Prompt Inspiration Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground flex items-center">
                  <Bot className="w-4 h-4 mr-1 text-purple-500 dark:text-purple-400" />
                  Choose a Prompt to Respond To
                </h3>
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 text-xs"
                >
                  Gemini 1.5 Flash
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                onClick={refreshPrompt}
                disabled={isLoadingPrompt}
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${
                    isLoadingPrompt ? "animate-spin" : ""
                  }`}
                />
                New Prompt
              </Button>
            </div>

            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={handleCategoryChange}
            >
              <TabsList className="mb-2 w-full grid grid-cols-3 lg:grid-cols-7 bg-purple-50/70 dark:bg-purple-900/20">
                {uniqueCategories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-xs capitalize data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-800/50 dark:data-[state=active]:text-purple-100"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-100 dark:border-purple-800/60">
                {isLoadingPrompt ? (
                  <div className="flex items-center justify-center gap-2 py-6">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500 dark:text-purple-400" />
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Generating with Gemini 1.5...
                    </p>
                  </div>
                ) : (
                  <p className="text-foreground text-sm font-medium">
                    {currentPrompt}
                  </p>
                )}
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={useCurrentPrompt}
                    className="text-xs border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-800 dark:hover:text-purple-200"
                    disabled={isLoadingPrompt}
                  >
                    Respond to This Prompt
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activePrompt && (
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-md mb-2">
                <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
                  <span className="text-xs font-normal text-purple-700 dark:text-purple-300">
                    You're responding to:
                  </span>{" "}
                  {activePrompt}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="journalResponse"
                className="text-sm font-medium text-foreground flex items-center gap-1"
              >
                <ArrowUpCircle className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
                Your Journal Response
              </label>
              <Textarea
                id="journalResponse"
                placeholder="Write your response to the prompt above..."
                className="min-h-[200px] text-sm border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500"
                value={journalResponse}
                onChange={(e) => setJournalResponse(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-700 dark:hover:to-indigo-700"
              disabled={
                isGenerating ||
                !journalResponse.trim() ||
                (!activePrompt && !currentPrompt)
              }
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing your journal entry...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance with AI
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-purple-50/50 dark:bg-purple-900/10 py-3 px-6 text-xs text-muted-foreground border-t border-purple-100 dark:border-purple-800/50">
          <div className="flex items-center gap-1">
            <Bot className="h-3 w-3 text-purple-400 dark:text-purple-400" />
            <span>
              Write your response to a prompt, then let AI enhance it with
              deeper insights and structure.
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
