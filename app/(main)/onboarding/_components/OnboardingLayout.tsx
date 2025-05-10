// app/onboarding/layout.tsx

"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

import JournalGoalScreen from "./JournalGoalScreen"
import NextStepScreen from "./NextStepScreen"
import CompletionScreen from "./CompletionScreen"
import useOnboardingStore from "@/app/store/onboardingStore"
import AgeSelectionScreen from "./AgeSelectionScreen"
import GenderSelectionScreen from "./GenderSelectionScreen"
import PrimaryOccupationScreen from "./PrimaryOccupationScreen"
import LandingPage from "@/app/page"

export default function OnboardingLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useAuth()

  // Get state from Zustand store
  const { currentStep, direction, goBack, setStep } = useOnboardingStore()

  // Do NOT check authentication during onboarding
  // Allow users to go through onboarding before signing in

  // Sync the URL path with the current step when needed
  useEffect(() => {
    // Only sync if we're on the base /onboarding route with no sub-paths
    if (pathname === "/onboarding") {
      // This prevents the loop - only render components directly rather than navigating
      // Do not add router.push here as it will cause infinite loops
    }
  }, [pathname])

  // Animation variants for page transitions
  const pageVariants = {
    initial: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? 100 : -100,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? -100 : 100,
      opacity: 0,
      transition: {
        x: { duration: 0.3 },
        opacity: { duration: 0.3 },
      },
    }),
  }

  // Progress indicators for the onboarding steps
  const getStepProgress = () => {
    switch (currentStep) {
      case "landing":
        return 0
      case "goal":
        return 1
      case "goal-confirmation":
        return 2
      case "age-selection":
        return 3
      case "gender-selection":
        return 4
      case "primary-occupation":
        return 5
      case "complete":
        return 6
      default:
        return 0
    }
  }

  // Determine which component to render based on the pathname
  const getComponentFromPathname = () => {
    // If we're on a specific sub-path, render the appropriate component
    if (pathname === "/onboarding/age-selection") {
      return <AgeSelectionScreen />
    } else if (pathname === "/onboarding/gender-selection") {
      return <GenderSelectionScreen />
    } else if (pathname === "/onboarding/primary-occupation") {
      return <PrimaryOccupationScreen />
    }

    // Otherwise, use the current step from state
    return renderStepFromState()
  }

  // Render the appropriate step based on currentStep in state
  const renderStepFromState = () => {
    switch (currentStep) {
      case "landing":
        return <LandingPage />
      case "goal":
        return <JournalGoalScreen />
      case "goal-confirmation":
        return <NextStepScreen />
      case "age-selection":
        return <AgeSelectionScreen />
      case "gender-selection":
        return <GenderSelectionScreen />
      case "primary-occupation":
        return <PrimaryOccupationScreen />
      case "complete":
        return <CompletionScreen />
      default:
        return <LandingPage />
    }
  }

  // If authentication is not yet loaded, show loading state
  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen bg-[#faf9f7] flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#faf9f7]">
      {/* Progress indicator - only show if not on landing */}
      {currentStep !== "landing" && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-10">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: `${(getStepProgress() / 6) * 100}%` }}
          />
        </div>
      )}

      {/* Back button - only show if not on landing */}
      {currentStep !== "landing" && (
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-10 flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep + pathname}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen"
        >
          {getComponentFromPathname()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
