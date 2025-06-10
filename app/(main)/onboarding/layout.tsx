// app/onboarding/layout.tsx

"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useTheme } from "@/components/theme/theme-provider"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import useOnboardingStore from "@/app/store/onboardingStore"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme() // Get current theme
  const router = useRouter()
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useAuth()

  const {
    currentStep,
    setCurrentStep,
    checkOnboardingStatus,
    navigateToPreviousStep,
  } = useOnboardingStore()

  // Check if onboarding is already complete
  useEffect(() => {
    const checkStatus = async () => {
      if (isSignedIn) {
        const isComplete = await checkOnboardingStatus()
        if (isComplete) {
          router.push("/dashboard")
        }
      }
    }

    if (isLoaded) {
      checkStatus()
    }
  }, [isLoaded, isSignedIn, checkOnboardingStatus, router])

  // Sync path with current step
  useEffect(() => {
    // Map pathname to step
    if (pathname) {
      if (pathname.includes("age-selection")) {
        setCurrentStep("age-selection")
      } else if (pathname.includes("gender-selection")) {
        setCurrentStep("gender-selection")
      } else if (pathname.includes("primary-occupation")) {
        setCurrentStep("primary-occupation")
      } else if (pathname.includes("relationship-status")) {
        setCurrentStep("relationship-status")
      } else if (pathname.includes("faith-orientation")) {
        setCurrentStep("faith-orientation")
      } else if (pathname.includes("struggles")) {
        setCurrentStep("struggles")
      } else if (pathname.includes("journal-time")) {
        setCurrentStep("journal-time")
      } else if (pathname.includes("first-check-in")) {
        setCurrentStep("first-check-in")
      } else if (pathname.includes("gemini-reflection")) {
        setCurrentStep("gemini-reflection")
      } else if (pathname.includes("gemini-insights")) {
        setCurrentStep("gemini-insights")
      } else if (
        pathname.includes("completion") ||
        pathname.includes("complete")
      ) {
        setCurrentStep("complete")
      } else if (pathname === "/onboarding") {
        setCurrentStep("goal")
      }
    }
  }, [pathname, setCurrentStep])

  // Progress indicators for the onboarding steps
  const getStepProgress = () => {
    switch (currentStep) {
      case "landing":
        return 0
      case "goal":
        return 9
      case "age-selection":
        return 18
      case "gender-selection":
        return 27
      case "primary-occupation":
        return 36
      case "relationship-status":
        return 45
      case "faith-orientation":
        return 54
      case "struggles":
        return 63
      case "journal-time":
        return 72
      case "first-check-in":
        return 81
      case "gemini-reflection":
        return 90
      case "gemini-insights":
        return 95
      case "complete":
        return 100
      default:
        return 0
    }
  }

  // Check if we're on the Gemini reflection page
  const isGeminiReflection = pathname?.includes("gemini-reflection")

  // Handle back button action
  const handleBack = () => {
    navigateToPreviousStep(router)
  }

  // Dark mode & light mode class adjustments
  const bgClass = theme === "dark" ? "bg-gray-900" : "bg-[#faf9f7]"
  const progressBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-200"
  const progressFillClass = theme === "dark" ? "bg-blue-400" : "bg-blue-500"
  const textClass = theme === "dark" ? "text-gray-300" : "text-gray-600"

  if (!isLoaded) {
    return (
      <div
        className={`w-full min-h-screen ${bgClass} flex items-center justify-center`}
      >
        <div
          className={`animate-spin h-8 w-8 border-t-2 border-b-2 ${
            theme === "dark" ? "border-blue-400" : "border-blue-500"
          } rounded-full`}
        ></div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen ${bgClass}`}>
      {/* Progress indicator - show on all pages except the landing page */}
      {currentStep !== "landing" && (
        <div
          className={`fixed top-0 left-0 w-full h-1 ${progressBgClass} z-20`}
        >
          <div
            className={`h-full ${progressFillClass} transition-all duration-500 ease-in-out`}
            style={{ width: `${isGeminiReflection ? 95 : getStepProgress()}%` }}
          />
        </div>
      )}

      {/* Theme toggle button */}
      <div className="fixed top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Back button - only show if not on landing or goal */}
      {currentStep !== "landing" && currentStep !== "goal" && (
        <button
          onClick={handleBack}
          className={`fixed top-4 left-4 z-20 flex items-center text-sm font-medium ${textClass} hover:text-blue-500 transition-colors`}
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

      {/* Main content */}
      <div className="w-full min-h-screen">{children}</div>
    </div>
  )
}
