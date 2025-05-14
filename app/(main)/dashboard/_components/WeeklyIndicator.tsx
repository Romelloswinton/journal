// app/dashboard/_components/WeeklyIndicator.tsx
"use client"

import { DayIndicator } from "./DayIndicator"
import { format, isSameDay } from "date-fns"

interface WeeklyIndicatorProps {
  currentDate: Date
  completedDays: Date[]
}

export function WeeklyIndicator({
  currentDate,
  completedDays,
}: WeeklyIndicatorProps) {
  // Days of the week in order from Sunday to Saturday
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]

  // Get current day of week (0-6, where 0 is Sunday)
  const currentDayIndex = currentDate.getDay()

  return (
    <div className="flex items-center gap-2">
      {daysOfWeek.map((day, index) => (
        <DayIndicator
          key={index}
          day={day}
          isActive={currentDayIndex === index}
          isCompleted={completedDays.some((date) => {
            const dayOfWeek = date.getDay()
            return dayOfWeek === index
          })}
        />
      ))}
    </div>
  )
}
