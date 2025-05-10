import { Reflection } from "@/app/store/reflectionsStore"

class ReflectionsService {
  // Get all reflections
  async getReflections(): Promise<Reflection[]> {
    try {
      const response = await fetch("/api/reflections")

      if (!response.ok) {
        throw new Error(`Failed to fetch reflections: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("Error in getReflections service:", error)

      // Return mock data if API fails in development
      if (process.env.NODE_ENV === "development") {
        return this.getMockReflections()
      }

      throw error
    }
  }

  // Get a reflection by ID
  async getReflectionById(id: string): Promise<Reflection> {
    try {
      const response = await fetch(`/api/reflections/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch reflection: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error(`Error in getReflectionById service for id ${id}:`, error)
      throw error
    }
  }

  // Create a new reflection
  async createReflection(reflection: Reflection): Promise<Reflection> {
    try {
      const response = await fetch("/api/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reflection),
      })

      if (!response.ok) {
        throw new Error(`Failed to create reflection: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("Error in createReflection service:", error)
      throw error
    }
  }

  // Update an existing reflection
  async updateReflection(
    id: string,
    reflection: Reflection
  ): Promise<Reflection> {
    try {
      const response = await fetch(`/api/reflections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reflection),
      })

      if (!response.ok) {
        throw new Error(`Failed to update reflection: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error(`Error in updateReflection service for id ${id}:`, error)
      throw error
    }
  }

  // Delete a reflection
  async deleteReflection(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/reflections/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete reflection: ${response.status}`)
      }
    } catch (error) {
      console.error(`Error in deleteReflection service for id ${id}:`, error)
      throw error
    }
  }

  // Generate an AI reflection
  async generateReflection(prompt: string): Promise<Reflection> {
    try {
      const response = await fetch("/api/ai/generate-reflection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate reflection: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("Error in generateReflection service:", error)
      throw error
    }
  }

  // Mock data for development
  private getMockReflections(): Reflection[] {
    return [
      {
        id: "1",
        title: "Morning Reflection on Goals",
        content:
          "Today I woke up feeling motivated and clear about my goals. I've been thinking a lot about the direction of my career and what truly brings me joy. I realized that I've been chasing external validation instead of focusing on what genuinely interests me.\n\nI want to spend more time on creative projects and less time worrying about how they'll be perceived. It's the process, not the outcome, that brings me fulfillment.",
        tags: ["career", "goals", "motivation"],
        metrics: {
          mood: 8,
          energy: 7,
          clarity: 9,
        },
        insights: [
          "External validation isn't sustainable motivation",
          "Creativity requires freedom from judgment",
          "Joy comes from the process, not just the outcome",
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        title: "Reflecting on Recent Challenges",
        content:
          "The past week has been difficult. I've faced several unexpected obstacles at work and in my personal life. The project deadline was moved up, creating stress for the entire team. At home, I've been dealing with some family issues that have taken an emotional toll.\n\nDespite these challenges, I'm trying to maintain perspective. These difficulties are temporary, and I've overcome similar situations before. I need to remember to take care of myself during stressful periods - sleep, exercise, and connecting with friends are essential.",
        tags: ["challenges", "stress", "work-life balance"],
        metrics: {
          mood: 4,
          energy: 3,
          clarity: 6,
        },
        insights: [
          "Perspective helps reduce immediate anxiety",
          "Self-care is crucial during difficult times",
          "Impermanence is comforting - this too shall pass",
        ],
        isAIGenerated: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        title: "Gratitude Practice",
        content:
          "I've been trying to cultivate more gratitude in my daily life. Today I'm grateful for:\n\n1. The supportive friends who checked in on me yesterday\n2. My health and ability to exercise\n3. The beautiful weather and the walk I took at lunch\n4. Having access to clean water and nutritious food\n5. The opportunity to learn new skills through my job\n\nEven writing this list has shifted my mood positively. It's easy to focus on what's lacking or what could be better, but there's always so much to appreciate if I take the time to notice.",
        tags: ["gratitude", "mindfulness", "positivity"],
        metrics: {
          mood: 9,
          energy: 7,
          clarity: 8,
        },
        insights: [
          "Gratitude practice tangibly improves mood",
          "Small everyday blessings are easy to overlook",
          "Intentional focus determines emotional experience",
        ],
        isAIGenerated: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }
}

export const reflectionsService = new ReflectionsService()
