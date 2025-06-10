// lib/services/ingredientService.ts

export interface HappinessIngredient {
  id: string
  name: string
  category: string
  frequency: string
  importance: string
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateIngredientInput {
  name: string
  category: string
  frequency: string // 'daily', 'weekly', or 'monthly'
  importance: string // 'high', 'medium', or 'low'
}

export interface UpdateIngredientInput {
  name?: string
  description?: string
  category?: string
  isCompleted?: boolean
}

// Fetch all happiness ingredients for the current user
export async function fetchIngredients(): Promise<HappinessIngredient[]> {
  try {
    const response = await fetch("/api/ingredients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Handle different status codes appropriately
      if (response.status === 404) {
        // User not found or no ingredients - return empty array instead of throwing
        console.warn("No ingredients found for user, returning empty array")
        return []
      }
      if (response.status === 401) {
        // Unauthorized - user not signed in
        console.warn("User not authorized to fetch ingredients")
        return []
      }
      // For other errors, still throw
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const ingredients = await response.json()

    // Ensure we always return an array
    return Array.isArray(ingredients) ? ingredients : []
  } catch (error) {
    console.error("Error fetching happiness ingredients:", error)
    // Instead of throwing, return empty array to prevent crashes
    return []
  }
}

// Create a new happiness ingredient
export async function createIngredient(
  ingredientData: CreateIngredientInput
): Promise<HappinessIngredient | null> {
  try {
    const response = await fetch("/api/happiness-ingredients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredientData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please sign in to create happiness ingredients")
      }
      if (response.status === 404) {
        throw new Error(
          "User profile not found. Please complete your profile setup."
        )
      }
      const errorData = await response.json()
      throw new Error(
        errorData.error ||
          `Failed to create happiness ingredient: ${response.statusText}`
      )
    }

    const data = await response.json()

    // Ensure dates are properly parsed
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  } catch (error) {
    console.error("Error creating happiness ingredient:", error)
    throw error
  }
}

// Update an existing happiness ingredient
export async function updateIngredient(
  ingredientId: string,
  updates: UpdateIngredientInput
): Promise<HappinessIngredient | null> {
  try {
    const response = await fetch(`/api/happiness-ingredients/${ingredientId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please sign in to update happiness ingredients")
      }
      if (response.status === 404) {
        throw new Error("Happiness ingredient not found")
      }
      const errorData = await response.json()
      throw new Error(
        errorData.error ||
          `Failed to update happiness ingredient: ${response.statusText}`
      )
    }

    const data = await response.json()

    // Ensure dates are properly parsed
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  } catch (error) {
    console.error("Error updating happiness ingredient:", error)
    throw error
  }
}

// Toggle completion status of a happiness ingredient
export async function toggleIngredientCompletion(
  ingredientId: string,
  currentStatus: boolean
): Promise<HappinessIngredient | null> {
  return updateIngredient(ingredientId, { isCompleted: !currentStatus })
}

// Delete a happiness ingredient
export async function deleteIngredient(ingredientId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/happiness-ingredients/${ingredientId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please sign in to delete happiness ingredients")
      }
      if (response.status === 404) {
        throw new Error("Happiness ingredient not found")
      }
      const errorData = await response.json()
      throw new Error(
        errorData.error ||
          `Failed to delete happiness ingredient: ${response.statusText}`
      )
    }

    return true
  } catch (error) {
    console.error("Error deleting happiness ingredient:", error)
    throw error
  }
}

// Get a specific happiness ingredient by ID
export async function fetchIngredient(
  ingredientId: string
): Promise<HappinessIngredient | null> {
  try {
    const response = await fetch(`/api/happiness-ingredients/${ingredientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please sign in to view happiness ingredients")
      }
      if (response.status === 404) {
        return null // Ingredient not found
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Ensure dates are properly parsed
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  } catch (error) {
    console.error("Error fetching happiness ingredient:", error)
    return null
  }
}
