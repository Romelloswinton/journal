// components/ui/OptionButton.tsx

import { useState } from "react"
import { motion } from "framer-motion"

interface OptionButtonProps {
  label: string
  emoji?: string
  isSelected: boolean
  onClick: () => void
  className?: string
  theme?: string // Add theme prop
}

export function OptionButton({
  label,
  emoji,
  isSelected,
  onClick,
  className = "",
  theme = "light",
}: OptionButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Dark mode & light mode class adjustments
  const baseClasses =
    "w-full px-4 py-3 rounded-lg flex items-center transition-all duration-200"

  // Determine background classes based on theme and selection state
  let bgClasses = ""
  if (theme === "dark") {
    bgClasses = isSelected
      ? "bg-blue-900 border border-blue-500"
      : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
  } else {
    bgClasses = isSelected
      ? "bg-blue-50 border border-blue-300"
      : "bg-white border border-gray-200 hover:bg-gray-50"
  }

  // Determine text classes based on theme and selection state
  const textClasses =
    theme === "dark"
      ? isSelected
        ? "text-blue-300"
        : "text-gray-200"
      : isSelected
      ? "text-blue-700"
      : "text-gray-700"

  return (
    <motion.button
      className={`${baseClasses} ${bgClasses} ${textClasses} ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {emoji && <span className="mr-3 text-xl">{emoji}</span>}
      <span className="text-left">{label}</span>
      {isSelected && (
        <svg
          // components/ui/OptionButton.tsx (continued)
          className={`ml-auto h-5 w-5 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </motion.button>
  )
}
