"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, PenLine, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-amber-100 dark:bg-amber-900/50 rounded-full opacity-20 animate-ping" />
        <div className="relative p-4 bg-amber-50 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-800">
          <PenLine className="h-12 w-12 text-amber-500 dark:text-amber-400" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2 text-foreground">
        No journal entries yet
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Create your first journal entry to capture thoughts, feelings, and
        insights. Track patterns over time and develop deeper self-awareness.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push("/journal/new")}
          className="bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white dark:from-amber-600 dark:to-orange-500 dark:hover:from-amber-700 dark:hover:to-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Entry
        </Button>
        <Button
          onClick={() => router.push("/journal/generate")}
          variant="outline"
          className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate with AI
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50">
          <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-2">
            Capture Thoughts
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Record your thoughts, feelings, and experiences as they happen
          </p>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50">
          <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-2">
            Track Patterns
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Identify recurring themes and patterns in your mental states
          </p>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50">
          <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-2">
            Gain Insights
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Develop deeper self-awareness through regular journaling
          </p>
        </div>
      </div>
    </motion.div>
  )
}
