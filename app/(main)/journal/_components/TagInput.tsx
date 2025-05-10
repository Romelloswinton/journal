"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tag, X, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddTag = () => {
    if (!inputValue.trim()) return

    // Check if tag already exists
    if (tags.includes(inputValue.trim())) {
      setInputValue("")
      return
    }

    // Add new tag and reset input
    const newTags = [...tags, inputValue.trim()]
    onChange(newTags)
    setInputValue("")

    // Focus input after adding
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    onChange(newTags)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter key
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }

    // Remove last tag on Backspace if input is empty
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      handleRemoveTag(tags.length - 1)
    }
  }

  return (
    <Card className="shadow-sm border-amber-100 dark:border-amber-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center text-amber-800 dark:text-amber-400">
          <Tag className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400" />
          Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tags display */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            <AnimatePresence>
              {tags.map((tag, index) => (
                <motion.div
                  key={`${tag}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-2 text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Tag input */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              className="text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggested tags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground mr-1 mt-1">
              Suggested:
            </span>
            {[
              "gratitude",
              "mindfulness",
              "goals",
              "growth",
              "challenges",
              "relationships",
            ].map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="text-xs cursor-pointer bg-transparent hover:bg-accent"
                onClick={() => {
                  if (!tags.includes(suggestion)) {
                    onChange([...tags, suggestion])
                  }
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
