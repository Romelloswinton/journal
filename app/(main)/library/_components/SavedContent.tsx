// app/library/_components/SavedContent.tsx
"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, BookOpen, ArrowRight, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import EmptyState from "./EmptyState"
import { useLibraryStore } from "@/app/store/libraryStore"

export default function SavedContent() {
  const {
    savedJournals,
    savedPrompts,
    removeSavedJournal,
    removeSavedPrompt,
    fetchJournals,
    fetchPrompts,
  } = useLibraryStore()

  const [savedType, setSavedType] = useState("journals")

  // Fetch data on component mount
  useEffect(() => {
    fetchJournals()
    fetchPrompts()
  }, [fetchJournals, fetchPrompts])

  // Use a prompt in a new journal
  const usePrompt = (promptText: string) => {
    window.location.href = `/journal/new?prompt=${encodeURIComponent(
      promptText
    )}`
  }

  return (
    <div className="mt-6">
      <Tabs
        defaultValue="journals"
        value={savedType}
        onValueChange={setSavedType}
      >
        <TabsList className="mb-6 bg-muted/50 dark:bg-muted/20">
          <TabsTrigger value="journals">
            Saved Journals ({savedJournals.length})
          </TabsTrigger>
          <TabsTrigger value="prompts">
            Saved Prompts ({savedPrompts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journals">
          {savedJournals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedJournals.map((journal) => (
                <SavedJournalCard
                  key={journal.id}
                  journal={journal}
                  onRemove={() => removeSavedJournal(journal.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title="No saved journals yet"
              description="Save your favorite journal templates for quick access"
              actionLabel="Browse journals"
              actionHref="/library"
            />
          )}
        </TabsContent>

        <TabsContent value="prompts">
          {savedPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPrompts.map((prompt) => (
                // app/library/_components/SavedContent.tsx (continued)
                <SavedPromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onRemove={() => removeSavedPrompt(prompt.id)}
                  onUse={() => usePrompt(prompt.text)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-12 w-12" />}
              title="No saved prompts yet"
              description="Save your favorite prompts for easy access"
              actionLabel="Browse prompts"
              actionHref="/library?tab=prompts"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Saved Journal Card
interface SavedJournalCardProps {
  journal: {
    id: string
    title: string
    author: string
    image: string
    lastUsed: string
  }
  onRemove: () => void
}

function SavedJournalCard({ journal, onRemove }: SavedJournalCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="w-16 h-16 relative rounded-full overflow-hidden bg-muted">
            {journal.image && (
              <Image
                src={journal.image}
                alt={journal.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
            onClick={(e) => {
              e.preventDefault()
              onRemove()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <h3 className="font-semibold text-foreground mb-1">{journal.title}</h3>
        <p className="text-sm text-muted-foreground mb-1">{journal.author}</p>
        <p className="text-xs text-muted-foreground mb-4">
          Last used: {journal.lastUsed}
        </p>

        <div className="mt-auto">
          <Link href={`/journal/new?template=${journal.id}`}>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600">
              Start journaling
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Saved Prompt Card
interface SavedPromptCardProps {
  prompt: {
    id: string
    text: string
    category: string
    lastUsed: string
  }
  onRemove: () => void
  onUse: () => void
}

function SavedPromptCard({ prompt, onRemove, onUse }: SavedPromptCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-opacity-50">
            {prompt.category}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
            onClick={(e) => {
              e.preventDefault()
              onRemove()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-foreground flex-grow mb-2">"{prompt.text}"</p>

        <p className="text-xs text-muted-foreground mb-4">
          Last used: {prompt.lastUsed}
        </p>

        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600"
          onClick={(e) => {
            e.preventDefault()
            onUse()
          }}
        >
          Use this prompt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
