// app/onboarding/_components/GeminiReflection.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import useOnboardingStore, { OnboardingStep } from "@/app/store/onboardingStore"
import geminiApiClient from "@/lib/gemini/geminiApiClient"
import { AllReflections } from "@/lib/gemini/types"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface GeminiReflectionProps {
  setCurrentStep: (step: OnboardingStep) => void
}

export function GeminiReflection({ setCurrentStep }: GeminiReflectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  const { firstEntryPriority, firstEntryWorry, firstEntryPositive } =
    useOnboardingStore()

  // Local state
  const [geminiReflections, setGeminiReflections] =
    useState<AllReflections | null>(null)
  const [priorityReflection, setPriorityReflection] = useState("")
  const [worryReflection, setWorryReflection] = useState("")
  const [positiveReflection, setPositiveReflection] = useState("")
  const [isLoadingReflections, setIsLoadingReflections] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Gemini reflections when component mounts
  useEffect(() => {
    async function loadReflections() {
      if (!geminiReflections) {
        try {
          setIsLoadingReflections(true)
          setError(null)

          if (!firstEntryPriority && !firstEntryWorry && !firstEntryPositive) {
            setError("No entries found to generate reflections.")
            setIsLoadingReflections(false)
            return
          }

          const reflections = await geminiApiClient.generateAllReflections({
            priority: firstEntryPriority || "",
            worry: firstEntryWorry || "",
            positive: firstEntryPositive || "",
          })

          setGeminiReflections(reflections)
        } catch (error) {
          console.error("Error generating reflections:", error)
          setError("Unable to generate reflections. Please try again later.")
        } finally {
          setIsLoadingReflections(false)
        }
      }
    }

    loadReflections()
  }, [
    firstEntryPriority,
    firstEntryWorry,
    firstEntryPositive,
    geminiReflections,
  ])

  if (isLoadingReflections) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <Loader2
          className={`h-12 w-12 ${styles.progressFillClass} animate-spin`}
        />
        <h2 className={`text-xl font-semibold ${styles.headerTextClass}`}>
          Generating reflections...
        </h2>
        <p className={styles.normalTextClass}>
          Our AI is analyzing your journal entries to provide thoughtful
          insights.
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
            setCurrentStep("first-check-in" as OnboardingStep)
          }}
        >
          Go Back
        </Button>
      </div>
    )
  }

  if (!geminiReflections) return null

  const { boxBgColors } = styles

  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="text-center mb-6">
        <h2 className={`text-xl font-semibold ${styles.headerTextClass} mb-2`}>
          🚀 Gemini Reflections
        </h2>
        <p className={styles.normalTextClass}>
          Based on your entries, here are some thoughtful insights
        </p>
      </div>

      {/* Priority Reflection */}
      {firstEntryPriority && (
        <div className="space-y-4">
          <div className={`${boxBgColors.priority.box} p-4 rounded-lg`}>
            <h3 className={`font-medium ${boxBgColors.priority.header} mb-2`}>
              Your Priority
            </h3>
            <p className={styles.normalTextClass}>{firstEntryPriority}</p>
          </div>
          <div className={`${boxBgColors.priority.insight} p-4 rounded-lg`}>
            <h3
              className={`font-medium ${
                theme === "dark" ? "text-blue-300" : "text-blue-900"
              } mb-2`}
            >
              Gemini's Insight
            </h3>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-800"}>
              {geminiReflections.priority.upgrade}
            </p>
          </div>
          <div>
            <h3
              className={`font-medium ${
                theme === "dark" ? "text-blue-400" : "text-blue-700"
              } mb-2`}
            >
              Reflection Question
            </h3>
            <p className={`${styles.normalTextClass} italic mb-3`}>
              {geminiReflections.priority.spark}
            </p>
            <Textarea
              placeholder="Share your thoughts..."
              className={`min-h-[100px] resize-none p-4 ${styles.textareaClass}`}
              value={priorityReflection}
              onChange={(e) => setPriorityReflection(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Worry Reflection */}
      {firstEntryWorry && (
        <div className="space-y-4">
          <div className={`${boxBgColors.worry.box} p-4 rounded-lg`}>
            <h3 className={`font-medium ${boxBgColors.worry.header} mb-2`}>
              Your Concern
            </h3>
            <p className={styles.normalTextClass}>{firstEntryWorry}</p>
          </div>
          <div className={`${boxBgColors.worry.insight} p-4 rounded-lg`}>
            <h3
              className={`font-medium ${
                theme === "dark" ? "text-pink-300" : "text-pink-900"
              } mb-2`}
            >
              Gemini's Insight
            </h3>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-800"}>
              {geminiReflections.worry.upgrade}
            </p>
          </div>
          <div>
            <h3
              className={`font-medium ${
                theme === "dark" ? "text-pink-400" : "text-pink-700"
              } mb-2`}
            >
              Reflection Question
            </h3>
            <p className={`${styles.normalTextClass} italic mb-3`}>
              {geminiReflections.worry.spark}
            </p>
            <Textarea
              placeholder="Share your thoughts..."
              className={`min-h-[100px] resize-none p-4 ${styles.textareaClass}`}
              value={worryReflection}
              onChange={(e) => setWorryReflection(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Positive Action Reflection */}
      {firstEntryPositive && (
        <div className="space-y-4">
          <div className={`${boxBgColors.positive.box} p-4 rounded-lg`}>
            <h3 className={`font-medium ${boxBgColors.positive.header} mb-2`}>
              Your Positive Action
            </h3>
            <p className={styles.normalTextClass}>{firstEntryPositive}</p>
          </div>
          <div className={`${boxBgColors.positive.insight} p-4 rounded-lg`}>
            <h3
              className={`font-medium ${
                theme === "dark" ? "text-green-300" : "text-green-900"
              } mb-2`}
            >
              Gemini's Insight
            </h3>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-800"}>
              {geminiReflections.positive.upgrade}
            </p>
          </div>
          <div>
            <h3
              className={`font-medium ${
                theme === "dark" ? "text-green-400" : "text-green-700"
              } mb-2`}
            >
              Reflection Question
            </h3>
            <p className={`${styles.normalTextClass} italic mb-3`}>
              {geminiReflections.positive.spark}
            </p>
            <Textarea
              placeholder="Share your thoughts..."
              className={`min-h-[100px] resize-none p-4 ${styles.textareaClass}`}
              value={positiveReflection}
              onChange={(e) => setPositiveReflection(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Two action buttons - Fixed sizing and layout */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button
          className={`flex-1 py-4 text-sm ${
            theme === "dark"
              ? "bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700"
              : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          } text-white`}
          onClick={() => setCurrentStep("gemini-insights" as OnboardingStep)}
        >
          🌟 Explore Deeper
        </Button>

        <Button
          className={`flex-1 py-4 text-sm ${
            theme === "dark"
              ? "bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-800 hover:to-green-700"
              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          } text-white`}
          onClick={() => setCurrentStep("complete" as OnboardingStep)}
        >
          ✅ Complete
        </Button>
      </div>

      <p className={`text-xs ${styles.mutedTextClass} text-center mt-4`}>
        *Gemini can help weave your responses into deeper insights if you choose
        to continue.*
      </p>
    </motion.div>
  )
}
