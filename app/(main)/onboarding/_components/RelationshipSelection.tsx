// app/onboarding/_components/RelationshipSelection.tsx

"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { OptionButton } from "@/components/ui/OptionButton"
import { relationshipOptions } from "@/data/relationshipData"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface RelationshipSelectionProps {
  localSelectedRelationship: string | null
  setLocalSelectedRelationship: (relationship: string) => void
}

export function RelationshipSelection({
  localSelectedRelationship,
  setLocalSelectedRelationship,
}: RelationshipSelectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  return (
    <motion.div variants={itemVariants}>
      <h2 className={`${styles.primaryTextClass} font-medium mb-4`}>
        What's your relationship status?
      </h2>

      <div className="space-y-2">
        {relationshipOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            emoji={option.emoji}
            isSelected={localSelectedRelationship === option.value}
            onClick={() => setLocalSelectedRelationship(option.value)}
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  )
}
