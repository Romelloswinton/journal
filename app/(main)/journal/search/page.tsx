// app/journal/search/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Loader2,
  Calendar,
  Tag as TagIcon,
  Search,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useJournalStore from "@/app/store/journalStore"

export default function SearchPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(queryParam)
  // Use journal store instead of dashboard store
  const { entries, isLoading, fetchEntries } = useJournalStore()

  // Fetch entries when component mounts
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchEntries()
    } else if (isLoaded && !isSignedIn) {
      // Redirect to landing page if not signed in
      router.push("/")
    }
  }, [isLoaded, isSignedIn, fetchEntries, router])

  // Update search query when URL param changes
  useEffect(() => {
    setSearchQuery(queryParam)
  }, [queryParam])

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/journal/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Filter entries based on search query
  const filteredEntries = queryParam
    ? entries.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(queryParam.toLowerCase()) ||
          entry.content.toLowerCase().includes(queryParam.toLowerCase())
      )
    : []

  if (!isLoaded || (isLoaded && !isSignedIn)) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 text-amber-500 dark:text-amber-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-8 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/journal">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Journal
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              Search Results
            </h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search entries..."
                className="pl-10 border-border focus-visible:ring-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {queryParam && (
            <p className="text-muted-foreground">
              {filteredEntries.length === 0
                ? `No results found for "${queryParam}"`
                : `Found ${filteredEntries.length} ${
                    filteredEntries.length === 1 ? "result" : "results"
                  } for "${queryParam}"`}
            </p>
          )}
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-amber-500 dark:text-amber-400 animate-spin" />
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Link href={`/journal/${entry.id}`} key={entry.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                          {entry.title || "Untitled Entry"}
                        </h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(entry.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {entry.content}
                      </p>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                            >
                              <TagIcon className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : queryParam ? (
          <div className="text-center py-12">
            <div className="bg-card rounded-lg p-8 shadow-sm inline-block">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No entries found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try searching with different keywords or phrases.
              </p>
              <Link href="/journal">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600">
                  Return to Journal
                </Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
