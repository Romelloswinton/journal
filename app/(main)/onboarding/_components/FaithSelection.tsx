// app/onboarding/_components/FaithSelection.tsx

"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { OptionButton } from "@/components/ui/OptionButton"
import { faithOptions } from "@/data/faithData"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface FaithSelectionProps {
  localSelectedFaith: string | null
  setLocalSelectedFaith: (faith: string) => void
}

export function FaithSelection({
  localSelectedFaith,
  setLocalSelectedFaith,
}: FaithSelectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  return (
    <motion.div variants={itemVariants}>
      <h2 className={`${styles.primaryTextClass} font-medium mb-4`}>
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
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  )
}
