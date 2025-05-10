"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, Plus, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface JournalInsightsProps {
  insights: string[]
  isEditable?: boolean
  onChange?: (insights: string[]) => void
}

export function JournalInsights({
  insights,
  isEditable = false,
  onChange = () => {},
}: JournalInsightsProps) {
  const [newInsight, setNewInsight] = useState("")

  const handleAddInsight = () => {
    if (!newInsight.trim()) return

    const updatedInsights = [...insights, newInsight.trim()]
    onChange(updatedInsights)
    setNewInsight("")
  }

  const handleRemoveInsight = (index: number) => {
    const updatedInsights = insights.filter((_, i) => i !== index)
    onChange(updatedInsights)
  }

  return (
    <Card className="shadow-sm border-amber-100 dark:border-amber-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center text-amber-800 dark:text-amber-400">
          <Lightbulb className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {insights.map((insight, index) => (
              <motion.div
                key={`${insight}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center"
              >
                <Badge
                  variant="secondary"
                  className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                >
                  {insight}
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInsight(index)}
                      className="ml-2 text-amber-700 dark:text-amber-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic mb-4">
            No insights added yet
          </p>
        )}

        {isEditable && (
          <div className="flex gap-2">
            <Input
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddInsight()}
              placeholder="Add a new insight..."
              className="text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddInsight}
              className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
