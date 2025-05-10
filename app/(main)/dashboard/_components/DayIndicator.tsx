// components/dashboard/DayIndicator.tsx
import { Check } from "lucide-react"

interface DayIndicatorProps {
  day: string
  isActive: boolean
  isCompleted?: boolean
}

export function DayIndicator({
  day,
  isActive,
  isCompleted = false,
}: DayIndicatorProps) {
  return (
    <div
      className={`w-8 h-8 rounded-full border flex items-center justify-center relative ${
        isActive
          ? "border-pink-500 ring-2 ring-pink-200 dark:ring-pink-900"
          : isCompleted
          ? "border-green-400 dark:border-green-600"
          : "border-border"
      }`}
    >
      <span
        className={`text-sm ${
          isActive
            ? "text-pink-600 dark:text-pink-400 font-medium"
            : isCompleted
            ? "text-green-600 dark:text-green-400"
            : "text-muted-foreground"
        }`}
      >
        {day}
      </span>
      {isCompleted && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  )
}
