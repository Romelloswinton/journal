"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Save,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Bot,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import useJournalStore from "@/app/store/journalStore"
import { useLibraryStore } from "@/app/store/libraryStore"
import { InsightsInput } from "./InsightsInput"
import { JournalMetricsInput } from "./JournalMetricsInput"
import { TagInput } from "./TagInput"
import { journalToTemplate } from "@/lib/_utils/templateUtils"

interface JournalFormProps {
  initialData?: {
    id?: string
    title: string
    content: string
    tags: string[]
    metrics: {
      mood: number
      energy: number
      clarity: number
    }
    insights: string[]
    isAIGenerated?: boolean
    templateId?: string
    colorScheme?: string
  }
  isEditing?: boolean
  initialContent?: string
}

export function JournalForm({
  initialData = {
    title: "",
    content: "",
    tags: [],
    metrics: {
      mood: 5,
      energy: 5,
      clarity: 5,
    },
    insights: [],
    isAIGenerated: false,
  },
  isEditing = false,
  initialContent = "",
}: JournalFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { createEntry, updateEntry } = useJournalStore()
  const {
    situationalJournals,
    dailyJournals,
    frameworkJournals,
    fetchJournals,
  } = useLibraryStore()

  // Get template ID from URL if present
  const templateId = searchParams.get("template")

  // Initialize formData with initialContent merged if provided
  const mergedInitialData = {
    ...initialData,
    content: initialContent || initialData.content,
  }

  const [formData, setFormData] = useState(mergedInitialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false)
  const [isUsingPrompt, setIsUsingPrompt] = useState(false)
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(!!templateId)
  const [usedTemplate, setUsedTemplate] = useState<any>(null)

  // For Rosebud insights
  const [rosebudInsight, setRosebudInsight] = useState<string | null>(null)
  const [rosebudQuery, setRosebudQuery] = useState<string | null>(null)
  const [isRosebudVisible, setIsRosebudVisible] = useState(true)

  // Load Rosebud insights from session storage if available
  useEffect(() => {
    const insight = sessionStorage.getItem("rosebudInsight")
    const query = sessionStorage.getItem("rosebudQuery")

    if (insight) {
      setRosebudInsight(insight)
      setRosebudQuery(query)
    }

    // Clean up session storage after reading
    return () => {
      sessionStorage.removeItem("rosebudInsight")
      sessionStorage.removeItem("rosebudQuery")
    }
  }, [])

  // Load template data if template ID is provided
  useEffect(() => {
    if (templateId && !isEditing) {
      setIsLoadingTemplate(true)

      const loadTemplate = async () => {
        await fetchJournals()

        // Find the template from all categories
        const allJournals = [
          ...situationalJournals,
          ...dailyJournals,
          ...frameworkJournals,
        ]
        const templateJournal = allJournals.find(
          (journal) => journal.id === templateId
        )

        if (templateJournal) {
          // Convert to proper template format
          const template = journalToTemplate(templateJournal)
          setUsedTemplate(template)

          // Determine color scheme based on category
          let colorScheme = "amber"
          if (template.category === "SITUATIONAL") {
            colorScheme = "blue"
          } else if (template.category === "FRAMEWORKS") {
            colorScheme = "purple"
          }

          // Pre-fill form with template data
          setFormData({
            title: template.title,
            content: template.prompts.join("\n\n"),
            tags: [template.category.toLowerCase()], // Add category as a tag
            metrics: {
              mood: 5,
              energy: 5,
              clarity: 5,
            },
            insights: [],
            isAIGenerated: false,
            templateId: template.id,
            colorScheme: colorScheme,
          })

          // Set using prompt flag to true
          setIsUsingPrompt(true)
        } else {
          toast.error("Template not found, using default journal")
          fetchNewPrompt()
        }

        setIsLoadingTemplate(false)
      }

      loadTemplate()
    } else if (!isEditing) {
      // If no template ID and not editing, fetch a prompt
      fetchNewPrompt()
    }
  }, [
    templateId,
    isEditing,
    situationalJournals,
    dailyJournals,
    frameworkJournals,
    fetchJournals,
  ])

  // Apply initialContent if provided (for RosebudInsight)
  useEffect(() => {
    if (initialContent && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        content: initialContent,
      }))
    }
  }, [initialContent, isEditing])

  // Function to fetch a new prompt from the API
  const fetchNewPrompt = async (category?: string) => {
    setIsLoadingPrompt(true)
    try {
      const url = new URL("/api/journal/prompt", window.location.origin)
      if (category && category !== "all") {
        url.searchParams.append("category", category)
      }

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error("Failed to fetch prompt")
      }

      const data = await response.json()
      setCurrentPrompt(data.prompt)
    } catch (error) {
      console.error("Error fetching prompt:", error)
      toast.error("Failed to load a new prompt. Using a default one instead.")
    } finally {
      setIsLoadingPrompt(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }))
  }

  const handleMetricsChange = (metrics: {
    mood: number
    energy: number
    clarity: number
  }) => {
    setFormData((prev) => ({ ...prev, metrics }))
  }

  const handleInsightsChange = (insights: string[]) => {
    setFormData((prev) => ({ ...prev, insights }))
  }

  const refreshPrompt = () => {
    fetchNewPrompt()
    setIsUsingPrompt(true)
  }

  const usePrompt = () => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content
        ? `${prev.content}\n\n${currentPrompt}`
        : currentPrompt,
    }))
    setIsUsingPrompt(true)
  }

  // Handle adding Rosebud insight to journal content
  const handleAddRosebudInsight = () => {
    if (rosebudInsight) {
      setFormData((prev) => ({
        ...prev,
        content: prev.content
          ? `${prev.content}\n\n${rosebudInsight}`
          : rosebudInsight,
      }))
      setIsRosebudVisible(false)
      toast.success("Rosebud insight added to your journal")
      // Clear from session storage after adding
      sessionStorage.removeItem("rosebudInsight")
      sessionStorage.removeItem("rosebudQuery")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Please enter a title for your journal entry")
      return
    }

    if (!formData.content.trim()) {
      toast.error("Please enter some content for your journal entry")
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && initialData.id) {
        await updateEntry(initialData.id, formData)
        toast.success("Journal entry updated successfully!")
      } else {
        // Ensure isAIGenerated is passed when creating a new entry
        const newEntry = await createEntry({
          ...formData,
          isAIGenerated: formData.isAIGenerated || false,
        })
        toast.success("Journal entry created successfully!")
        router.push(`/journal/${newEntry.id}`)
      }

      if (isEditing) {
        router.push(`/journal/${initialData.id}`)
      }
    } catch (error) {
      console.error("Error saving journal entry:", error)
      toast.error("Failed to save journal entry. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine color scheme for styling
  const getColorClasses = () => {
    const colorScheme = formData.colorScheme || "amber"

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
    }

    return (
      colorClasses[colorScheme as keyof typeof colorClasses] ||
      colorClasses.amber
    )
  }

  const colorClasses = getColorClasses()

  if (isLoadingTemplate) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500 dark:text-amber-400 mb-4" />
        <p className="text-muted-foreground">Loading template...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/journal"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to journal
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">
          {isEditing ? "Edit Entry" : "New Journal Entry"}
        </h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Rosebud Insight Card */}
      {rosebudInsight && isRosebudVisible && (
        <Card className="bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center text-pink-800 dark:text-pink-300">
                <MessageSquare className="h-4 w-4 mr-1.5" />
                Rosebud Insight: {rosebudQuery}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-pink-700 dark:text-pink-400"
                onClick={() => setIsRosebudVisible(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>

            <div className="text-sm text-pink-700 dark:text-pink-300 mb-3 whitespace-pre-line max-h-48 overflow-y-auto">
              {rosebudInsight}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30"
              onClick={handleAddRosebudInsight}
            >
              Add to journal content
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Template Info (if using a template) */}
      {usedTemplate && !isEditing && (
        <Card className={`p-4 mb-6 ${colorClasses.border} ${colorClasses.bg}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className={`h-4 w-4 ${colorClasses.icon}`} />
                <p className="text-sm font-medium text-foreground">
                  Using Template:
                </p>
                <Badge className={colorClasses.badge}>
                  {usedTemplate.category}
                </Badge>
              </div>
              <p className="text-sm font-medium text-foreground">
                {usedTemplate.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {usedTemplate.description}
              </p>
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                className={`${colorClasses.icon} hover:bg-muted`}
                onClick={() =>
                  router.push(`/journal/template/${usedTemplate.id}`)
                }
              >
                <FileText className="h-3 w-3 mr-1" />
                View template
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* AI Prompt (only show if not using a template) */}
      {!usedTemplate && !isEditing && (
        <Card className="p-4 mb-6 border-purple-100 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                  Gemini-Generated Prompt:
                </p>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  Gemini 1.5
                </Badge>
              </div>
              {isLoadingPrompt ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="h-3 w-3 animate-spin text-purple-500 dark:text-purple-400" />
                  <p className="text-sm text-muted-foreground">
                    Generating prompt...
                  </p>
                </div>
              ) : (
                <p className="text-sm text-foreground">{currentPrompt}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                onClick={refreshPrompt}
                disabled={isLoadingPrompt}
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${
                    isLoadingPrompt ? "animate-spin" : ""
                  }`}
                />
                New Prompt
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                onClick={usePrompt}
                disabled={isLoadingPrompt}
              >
                Use Prompt
              </Button>
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card
          className={`p-6 shadow-md ${
            usedTemplate
              ? colorClasses.border
              : "border-amber-100 dark:border-amber-800/50"
          }`}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your journal entry a title..."
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Content
              </label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder={
                  isUsingPrompt && !usedTemplate
                    ? currentPrompt
                    : "Write your journal entry here..."
                }
                className="min-h-[250px]"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TagInput tags={formData.tags} onChange={handleTagsChange} />

          <JournalMetricsInput
            metrics={formData.metrics}
            onChange={handleMetricsChange}
          />
        </div>

        <InsightsInput
          insights={formData.insights}
          onChange={handleInsightsChange}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className={
              usedTemplate
                ? colorClasses.button
                : "bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600"
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Entry" : "Save Entry"}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
