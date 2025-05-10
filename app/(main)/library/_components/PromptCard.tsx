// app/library/_components/PromptCard.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Plus } from "lucide-react"
import { Prompt } from "@/app/store/libraryStore"

interface PromptCardProps {
  prompt: Prompt
  onSave: () => void
  onUse: () => void
}

export default function PromptCard({ prompt, onSave, onUse }: PromptCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-opacity-50 text-xs">
            {prompt.category}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-amber-500 dark:hover:text-amber-400"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSave()
            }}
          >
            {prompt.isSaved ? (
              <Bookmark className="h-4 w-4 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-foreground flex-grow mb-3 text-sm">
          "{prompt.text}"
        </p>
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onUse()
          }}
        >
          <Plus className="h-3 w-3 mr-1" />
          Use this prompt
        </Button>
      </CardContent>
    </Card>
  )
}
