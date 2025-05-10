// components/journal/Calendar.tsx
"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Edit,
  Check,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import useJournalStore from "@/app/store/journalStore"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface JournalEntryDate {
  date: Date
  hasEntry: boolean
  entryId?: string
  entryTitle?: string
  isAIGenerated?: boolean
}

export function JournalCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<JournalEntryDate[]>([])
  const { entries } = useJournalStore()

  useEffect(() => {
    if (entries.length > 0) {
      // Get all days in current month
      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(currentMonth)
      const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
      })

      // Map calendar days with entry information
      const mappedDays = daysInMonth.map((day) => {
        // Find entries for this day
        const dayEntries = entries.filter((entry) => {
          const entryDate = new Date(entry.createdAt)
          return isSameDay(entryDate, day)
        })

        // Use the first entry found for this day (if any)
        const entry = dayEntries.length > 0 ? dayEntries[0] : null

        return {
          date: day,
          hasEntry: !!entry,
          entryId: entry?.id,
          entryTitle: entry?.title,
          isAIGenerated: entry?.isAIGenerated,
        }
      })

      setCalendarDays(mappedDays)
    } else {
      // If no entries, just generate empty calendar
      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(currentMonth)
      const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
      })

      setCalendarDays(
        daysInMonth.map((day) => ({
          date: day,
          hasEntry: false,
        }))
      )
    }
  }, [currentMonth, entries])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Get day names for header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Calculate entries for current month (for stats)
  const entriesThisMonth = entries.filter((entry) => {
    const entryDate = new Date(entry.createdAt)
    return isSameMonth(entryDate, currentMonth)
  })

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          <h2 className="text-lg font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevMonth}
            className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
            className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Stats */}
      <div className="flex items-center mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-lg">
        <div className="flex-1 text-center">
          <span className="block text-lg font-semibold text-amber-800 dark:text-amber-400">
            {entriesThisMonth.length}
          </span>
          <span className="text-sm text-muted-foreground">
            Entries this month
          </span>
        </div>
        <div className="flex-1 text-center border-l border-amber-200 dark:border-amber-800/50">
          <span className="block text-lg font-semibold text-amber-800 dark:text-amber-400">
            {Math.round((entriesThisMonth.length / calendarDays.length) * 100)}%
          </span>
          <span className="text-sm text-muted-foreground">Days journaled</span>
        </div>
        <div className="flex-1 text-center border-l border-amber-200 dark:border-amber-800/50">
          <span className="block text-lg font-semibold text-amber-800 dark:text-amber-400">
            {entriesThisMonth.filter((entry) => entry.isAIGenerated).length}
          </span>
          <span className="text-sm text-muted-foreground">AI-generated</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="shadow-md border-amber-100 dark:border-amber-800/50">
        <CardContent className="p-4">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center py-2 font-medium text-sm text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayNumber = format(day.date, "d")
              const isCurrentMonth = isSameMonth(day.date, currentMonth)
              const isTodayDate = isToday(day.date)

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        {day.hasEntry ? (
                          <Link href={`/journal/${day.entryId}`}>
                            <div
                              className={`
                                relative h-16 md:h-24 rounded-md p-1 flex flex-col items-center justify-center cursor-pointer
                                ${
                                  isCurrentMonth
                                    ? day.isAIGenerated
                                      ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-200 dark:hover:bg-purple-800/50"
                                      : "bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-200 dark:hover:bg-amber-800/50"
                                    : "bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/60 opacity-50"
                                }
                                ${
                                  isTodayDate
                                    ? "ring-2 ring-amber-500 dark:ring-amber-400"
                                    : ""
                                }
                              `}
                            >
                              <span
                                className={`
                                  text-sm font-medium
                                  ${
                                    day.isAIGenerated
                                      ? "text-purple-700 dark:text-purple-300"
                                      : "text-amber-700 dark:text-amber-300"
                                  }
                                `}
                              >
                                {dayNumber}
                              </span>
                              <Check className="h-4 w-4 mt-1 text-green-500 dark:text-green-400" />
                              {day.isAIGenerated && (
                                <Sparkles className="h-3 w-3 absolute top-1 right-1 text-purple-500 dark:text-purple-400" />
                              )}
                            </div>
                          </Link>
                        ) : (
                          <div
                            className={`
                              h-16 md:h-24 rounded-md p-1 flex items-center justify-center
                              ${
                                isCurrentMonth
                                  ? "bg-card border border-border hover:bg-accent cursor-pointer"
                                  : "bg-gray-50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800/20 text-gray-400 dark:text-gray-500"
                              }
                              ${
                                isTodayDate
                                  ? "ring-2 ring-amber-500 dark:ring-amber-400"
                                  : ""
                              }
                            `}
                            onClick={() => {
                              if (isCurrentMonth) {
                                const formattedDate = format(
                                  day.date,
                                  "yyyy-MM-dd"
                                )
                                window.location.href = `/journal/new?date=${formattedDate}`
                              }
                            }}
                          >
                            <span className="text-sm">{dayNumber}</span>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    {day.hasEntry && (
                      <TooltipContent side="top" align="center">
                        <div className="text-sm">
                          <p className="font-medium">{day.entryTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(day.date, "MMMM d, yyyy")}
                            {day.isAIGenerated && (
                              <span className="flex items-center mt-1 text-purple-600 dark:text-purple-400">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI Generated
                              </span>
                            )}
                          </p>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
