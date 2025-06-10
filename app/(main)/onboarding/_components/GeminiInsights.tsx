// app/onboarding/_components/GeminiInsights.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { Loader2, AlertCircle, Brain, Eye, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import useOnboardingStore from "@/app/store/onboardingStore"
import geminiApiClient from "@/lib/gemini/geminiApiClient"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface DeeperInsight {
  title: string
  insight: string
  practicalSteps: string[]
  connectionToOtherAreas: string
}

interface InsightsData {
  overallPattern: string
  keyInsights: DeeperInsight[]
  personalizedGrowthPath: string
}

export function GeminiInsights() {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  const { firstEntryPriority, firstEntryWorry, firstEntryPositive } =
    useOnboardingStore()

  // Local state
  const [deeperInsights, setDeeperInsights] = useState<InsightsData | null>(
    null
  )
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Gemini insights when component mounts
  useEffect(() => {
    async function loadInsights() {
      if (!deeperInsights) {
        try {
          setIsLoadingInsights(true)
          setError(null)

          // Generate deeper insights using Gemini
          const insights = await geminiApiClient.generateDeeperInsights({
            originalEntries: {
              priority: firstEntryPriority || "",
              worry: firstEntryWorry || "",
              positive: firstEntryPositive || "",
            },
            reflections: {
              priority: "",
              worry: "",
              positive: "",
            },
          })

          setDeeperInsights(insights)
        } catch (error) {
          console.error("Error generating deeper insights:", error)
          setError("Unable to generate deeper insights. Please try again.")
        } finally {
          setIsLoadingInsights(false)
        }
      }
    }

    loadInsights()
  }, [firstEntryPriority, firstEntryWorry, firstEntryPositive, deeperInsights])

  if (isLoadingInsights) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <Brain
          className={`h-12 w-12 ${
            theme === "dark" ? "text-purple-400" : "text-purple-500"
          } animate-pulse`}
        />
        <h2 className={`text-xl font-semibold ${styles.headerTextClass}`}>
          Generating deeper insights...
        </h2>
        <p className={styles.normalTextClass}>
          Gemini is weaving together your thoughts and reflections.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className={`text-xl font-semibold ${styles.headerTextClass}`}>
          Something went wrong
        </h2>
        <p className={styles.normalTextClass}>{error}</p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            setError(null)
            // Could add retry logic here
          }}
        >
          Go Back
        </Button>
      </div>
    )
  }

  if (!deeperInsights) return null

  const insightBgClass = theme === "dark" ? "bg-gray-800" : "bg-gray-50"
  const patternGradientClass =
    theme === "dark"
      ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30"
      : "bg-gradient-to-r from-purple-50 to-blue-50"

  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles
          className={`h-8 w-8 ${
            theme === "dark" ? "text-purple-400" : "text-purple-500"
          }`}
        />
        <h2 className={`text-2xl font-bold ${styles.headerTextClass}`}>
          Deeper Insights from Gemini
        </h2>
      </div>

      {/* Overall Pattern */}
      <section>
        <h3
          className={`text-xl font-semibold ${styles.headerTextClass} mb-3 flex items-center gap-2`}
        >
          <Eye
            className={`h-5 w-5 ${
              theme === "dark" ? "text-blue-400" : "text-blue-500"
            }`}
          />
          Overall Pattern
        </h3>
        <p className={`${styles.normalTextClass} leading-relaxed`}>
          {deeperInsights.overallPattern}
        </p>
      </section>

      {/* Key Insights */}
      {deeperInsights.keyInsights.map((insight, index) => (
        <motion.section
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${insightBgClass} rounded-lg p-6 ${
            theme === "dark" ? "border border-gray-700" : ""
          }`}
        >
          <h4
            className={`text-lg font-semibold ${styles.headerTextClass} mb-3`}
          >
            {insight.title}
          </h4>
          <p className={`${styles.normalTextClass} mb-4`}>{insight.insight}</p>

          <div className="mb-4">
            <h5 className={`font-medium ${styles.headerTextClass} mb-2`}>
              Practical Steps:
            </h5>
            <ul className="list-disc pl-5 space-y-1">
              {insight.practicalSteps.map((step, stepIndex) => (
                <li key={stepIndex} className={styles.normalTextClass}>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className={`font-medium ${styles.headerTextClass} mb-2`}>
              Connections:
            </h5>
            <p className={styles.normalTextClass}>
              {insight.connectionToOtherAreas}
            </p>
          </div>
        </motion.section>
      ))}

      {/* Personalized Growth Path */}
      <section
        className={`${patternGradientClass} rounded-lg p-6 ${
          theme === "dark" ? "border border-gray-700" : ""
        }`}
      >
        <h3
          className={`text-xl font-semibold ${styles.headerTextClass} mb-3 flex items-center gap-2`}
        >
          <Heart
            className={`h-5 w-5 ${
              theme === "dark" ? "text-pink-400" : "text-pink-500"
            }`}
          />
          Your Personalized Growth Path
        </h3>
        <p className={`${styles.normalTextClass} leading-relaxed`}>
          {deeperInsights.personalizedGrowthPath}
        </p>
      </section>
    </motion.div>
  )
}
