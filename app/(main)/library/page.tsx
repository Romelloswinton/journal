// app/library/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb } from "lucide-react"
import JournalCategory from "./_components/JournalCategory"
import PromptContent from "./_components/PromptContent"
import SavedContent from "./_components/SavedContent"
import { useSearchParams, useRouter } from "next/navigation"
import { useLibraryStore } from "@/app/store/libraryStore"

export default function LibraryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("journals")

  // Get data from the library store
  const {
    situationalJournals,
    dailyJournals,
    frameworkJournals,
    fetchJournals,
    isLoading,
  } = useLibraryStore()

  // Initialize data on component mount
  useEffect(() => {
    fetchJournals()
  }, [fetchJournals])

  // Set the active tab based on URL params
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["journals", "prompts", "saved"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Handle tab change with URL update
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/library?tab=${value}`, { scroll: false })
  }

  // Handle submit idea
  const handleSubmitIdea = () => {
    // Open modal or navigate to idea submission page
    router.push("/library/submit-idea")
  }

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Tabs Navigation - centered */}
      <Tabs
        defaultValue="journals"
        value={activeTab}
        onValueChange={handleTabChange}
        className="mb-4 max-w-5xl mx-auto"
      >
        <div className="flex justify-center">
          <TabsList className="border-border w-auto justify-center rounded-none bg-transparent h-10">
            <TabsTrigger
              value="journals"
              className="rounded-md border-transparent data-[state=active]:border-amber-500 dark:data-[state=active]:border-amber-400 data-[state=active]:bg-transparent px-6 text-base"
            >
              Journals
            </TabsTrigger>
            <TabsTrigger
              value="prompts"
              className="rounded-md border-transparent data-[state=active]:border-amber-500 dark:data-[state=active]:border-amber-400 data-[state=active]:bg-transparent px-6 text-base"
            >
              Prompts
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="rounded-md border-transparent data-[state=active]:border-amber-500 dark:data-[state=active]:border-amber-400 data-[state=active]:bg-transparent px-6 text-base"
            >
              Saved
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="journals" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500 dark:border-amber-400"></div>
            </div>
          ) : (
            <>
              {/* Situational Journaling Section */}
              <JournalCategory
                title="SITUATIONAL"
                journals={situationalJournals}
              />

              {/* Daily Journaling Section */}
              <JournalCategory title="DAILY" journals={dailyJournals} />

              {/* Framework Journaling Section */}
              <JournalCategory
                title="FRAMEWORKS"
                journals={frameworkJournals}
              />

              {/* Submit Idea Section - kept unchanged but centered */}
              <div className="mt-8 border-t border-border pt-4 flex flex-col items-center max-w-5xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Have a journal idea?
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4 text-center max-w-md text-sm">
                  We're constantly expanding our library. Share your ideas for
                  new journals or prompts.
                </p>
                <Button
                  onClick={handleSubmitIdea}
                  className="bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600 px-6"
                  size="sm"
                >
                  Submit an idea
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="prompts">
          <PromptContent />
        </TabsContent>

        <TabsContent value="saved">
          <SavedContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
