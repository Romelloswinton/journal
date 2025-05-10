"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  SunMoon,
  Zap,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface JournalMetricsProps {
  metrics: {
    mood: number
    energy: number
    clarity: number
  }
}

export function JournalMetrics({ metrics }: JournalMetricsProps) {
  const [expanded, setExpanded] = useState(true)

  // Get descriptors based on metric values
  const getMoodDescriptor = (value: number) => {
    if (value <= 3) return "Low"
    if (value <= 7) return "Moderate"
    return "High"
  }

  const getEnergyDescriptor = (value: number) => {
    if (value <= 3) return "Depleted"
    if (value <= 7) return "Steady"
    return "Energized"
  }

  const getClarityDescriptor = (value: number) => {
    if (value <= 3) return "Foggy"
    if (value <= 7) return "Aware"
    return "Crystal clear"
  }

  // Get color based on metric values
  const getMoodColor = (value: number) => {
    if (value <= 3) return "text-blue-500 dark:text-blue-400"
    if (value <= 7) return "text-amber-500 dark:text-amber-400"
    return "text-green-500 dark:text-green-400"
  }

  const getEnergyColor = (value: number) => {
    if (value <= 3) return "text-gray-500 dark:text-gray-400"
    if (value <= 7) return "text-amber-500 dark:text-amber-400"
    return "text-red-500 dark:text-red-400"
  }

  const getClarityColor = (value: number) => {
    if (value <= 3) return "text-gray-500 dark:text-gray-400"
    if (value <= 7) return "text-amber-500 dark:text-amber-400"
    return "text-indigo-500 dark:text-indigo-400"
  }

  return (
    <Card className="shadow-sm border-amber-100 dark:border-amber-800/50">
      <CardHeader
        className="pb-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="text-md flex items-center justify-between text-amber-800 dark:text-amber-400">
          <div className="flex items-center">
            <BarChart className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400" />
            Metrics
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-2">
          <div className="space-y-6">
            {/* Mood Metric */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SunMoon
                    className={cn("h-4 w-4 mr-2", getMoodColor(metrics.mood))}
                  />
                  <span className="text-sm font-medium">Mood</span>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    getMoodColor(metrics.mood)
                  )}
                >
                  {getMoodDescriptor(metrics.mood)}
                </span>
              </div>

              <div className="relative pt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.mood * 10}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "h-2 rounded-full",
                    metrics.mood <= 3
                      ? "bg-blue-500 dark:bg-blue-600"
                      : metrics.mood <= 7
                      ? "bg-amber-500 dark:bg-amber-600"
                      : "bg-green-500 dark:bg-green-600"
                  )}
                />
                <div className="absolute inset-0 h-2 rounded-full bg-gray-200 dark:bg-gray-700 -z-10" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* Energy Metric */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap
                    className={cn(
                      "h-4 w-4 mr-2",
                      getEnergyColor(metrics.energy)
                    )}
                  />
                  <span className="text-sm font-medium">Energy</span>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    getEnergyColor(metrics.energy)
                  )}
                >
                  {getEnergyDescriptor(metrics.energy)}
                </span>
              </div>

              <div className="relative pt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.energy * 10}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "h-2 rounded-full",
                    metrics.energy <= 3
                      ? "bg-gray-500 dark:bg-gray-600"
                      : metrics.energy <= 7
                      ? "bg-amber-500 dark:bg-amber-600"
                      : "bg-red-500 dark:bg-red-600"
                  )}
                />
                <div className="absolute inset-0 h-2 rounded-full bg-gray-200 dark:bg-gray-700 -z-10" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Depleted</span>
                  <span>Energized</span>
                </div>
              </div>
            </div>

            {/* Clarity Metric */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lightbulb
                    className={cn(
                      "h-4 w-4 mr-2",
                      getClarityColor(metrics.clarity)
                    )}
                  />
                  <span className="text-sm font-medium">Clarity</span>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    getClarityColor(metrics.clarity)
                  )}
                >
                  {getClarityDescriptor(metrics.clarity)}
                </span>
              </div>

              <div className="relative pt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.clarity * 10}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "h-2 rounded-full",
                    metrics.clarity <= 3
                      ? "bg-gray-500 dark:bg-gray-600"
                      : metrics.clarity <= 7
                      ? "bg-amber-500 dark:bg-amber-600"
                      : "bg-indigo-500 dark:bg-indigo-600"
                  )}
                />
                <div className="absolute inset-0 h-2 rounded-full bg-gray-200 dark:bg-gray-700 -z-10" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Foggy</span>
                  <span>Crystal clear</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
