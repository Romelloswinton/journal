"use client"

import { useState } from "react"
import { Check, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type HappinessIngredient } from "@/lib/services/ingredientService"

interface IngredientItemProps {
  ingredient: HappinessIngredient
  onToggleComplete: () => void
  onDelete: () => void
}

export default function IngredientItem({
  ingredient,
  onToggleComplete,
  onDelete,
}: IngredientItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get icon color based on completion status
  const getCheckColor = () => {
    return ingredient.isCompleted ? "text-green-500" : "text-muted-foreground"
  }

  return (
    <div
      className={`flex items-center p-2 rounded-sm border transition-colors ${
        ingredient.isCompleted
          ? "bg-green-50/50 dark:bg-green-950/50 border-green-100 dark:border-green-900"
          : "bg-muted border-border"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span
            className={`font-medium text-xs ${
              ingredient.isCompleted
                ? "text-green-700 dark:text-green-400 line-through opacity-70"
                : "text-foreground"
            } truncate max-w-full`}
          >
            {ingredient.name}
          </span>
          {ingredient.importance === "high" && (
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-1 py-0 rounded inline-flex items-center">
              Essential
            </span>
          )}
        </div>
        <div className="text-[10px] text-muted-foreground flex items-center flex-wrap mt-0.5">
          <span className="truncate max-w-[80px]">{ingredient.category}</span>
          <span className="mx-1">•</span>
          <span className="truncate max-w-[80px]">{ingredient.frequency}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center ml-1 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={onToggleComplete}
        >
          <Check className={`h-3 w-3 ${getCheckColor()}`} />
        </Button>

        {/* Delete button - only visible on hover */}
        {isHovered && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
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
  )
}
