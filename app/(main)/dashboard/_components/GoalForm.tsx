"use client"

import { useState } from "react"
import { Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addDays } from "date-fns"
import { CreateGoalInput } from "@/lib/services/goalService"

interface GoalFormProps {
  onCancel: () => void
  onSubmit: (goal: CreateGoalInput) => void
}

export default function GoalForm({ onCancel, onSubmit }: GoalFormProps) {
  const [goalName, setGoalName] = useState("")
  const [goalType, setGoalType] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [deadlineMonths, setDeadlineMonths] = useState("1") // Default to 1 month
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!goalName || !goalType) return

    setIsSubmitting(true)

    // Calculate deadline date
    const deadline = addDays(new Date(), parseInt(deadlineMonths) * 30)

    onSubmit({
      name: goalName,
      type: goalType,
      description: goalDescription || undefined,
      deadline: deadline,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="goalName" className="text-sm font-medium">
            What's your goal?
          </Label>
          <Input
            id="goalName"
            placeholder="e.g., Run a marathon, Learn French"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="goalType" className="text-sm font-medium">
            Type of goal
          </Label>
          <Select value={goalType} onValueChange={setGoalType} required>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="career">Career</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="relationship">Relationship</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="deadlineMonths" className="text-sm font-medium">
            Target timeframe
          </Label>
          <Select
            value={deadlineMonths}
            onValueChange={setDeadlineMonths}
            required
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">In 1 month</SelectItem>
              <SelectItem value="3">In 3 months</SelectItem>
              <SelectItem value="6">In 6 months</SelectItem>
              <SelectItem value="12">In 1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="goalDescription" className="text-sm font-medium">
            Why is this goal important to you?
          </Label>
          <Textarea
            id="goalDescription"
            placeholder="Describe why this goal matters and what achieving it will mean to you"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!goalName || !goalType || isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 dark:from-blue-700 dark:to-blue-900 dark:hover:from-blue-800 dark:hover:to-blue-950"
        >
          <Target className="w-4 h-4 mr-2" /> Save Goal
        </Button>
      </div>
    </form>
  )
}
