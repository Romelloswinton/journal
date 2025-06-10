// lib/services/goalService.ts

export interface Goal {
  id: string
  name: string
  type: string
  description?: string
  deadline: string
  progress: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateGoalData {
  name: string
  type: string
  description?: string
  deadline: string
}

export interface UpdateGoalData {
  name?: string
  type?: string
  description?: string
  deadline?: string
  progress?: number
}

// Fetch all goals for the current user
export async function fetchGoals(): Promise<Goal[]> {
  try {
    const response = await fetch("/api/goals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Handle different status codes appropriately
      if (response.status === 404) {
        // User not found or no goals - return empty array instead of throwing
        console.warn("No goals found for user, returning empty array")
        return []
      }
      if (response.status === 401) {
        // Unauthorized - user not signed in
        console.warn("User not authorized to fetch goals")
        return []
      }
      // For other errors, still throw
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const goals = await response.json()

    // Ensure we always return an array
    return Array.isArray(goals) ? goals : []
  } catch (error) {
    console.error("Error fetching goals:", error)
    // Instead of throwing, return empty array to prevent crashes
    return []
  }
}

// Create a new goal
export async function createGoal(
  goalData: CreateGoalData
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
      if (response.status === 401) {
        throw new Error("Please sign in to create goals")
      }
      if (response.status === 404) {
        throw new Error(
          "User profile not found. Please complete your profile setup."
        )
      }
      const errorData = await response.json()
      throw new Error(
        errorData.error || `Failed to create goal: ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating goal:", error)
    throw error
  }
}

// Update an existing goal
export async function updateGoal(
  goalId: string,
  updates: UpdateGoalData
): Promise<Goal | null> {
  try {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please sign in to update goals")
      }
      if (response.status === 404) {
        throw new Error("Goal not found")
      }
      const errorData = await response.json()
      throw new Error(
        errorData.error || `Failed to update goal: ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating goal:", error)
    throw error
  }
}

// Delete a goal
export async function deleteGoal(goalId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please sign in to delete goals")
      }
      if (response.status === 404) {
        throw new Error("Goal not found")
      }
      const errorData = await response.json()
      throw new Error(
        errorData.error || `Failed to delete goal: ${response.statusText}`
      )
    }

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error("Error deleting goal:", error)
    throw error
  }
}

// Get a specific goal by ID
export async function fetchGoal(goalId: string): Promise<Goal | null> {
  try {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please sign in to view goals")
      }
      if (response.status === 404) {
        return null // Goal not found
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching goal:", error)
    return null
  }
}
