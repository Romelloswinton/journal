// app/onboarding/_lib/utils.ts

import { ThemeStyles } from "./types"
import { OnboardingStep } from "@/app/store/onboardingStore"

export const getThemeStyles = (theme: string): ThemeStyles => {
  const isDark = theme === "dark"

  return {
    bgClass: isDark ? "bg-gray-800" : "bg-muted",
    cardBgClass: isDark ? "bg-gray-900" : "bg-white",
    cardBorderClass: isDark ? "border-gray-700" : "border-border",
    headerTextClass: isDark ? "text-gray-100" : "text-gray-800",
    primaryTextClass: isDark ? "text-blue-400" : "text-blue-700",
    secondaryTextClass: isDark ? "text-blue-300" : "text-blue-600",
    normalTextClass: isDark ? "text-gray-300" : "text-gray-700",
    mutedTextClass: isDark ? "text-gray-400" : "text-gray-500",
    progressBgClass: isDark ? "bg-gray-700" : "bg-gray-100",
    progressFillClass: isDark ? "bg-blue-600" : "bg-blue-500",
    backButtonClass: isDark
      ? "border-gray-700 hover:bg-gray-800"
      : "border-gray-200 hover:bg-gray-50",
    skipButtonClass: isDark
      ? "text-gray-400 hover:text-gray-300"
      : "text-muted-foreground hover:text-gray-700",
    textareaClass: isDark
      ? "bg-gray-800 border-gray-700 focus:border-blue-500 text-gray-200"
      : "bg-white border-gray-200 focus:border-blue-300 text-gray-700",
    boxBgColors: {
      priority: {
        box: isDark ? "bg-blue-900/30" : "bg-blue-50",
        header: isDark ? "text-blue-300" : "text-blue-800",
        insight: isDark
          ? "bg-blue-900/50 text-blue-200"
          : "bg-blue-100 text-gray-800",
      },
      worry: {
        box: isDark ? "bg-pink-900/30" : "bg-pink-50",
        header: isDark ? "text-pink-300" : "text-pink-800",
        insight: isDark
          ? "bg-pink-900/50 text-pink-200"
          : "bg-pink-100 text-gray-800",
      },
      positive: {
        box: isDark ? "bg-green-900/30" : "bg-green-50",
        header: isDark ? "text-green-300" : "text-green-800",
        insight: isDark
          ? "bg-green-900/50 text-green-200"
          : "bg-green-100 text-gray-800",
      },
    },
  }
}

export const getStepProgress = (currentStep: OnboardingStep): number => {
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
