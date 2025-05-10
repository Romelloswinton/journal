// Service for handling Goal operations
import { addDays } from "date-fns"

// Type definitions
export interface Goal {
  id: string
  name: string
  type: string
  description?: string
  deadline: Date
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateGoalInput {
  name: string
  type: string
  description?: string
  deadline: Date
}

export interface UpdateGoalInput {
  name?: string
  type?: string
  description?: string
  deadline?: Date
  progress?: number
}

// Functions for fetching goals
export async function fetchGoals(): Promise<Goal[]> {
  try {
    const response = await fetch("/api/goals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    // Ensure dates are properly parsed
    return data.map((goal: any) => ({
      ...goal,
      deadline: new Date(goal.deadline),
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt),
    }))
  } catch (error) {
    console.error("Failed to fetch goals:", error)
    return []
  }
}

// Function for creating a new goal
export async function createGoal(
  goalData: CreateGoalInput
): Promise<Goal | null> {
  try {
    const response = await fetch("/api/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goalData),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    // Ensure dates are properly parsed
    return {
      ...data,
      deadline: new Date(data.deadline),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  } catch (error) {
    console.error("Failed to create goal:", error)
    return null
  }
}

// Function for updating a goal
export async function updateGoal(
  id: string,
  goalData: UpdateGoalInput
): Promise<Goal | null> {
  try {
    const response = await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goalData),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    // Ensure dates are properly parsed
    return {
      ...data,
      deadline: new Date(data.deadline),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  } catch (error) {
    console.error(`Failed to update goal ${id}:`, error)
    return null
  }
}

// Function for deleting a goal
export async function deleteGoal(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/goals/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error(`Failed to delete goal ${id}:`, error)
    return false
  }
}
