"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Sparkles } from "lucide-react"

interface EntryReflectionProps {
  entry: {
    id: string
    title?: string
    content: string
    createdAt: string
  }
}

export function EntryReflection({ entry }: EntryReflectionProps) {
  const [reflection, setReflection] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Generate a reflection prompt based on entry content
  const getReflectionPrompt = () => {
    const prompts = [
      "Looking back at this entry, what insights can you draw about yourself?",
      "If you could speak to yourself when you wrote this, what would you say?",
      "How does this entry connect to your broader life journey?",
      "What emotions come up for you when re-reading this entry?",
      "What patterns do you notice in your thoughts from this entry?",
    ]

    return prompts[Math.floor(Math.random() * prompts.length)]
  }

  // Handle saving the reflection
  const handleSaveReflection = () => {
    if (!reflection.trim()) return

    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsSaved(true)
    }, 1000)
  }

  return (
    <Card className="border border-purple-100 bg-purple-50/50">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center text-xs font-medium text-purple-700 uppercase tracking-wide">
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Entry Reflection
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <p className="text-sm text-gray-600 italic mb-3">
          {getReflectionPrompt()}
        </p>

        <Textarea
          placeholder="Write your reflection here..."
          className="min-h-[100px] text-sm border-purple-200 focus-visible:ring-purple-500 bg-white/80"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          disabled={isSaved}
        />
      </CardContent>

      {(!isSaved || reflection.trim()) && (
        <CardFooter className="pt-0 pb-4 px-4">
          <Button
            size="sm"
            className={
              isSaved
                ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            }
            onClick={handleSaveReflection}
            disabled={!reflection.trim() || isSaving || isSaved}
          >
            {isSaving ? (
              "Saving..."
            ) : isSaved ? (
              <>
                <Heart className="h-4 w-4 mr-1" />
                Saved
              </>
            ) : (
              "Save Reflection"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
