// app/onboarding/_components/StruggleSelection.tsx

"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { OptionButton } from "@/components/ui/OptionButton"
import { struggleOptions } from "@/data/strugglesData"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface StruggleSelectionProps {
  localSelectedStruggle: string | null
  setLocalSelectedStruggle: (struggle: string) => void
}

export function StruggleSelection({
  localSelectedStruggle,
  setLocalSelectedStruggle,
}: StruggleSelectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  return (
    <motion.div variants={itemVariants}>
      <h2 className={`${styles.primaryTextClass} font-medium mb-4`}>
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
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  )
}
