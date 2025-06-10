// app/onboarding/_components/JournalTimeSelection.tsx

"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { OptionButton } from "@/components/ui/OptionButton"
import { journalTimeOptions } from "@/data/journalTimeData"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface JournalTimeSelectionProps {
  localSelectedJournalTime: string | null
  setLocalSelectedJournalTime: (time: string) => void
}

export function JournalTimeSelection({
  localSelectedJournalTime,
  setLocalSelectedJournalTime,
}: JournalTimeSelectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  return (
    <motion.div variants={itemVariants}>
      <h2 className={`${styles.primaryTextClass} font-medium mb-4`}>
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
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  )
}
