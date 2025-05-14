// app/journal/new/_components/RosebudInsightCard.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RosebudInsightCardProps {
  onAddToContent: (insight: string) => void
}

export default function RosebudInsightCard({
  onAddToContent,
}: RosebudInsightCardProps) {
  const [rosebudInsight, setRosebudInsight] = useState<string | null>(null)
  const [rosebudQuery, setRosebudQuery] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if there's an insight from Rosebud in session storage
    const insight = sessionStorage.getItem("rosebudInsight")
    const query = sessionStorage.getItem("rosebudQuery")

    if (insight) {
      setRosebudInsight(insight)
      setRosebudQuery(query)
    }
  }, [])

  // Handle adding the insight to journal and removing the card
  const handleAddInsight = () => {
    if (rosebudInsight) {
      onAddToContent(rosebudInsight)
      // Clear from session storage after adding
      sessionStorage.removeItem("rosebudInsight")
      sessionStorage.removeItem("rosebudQuery")
      // Hide the card
      setIsVisible(false)
    }
  }

  // Handle dismissing the card without adding
  const handleDismiss = () => {
    // Clear from session storage
    sessionStorage.removeItem("rosebudInsight")
    sessionStorage.removeItem("rosebudQuery")
    // Hide the card
    setIsVisible(false)
  }

  if (!rosebudInsight || !isVisible) {
    return null
  }

  return (
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
            onClick={handleDismiss}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="text-sm text-pink-700 dark:text-pink-300 mb-3 whitespace-pre-line max-h-48 overflow-y-auto">
          {rosebudInsight}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-xs border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30"
          onClick={handleAddInsight}
        >
          Add to journal content
        </Button>
      </CardContent>
    </Card>
  )
}
