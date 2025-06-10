// app/onboarding/_components/GoalSelection.tsx

"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { OptionButton } from "@/components/ui/OptionButton"
import journalCategories from "@/data/journalCategories"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface GoalSelectionProps {
  localSelectedGoal: string | null
  setLocalSelectedGoal: (goal: string) => void
}

export function GoalSelection({
  localSelectedGoal,
  setLocalSelectedGoal,
}: GoalSelectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  return (
    <motion.div variants={itemVariants}>
      <p
        className={`text-sm md:text-base ${styles.primaryTextClass} font-medium leading-snug mb-6`}
      >
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
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  )
}
