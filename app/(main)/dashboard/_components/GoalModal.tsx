"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

interface GoalModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (goal: {
    name: string
    type: string
    description: string
    deadline?: Date
  }) => void
}

export function GoalModal({ isOpen, onOpenChange, onSubmit }: GoalModalProps) {
  // Form states
  const [goalName, setGoalName] = useState("")
  const [goalType, setGoalType] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [goalDeadline, setGoalDeadline] = useState<Date>()

  // Reset form states when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when modal closes
      setGoalName("")
      setGoalType("")
      setGoalDescription("")
      setGoalDeadline(undefined)
    }
    onOpenChange(open)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      name: goalName,
      type: goalType,
      description: goalDescription,
      deadline: goalDeadline,
    })

    // Close modal
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Set a New Goal
          </DialogTitle>
          <DialogDescription className="text-blue-100 mt-2">
            Define something meaningful you want to achieve
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              <Label htmlFor="goalDeadline" className="text-sm font-medium">
                Target date
              </Label>
              <div className="mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !goalDeadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {goalDeadline ? (
                        format(goalDeadline, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover">
                    <Calendar
                      mode="single"
                      selected={goalDeadline}
                      onSelect={setGoalDeadline}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="border-border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
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

          <DialogFooter className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 dark:from-blue-700 dark:to-blue-900 dark:hover:from-blue-800 dark:hover:to-blue-950"
            >
              <Target className="w-4 h-4 mr-2" /> Save Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
