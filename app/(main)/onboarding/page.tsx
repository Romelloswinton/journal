// app/onboarding/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { OptionButton } from "@/components/ui/OptionButton"
import { ContinueButton } from "@/components/ui/ContinueButton"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Loader2,
  Brain,
  Eye,
  Heart,
  Sparkles,
} from "lucide-react"
import useOnboardingStore, { OnboardingStep } from "@/app/store/onboardingStore"
import journalCategories from "@/data/journalCategories"
import { faithOptions } from "@/data/faithData"
import { relationshipOptions } from "@/data/relationshipData"
import { struggleOptions } from "@/data/strugglesData"
import { journalTimeOptions } from "@/data/journalTimeData"
import useSpeechRecognition from "@/hooks/useSpeechRecognition"
import geminiApiClient from "@/lib/gemini/geminiApiClient"
import { AllReflections } from "@/lib/gemini/types"

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

export default function UnifiedOnboardingPage() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const router = useRouter()

  // Get state and actions from the store
  const {
    currentStep,
    selectedGoal,
    selectedAge,
    selectedGender,
    selectedOccupation,
    selectedRelationship,
    selectedFaith,
    selectedStruggle,
    selectedJournalTime,
    firstEntryPriority,
    firstEntryWorry,
    firstEntryPositive,
    handleSelectGoal,
    handleSelectAge,
    handleSelectGender,
    handleSelectOccupation,
    handleSelectRelationship,
    handleSelectFaith,
    handleSelectStruggle,
    handleSelectJournalTime,
    saveFirstEntry,
    navigateToNextStep,
    navigateToPreviousStep,
    skipCurrentStep,
    setCurrentStep,
    completeOnboarding,
  } = useOnboardingStore()

  // Local states for form inputs
  const [localSelectedGoal, setLocalSelectedGoal] = useState<string | null>(
    selectedGoal
  )
  const [localSelectedAge, setLocalSelectedAge] = useState<string | null>(
    selectedAge
  )
  const [localSelectedGender, setLocalSelectedGender] = useState<string | null>(
    selectedGender
  )
  const [localSelectedOccupation, setLocalSelectedOccupation] = useState<
    string | null
  >(selectedOccupation)
  const [localSelectedRelationship, setLocalSelectedRelationship] = useState<
    string | null
  >(selectedRelationship)
  const [localSelectedFaith, setLocalSelectedFaith] = useState<string | null>(
    selectedFaith
  )
  const [localSelectedStruggle, setLocalSelectedStruggle] = useState<
    string | null
  >(selectedStruggle)
  const [localSelectedJournalTime, setLocalSelectedJournalTime] = useState<
    string | null
  >(selectedJournalTime)

  // First entry fields
  const [priority, setPriority] = useState(firstEntryPriority || "")
  const [worry, setWorry] = useState(firstEntryWorry || "")
  const [positiveAction, setPositiveAction] = useState(firstEntryPositive || "")

  // Gemini reflection states
  const [geminiReflections, setGeminiReflections] =
    useState<AllReflections | null>(null)
  const [priorityReflection, setPriorityReflection] = useState("")
  const [worryReflection, setWorryReflection] = useState("")
  const [positiveReflection, setPositiveReflection] = useState("")

  // Gemini insights states
  const [deeperInsights, setDeeperInsights] = useState<InsightsData | null>(
    null
  )
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingReflections, setIsLoadingReflections] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load Gemini reflections when reaching that step
  useEffect(() => {
    async function loadReflections() {
      if (currentStep === "gemini-reflection" && !geminiReflections) {
        try {
          setIsLoadingReflections(true)
          setError(null)

          // Check if we have entries to process
          if (!firstEntryPriority && !firstEntryWorry && !firstEntryPositive) {
            setError("No entries found to generate reflections.")
            setIsLoadingReflections(false)
            return
          }

          // Generate all reflections using the Gemini API
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
    currentStep,
    firstEntryPriority,
    firstEntryWorry,
    firstEntryPositive,
    geminiReflections,
  ])

  // Load Gemini insights when reaching that step
  useEffect(() => {
    async function loadInsights() {
      if (currentStep === "gemini-insights" && !deeperInsights) {
        try {
          setIsLoadingInsights(true)
          setError(null)

          // Get user's reflections
          const reflections = {
            priority: priorityReflection,
            worry: worryReflection,
            positive: positiveReflection,
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
  }, [
    currentStep,
    firstEntryPriority,
    firstEntryWorry,
    firstEntryPositive,
    priorityReflection,
    worryReflection,
    positiveReflection,
    deeperInsights,
  ])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.5 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  // Step progress calculation
  const getStepProgress = () => {
    const steps = [
      "goal",
      "age-selection",
      "gender-selection",
      "primary-occupation",
      "relationship-status",
      "faith-orientation",
      "struggles",
      "journal-time",
      "first-check-in",
      "gemini-reflection",
      "gemini-insights",
      "complete",
    ]
    const currentIndex = steps.indexOf(currentStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  // Navigation handlers
  const handleNext = async () => {
    setIsSubmitting(true)

    try {
      switch (currentStep) {
        case "goal":
          if (!localSelectedGoal) return
          handleSelectGoal(localSelectedGoal as any)
          setCurrentStep("age-selection")
          break
        case "age-selection":
          if (!localSelectedAge) return
          handleSelectAge(localSelectedAge as any, router)
          break
        case "gender-selection":
          if (!localSelectedGender) return
          handleSelectGender(localSelectedGender as any, router)
          break
        case "primary-occupation":
          if (!localSelectedOccupation) return
          handleSelectOccupation(localSelectedOccupation as any, router)
          break
        case "relationship-status":
          if (!localSelectedRelationship) return
          handleSelectRelationship(localSelectedRelationship as any, router)
          break
        case "faith-orientation":
          if (!localSelectedFaith) return
          handleSelectFaith(localSelectedFaith as any, router)
          break
        case "struggles":
          if (!localSelectedStruggle) return
          handleSelectStruggle(localSelectedStruggle as any, router)
          break
        case "journal-time":
          if (!localSelectedJournalTime) return
          handleSelectJournalTime(localSelectedJournalTime as any, router)
          break
        case "first-check-in":
          if (!priority.trim() || !worry.trim() || !positiveAction.trim())
            return
          saveFirstEntry(priority, worry, positiveAction, router)
          setCurrentStep("gemini-reflection")
          break
        case "gemini-reflection":
          // Continue button no longer shown here since we have two buttons in the UI
          break
        case "gemini-insights":
          // Complete onboarding and go to final confirmation
          await completeOnboarding()
          setCurrentStep("complete")
          break
        case "complete":
          router.push("/dashboard")
          return
      }
    } finally {
      setTimeout(() => setIsSubmitting(false), 500)
    }
  }

  const handleBack = () => {
    navigateToPreviousStep(router)
  }

  const handleSkip = () => {
    skipCurrentStep(router)
  }

  // Rendering functions for each step
  const renderGoalSelection = () => (
    <motion.div variants={itemVariants}>
      <p className="text-sm md:text-base text-blue-700 font-medium leading-snug mb-6">
        Our mission is to guide you to a more fulfilling life through
        self-reflection.
        <br />
        What is your primary goal for journaling?
      </p>

      <div className="space-y-3">
        {journalCategories.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            emoji={option.emoji}
            isSelected={localSelectedGoal === option.id}
            onClick={() => setLocalSelectedGoal(option.id)}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderAgeSelection = () => (
    <motion.div variants={itemVariants}>
      <p className="text-blue-700 font-medium mb-6">
        Great! Now, let's tailor fit Rosebud to you.
        <br />
        🧸 How many years young are you?
      </p>

      <div className="space-y-3">
        {[
          { value: "under-18", label: "Under 18" },
          { value: "18-24", label: "18–24" },
          { value: "25-34", label: "25–34" },
          { value: "35-44", label: "35–44" },
          { value: "45-54", label: "45–54" },
          { value: "55-plus", label: "55+" },
        ].map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            isSelected={localSelectedAge === option.value}
            onClick={() => setLocalSelectedAge(option.value)}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderGenderSelection = () => (
    <motion.div variants={itemVariants}>
      <h2 className="text-blue-700 font-medium mb-4">How do you identify?</h2>

      <div className="space-y-2">
        {[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "non-binary", label: "Non-binary" },
          { value: "prefer-not-to-say", label: "Prefer not to say" },
        ].map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            isSelected={localSelectedGender === option.value}
            onClick={() => setLocalSelectedGender(option.value)}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderOccupationSelection = () => (
    <motion.div variants={itemVariants}>
      <h2 className="text-blue-700 font-medium mb-4">
        What best describes your current primary occupation?
      </h2>

      <div className="space-y-2">
        {[
          { value: "student", label: "Student" },
          { value: "professional", label: "Professional" },
          { value: "homemaker", label: "Homemaker" },
          { value: "retired", label: "Retired" },
          { value: "unemployed", label: "Unemployed" },
          { value: "other", label: "Other" },
          { value: "prefer-not-to-say", label: "Prefer not to say" },
        ].map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            isSelected={localSelectedOccupation === option.value}
            onClick={() => setLocalSelectedOccupation(option.value)}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderRelationshipSelection = () => (
    <motion.div variants={itemVariants}>
      <h2 className="text-blue-700 font-medium mb-4">
        What's your relationship status?
      </h2>

      <div className="space-y-2">
        {relationshipOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            emoji={option.emoji}
            isSelected={localSelectedRelationship === option.value}
            onClick={() => setLocalSelectedRelationship(option.value)}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderFaithSelection = () => (
    <motion.div variants={itemVariants}>
      <h2 className="text-blue-700 font-medium mb-4">
        What is your faith or spiritual orientation?
      </h2>

      <div className="space-y-2">
        {faithOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            emoji={option.emoji}
            isSelected={localSelectedFaith === option.value}
            onClick={() => setLocalSelectedFaith(option.value)}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderStruggleSelection = () => (
    <motion.div variants={itemVariants}>
      <h2 className="text-blue-700 font-medium mb-4">
        Have you been struggling with any of the following?
      </h2>

      <div className="space-y-2">
        {struggleOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            emoji={option.emoji}
            isSelected={localSelectedStruggle === option.value}
            onClick={() => setLocalSelectedStruggle(option.value)}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderJournalTimeSelection = () => (
    <motion.div variants={itemVariants}>
      <h2 className="text-blue-700 font-medium mb-4">
        Lastly, when would you like to journal?
      </h2>

      <div className="space-y-2">
        {journalTimeOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            emoji={option.emoji}
            isSelected={localSelectedJournalTime === option.value}
            onClick={() => setLocalSelectedJournalTime(option.value)}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderFirstCheckIn = () => (
    <motion.div variants={itemVariants}>
      <h2 className="text-lg text-blue-600 font-medium mb-6">
        ✍️ First Check-in
      </h2>

      {/* Priority Question */}
      <div className="mb-6">
        <h3 className="text-blue-600 font-medium mb-2">
          🪷 What's your highest priority today?
        </h3>
        <Textarea
          placeholder="Write..."
          className="min-h-[120px] resize-none p-4"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
      </div>

      {/* Worry Question */}
      <div className="mb-6">
        <h3 className="text-blue-600 font-medium mb-2">
          🥀 Is there anything worrying you about the day ahead?
        </h3>
        <Textarea
          placeholder="Write..."
          className="min-h-[120px] resize-none p-4"
          value={worry}
          onChange={(e) => setWorry(e.target.value)}
        />
      </div>

      {/* Positive Action Question */}
      <div className="mb-6">
        <h3 className="text-blue-600 font-medium mb-2">
          🌱 What's one positive thing you can do for yourself today?
        </h3>
        <Textarea
          placeholder="Write..."
          className="min-h-[120px] resize-none p-4"
          value={positiveAction}
          onChange={(e) => setPositiveAction(e.target.value)}
        />
      </div>
    </motion.div>
  )

  const renderGeminiReflection = () => {
    if (isLoadingReflections) {
      return (
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800">
            Generating reflections...
          </h2>
          <p className="text-gray-600">
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
          <h2 className="text-xl font-semibold text-gray-800">
            Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setError(null)
              setCurrentStep("first-check-in")
            }}
          >
            Go Back
          </Button>
        </div>
      )
    }

    if (!geminiReflections) return null

    return (
      <motion.div variants={itemVariants} className="space-y-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🚀 Gemini Reflections
          </h2>
          <p className="text-gray-600">
            Based on your entries, here are some thoughtful insights
          </p>
        </div>

        {/* Priority Reflection */}
        {firstEntryPriority && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Your Priority</h3>
              <p className="text-gray-700">{firstEntryPriority}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                Gemini's Insight
              </h3>
              <p className="text-gray-800">
                {geminiReflections.priority.upgrade}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">
                Reflection Question
              </h3>
              <p className="text-gray-700 italic mb-3">
                {geminiReflections.priority.spark}
              </p>
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[100px] resize-none p-4"
                value={priorityReflection}
                onChange={(e) => setPriorityReflection(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Worry Reflection */}
        {firstEntryWorry && (
          <div className="space-y-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-medium text-pink-800 mb-2">Your Concern</h3>
              <p className="text-gray-700">{firstEntryWorry}</p>
            </div>
            <div className="bg-pink-100 p-4 rounded-lg">
              <h3 className="font-medium text-pink-900 mb-2">
                Gemini's Insight
              </h3>
              <p className="text-gray-800">{geminiReflections.worry.upgrade}</p>
            </div>
            <div>
              <h3 className="font-medium text-pink-700 mb-2">
                Reflection Question
              </h3>
              <p className="text-gray-700 italic mb-3">
                {geminiReflections.worry.spark}
              </p>
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[100px] resize-none p-4"
                value={worryReflection}
                onChange={(e) => setWorryReflection(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Positive Action Reflection */}
        {firstEntryPositive && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">
                Your Positive Action
              </h3>
              <p className="text-gray-700">{firstEntryPositive}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">
                Gemini's Insight
              </h3>
              <p className="text-gray-800">
                {geminiReflections.positive.upgrade}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-green-700 mb-2">
                Reflection Question
              </h3>
              <p className="text-gray-700 italic mb-3">
                {geminiReflections.positive.spark}
              </p>
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[100px] resize-none p-4"
                value={positiveReflection}
                onChange={(e) => setPositiveReflection(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Two action buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Button
            className="flex-1 py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            onClick={() => setCurrentStep("gemini-insights")}
          >
            🌟 Explore Deeper with Gemini
          </Button>

          <Button
            className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            onClick={() => setCurrentStep("complete")}
          >
            ✅ Continue to Completion
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          *Gemini can help weave your responses into deeper insights if you
          choose to continue.*
        </p>
      </motion.div>
    )
  }

  const renderGeminiInsights = () => {
    if (isLoadingInsights) {
      return (
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <Brain className="h-12 w-12 text-purple-500 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-800">
            Generating deeper insights...
          </h2>
          <p className="text-gray-600">
            Gemini is weaving together your thoughts and reflections.
          </p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setError(null)
              setCurrentStep("gemini-reflection")
            }}
          >
            Go Back
          </Button>
        </div>
      )
    }

    if (!deeperInsights) return null

    return (
      <motion.div variants={itemVariants} className="space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            Deeper Insights from Gemini
          </h2>
        </div>

        {/* Overall Pattern */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Overall Pattern
          </h3>
          <p className="text-gray-700 leading-relaxed">
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
            className="bg-gray-50 rounded-lg p-6"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {insight.title}
            </h4>
            <p className="text-gray-700 mb-4">{insight.insight}</p>

            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">
                Practical Steps:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                {insight.practicalSteps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-gray-800 mb-2">Connections:</h5>
              <p className="text-gray-700">{insight.connectionToOtherAreas}</p>
            </div>
          </motion.section>
        ))}

        {/* Personalized Growth Path */}
        <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Your Personalized Growth Path
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {deeperInsights.personalizedGrowthPath}
          </p>
        </section>
      </motion.div>
    )
  }

  const renderComplete = () => (
    <motion.div variants={itemVariants} className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-green-500" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome to Your Journal!
      </h2>

      <p className="text-gray-600 mb-6">
        You're all set! We've personalized your journal for your goals
        {selectedJournalTime &&
          selectedJournalTime !== "no-preference" &&
          ` and will remind you ${
            selectedJournalTime === "morning"
              ? "in the morning"
              : selectedJournalTime === "afternoon"
              ? "in the afternoon"
              : "in the evening"
          }.`}
      </p>

      {firstEntryPriority && (
        <div className="bg-amber-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">📝</span>
            <span className="font-medium text-amber-800">Your First Entry</span>
          </div>
          <p className="text-sm text-amber-700 italic">
            "{firstEntryPriority}"
          </p>
        </div>
      )}

      <Button
        className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        onClick={() => router.push("/dashboard")}
      >
        <span className="flex items-center justify-center">
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </span>
      </Button>

      <p className="text-xs text-gray-400 mt-6">
        You can always adjust your preferences in Settings
      </p>
    </motion.div>
  )

  // Determine which content to render based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "goal":
        return renderGoalSelection()
      case "age-selection":
        return renderAgeSelection()
      case "gender-selection":
        return renderGenderSelection()
      case "primary-occupation":
        return renderOccupationSelection()
      case "relationship-status":
        return renderRelationshipSelection()
      case "faith-orientation":
        return renderFaithSelection()
      case "struggles":
        return renderStruggleSelection()
      case "journal-time":
        return renderJournalTimeSelection()
      case "first-check-in":
        return renderFirstCheckIn()
      case "gemini-reflection":
        return renderGeminiReflection()
      case "gemini-insights":
        return renderGeminiInsights()
      case "complete":
        return renderComplete()
      default:
        return renderGoalSelection()
    }
  }

  // Check if continue button should be shown
  const shouldShowContinue = () => {
    switch (currentStep) {
      case "goal":
        return !!localSelectedGoal
      case "age-selection":
        return !!localSelectedAge
      case "gender-selection":
        return !!localSelectedGender
      case "primary-occupation":
        return !!localSelectedOccupation
      case "relationship-status":
        return !!localSelectedRelationship
      case "faith-orientation":
        return !!localSelectedFaith
      case "struggles":
        return !!localSelectedStruggle
      case "journal-time":
        return !!localSelectedJournalTime
      case "first-check-in":
        return !!(priority.trim() && worry.trim() && positiveAction.trim())
      case "gemini-reflection":
        return false // No continue button here since we have two custom buttons
      case "gemini-insights":
        return !isLoadingInsights
      case "complete":
        return false
      default:
        return false
    }
  }

  // Get continue button label
  const getContinueLabel = () => {
    switch (currentStep) {
      case "first-check-in":
        return "See Gemini Insights"
      case "journal-time":
        return "Start First Entry"
      case "gemini-reflection":
        return "Explore Deeper"
      case "gemini-insights":
        return "Complete Setup"
      default:
        return "Continue"
    }
  }

  // If auth is still loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto"
      >
        <Card className="w-full rounded-xl shadow-md bg-white overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-400" />

          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-800 text-sm">
                {currentStep === "goal"
                  ? "🌹 Welcome to Rosebud!"
                  : currentStep === "first-check-in"
                  ? "✍️ First Check-in"
                  : currentStep === "gemini-reflection"
                  ? "✨ Gemini Reflections"
                  : currentStep === "gemini-insights"
                  ? "🧠 Deeper Insights"
                  : currentStep === "complete"
                  ? "🎉 Personalization complete!"
                  : "Personalize your journal"}
              </h2>
              {currentStep !== "complete" && (
                <button
                  onClick={handleSkip}
                  className="text-sm text-muted-foreground underline cursor-pointer"
                >
                  Skip
                </button>
              )}
            </div>

            {/* Progress indicator */}
            {currentStep !== "complete" && (
              <motion.div
                variants={itemVariants}
                className="w-full h-1 bg-gray-100 rounded-full mb-6"
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${getStepProgress()}%` }}
                />
              </motion.div>
            )}

            {/* Step content */}
            {renderStepContent()}

            {/* Continue button */}
            {shouldShowContinue() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <ContinueButton
                  onClick={handleNext}
                  isSubmitting={isSubmitting}
                  label={getContinueLabel()}
                />
              </motion.div>
            )}

            {/* Back button */}
            {currentStep !== "goal" && currentStep !== "complete" && (
              <motion.div variants={itemVariants} className="mt-4">
                <button
                  className="text-sm border border-gray-200 rounded-md px-3 py-1 hover:bg-gray-50 transition"
                  onClick={handleBack}
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {/* Footer note */}
            <motion.p
              variants={itemVariants}
              className="text-xs text-gray-400 text-center mt-6"
            >
              {currentStep === "first-check-in"
                ? "Everything you write is private and only visible to you."
                : currentStep === "gemini-reflection"
                ? "Our AI is helping you reflect deeper on your thoughts."
                : currentStep === "gemini-insights"
                ? "Discovering patterns and connections in your reflections."
                : currentStep === "complete"
                ? "You can always adjust your preferences in Settings"
                : "This information helps us personalize your experience"}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
