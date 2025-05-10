"use client"

import { useState, KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lightbulb,
  Plus,
  X,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface InsightsInputProps {
  insights: string[]
  onChange: (insights: string[]) => void
}

export function InsightsInput({ insights, onChange }: InsightsInputProps) {
  const [newInsight, setNewInsight] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

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

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddInsight()
    }
  }

  return (
    <Card className="shadow-sm border-amber-100 dark:border-amber-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center justify-between text-amber-800 dark:text-amber-400">
          <div className="flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400" />
            Key Insights
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 rounded-full"
          >
            {isExpanded ? (
              <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Insights display */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            <AnimatePresence>
              {insights.map((insight, index) => (
                <motion.div
                  key={`${insight}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                  >
                    {insight}
                    <button
                      type="button"
                      onClick={() => handleRemoveInsight(index)}
                      className="ml-2 text-amber-700 dark:text-amber-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input area - expanded or collapsed */}
          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Textarea
                  value={newInsight}
                  onChange={(e) => setNewInsight(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a key insight or takeaway from your journal entry..."
                  className="min-h-[100px] text-sm resize-none"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddInsight}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Insight
                </Button>
                <div className="text-xs text-muted-foreground italic">
                  <p>
                    Key insights are the most important lessons or realizations
                    from your journal entry.
                  </p>
                  <p>
                    Examples: "I need more boundaries at work" or "My anxiety
                    decreases when I meditate regularly"
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <Input
                  value={newInsight}
                  onChange={(e) => setNewInsight(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a key insight..."
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helpful tips for insights */}
          {insights.length === 0 && (
            <div className="text-xs text-muted-foreground italic pb-2">
              What are the most important lessons or takeaways from this journal
              entry?
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
