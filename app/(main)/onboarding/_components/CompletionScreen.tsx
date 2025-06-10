// app/onboarding/_components/CompletionScreen.tsx

"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import useOnboardingStore from "@/app/store/onboardingStore"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

export function CompletionScreen() {
  const router = useRouter()
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  const { selectedJournalTime, firstEntryPriority } = useOnboardingStore()

  const checkCircleBgClass =
    theme === "dark" ? "bg-green-900/30" : "bg-green-50"
  const checkCircleTextClass =
    theme === "dark" ? "text-green-400" : "text-green-500"
  const entryBgClass = theme === "dark" ? "bg-amber-900/20" : "bg-amber-50"
  const entryHeaderClass =
    theme === "dark" ? "text-amber-400" : "text-amber-800"
  const entryTextClass = theme === "dark" ? "text-amber-300" : "text-amber-700"
  const buttonGradientClass =
    theme === "dark"
      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"

  return (
    <motion.div variants={itemVariants} className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className={`w-20 h-20 ${checkCircleBgClass} rounded-full flex items-center justify-center mx-auto mb-6`}
      >
        <CheckCircle className={`w-10 h-10 ${checkCircleTextClass}`} />
      </motion.div>

      <h2 className={`text-2xl font-bold ${styles.headerTextClass} mb-4`}>
        Welcome to Your Journal!
      </h2>

      <p className={`${styles.normalTextClass} mb-6`}>
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
        <div
          className={`${entryBgClass} rounded-lg p-4 mb-6 text-left ${
            theme === "dark" ? "border border-amber-900/30" : ""
          }`}
        >
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">📝</span>
            <span className={`font-medium ${entryHeaderClass}`}>
              Your First Entry
            </span>
          </div>
          <p className={`text-sm ${entryTextClass} italic`}>
            "{firstEntryPriority}"
          </p>
        </div>
      )}

      <Button
        className={`w-full py-6 ${buttonGradientClass} text-white`}
        onClick={() => router.push("/dashboard")}
      >
        <span className="flex items-center justify-center">
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </span>
      </Button>
    </motion.div>
  )
}
