// app/journal/_components/TemplatePreview.tsx
"use client"

import { useState } from "react"
import { JournalTemplate } from "@/data/journalTemplatesData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenLine, Info, ArrowRight } from "lucide-react"

interface TemplatePreviewProps {
  template: JournalTemplate
  onStartJournaling: () => void
  colorScheme?: "amber" | "blue" | "purple"
}

export default function TemplatePreview({
  template,
  onStartJournaling,
  colorScheme = "amber",
}: TemplatePreviewProps) {
  const [expandedPromptIndex, setExpandedPromptIndex] = useState<number | null>(
    null
  )

  // Color classes based on scheme
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

  const togglePrompt = (index: number) => {
    if (expandedPromptIndex === index) {
      setExpandedPromptIndex(null)
    } else {
      setExpandedPromptIndex(index)
    }
  }

  return (
    <Card className={`border ${colorClasses.border}`}>
      <CardHeader className={`${colorClasses.bg}`}>
        <div className="flex justify-between items-start">
          <div>
            <Badge className={colorClasses.badge}>{template.category}</Badge>
            <CardTitle className="mt-2 text-lg">{template.title}</CardTitle>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xl">
            {template.emoji || "🖋️"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          {template.description}
        </p>

        <div className="mb-4">
          <div className="text-sm font-medium flex items-center mb-2">
            <Info className="h-4 w-4 mr-1" />
            Sample Prompts
          </div>
          <div className="space-y-2">
            {template.prompts.slice(0, 3).map((prompt, index) => (
              <div
                key={index}
                className={`text-sm p-2 rounded-md cursor-pointer transition-colors ${
                  expandedPromptIndex === index
                    ? colorClasses.bg
                    : "hover:bg-muted/50"
                }`}
                onClick={() => togglePrompt(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <span
                      className={`w-5 h-5 rounded-full ${colorClasses.badge} flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5`}
                    >
                      {index + 1}
                    </span>
                    <p
                      className={`${
                        expandedPromptIndex === index ? "" : "line-clamp-1"
                      }`}
                    >
                      {prompt}
                    </p>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 transform transition-transform ${
                      expandedPromptIndex === index ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
            ))}
            {template.prompts.length > 3 && (
              <p className="text-xs text-muted-foreground mt-1">
                +{template.prompts.length - 3} more prompts
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={onStartJournaling}
          className={`w-full ${colorClasses.button}`}
        >
          <PenLine className="mr-2 h-4 w-4" />
          Start Journaling
        </Button>
      </CardContent>
    </Card>
  )
}
