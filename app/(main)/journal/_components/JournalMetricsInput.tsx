"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SunMoon, Zap, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface JournalMetricsInputProps {
  metrics: {
    mood: number
    energy: number
    clarity: number
  }
  onChange: (metrics: { mood: number; energy: number; clarity: number }) => void
}

export function JournalMetricsInput({
  metrics,
  onChange,
}: JournalMetricsInputProps) {
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

  // Handle slider changes
  const handleMoodChange = (value: number[]) => {
    onChange({
      ...metrics,
      mood: value[0],
    })
  }

  const handleEnergyChange = (value: number[]) => {
    onChange({
      ...metrics,
      energy: value[0],
    })
  }

  const handleClarityChange = (value: number[]) => {
    onChange({
      ...metrics,
      clarity: value[0],
    })
  }

  return (
    <Card className="shadow-sm border-amber-100 dark:border-amber-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center text-amber-800 dark:text-amber-400">
          <Zap className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400" />
          Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Mood Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="mood-slider"
                className="flex items-center text-sm font-medium"
              >
                <SunMoon
                  className={cn("h-4 w-4 mr-2", getMoodColor(metrics.mood))}
                />
                Mood
              </Label>
              <span
                className={cn(
                  "text-sm font-medium",
                  getMoodColor(metrics.mood)
                )}
              >
                {getMoodDescriptor(metrics.mood)}
              </span>
            </div>
            <Slider
              id="mood-slider"
              min={1}
              max={10}
              step={1}
              value={[metrics.mood]}
              onValueChange={(value) => handleMoodChange(value)}
              className={cn(
                metrics.mood <= 3
                  ? "bg-blue-500 dark:bg-blue-600"
                  : metrics.mood <= 7
                  ? "bg-amber-500 dark:bg-amber-600"
                  : "bg-green-500 dark:bg-green-600"
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="energy-slider"
                className="flex items-center text-sm font-medium"
              >
                <Zap
                  className={cn("h-4 w-4 mr-2", getEnergyColor(metrics.energy))}
                />
                Energy
              </Label>
              <span
                className={cn(
                  "text-sm font-medium",
                  getEnergyColor(metrics.energy)
                )}
              >
                {getEnergyDescriptor(metrics.energy)}
              </span>
            </div>
            <Slider
              id="energy-slider"
              min={1}
              max={10}
              step={1}
              value={[metrics.energy]}
              onValueChange={(value) => handleEnergyChange(value)}
              className={cn(
                metrics.energy <= 3
                  ? "bg-gray-500 dark:bg-gray-600"
                  : metrics.energy <= 7
                  ? "bg-amber-500 dark:bg-amber-600"
                  : "bg-red-500 dark:bg-red-600"
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Depleted</span>
              <span>Energized</span>
            </div>
          </div>

          {/* Clarity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="clarity-slider"
                className="flex items-center text-sm font-medium"
              >
                <Lightbulb
                  className={cn(
                    "h-4 w-4 mr-2",
                    getClarityColor(metrics.clarity)
                  )}
                />
                Clarity
              </Label>
              <span
                className={cn(
                  "text-sm font-medium",
                  getClarityColor(metrics.clarity)
                )}
              >
                {getClarityDescriptor(metrics.clarity)}
              </span>
            </div>
            <Slider
              id="clarity-slider"
              min={1}
              max={10}
              step={1}
              value={[metrics.clarity]}
              onValueChange={(value) => handleClarityChange(value)}
              className={cn(
                metrics.clarity <= 3
                  ? "bg-gray-500 dark:bg-gray-600"
                  : metrics.clarity <= 7
                  ? "bg-amber-500 dark:bg-amber-600"
                  : "bg-indigo-500 dark:bg-indigo-600"
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Foggy</span>
              <span>Crystal clear</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
