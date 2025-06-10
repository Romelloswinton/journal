// app/library/_components/JournalCard.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Bookmark, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Journal, useLibraryStore } from "@/app/store/libraryStore"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface JournalCardProps {
  journal: Journal
  className?: string
  showSaveButton?: boolean
}

export default function JournalCard({
  journal,
  className,
  showSaveButton = false,
}: JournalCardProps) {
  const { savedJournals, saveJournal } = useLibraryStore()

  // Check if journal is already saved
  const isSaved = savedJournals.some((saved) => saved.id === journal.id)

  // Handle saving the journal
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigating to journal page
    e.stopPropagation()

    if (isSaved) {
      toast.info("Journal is already saved to your library")
      return
    }

    saveJournal(journal)
  }

  // Determine which emoji to display based on category
  const getEmoji = () => {
    switch (journal.category) {
      case "Situational":
        return "🧭" // Compass for situational
      case "Framework":
        return "🧠" // Brain for frameworks
      case "Daily":
      default:
        return "🖋️" // Pen for daily
    }
  }

  const displayEmoji = getEmoji()

  // Determine color scheme based on category
  const getCategoryColorClasses = () => {
    switch (journal.category) {
      case "Situational":
        return {
          border: "border-blue-200 dark:border-blue-800/50",
          badge:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
          bg: "bg-blue-50/50 dark:bg-blue-900/10",
          icon: "text-blue-500 dark:text-blue-400",
        }
      case "Framework":
        return {
          border: "border-purple-200 dark:border-purple-800/50",
          badge:
            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
          bg: "bg-purple-50/50 dark:bg-purple-900/10",
          icon: "text-purple-500 dark:text-purple-400",
        }
      case "Daily":
      default:
        return {
          border: "border-amber-200 dark:border-amber-800/50",
          badge:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
          bg: "bg-amber-50/50 dark:bg-amber-900/10",
          icon: "text-amber-500 dark:text-amber-400",
        }
    }
  }

  const colorClasses = getCategoryColorClasses()

  return (
    <Link
      href={`/journal/template/${journal.id}`}
      className="cursor-pointer group"
    >
      <Card
        className={cn(
          `border ${colorClasses.border} shadow-sm hover:shadow-md transition-all group-hover:translate-y-[-2px] bg-card overflow-hidden h-full rounded-lg`,
          className
        )}
      >
        <CardContent className="p-0 flex flex-col items-center h-full">
          {/* Card image */}
          <div
            className={`w-full relative mb-3 p-5 flex items-center justify-center ${colorClasses.bg}`}
          >
            {journal.image &&
            journal.image.startsWith("http") &&
            (journal.image.includes("placeholder") ||
              journal.image.endsWith(".jpg") ||
              journal.image.endsWith(".png")) ? (
              // Use Image component for valid image URLs
              <div
                className={`w-20 h-20 relative rounded-full overflow-hidden border ${colorClasses.border}`}
              >
                <Image
                  src={journal.image}
                  alt={journal.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>
            ) : (
              // Fallback to emoji
              <div
                className={`w-20 h-20 bg-card rounded-full flex items-center justify-center border ${colorClasses.border}`}
              >
                <span className="text-2xl">{displayEmoji}</span>
              </div>
            )}

            {/* Category Badge */}
            <Badge
              className={`absolute top-3 left-3 text-xs ${colorClasses.badge}`}
              variant="outline"
            >
              {journal.category || "Daily"}
            </Badge>

            {/* Save button */}
            {showSaveButton && (
              <div className="absolute top-3 right-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 text-muted-foreground hover:${colorClasses.icon} p-0`}
                  onClick={handleSave}
                  title={
                    isSaved ? "Already saved to library" : "Save to library"
                  }
                >
                  <Bookmark
                    className={cn(
                      "h-5 w-5",
                      isSaved ? `fill-current ${colorClasses.icon}` : ""
                    )}
                  />
                </Button>
              </div>
            )}
          </div>

          {/* Card content */}
          <div className="text-center px-4 pb-5 w-full">
            <h3 className="font-semibold text-foreground mb-1 text-base line-clamp-1">
              {journal.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
              {journal.author}
            </p>

            {/* View Template Button - only shows on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm w-full ${colorClasses.icon} hover:bg-muted`}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
