// app/onboarding/layout.tsx

"use client"

import useOnboardingStore from "@/app/store/onboardingStore"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentStep } = useOnboardingStore()

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
  const isGeminiReflection =
    typeof window !== "undefined" &&
    window.location.pathname.includes("gemini-reflection")

  return (
    <div className="w-full min-h-screen bg-[#faf9f7]">
      {/* Progress indicator - show on all pages except the landing page */}
      {currentStep !== "landing" && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-20">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: `${isGeminiReflection ? 95 : getStepProgress()}%` }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="w-full min-h-screen">{children}</div>
    </div>
  )
}
