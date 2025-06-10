"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Trash, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Goal } from "@/lib/services/goalService"

interface GoalItemProps {
  goal: Goal
  onDelete: () => void
  onUpdateProgress: (progress: number) => void
}

export default function GoalItem({
  goal,
  onDelete,
  onUpdateProgress,
}: GoalItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Increment progress by 5%
  const incrementProgress = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newProgress = Math.min(goal.progress + 5, 100)
    onUpdateProgress(newProgress)
  }

  // Decrement progress by 5%
  const decrementProgress = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newProgress = Math.max(goal.progress - 5, 0)
    onUpdateProgress(newProgress)
  }

  return (
    <div
      className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-sm border border-blue-100 dark:border-blue-800/50 relative transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-blue-800 dark:text-blue-100 truncate pr-1 text-xs">
          {goal.name}
        </span>

        <div className="flex items-center space-x-1 shrink-0">
          {/* Date positioned to the left of the trash icon */}
          <span className="text-[10px] text-blue-600 dark:text-blue-300 whitespace-nowrap">
            {format(goal.deadline, "MMM d, yy")}
          </span>

          {/* Delete button in the right corner, only visible on hover */}
          {isHovered && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash className="h-2.5 w-2.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 mb-0.5">
        <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-1.5">
          <div
            className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>

        {/* Progress Controls */}
        <div className="flex space-x-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800/50 hover:bg-blue-200 dark:hover:bg-blue-700/50 p-0 transition-colors"
            onClick={decrementProgress}
            disabled={goal.progress <= 0}
          >
            <ChevronDown className="h-2.5 w-2.5 text-blue-800 dark:text-blue-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800/50 hover:bg-blue-200 dark:hover:bg-blue-700/50 p-0 transition-colors"
            onClick={incrementProgress}
            disabled={goal.progress >= 100}
          >
            <ChevronUp className="h-2.5 w-2.5 text-blue-800 dark:text-blue-100" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-blue-600 dark:text-blue-300">
        <span className="truncate max-w-[70px]">{goal.type}</span>
        <span>{goal.progress}% complete</span>
      </div>
    </div>
  )
}
