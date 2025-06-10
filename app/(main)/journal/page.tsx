// app/journal/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  Filter,
  Sparkles,
  Loader2,
  Calendar,
  Tag,
  Lightbulb,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "sonner"

import useJournalStore from "@/app/store/journalStore"
import { JournalCard } from "./_components/JournalCard"
import { JournalFilters } from "./_components/JournalFilters"
import { EmptyState } from "./_components/EmptyState"

export default function JournalPage() {
  const router = useRouter()
  const { entries, isLoading, error, fetchEntries } = useJournalStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [moodRange, setMoodRange] = useState<[number, number]>([1, 10])
  const [energyRange, setEnergyRange] = useState<[number, number]>([1, 10])
  const [clarityRange, setClarityRange] = useState<[number, number]>([1, 10])
  const [showAiGenerated, setShowAiGenerated] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })

  const [isFilterVisible, setIsFilterVisible] = useState(false)

  // Fetch entries on mount
  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Filter and sort entries
  const filteredEntries = entries
    .filter((entry) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          entry.insights.some((insight) =>
            insight.toLowerCase().includes(query)
          )
        )
      }
      return true
    })
    .filter((entry) => {
      // Filter by selected tags
      if (selectedTags.length > 0) {
        return entry.tags.some((tag) => selectedTags.includes(tag))
      }
      return true
    })
    .filter((entry) => {
      // Filter by tab or AI generated
      if (selectedTab === "ai" || showAiGenerated) {
        return entry.isAIGenerated
      }
      return true
    })
    .filter((entry) => {
      // Filter by mood range
      const mood = entry.metrics.mood || 5
      return mood >= moodRange[0] && mood <= moodRange[1]
    })
    .filter((entry) => {
      // Filter by energy range
      const energy = entry.metrics.energy || 5
      return energy >= energyRange[0] && energy <= energyRange[1]
    })
    .filter((entry) => {
      // Filter by clarity range
      const clarity = entry.metrics.clarity || 5
      return clarity >= clarityRange[0] && clarity <= clarityRange[1]
    })
    .filter((entry) => {
      // Filter by date range
      if (dateRange.from || dateRange.to) {
        const entryDate = new Date(entry.createdAt)
        if (dateRange.from && dateRange.to) {
          return entryDate >= dateRange.from && entryDate <= dateRange.to
        } else if (dateRange.from) {
          return entryDate >= dateRange.from
        } else if (dateRange.to) {
          return entryDate <= dateRange.to
        }
      }
      return true
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  // Extract all unique tags from entries
  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)))

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSelectedTab("all")
    setMoodRange([1, 10])
    setEnergyRange([1, 10])
    setClarityRange([1, 10])
    setShowAiGenerated(false)
    setDateRange({ from: undefined, to: undefined })
  }

  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setIsFilterVisible(!isFilterVisible)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Journal</h1>
            <p className="mt-1 text-muted-foreground">
              Capture and explore your thoughts, feelings, and insights
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              onClick={() => router.push("/journal/generate")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Generate
            </Button>
            <Button
              onClick={() => router.push("/journal/new")}
              className="bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search journal entries..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Tabs
              defaultValue="all"
              className="flex-grow"
              onValueChange={setSelectedTab}
            >
              <TabsList className="grid grid-cols-2 h-10">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="ai">AI Generated</TabsTrigger>
              </TabsList>
            </Tabs>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2 text-xs font-medium text-muted-foreground">
                  Sort By
                </div>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "newest"}
                  onCheckedChange={() => setSortBy("newest")}
                >
                  Newest first
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "oldest"}
                  onCheckedChange={() => setSortBy("oldest")}
                >
                  Oldest first
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "title"}
                  onCheckedChange={() => setSortBy("title")}
                >
                  By title
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Advanced filters toggle */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={toggleAdvancedFilters}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              Filter by tag
            </h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTags.includes(tag)
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Advanced journal filters */}
        {isFilterVisible && (
          <div className="mb-6">
            <JournalFilters
              allTags={allTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              moodRange={moodRange}
              onMoodRangeChange={setMoodRange}
              energyRange={energyRange}
              onEnergyRangeChange={setEnergyRange}
              clarityRange={clarityRange}
              onClarityRangeChange={setClarityRange}
              showAiGenerated={showAiGenerated}
              onShowAiGeneratedChange={setShowAiGenerated}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-4" />
            <p className="text-muted-foreground">
              Loading your journal entries...
            </p>
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <JournalCard
                  entry={entry}
                  onClick={() => router.push(`/journal/${entry.id}`)}
                />
              </motion.div>
            ))}
          </div>
        ) : entries.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <Lightbulb className="h-8 w-8 text-amber-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-foreground">
                No matches found
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                No journal entries match your current search and filters. Try
                adjusting your criteria or create a new entry.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </motion.div>
    </div>
  )
}
