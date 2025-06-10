// app/library/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, AlertCircle, RefreshCw } from "lucide-react"
import JournalCategory from "./_components/JournalCategory"
import PromptContent from "./_components/PromptContent"
import SavedContent from "./_components/SavedContent"
import { useSearchParams, useRouter } from "next/navigation"
import { useLibraryStore } from "@/app/store/libraryStore"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
    error,
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
    router.push("/library/submit-idea")
  }

  // Handle retry
  const handleRetry = () => {
    fetchJournals()
  }

  // Calculate total journals for display
  const totalJournals =
    situationalJournals.length + dailyJournals.length + frameworkJournals.length

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Error state */}
      {error && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="ml-4"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 dark:border-amber-400 mb-4"></div>
              <p className="text-muted-foreground">
                Loading journal templates...
              </p>
            </div>
          ) : (
            <>
              {/* Show message if no journals loaded and no error */}
              {totalJournals === 0 && !error ? (
                <div className="text-center py-16">
                  <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    No journals available
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    It looks like there are no journal templates available right
                    now. This might be because the database hasn't been seeded
                    yet.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleRetry} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try again
                    </Button>
                    <Button onClick={handleSubmitIdea}>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Submit an idea
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Success state with categories */}
                  <div className="space-y-8">
                    {/* Situational Journaling Section */}
                    {situationalJournals.length > 0 && (
                      <JournalCategory
                        title="SITUATIONAL"
                        journals={situationalJournals}
                      />
                    )}

                    {/* Daily Journaling Section */}
                    {dailyJournals.length > 0 && (
                      <JournalCategory title="DAILY" journals={dailyJournals} />
                    )}

                    {/* Framework Journaling Section */}
                    {frameworkJournals.length > 0 && (
                      <JournalCategory
                        title="FRAMEWORKS"
                        journals={frameworkJournals}
                      />
                    )}
                  </div>

                  {/* Submit Idea Section */}
                  <div className="mt-12 border-t border-border pt-8 flex flex-col items-center max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                      <h3 className="text-xl font-semibold text-foreground">
                        Have a journal idea?
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-6 text-center max-w-lg text-base">
                      We're constantly expanding our library. Share your ideas
                      for new journals or prompts and help our community grow.
                    </p>
                    <Button
                      onClick={handleSubmitIdea}
                      className="bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600 px-8 py-3 text-base"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Submit an idea
                    </Button>
                  </div>
                </>
              )}
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
