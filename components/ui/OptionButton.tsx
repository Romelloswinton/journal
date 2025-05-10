// components/ui/OptionButton.tsx
"use client"

import { motion } from "framer-motion"

interface OptionButtonProps {
  label: string
  emoji?: string
  isSelected: boolean
  onClick: () => void
  className?: string
}

export function OptionButton({
  label,
  emoji,
  isSelected,
  onClick,
  className = "",
}: OptionButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <button
        className={`w-full py-2 rounded-lg text-sm border hover:bg-muted/40 transition mb-2 justify-start flex items-center px-4 ${
          isSelected
            ? "bg-blue-50 border-blue-300 text-blue-700"
            : "border-gray-200"
        } ${className}`}
        onClick={onClick}
      >
        {emoji && <span className="mr-2">{emoji}</span>}
        {label}

        {/* Checkmark for selected option */}
        {isSelected && (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-auto h-4 w-4 text-blue-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
      </button>
    </motion.div>
  )
}
