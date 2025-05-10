"use client"

import { useState } from "react"
import { MessageSquare, PlusCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface PromptSuggestionProps {
  prompt: string
  category?: string
  onAttach?: (prompt: string, response?: string) => void
}

const prompts = [
  {
    text: "What is something small you're proud of from today?",
    category: "Gratitude",
  },
  {
    text: "If your inner critic had a voice, what would it be saying right now? How can you respond with compassion?",
    category: "Growth",
  },
  {
    text: "Name a moment this week when you truly felt like yourself.",
    category: "Mindfulness",
  },
  {
    text: "Describe a moment this week when you felt completely present. What made that moment special?",
    category: "Mindfulness",
  },
  {
    text: "What's one small thing you can do today to take care of yourself?",
    category: "Self-care",
  },
  {
    text: "What are three things you're grateful for right now?",
    category: "Gratitude",
  },
  {
    text: "What's one challenge you're facing, and what's one step you can take toward addressing it?",
    category: "Coping",
  },
  {
    text: "What would your future self, looking back on today, want you to remember?",
    category: "Vision",
  },
]

export function getRandomPrompt(category?: string) {
  if (category) {
    const categoryPrompts = prompts.filter((p) => p.category === category)
    if (categoryPrompts.length > 0) {
      return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)]
    }
  }
  return prompts[Math.floor(Math.random() * prompts.length)]
}

export function PromptSuggestion({
  prompt,
  category,
  onAttach,
}: PromptSuggestionProps) {
  const [response, setResponse] = useState("")
  const [isAttached, setIsAttached] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [savedResponse, setSavedResponse] = useState("")

  const handleAttach = () => {
    if (onAttach) {
      onAttach(prompt, response)
      setIsAttached(true)
      setSavedResponse(response)
    }
  }

  return (
    <Card className="bg-amber-50/70 border border-amber-200 shadow-sm mb-6">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center text-xs font-medium text-amber-700 uppercase tracking-wide">
          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
          {category ? `${category} Prompt` : "Prompt Suggestion"}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-gray-700 text-sm italic">{prompt}</p>

        {isExpanded || savedResponse ? (
          <div className="mt-3">
            <Textarea
              placeholder="Write your response here..."
              className="min-h-[80px] text-sm border-amber-200 focus-visible:ring-amber-500 bg-white/80"
              value={isAttached ? savedResponse : response}
              onChange={(e) => setResponse(e.target.value)}
              disabled={isAttached}
            />
          </div>
        ) : (
          <button
            className="mt-2 text-sm text-amber-700 flex items-center hover:text-amber-800 transition-colors"
            onClick={() => setIsExpanded(true)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add a response...
          </button>
        )}
      </CardContent>

      {(isExpanded || savedResponse) && (
        <CardFooter className="pt-0 pb-3 px-4">
          <Button
            size="sm"
            variant={isAttached ? "outline" : "default"}
            className={
              isAttached
                ? "text-green-600 border-green-200 bg-green-50"
                : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
            }
            onClick={handleAttach}
            disabled={isAttached || !response.trim()}
          >
            {isAttached ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Added to Journal
              </>
            ) : (
              "Attach to Journal Entry"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
