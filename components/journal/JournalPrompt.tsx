// components/journal/JournalPrompt.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Array of thoughtful journal prompts
const JOURNAL_PROMPTS = [
  "What made you smile today?",
  "What's something you're looking forward to this week?",
  "What's a challenge you're currently facing, and how might you overcome it?",
  "Describe a moment today when you felt peaceful.",
  "What's something you're grateful for right now?",
  "What's a lesson you've learned recently?",
  "How would you describe your current emotional state, and why?",
  "What's something you'd like to improve about yourself?",
  "What's a boundary you need to set or maintain?",
  "Reflect on a meaningful conversation you had recently.",
  "What's something you wish others knew about you?",
  "Describe a small win or accomplishment from today.",
  "What's something that surprised you recently?",
  "How have you practiced self-care today?",
  "What's a goal you're working toward, and what's your next step?",
  "Reflect on something you read or heard that resonated with you.",
  "What's a fear you'd like to overcome?",
  "What's a memory that brought you joy recently?",
  "How could you show more compassion to yourself?",
  "What's something you need to let go of?",
]

export function JournalPrompt() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(
    Math.floor(Math.random() * JOURNAL_PROMPTS.length)
  )
  const [isRotating, setIsRotating] = useState(false)

  const getNewPrompt = () => {
    setIsRotating(true)

    // Get a new random prompt different from current one
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length)
    } while (newIndex === currentPromptIndex)

    setTimeout(() => {
      setCurrentPromptIndex(newIndex)
      setIsRotating(false)
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-blue-50 to-pink-50 p-5 rounded-lg border border-blue-100/50"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium text-gray-700">Journal Prompt</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          onClick={getNewPrompt}
          disabled={isRotating}
        >
          <RefreshCw
            className={`h-4 w-4 mr-1 ${isRotating ? "animate-spin" : ""}`}
          />
          New Prompt
        </Button>
      </div>
      <motion.p
        key={currentPromptIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-gray-700 italic"
      >
        "{JOURNAL_PROMPTS[currentPromptIndex]}"
      </motion.p>
    </motion.div>
  )
}
