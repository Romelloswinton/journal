// app/onboarding/_components/GeminiInsightsPage.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, Brain, Heart, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import useOnboardingStore from "@/app/store/onboardingStore"
import geminiApiClient from "@/lib/gemini/geminiApiClient"

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

/**
 * GeminiInsightsPage component for deeper exploration of reflections
 */
const GeminiInsightsPage: React.FC = () => {
  const router = useRouter()
  const { isSignedIn } = useAuth()

  // Get user's entries and reflections from the store
  const {
    firstEntryPriority,
    firstEntryWorry,
    firstEntryPositive,
    completeOnboarding,
  } = useOnboardingStore()

  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to get user's reflections - you might want to fetch these from the backend
  const getUserReflections = async () => {
    try {
      const response = await fetch("/api/reflections")
      if (!response.ok) throw new Error("Failed to fetch reflections")
      const data = await response.json()
      return data.reflections
    } catch (error) {
      console.error("Error fetching reflections:", error)
      return null
    }
  }

  useEffect(() => {
    async function generateDeeperInsights() {
      try {
        setIsLoading(true)
        setError(null)

        // Get user's reflections
        const reflections = await getUserReflections()

        if (!reflections) {
          setError("Could not load your reflections. Please try again.")
          return
        }

        // Generate deeper insights using Gemini
        const insights = await geminiApiClient.generateDeeperInsights({
          originalEntries: {
            priority: firstEntryPriority || "",
            worry: firstEntryWorry || "",
            positive: firstEntryPositive || "",
          },
          reflections: reflections,
        })

        setInsights(insights)
      } catch (error) {
        console.error("Error generating deeper insights:", error)
        setError("Unable to generate deeper insights. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    generateDeeperInsights()
  }, [firstEntryPriority, firstEntryWorry, firstEntryPositive])

  const handleContinueToCompletion = async () => {
    try {
      // Mark onboarding as complete
      await completeOnboarding()

      // Navigate to completion screen
      router.push("/onboarding/completion")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      setError("Failed to complete onboarding. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md rounded-xl shadow-md bg-white overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Brain className="h-12 w-12 text-purple-500 animate-pulse" />
              <h2 className="text-xl font-semibold text-gray-800">
                Generating deeper insights...
              </h2>
              <p className="text-gray-600">
                Gemini is weaving together your thoughts and reflections.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md rounded-xl shadow-md bg-white overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-red-600">{error}</p>
              <Button
                onClick={handleContinueToCompletion}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue to Completion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-xl shadow-md bg-white overflow-hidden mb-6">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-8 w-8 text-purple-500" />
                <h1 className="text-2xl font-bold text-gray-800">
                  Deeper Insights from Gemini
                </h1>
              </div>

              {insights && (
                <div className="space-y-8">
                  {/* Overall Pattern */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      Overall Pattern
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {insights.overallPattern}
                    </p>
                  </section>

                  {/* Key Insights */}
                  {insights.keyInsights.map((insight, index) => (
                    <motion.section
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {insight.title}
                      </h3>
                      <p className="text-gray-700 mb-4">{insight.insight}</p>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Practical Steps:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {insight.practicalSteps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-gray-700">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          Connections:
                        </h4>
                        <p className="text-gray-700">
                          {insight.connectionToOtherAreas}
                        </p>
                      </div>
                    </motion.section>
                  ))}

                  {/* Personalized Growth Path */}
                  <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Your Personalized Growth Path
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {insights.personalizedGrowthPath}
                    </p>
                  </section>
                </div>
              )}

              <div className="mt-8">
                <Button
                  onClick={handleContinueToCompletion}
                  className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  Continue to Completion
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default GeminiInsightsPage
