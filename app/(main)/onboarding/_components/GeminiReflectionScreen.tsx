// app/onboarding/_components/GeminiReflectionScreen.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import useOnboardingStore from "@/app/store/onboardingStore"
import { AllReflections } from "@/lib/gemini/types"
import geminiApiClient from "@/lib/gemini/geminiApiClient"
import { AlertCircle, Loader2 } from "lucide-react"

/**
 * Props for input field components
 */
interface ReflectionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/**
 * GeminiReflectionScreen component that shows AI reflections on user's check-in entries
 */
const GeminiReflectionScreen: React.FC = () => {
  const router = useRouter()
  const { isLoaded, isSignedIn, userId } = useAuth()

  // Get user's three check-in entries from the store
  const {
    firstEntryPriority,
    firstEntryWorry,
    firstEntryPositive,
    completeOnboarding,
  } = useOnboardingStore()

  // State for user's responses to Gemini's follow-up questions
  const [priorityReflection, setPriorityReflection] = useState<string>("")
  const [worryReflection, setWorryReflection] = useState<string>("")
  const [positiveReflection, setPositiveReflection] = useState<string>("")

  // Initial empty state for Gemini's reflections
  const initialReflections: AllReflections = {
    priority: {
      upgrade: "Loading reflection...",
      spark: "Loading question...",
    },
    worry: {
      upgrade: "Loading reflection...",
      spark: "Loading question...",
    },
    positive: {
      upgrade: "Loading reflection...",
      spark: "Loading question...",
    },
  }

  // State for Gemini's reflections
  const [geminiUpgrades, setGeminiUpgrades] =
    useState<AllReflections>(initialReflections)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load Gemini reflections when component mounts
  useEffect(() => {
    async function loadReflections() {
      try {
        setIsLoading(true)
        setError(null)

        // Check if we have entries to process
        if (!firstEntryPriority && !firstEntryWorry && !firstEntryPositive) {
          setError("No entries found to generate reflections.")
          setIsLoading(false)
          return
        }

        // Generate all reflections using the Gemini API
        const reflections = await geminiApiClient.generateAllReflections({
          priority: firstEntryPriority || "",
          worry: firstEntryWorry || "",
          positive: firstEntryPositive || "",
        })

        setGeminiUpgrades(reflections)
      } catch (error) {
        console.error("Error generating reflections:", error)
        setError("Unable to generate reflections. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadReflections()
  }, [firstEntryPriority, firstEntryWorry, firstEntryPositive])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Handle completion of onboarding
  const handleComplete = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // If not signed in, skip saving reflections and just redirect
      if (!isSignedIn) {
        sessionStorage.setItem("fromOnboarding", "true")
        await completeOnboarding()
        router.push("/onboarding/completion?fromOnboarding=true")
        return
      }

      // Save reflections to database
      const reflectionData = {
        priority: priorityReflection,
        worry: worryReflection,
        positive: positiveReflection,
      }

      console.log("Attempting to save reflections:", {
        firstEntryPriority,
        firstEntryWorry,
        firstEntryPositive,
        reflections: reflectionData,
      })

      const response = await fetch("/api/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstEntryPriority,
          firstEntryWorry,
          firstEntryPositive,
          reflections: reflectionData,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("API Error Response:", responseData)
        throw new Error(responseData.error || "Failed to save reflections")
      }

      console.log("Reflections saved successfully:", responseData)

      // Mark onboarding as complete
      await completeOnboarding()

      // Navigate to the completion screen
      router.push("/onboarding/completion")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save your reflections. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle explore deeper with Gemini
  const handleExploreDeeper = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // If not signed in, skip saving reflections and just redirect
      if (!isSignedIn) {
        sessionStorage.setItem("fromOnboarding", "true")
        router.push("/onboarding/insights?fromOnboarding=true")
        return
      }

      // Save reflections to database first
      const reflectionData = {
        priority: priorityReflection,
        worry: worryReflection,
        positive: positiveReflection,
      }

      console.log("Attempting to save reflections before exploring deeper:", {
        firstEntryPriority,
        firstEntryWorry,
        firstEntryPositive,
        reflections: reflectionData,
      })

      const response = await fetch("/api/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstEntryPriority,
          firstEntryWorry,
          firstEntryPositive,
          reflections: reflectionData,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("API Error Response:", responseData)
        throw new Error(responseData.error || "Failed to save reflections")
      }

      console.log("Reflections saved successfully:", responseData)

      // Navigate to deeper insights page
      router.push("/onboarding/insights")
    } catch (error) {
      console.error("Error saving reflections:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save your reflections. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Custom input component for reflection responses
   */
  const ReflectionInput: React.FC<ReflectionInputProps> = ({
    value,
    onChange,
    placeholder = "Share your thoughts...",
    className = "min-h-[100px] resize-none p-4 text-base bg-gray-50 border-gray-200 focus:border-blue-300 rounded-lg",
  }) => (
    <Textarea
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )

  // Render error state if there's an error
  if (error && isLoading === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md rounded-xl shadow-md bg-white overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Something went wrong
              </h2>
              <p className="text-gray-600">{error}</p>
              <div className="flex gap-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setError(null)
                    // Try reloading reflections
                    window.location.reload()
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/onboarding/first-check-in")}
                >
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md rounded-xl shadow-md bg-white overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-800">
                Generating reflections...
              </h2>
              <p className="text-gray-600">
                Our AI is analyzing your journal entries to provide thoughtful
                insights.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        <Card className="w-full rounded-xl shadow-md bg-white overflow-hidden">
          {/* Progress bar - 100% complete */}
          <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500 w-full" />

          <CardContent className="p-6 md:p-8">
            {/* Display any error messages */}
            {error && (
              <motion.div
                variants={itemVariants}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                🚀 Gemini Reflection
              </h2>
              <div className="w-full h-1 bg-gray-100 rounded-full mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <hr className="border-gray-200 my-6" />
            </motion.div>

            {/* Priority Section */}
            {firstEntryPriority && (
              <motion.div variants={itemVariants} className="mb-10">
                {/* User's Original Response */}
                <div className="mb-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                    Priority
                  </h3>
                  <p className="bg-blue-50 p-4 rounded-lg text-gray-700">
                    <span className="mr-2">🪷</span>"{firstEntryPriority}"
                  </p>
                </div>

                {/* Gemini Upgrade */}
                <div className="mb-4 ml-4 border-l-2 border-blue-300 pl-4">
                  <h3 className="text-sm uppercase tracking-wider text-blue-600 mb-2">
                    Gemini Upgrade
                  </h3>
                  <p className="text-gray-700">
                    {geminiUpgrades.priority.upgrade}
                  </p>
                </div>

                {/* Follow-up Spark */}
                <div className="mb-4">
                  <h3 className="text-sm flex items-center text-blue-600 mb-2">
                    <span className="mr-2">➡️</span>
                    <span className="font-medium">
                      Follow-up Spark by Gemini
                    </span>
                  </h3>
                  <p className="text-gray-700 italic mb-3">
                    "{geminiUpgrades.priority.spark}"
                  </p>

                  {/* Input Field */}
                  <ReflectionInput
                    value={priorityReflection}
                    onChange={setPriorityReflection}
                    className="min-h-[100px] resize-none p-4 text-base bg-gray-50 border-gray-200 focus:border-blue-300 rounded-lg"
                  />
                </div>
              </motion.div>
            )}

            {firstEntryPriority && (firstEntryWorry || firstEntryPositive) && (
              <motion.div variants={itemVariants} className="mb-8">
                <hr className="border-gray-200 my-6" />
              </motion.div>
            )}

            {/* Worry Section */}
            {firstEntryWorry && (
              <motion.div variants={itemVariants} className="mb-10">
                {/* User's Original Response */}
                <div className="mb-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                    Worry
                  </h3>
                  <p className="bg-pink-50 p-4 rounded-lg text-gray-700">
                    <span className="mr-2">🥀</span>"{firstEntryWorry}"
                  </p>
                </div>

                {/* Gemini Upgrade */}
                <div className="mb-4 ml-4 border-l-2 border-pink-300 pl-4">
                  <h3 className="text-sm uppercase tracking-wider text-pink-600 mb-2">
                    Gemini Upgrade
                  </h3>
                  <p className="text-gray-700">
                    {geminiUpgrades.worry.upgrade}
                  </p>
                </div>

                {/* Follow-up Spark */}
                <div className="mb-4">
                  <h3 className="text-sm flex items-center text-pink-600 mb-2">
                    <span className="mr-2">➡️</span>
                    <span className="font-medium">
                      Follow-up Spark by Gemini
                    </span>
                  </h3>
                  <p className="text-gray-700 italic mb-3">
                    "{geminiUpgrades.worry.spark}"
                  </p>

                  {/* Input Field */}
                  <ReflectionInput
                    value={worryReflection}
                    onChange={setWorryReflection}
                    className="min-h-[100px] resize-none p-4 text-base bg-gray-50 border-gray-200 focus:border-pink-300 rounded-lg"
                  />
                </div>
              </motion.div>
            )}

            {firstEntryWorry && firstEntryPositive && (
              <motion.div variants={itemVariants} className="mb-8">
                <hr className="border-gray-200 my-6" />
              </motion.div>
            )}

            {/* Positive Action Section */}
            {firstEntryPositive && (
              <motion.div variants={itemVariants} className="mb-10">
                {/* User's Original Response */}
                <div className="mb-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                    Positive Action
                  </h3>
                  <p className="bg-green-50 p-4 rounded-lg text-gray-700">
                    <span className="mr-2">🌱</span>"{firstEntryPositive}"
                  </p>
                </div>

                {/* Gemini Upgrade */}
                <div className="mb-4 ml-4 border-l-2 border-green-300 pl-4">
                  <h3 className="text-sm uppercase tracking-wider text-green-600 mb-2">
                    Gemini Upgrade
                  </h3>
                  <p className="text-gray-700">
                    {geminiUpgrades.positive.upgrade}
                  </p>
                </div>

                {/* Follow-up Spark */}
                <div className="mb-4">
                  <h3 className="text-sm flex items-center text-green-600 mb-2">
                    <span className="mr-2">➡️</span>
                    <span className="font-medium">
                      Follow-up Spark by Gemini
                    </span>
                  </h3>
                  <p className="text-gray-700 italic mb-3">
                    "{geminiUpgrades.positive.spark}"
                  </p>

                  {/* Input Field */}
                  <ReflectionInput
                    value={positiveReflection}
                    onChange={setPositiveReflection}
                    className="min-h-[100px] resize-none p-4 text-base bg-gray-50 border-gray-200 focus:border-green-300 rounded-lg"
                  />
                </div>
              </motion.div>
            )}

            {(firstEntryPriority || firstEntryWorry || firstEntryPositive) && (
              <motion.div variants={itemVariants} className="mb-8">
                <hr className="border-gray-200 my-6" />
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
            >
              <Button
                className="flex-1 py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                onClick={handleExploreDeeper}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>🌟 Explore Deeper with Gemini</>
                )}
              </Button>

              <Button
                className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                onClick={handleComplete}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>✅ Complete Reflection</>
                )}
              </Button>
            </motion.div>

            {/* Note */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                *Gemini Flash can help weave your responses into a deeper
                insight if you choose to continue.*
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default GeminiReflectionScreen
