"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Lightbulb, BarChart } from "lucide-react"

interface EntryAnalysisProps {
  entry: {
    id: string
    title?: string
    content: string
    createdAt: string
  }
}

export function EntryAnalysis({ entry }: EntryAnalysisProps) {
  // In a real app, you would fetch or generate the analysis from an API
  // Here we're just simulating a simple analysis

  // Get word count
  const wordCount = entry.content.split(/\s+/).filter(Boolean).length

  // Generate sentiment analysis (simplified for demo)
  const sentiments = ["positive", "negative", "neutral"]
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)]

  // Get most common words (simplified)
  const words = entry.content.toLowerCase().split(/\s+/).filter(Boolean)
  const wordFrequency: Record<string, number> = {}
  words.forEach((word) => {
    if (
      word.length > 3 &&
      ![
        "this",
        "that",
        "with",
        "from",
        "have",
        "your",
        "what",
        "when",
      ].includes(word)
    ) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
    }
  })

  const topWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <Card className="border border-blue-100 bg-blue-50/50">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center text-xs font-medium text-blue-700 uppercase tracking-wide">
            <BarChart className="h-3.5 w-3.5 mr-1.5" />
            Entry Stats
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Words:</span>
              <span className="font-medium">{wordCount}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Overall tone:</span>
              <span className="font-medium capitalize">{sentiment}</span>
            </li>
            {topWords.length > 0 && (
              <li>
                <div className="text-gray-600 mb-1">Frequent words:</div>
                <div className="flex flex-wrap gap-1">
                  {topWords.map(([word, count]) => (
                    <span
                      key={word}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {word} ({count})
                    </span>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card className="border border-indigo-100 bg-indigo-50/50">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center text-xs font-medium text-indigo-700 uppercase tracking-wide">
            <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
            AI Insights
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-3 text-sm">
            <p>
              This entry focuses on{" "}
              {sentiment === "positive"
                ? "positive experiences and optimism"
                : sentiment === "negative"
                ? "challenges and concerns"
                : "reflective observations"}
              .
            </p>
            <p>
              {wordCount < 50
                ? "This is a brief note. Consider expanding on your thoughts for deeper reflection."
                : wordCount > 300
                ? "This is a detailed entry that shows thoughtful reflection."
                : "This entry provides a good balance of detail and focus."}
            </p>
            <p>
              {topWords.length > 0
                ? `Your repeated mention of "${topWords[0][0]}" suggests this might be a key theme in your thoughts today.`
                : "Your writing uses diverse vocabulary without obvious repetition."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
