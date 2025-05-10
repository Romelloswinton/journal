"use client"

import { useState } from "react"
import { Book, Dumbbell, Home, Music, Smile, Users, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

interface IngredientModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (ingredient: {
    name: string
    category: string
    frequency: string
    importance: string
  }) => void
}

export function IngredientModal({
  isOpen,
  onOpenChange,
  onSubmit,
}: IngredientModalProps) {
  // Form states
  const [ingredientName, setIngredientName] = useState("")
  const [ingredientCategory, setIngredientCategory] = useState("")
  const [ingredientFrequency, setIngredientFrequency] = useState("daily")
  const [ingredientImportance, setIngredientImportance] = useState("medium")

  // Reset form states when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when modal closes
      setIngredientName("")
      setIngredientCategory("")
      setIngredientFrequency("daily")
      setIngredientImportance("medium")
    }
    onOpenChange(open)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      name: ingredientName,
      category: ingredientCategory,
      frequency: ingredientFrequency,
      importance: ingredientImportance,
    })

    // Close modal
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>Add to Your Happiness Recipe</DialogTitle>
          <DialogDescription>
            What small habits bring joy and meaning to your life?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ingredientName" className="text-sm font-medium">
              Happiness ingredient
            </Label>
            <Input
              id="ingredientName"
              placeholder="e.g., Morning meditation, Reading, Time with friends"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="ingredientCategory" className="text-sm font-medium">
              Category
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                type="button"
                variant={
                  ingredientCategory === "mindfulness" ? "default" : "outline"
                }
                className={`justify-start ${
                  ingredientCategory === "mindfulness"
                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200 hover:text-amber-900 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900 dark:hover:text-amber-200"
                    : ""
                }`}
                onClick={() => setIngredientCategory("mindfulness")}
              >
                <Smile className="w-4 h-4 mr-2" /> Mindfulness
              </Button>
              <Button
                type="button"
                variant={
                  ingredientCategory === "learning" ? "default" : "outline"
                }
                className={`justify-start ${
                  ingredientCategory === "learning"
                    ? "bg-blue-100 text-blue-900 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 dark:hover:text-blue-200"
                    : ""
                }`}
                onClick={() => setIngredientCategory("learning")}
              >
                <Book className="w-4 h-4 mr-2" /> Learning
              </Button>
              <Button
                type="button"
                variant={
                  ingredientCategory === "exercise" ? "default" : "outline"
                }
                className={`justify-start ${
                  ingredientCategory === "exercise"
                    ? "bg-green-100 text-green-900 hover:bg-green-200 hover:text-green-900 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900 dark:hover:text-green-200"
                    : ""
                }`}
                onClick={() => setIngredientCategory("exercise")}
              >
                <Dumbbell className="w-4 h-4 mr-2" /> Exercise
              </Button>
              <Button
                type="button"
                variant={
                  ingredientCategory === "connection" ? "default" : "outline"
                }
                className={`justify-start ${
                  ingredientCategory === "connection"
                    ? "bg-pink-100 text-pink-900 hover:bg-pink-200 hover:text-pink-900 dark:bg-pink-950 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200"
                    : ""
                }`}
                onClick={() => setIngredientCategory("connection")}
              >
                <Users className="w-4 h-4 mr-2" /> Connection
              </Button>
              <Button
                type="button"
                variant={
                  ingredientCategory === "creativity" ? "default" : "outline"
                }
                className={`justify-start ${
                  ingredientCategory === "creativity"
                    ? "bg-purple-100 text-purple-900 hover:bg-purple-200 hover:text-purple-900 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900 dark:hover:text-purple-200"
                    : ""
                }`}
                onClick={() => setIngredientCategory("creativity")}
              >
                <Music className="w-4 h-4 mr-2" /> Creativity
              </Button>
              <Button
                type="button"
                variant={ingredientCategory === "rest" ? "default" : "outline"}
                className={`justify-start ${
                  ingredientCategory === "rest"
                    ? "bg-indigo-100 text-indigo-900 hover:bg-indigo-200 hover:text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 dark:hover:text-indigo-200"
                    : ""
                }`}
                onClick={() => setIngredientCategory("rest")}
              >
                <Home className="w-4 h-4 mr-2" /> Rest
              </Button>
            </div>
          </div>

          <div>
            <Label
              htmlFor="ingredientFrequency"
              className="text-sm font-medium"
            >
              How often?
            </Label>
            <RadioGroup
              value={ingredientFrequency}
              onValueChange={setIngredientFrequency}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label
              htmlFor="ingredientImportance"
              className="text-sm font-medium"
            >
              How important is this to your happiness?
            </Label>
            <RadioGroup
              value={ingredientImportance}
              onValueChange={setIngredientImportance}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded-md bg-amber-50 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900">
                <RadioGroupItem value="high" id="high" />
                <Label
                  htmlFor="high"
                  className="font-medium text-amber-800 dark:text-amber-300"
                >
                  Essential
                </Label>
                <span className="text-xs text-amber-600 dark:text-amber-400 ml-1">
                  (Brings significant joy)
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-50 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900">
                <RadioGroupItem value="medium" id="medium" />
                <Label
                  htmlFor="medium"
                  className="font-medium text-blue-800 dark:text-blue-300"
                >
                  Important
                </Label>
                <span className="text-xs text-blue-600 dark:text-blue-400 ml-1">
                  (Makes my days better)
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md bg-green-50 border border-green-100 dark:bg-green-950/30 dark:border-green-900">
                <RadioGroupItem value="low" id="low" />
                <Label
                  htmlFor="low"
                  className="font-medium text-green-800 dark:text-green-300"
                >
                  Nice to have
                </Label>
                <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                  (Adds a little extra)
                </span>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="flex gap-4 mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 dark:from-rose-500 dark:to-pink-600 dark:hover:from-rose-600 dark:hover:to-pink-700"
            >
              <Zap className="w-4 h-4 mr-2" /> Add to Recipe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
