// app/journal/template/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Loader2,
  ArrowLeft,
  PenLine,
  Sparkles,
  Bookmark,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { JournalTemplate } from "@/data/journalTemplatesData"
import { Button } from "@/components/ui/button"
import { useLibraryStore } from "@/app/store/libraryStore"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { journalToTemplate } from "@/lib/_utils/templateUtils"

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const {
    situationalJournals,
    dailyJournals,
    frameworkJournals,
    savedJournals,
    saveJournal,
    fetchJournals,
  } = useLibraryStore()

  const [template, setTemplate] = useState<JournalTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  // Find the template in the store
  useEffect(() => {
    setIsLoading(true)

    // Fetch journals if needed
    const loadData = async () => {
      await fetchJournals()

      // Find template across all categories
      const allJournals = [
        ...situationalJournals,
        ...dailyJournals,
        ...frameworkJournals,
      ]
      const foundTemplate = allJournals.find((journal) => journal.id === id)

      if (foundTemplate) {
        setTemplate(journalToTemplate(foundTemplate))
        // Check if the template is saved
        setIsSaved(savedJournals.some((saved) => saved.id === id))
      } else {
        toast.error("Template not found")
        router.push("/journal")
      }

      setIsLoading(false)
    }

    loadData()
  }, [
    id,
    situationalJournals,
    dailyJournals,
    frameworkJournals,
    savedJournals,
    fetchJournals,
    router,
  ])

  // Direct user to new journal form with template information
  const handleStartJournaling = () => {
    if (!template) return

    // Navigate to new journal form with template ID in query params
    router.push(`/journal/new?template=${template.id}`)
  }

  // Save/unsave the template
  const handleSaveTemplate = () => {
    if (!template) return

    // Convert template back to Journal type for saving
    saveJournal({
      id: template.id,
      title: template.title,
      author: template.author,
      category: template.category,
      image: template.image,
      // Additional fields get handled by the saveJournal function
    } as any)

    setIsSaved(true)
    toast.success("Template saved to your library")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500 dark:text-amber-400 mb-4" />
        <p className="text-muted-foreground">Loading template...</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Template not found
          </h2>
          <p className="text-muted-foreground mb-6 text-center">
            Sorry, the template you're looking for doesn't exist or has been
            removed.
          </p>
          <Link href="/library">
            <Button>Return to Library</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Determine color scheme based on category
  const getCategoryColor = () => {
    switch (template.category) {
      case "SITUATIONAL":
        return "blue"
      case "FRAMEWORKS":
        return "purple"
      case "DAILY":
      default:
        return "amber"
    }
  }

  const colorScheme = getCategoryColor()
  const colorClasses = {
    amber: {
      badge:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
      button:
        "bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600",
      icon: "text-amber-500 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800/50",
      bg: "bg-amber-50/50 dark:bg-amber-900/10",
    },
    blue: {
      badge:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
      button:
        "bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white dark:from-blue-600 dark:to-indigo-500 dark:hover:from-blue-700 dark:hover:to-indigo-600",
      icon: "text-blue-500 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800/50",
      bg: "bg-blue-50/50 dark:bg-blue-900/10",
    },
    purple: {
      badge:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
      button:
        "bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white dark:from-purple-600 dark:to-pink-500 dark:hover:from-purple-700 dark:hover:to-pink-600",
      icon: "text-purple-500 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800/50",
      bg: "bg-purple-50/50 dark:bg-purple-900/10",
    },
  }[colorScheme]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/library"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to library
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveTemplate}
            disabled={isSaved}
            className={`flex items-center ${
              isSaved
                ? "text-muted-foreground cursor-not-allowed"
                : colorClasses.icon
            }`}
          >
            <Bookmark
              className={`mr-1 h-4 w-4 ${isSaved ? "fill-current" : ""}`}
            />
            {isSaved ? "Saved" : "Save template"}
          </Button>
        </div>

        {/* Template Header */}
        <div className="mb-8 flex flex-col md:flex-row gap-6 items-start">
          {/* Template Image */}
          <div
            className={`rounded-full overflow-hidden w-20 h-20 flex items-center justify-center ${colorClasses.bg} ${colorClasses.border} border`}
          >
            {template.image ? (
              <Image
                src={template.image}
                alt={template.title}
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <span className="text-3xl">{template.emoji || "🖋️"}</span>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={colorClasses.badge}>{template.category}</Badge>
            </div>

            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {template.title}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              By {template.author}
            </p>
            <p className="text-foreground">{template.description}</p>
          </div>
        </div>

        {/* Template Content */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center">
            <Sparkles className={`${colorClasses.icon} mr-2 h-5 w-5`} />
            Prompts & Questions
          </h2>

          <div
            className={`p-6 rounded-lg border ${colorClasses.border} ${colorClasses.bg} space-y-4`}
          >
            {template.prompts.map((prompt, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${colorClasses.badge} shrink-0`}
                >
                  {index + 1}
                </div>
                <p className="text-foreground">{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Start Journaling Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleStartJournaling}
            className={`${colorClasses.button} px-6`}
            size="lg"
          >
            <PenLine className="mr-2 h-4 w-4" />
            Start journaling with this template
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
