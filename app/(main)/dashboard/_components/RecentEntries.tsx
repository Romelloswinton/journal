"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { JournalEntry } from "@/app/store/journalStore"
import { ChevronRight } from "lucide-react"

interface RecentEntriesProps {
  entries: JournalEntry[]
}

export function RecentEntries({ entries }: RecentEntriesProps) {
  // Take only the most recent entry for ultra-compact view
  const latestEntry = entries[0]

  return (
    <Card className="bg-card border-border shadow-sm h-full">
      <CardContent className="p-4 h-full">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold text-card-foreground">
            Latest Entry
          </h4>
          <span className="text-xs text-muted-foreground">
            {format(new Date(latestEntry.createdAt), "MMM d")}
          </span>
        </div>

        <Link
          href={`/journal/${latestEntry.id}`}
          className="block mb-2 hover:opacity-80 transition-opacity"
        >
          <h5 className="font-medium text-card-foreground text-sm line-clamp-1">
            {latestEntry.title}
          </h5>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {latestEntry.content.substring(0, 100)}...
          </p>
        </Link>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1">
            {latestEntry.tags &&
              latestEntry.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-full transition-colors"
                >
                  {tag}
                </span>
              ))}
          </div>
          <Link href="/journal">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
