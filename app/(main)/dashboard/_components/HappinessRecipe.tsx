// app/dashboard/_components/HappinessRecipe.tsx
"use client"

import { useState, useEffect } from "react"
import { Plus, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import GoalItem from "./GoalItem"
import IngredientItem from "./IngredientItem"
import GoalForm from "./GoalForm"
import IngredientForm from "./IngredientForm"

import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  type Goal,
  type CreateGoalData, // Add this missing import
} from "@/lib/services/goalService"

import {
  fetchIngredients,
  createIngredient,
  updateIngredient,
  toggleIngredientCompletion,
  deleteIngredient,
  type HappinessIngredient,
  type CreateIngredientInput,
} from "@/lib/services/ingredientService"

export default function HappinessRecipe() {
  const { isSignedIn, isLoaded } = useAuth()

  // Modal states
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false)

  // Data states
  const [goals, setGoals] = useState<Goal[]>([])
  const [ingredients, setIngredients] = useState<HappinessIngredient[]>([])

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch data on component mount and when auth changes
  useEffect(() => {
    async function loadData() {
      if (!isLoaded) return // Wait for auth to load

      if (!isSignedIn) {
        setGoals([])
        setIngredients([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Fetch goals and ingredients in parallel
        const [goalsData, ingredientsData] = await Promise.all([
          fetchGoals(),
          fetchIngredients(),
        ])

        setGoals(goalsData)
        setIngredients(ingredientsData)
      } catch (err) {
        console.error("Error loading happiness recipe data:", err)
        setError("Failed to load your happiness recipe data")
        // Set empty arrays on error to prevent crashes
        setGoals([])
        setIngredients([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isSignedIn, isLoaded])

  // Handle form submissions
  const handleGoalSubmit = async (goalData: CreateGoalData) => {
    try {
      const newGoal = await createGoal(goalData)

      if (newGoal) {
        setGoals((prev) => [newGoal, ...prev])
      }
    } catch (err) {
      console.error("Error creating goal:", err)
      setError("Failed to create goal. Please try again.")
    }

    // Close the modal
    setIsAddGoalOpen(false)
  }

  const handleIngredientSubmit = async (
    ingredientData: CreateIngredientInput
  ) => {
    try {
      const newIngredient = await createIngredient(ingredientData)

      if (newIngredient) {
        setIngredients((prev) => [newIngredient, ...prev])
      }
    } catch (err) {
      console.error("Error creating ingredient:", err)
      setError("Failed to create ingredient. Please try again.")
    }

    // Close the modal
    setIsAddIngredientOpen(false)
  }

  // Handle ingredient completion toggle
  const handleToggleIngredient = async (id: string, isCompleted: boolean) => {
    try {
      // Optimistic update
      setIngredients((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isCompleted: !isCompleted } : item
        )
      )

      // Send update to server
      await toggleIngredientCompletion(id, isCompleted)
    } catch (err) {
      console.error(`Error toggling ingredient ${id}:`, err)

      // Revert on error
      setIngredients((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isCompleted } : item))
      )
    }
  }

  // Handle goal deletion
  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return

    try {
      // Optimistic update
      setGoals((prev) => prev.filter((goal) => goal.id !== id))

      // Send delete to server
      await deleteGoal(id)
    } catch (err) {
      console.error(`Error deleting goal ${id}:`, err)

      // Refresh data on error
      const refreshedGoals = await fetchGoals()
      setGoals(refreshedGoals)
    }
  }

  // Handle ingredient deletion
  const handleDeleteIngredient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ingredient?")) return

    try {
      // Optimistic update
      setIngredients((prev) =>
        prev.filter((ingredient) => ingredient.id !== id)
      )

      // Send delete to server
      await deleteIngredient(id)
    } catch (err) {
      console.error(`Error deleting ingredient ${id}:`, err)

      // Refresh data on error
      const refreshedIngredients = await fetchIngredients()
      setIngredients(refreshedIngredients)
    }
  }

  // Handle goal progress update
  const handleUpdateGoalProgress = async (id: string, progress: number) => {
    try {
      // Optimistic update
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? { ...goal, progress } : goal))
      )

      // Send update to server
      await updateGoal(id, { progress })
    } catch (err) {
      console.error(`Error updating goal progress ${id}:`, err)

      // Refresh data on error
      const refreshedGoals = await fetchGoals()
      setGoals(refreshedGoals)
    }
  }

  // Retry function for error state
  const handleRetry = async () => {
    if (!isSignedIn) return

    setIsLoading(true)
    setError(null)

    try {
      const [goalsData, ingredientsData] = await Promise.all([
        fetchGoals(),
        fetchIngredients(),
      ])
      setGoals(goalsData)
      setIngredients(ingredientsData)
    } catch (err) {
      console.error("Error refreshing data:", err)
      setError("Failed to refresh data")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state
  if (!isLoaded || isLoading) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-card-foreground">
              Happiness Recipe
            </h4>
            <Heart className="h-4 w-4 text-pink-500" />
          </div>
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show sign-in prompt for non-authenticated users
  if (!isSignedIn) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-card-foreground">
              Happiness Recipe
            </h4>
            <Heart className="h-4 w-4 text-pink-500" />
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Sign in to create your personal happiness recipe with goals and
            daily habits
          </p>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Create an account to start building your happiness recipe
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-card-foreground">
            Happiness Recipe
          </h4>
          <Heart className="h-4 w-4 text-pink-500" />
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Track your goals and daily ingredients for happiness
        </p>

        {/* Fixed height container with scrolling */}
        <div className="h-[300px]">
          {error ? (
            <div className="text-center py-6 h-full flex flex-col justify-center">
              <p className="text-destructive text-sm mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          ) : ingredients.length > 0 || goals.length > 0 ? (
            <div className="space-y-4 h-full overflow-y-auto pr-2">
              {/* Ingredients List */}
              {ingredients.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-card-foreground mb-2 sticky top-0 bg-card z-10 pb-1">
                    Daily Ingredients
                  </h5>
                  <div className="space-y-1.5">
                    {ingredients.map((ingredient) => (
                      <IngredientItem
                        key={ingredient.id}
                        ingredient={ingredient}
                        onToggleComplete={() =>
                          handleToggleIngredient(
                            ingredient.id,
                            ingredient.isCompleted
                          )
                        }
                        onDelete={() => handleDeleteIngredient(ingredient.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Goals List */}
              {goals.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-card-foreground mb-2 sticky top-0 bg-card z-10 pb-1">
                    Goals
                  </h5>
                  <div className="space-y-1.5">
                    {goals.map((goal) => (
                      <GoalItem
                        key={goal.id}
                        goal={goal}
                        onDelete={() => handleDeleteGoal(goal.id)}
                        onUpdateProgress={(progress) =>
                          handleUpdateGoalProgress(goal.id, progress)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Add More Section - fixed at bottom */}
              <div className="sticky bottom-0 pt-2 pb-1 bg-card border-t border-border">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 h-8 text-xs"
                    onClick={() => setIsAddIngredientOpen(true)}
                  >
                    <Plus className="w-3 h-3" /> Add ingredient
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 h-8 text-xs"
                    onClick={() => setIsAddGoalOpen(true)}
                  >
                    <Plus className="w-3 h-3" /> Add goal
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center h-full text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4 text-sm">
                Let's add the ingredients to your happiness — habits or goals
                that matter to you.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 h-8"
                  onClick={() => setIsAddIngredientOpen(true)}
                >
                  <Plus className="w-3 h-3" /> Add ingredient
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 h-8"
                  onClick={() => setIsAddGoalOpen(true)}
                >
                  <Plus className="w-3 h-3" /> Add goal
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Goal Modal */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Set a New Goal
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-2">
              Define something meaningful you want to achieve
            </DialogDescription>
          </div>

          <div className="p-6">
            <GoalForm
              onCancel={() => setIsAddGoalOpen(false)}
              onSubmit={handleGoalSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Ingredient Modal */}
      <Dialog open={isAddIngredientOpen} onOpenChange={setIsAddIngredientOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add to Your Happiness Recipe</DialogTitle>
            <DialogDescription>
              What small habits bring joy and meaning to your life?
            </DialogDescription>
          </DialogHeader>

          <IngredientForm
            onCancel={() => setIsAddIngredientOpen(false)}
            onSubmit={handleIngredientSubmit}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
