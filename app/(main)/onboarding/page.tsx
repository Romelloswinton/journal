// app/onboarding/page.tsx

"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import useOnboardingStore from "@/app/store/onboardingStore"
import { ContinueButton } from "@/components/ui/ContinueButton"
import { getStepProgress } from "./_lib/utils"
import { GoalSelection } from "./_components/GoalSelection"
import { GenderSelection } from "./_components/GenderSelection"
import { itemVariants } from "./_lib/animations"
import { AgeSelection } from "./_components/AgeSelection"
import { OccupationSelection } from "./_components/OccupationSelection"
import { RelationshipSelection } from "./_components/RelationshipSelection"
import { FaithSelection } from "./_components/FaithSelection"
import { StruggleSelection } from "./_components/StruggleSelection"
import { FirstCheckIn } from "./_components/FirstCheckIn"
import { GeminiInsights } from "./_components/GeminiInsights"
import { CompletionScreen } from "./_components/CompletionScreen"
import { containerVariants } from "./_lib/animations"
import { GeminiReflection } from "./_components/GeminiReflection"
import { JournalTimeSelection } from "./_components/JournalSelection"

export default function UnifiedOnboardingPage() {
  const { isLoaded, isSignedIn } = useAuth()
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

  // Form control states
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fixed light theme styles for onboarding
  const styles = {
    bgClass: "bg-muted",
    cardBgClass: "bg-white",
    cardBorderClass: "border-border",
    headerTextClass: "text-gray-800",
    primaryTextClass: "text-blue-700",
    secondaryTextClass: "text-blue-600",
    normalTextClass: "text-gray-700",
    mutedTextClass: "text-gray-500",
    progressBgClass: "bg-gray-100",
    progressFillClass: "bg-blue-500",
    skipButtonClass: "text-muted-foreground hover:text-gray-700",
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
          // Get the current values from the store (which FirstCheckIn component updates)
          const currentStore = useOnboardingStore.getState()
          if (
            !currentStore.firstEntryPriority ||
            !currentStore.firstEntryWorry ||
            !currentStore.firstEntryPositive
          ) {
            return
          }
          // Properly save the entries using the store action
          saveFirstEntry(
            currentStore.firstEntryPriority,
            currentStore.firstEntryWorry,
            currentStore.firstEntryPositive,
            router
          )
          setCurrentStep("gemini-reflection")
          break
        case "gemini-insights":
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

  // Determine which content to render based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "goal":
        return (
          <GoalSelection
            localSelectedGoal={localSelectedGoal}
            setLocalSelectedGoal={setLocalSelectedGoal}
          />
        )
      case "age-selection":
        return (
          <AgeSelection
            localSelectedAge={localSelectedAge}
            setLocalSelectedAge={setLocalSelectedAge}
          />
        )
      case "gender-selection":
        return (
          <GenderSelection
            localSelectedGender={localSelectedGender}
            setLocalSelectedGender={setLocalSelectedGender}
          />
        )
      case "primary-occupation":
        return (
          <OccupationSelection
            localSelectedOccupation={localSelectedOccupation}
            setLocalSelectedOccupation={setLocalSelectedOccupation}
          />
        )
      case "relationship-status":
        return (
          <RelationshipSelection
            localSelectedRelationship={localSelectedRelationship}
            setLocalSelectedRelationship={setLocalSelectedRelationship}
          />
        )
      case "faith-orientation":
        return (
          <FaithSelection
            localSelectedFaith={localSelectedFaith}
            setLocalSelectedFaith={setLocalSelectedFaith}
          />
        )
      case "struggles":
        return (
          <StruggleSelection
            localSelectedStruggle={localSelectedStruggle}
            setLocalSelectedStruggle={setLocalSelectedStruggle}
          />
        )
      case "journal-time":
        return (
          <JournalTimeSelection
            localSelectedJournalTime={localSelectedJournalTime}
            setLocalSelectedJournalTime={setLocalSelectedJournalTime}
          />
        )
      case "first-check-in":
        return <FirstCheckIn />
      case "gemini-reflection":
        return <GeminiReflection setCurrentStep={setCurrentStep} />
      case "gemini-insights":
        return <GeminiInsights />
      case "complete":
        return <CompletionScreen />
      default:
        return (
          <GoalSelection
            localSelectedGoal={localSelectedGoal}
            setLocalSelectedGoal={setLocalSelectedGoal}
          />
        )
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
        return !!(firstEntryPriority && firstEntryWorry && firstEntryPositive)
      case "gemini-reflection":
        return false // No continue button here since we have two custom buttons
      case "gemini-insights":
        return true
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
      <div
        className={`min-h-screen flex items-center justify-center ${styles.bgClass}`}
      >
        <div
          className={`animate-spin h-8 w-8 border-t-2 border-b-2 ${styles.progressFillClass} rounded-full`}
        />
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${styles.bgClass} p-4`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto"
      >
        <Card
          className={`w-full rounded-xl shadow-md ${styles.cardBgClass} ${styles.cardBorderClass} overflow-hidden`}
        >
          {/* Progress bar */}
          <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-400" />

          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-semibold ${styles.headerTextClass} text-sm`}>
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
                  className={`text-sm ${styles.skipButtonClass} underline cursor-pointer`}
                >
                  Skip
                </button>
              )}
            </div>

            {/* Progress indicator */}
            {currentStep !== "complete" && (
              <motion.div
                variants={itemVariants}
                className={`w-full h-1 ${styles.progressBgClass} rounded-full mb-6`}
              >
                <div
                  className={`h-full ${styles.progressFillClass} rounded-full transition-all duration-500`}
                  style={{ width: `${getStepProgress(currentStep)}%` }}
                />
              </motion.div>
            )}

            {/* Step content */}
            {renderStepContent()}

            {/* Continue button only - Back button removed */}
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
                  theme="light" // Fixed to light theme
                  className="bg-black hover:bg-gray-800 text-white" // Black styling
                />
              </motion.div>
            )}

            {/* Footer note */}
            <motion.p
              variants={itemVariants}
              className={`text-xs ${styles.mutedTextClass} text-center mt-6`}
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
