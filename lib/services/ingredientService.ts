// Service for handling Happiness Ingredient operations

// Type definitions
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
  category?: string
  frequency?: string
  importance?: string
  isCompleted?: boolean
}

// Functions for fetching ingredients
export async function fetchIngredients(): Promise<HappinessIngredient[]> {
  try {
    const response = await fetch("/api/happiness-ingredients", {
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
    return data.map((ingredient: any) => ({
      ...ingredient,
      createdAt: new Date(ingredient.createdAt),
      updatedAt: new Date(ingredient.updatedAt),
    }))
  } catch (error) {
    console.error("Failed to fetch happiness ingredients:", error)
    return []
  }
}

// Function for creating a new ingredient
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
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    // Ensure dates are properly parsed
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  } catch (error) {
    console.error("Failed to create happiness ingredient:", error)
    return null
  }
}

// Function for updating an ingredient
export async function updateIngredient(
  id: string,
  ingredientData: UpdateIngredientInput
): Promise<HappinessIngredient | null> {
  try {
    const response = await fetch(`/api/happiness-ingredients/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredientData),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    // Ensure dates are properly parsed
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  } catch (error) {
    console.error(`Failed to update happiness ingredient ${id}:`, error)
    return null
  }
}

// Function for toggling completion status
export async function toggleIngredientCompletion(
  id: string,
  currentStatus: boolean
): Promise<HappinessIngredient | null> {
  return updateIngredient(id, { isCompleted: !currentStatus })
}

// Function for deleting an ingredient
export async function deleteIngredient(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/happiness-ingredients/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error(`Failed to delete happiness ingredient ${id}:`, error)
    return false
  }
}
