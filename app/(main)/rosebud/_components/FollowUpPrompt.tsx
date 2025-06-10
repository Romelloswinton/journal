// app/rosebud/_components/FollowUpPrompt.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, Lightbulb, ArrowRight, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FollowUpPromptProps {
  onSuggestedQuestion: (question: string) => void
  lastResponse?: string
  lastQuestion?: string // NEW: Include the original question
  isVisible: boolean
}

// Contextual follow-up suggestions based on response content
const getContextualSuggestions = (response: string) => {
  const lowerResponse = response.toLowerCase()

  if (lowerResponse.includes("journal") || lowerResponse.includes("write")) {
    return [
      "How can I make journaling a daily habit?",
      "What should I write about when I feel stuck?",
      "Can you suggest some journal prompts for today?",
    ]
  }

  if (lowerResponse.includes("stress") || lowerResponse.includes("anxious")) {
    return [
      "What are some quick stress relief techniques?",
      "How can I manage anxiety in the moment?",
      "Can you guide me through a breathing exercise?",
    ]
  }

  if (lowerResponse.includes("goal") || lowerResponse.includes("achieve")) {
    return [
      "How do I stay motivated towards my goals?",
      "What if I'm struggling to reach my targets?",
      "Can you help me break down my goals into smaller steps?",
    ]
  }

  if (
    lowerResponse.includes("relationship") ||
    lowerResponse.includes("friend")
  ) {
    return [
      "How can I improve my communication in relationships?",
      "What should I do when I have conflict with someone?",
      "How do I set healthy boundaries?",
    ]
  }

  // Default suggestions if no specific context is detected
  return [
    "Can you help me explore this topic deeper?",
    "What else should I consider about this?",
    "How can I apply this to my daily life?",
  ]
}

// General follow-up suggestions for engagement
const generalSuggestions = [
  "Tell me more about mindfulness practices",
  "How can I improve my self-care routine?",
  "What are some ways to boost my mood?",
  "Can you help me process my emotions?",
  "What should I reflect on today?",
  "How can I be more present in my daily life?",
  "What are some healthy coping strategies?",
  "Can you guide me through a self-reflection exercise?",
]

export default function FollowUpPrompt({
  onSuggestedQuestion,
  lastResponse = "",
  lastQuestion = "", // NEW: Include the original question
  isVisible,
}: FollowUpPromptProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)

  useEffect(() => {
    if (lastResponse) {
      // Get contextual suggestions based on the AI's response
      const contextual = getContextualSuggestions(lastResponse)
      // Mix with some general suggestions
      const mixed = [...contextual, ...generalSuggestions.slice(0, 2)]
      setSuggestions(mixed.slice(0, 5)) // Show up to 5 suggestions
    } else {
      setSuggestions(generalSuggestions.slice(0, 4))
    }
  }, [lastResponse])

  // Rotate through suggestions every 4 seconds
  useEffect(() => {
    if (suggestions.length > 1) {
      const interval = setInterval(() => {
        setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [suggestions])

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestedQuestion(suggestion)
  }

  if (!isVisible || suggestions.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-4"
      >
        <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/50">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Continue exploring...</span>
            </div>

            {/* NEW: Show the original question for context - moved above suggestions */}
            {lastQuestion && (
              <div className="mb-3 p-3 bg-white/50 dark:bg-gray-900/30 rounded-lg border border-amber-100 dark:border-amber-900/50">
                <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 mb-1">
                  <MessageSquare className="h-3 w-3 mt-1 shrink-0" />
                  <span className="text-xs font-medium">Your question:</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  "{lastQuestion}"
                </p>
              </div>
            )}

            {/* Rotating suggestion */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSuggestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="min-h-[2rem] flex items-center"
              >
                <Button
                  variant="ghost"
                  onClick={() =>
                    handleSuggestionClick(suggestions[currentSuggestionIndex])
                  }
                  className="w-full justify-start text-left h-auto p-2 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                >
                  <MessageSquare className="h-3 w-3 mr-2 shrink-0" />
                  <span className="text-sm">
                    {suggestions[currentSuggestionIndex]}
                  </span>
                  <ArrowRight className="h-3 w-3 ml-auto shrink-0" />
                </Button>
              </motion.div>
            </AnimatePresence>

            {/* Quick action buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleSuggestionClick(
                    "Can you help me explore my feelings about this?"
                  )
                }
                className="text-xs border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Explore feelings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick("What should I do next?")}
                className="text-xs border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Next steps
              </Button>
            </div>

            {/* Indicator dots for multiple suggestions */}
            {suggestions.length > 1 && (
              <div className="flex justify-center gap-1 pt-1">
                {suggestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      index === currentSuggestionIndex
                        ? "bg-amber-500 dark:bg-amber-400"
                        : "bg-amber-200 dark:bg-amber-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
