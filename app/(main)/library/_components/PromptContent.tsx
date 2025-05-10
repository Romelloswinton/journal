// app/library/_components/PromptContent.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Bookmark, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Prompt, SavedPrompt, useLibraryStore } from "@/app/store/libraryStore"
import EmptyState from "./EmptyState"
import PromptCard from "./PromptCard"

// Categories for filtering
const CATEGORIES = [
  "All",
  "Gratitude",
  "Self-Reflection",
  "Mindfulness",
  "Growth",
  "Vision",
  "Awareness",
  "Problem-solving",
  "Healing",
  "Planning",
]

export default function PromptContent() {
  const {
    prompts,
    savedPrompts,
    selectedCategory,
    setSelectedCategory,
    toggleSavePrompt,
    removeSavedPrompt,
    fetchPrompts,
    isLoading,
  } = useLibraryStore()

  const [activeTab, setActiveTab] = useState("browse")

  // Fetch prompts on component mount
  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  // Filter prompts by category
  const filteredPrompts =
    selectedCategory === "All"
      ? prompts
      : prompts.filter((prompt) => prompt.category === selectedCategory)

  // Use prompt in journal
  const usePrompt = (promptText: string) => {
    // Navigate to new journal page with prompt
    window.location.href = `/journal/new?prompt=${encodeURIComponent(
      promptText
    )}`
  }

  return (
    <div className="mt-6">
      <Tabs
        defaultValue="browse"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 bg-muted/50 dark:bg-muted/20">
          <TabsTrigger value="browse">Browse Prompts</TabsTrigger>
          <TabsTrigger value="saved">
            Saved Prompts ({savedPrompts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category
                    ? "bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700"
                    : "hover:bg-accent"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Loading state */}
          {isLoading ? (
            <PromptLoadingSkeleton />
          ) : (
            /* Prompts grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onSave={() => toggleSavePrompt(prompt.id)}
                  onUse={() => usePrompt(prompt.text)}
                />
              ))}
            </div>
          )}

          {/* Empty state when no prompts match filter */}
          {!isLoading && filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No prompts found
              </h3>
              <p className="text-muted-foreground mb-6">
                No prompts found in the "{selectedCategory}" category.
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("All")}
              >
                View all prompts
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {/* Saved prompts tab content */}
          {savedPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPrompts.map((prompt) => (
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
              actionHref="#"
              onAction={() => setActiveTab("browse")}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Saved prompt card component
interface SavedPromptCardProps {
  prompt: SavedPrompt
  onRemove: () => void
  onUse: () => void
}

export function SavedPromptCard({
  prompt,
  onRemove,
  onUse,
}: SavedPromptCardProps) {
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
            <MessageSquare className="h-4 w-4" />
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

// Loading skeleton for prompts
function PromptLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="w-24 h-6 bg-muted rounded-full"></div>
              <div className="w-8 h-8 bg-muted rounded-full"></div>
            </div>
            <div className="w-full h-20 bg-muted rounded-md mb-6"></div>
            <div className="w-full h-10 bg-muted rounded-md"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
