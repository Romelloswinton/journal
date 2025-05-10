// app/api/gemini/reflections/route.ts

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export interface ReflectionEntry {
  priority: string
  worry: string
  positive: string
}

export interface ReflectionContent {
  upgrade: string
  spark: string
}

export interface AllReflections {
  priority: ReflectionContent
  worry: ReflectionContent
  positive: ReflectionContent
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    // For onboarding, we don't require authentication
    // as users complete onboarding before signing in

    const body = await req.json()
    const { priority, worry, positive } = body

    // Check if we have any content to reflect on
    if (!priority && !worry && !positive) {
      return NextResponse.json(
        { error: "No content provided for reflection" },
        { status: 400 }
      )
    }

    const reflections = await generateAllReflections({
      priority: priority || "",
      worry: worry || "",
      positive: positive || "",
    })

    return NextResponse.json(reflections)
  } catch (error) {
    console.error("Error generating reflections:", error)
    return NextResponse.json(
      { error: "Failed to generate reflections" },
      { status: 500 }
    )
  }
}

// Function to generate all reflections
async function generateAllReflections(
  entries: ReflectionEntry
): Promise<AllReflections> {
  try {
    const reflections: AllReflections = {
      priority: {
        upgrade: "",
        spark: "",
      },
      worry: {
        upgrade: "",
        spark: "",
      },
      positive: {
        upgrade: "",
        spark: "",
      },
    }

    // Generate reflections for each entry in parallel
    const [priorityReflection, worryReflection, positiveReflection] =
      await Promise.all([
        entries.priority
          ? generatePriorityReflections(entries.priority)
          : Promise.resolve({
              upgrade: "No priority entry provided.",
              spark: "What would you consider your highest priority today?",
            }),
        entries.worry
          ? generateWorryReflections(entries.worry)
          : Promise.resolve({
              upgrade: "No worry entry provided.",
              spark: "Is there something causing you concern today?",
            }),
        entries.positive
          ? generatePositiveReflections(entries.positive)
          : Promise.resolve({
              upgrade: "No positive action entry provided.",
              spark: "What's one thing you could do for yourself today?",
            }),
      ])

    // Combine all reflections
    reflections.priority = priorityReflection
    reflections.worry = worryReflection
    reflections.positive = positiveReflection

    return reflections
  } catch (error) {
    console.error("Error generating all reflections:", error)

    // Return default reflections if there's an error
    return {
      priority: {
        upgrade:
          "I'm having trouble generating a reflection right now. Your priority seems important.",
        spark:
          "How would you describe the importance of this priority in your life?",
      },
      worry: {
        upgrade:
          "I'm having trouble generating a reflection right now. Your concern is valid.",
        spark:
          "What steps might help you address this worry in a constructive way?",
      },
      positive: {
        upgrade:
          "I'm having trouble generating a reflection right now. Your positive action shows self-care.",
        spark:
          "How do you think this positive action will impact your wellbeing?",
      },
    }
  }
}

// Generate reflections for priority entry
async function generatePriorityReflections(
  priorityEntry: string
): Promise<ReflectionContent> {
  try {
    const prompt = `
    I'm using an AI journaling app. I wrote this in response to "What's your highest priority today?":
    
    "${priorityEntry}"
    
    Please provide two things:
    1. A thoughtful, insightful "upgrade" that reflects back what I wrote with deeper meaning and context (50-75 words)
    2. A follow-up question or "spark" that encourages me to reflect deeper on this priority (15-25 words)
    
    Format as JSON with "upgrade" and "spark" properties.
    `

    const response = await callGeminiAPI(prompt)
    return response
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return {
      upgrade:
        "Your focus on this priority shows what matters to you right now. Identifying your priorities helps create clarity and purpose in your day.",
      spark:
        "How does focusing on this priority align with your longer-term goals?",
    }
  }
}

// Generate reflections for worry entry
async function generateWorryReflections(
  worryEntry: string
): Promise<ReflectionContent> {
  try {
    const prompt = `
    I'm using an AI journaling app. I wrote this in response to "Is there anything worrying you about the day ahead?":
    
    "${worryEntry}"
    
    Please provide two things:
    1. A thoughtful, insightful "upgrade" that acknowledges my worry with compassion and offers a helpful perspective (50-75 words)
    2. A follow-up question or "spark" that encourages me to reflect on this worry in a constructive way (15-25 words)
    
    Format as JSON with "upgrade" and "spark" properties.
    `

    const response = await callGeminiAPI(prompt)
    return response
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return {
      upgrade:
        "It's natural to feel concern about this. Acknowledging worries is an important step in processing emotions and finding ways to address them.",
      spark:
        "What would help you feel more at ease about this particular concern?",
    }
  }
}

// Generate reflections for positive action entry
async function generatePositiveReflections(
  positiveEntry: string
): Promise<ReflectionContent> {
  try {
    const prompt = `
    I'm using an AI journaling app. I wrote this in response to "What's one positive thing you can do for yourself today?":
    
    "${positiveEntry}"
    
    Please provide two things:
    1. A thoughtful, encouraging "upgrade" that celebrates this positive intention and reflects on its potential benefits (50-75 words)
    2. A follow-up question or "spark" that encourages me to reflect deeper on this positive action (15-25 words)
    
    Format as JSON with "upgrade" and "spark" properties.
    `

    const response = await callGeminiAPI(prompt)
    return response
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return {
      upgrade:
        "Choosing this positive action shows self-awareness and a commitment to your wellbeing. Small acts of self-care can have ripple effects throughout your day.",
      spark:
        "How might this action contribute to a pattern of positive choices in your life?",
    }
  }
}

// Function to call the Google Gemini API
async function callGeminiAPI(prompt: string): Promise<ReflectionContent> {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error("Gemini API key not configured")
    }

    // Updated model name to gemini-1.5-pro as requested
    const model = "gemini-1.5-pro"

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    // Parse the response to extract the JSON data
    let jsonText = ""

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      jsonText = data.candidates[0].content.parts[0].text
    }

    // Extract just the JSON portion
    let jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    let jsonData = jsonMatch ? jsonMatch[0] : null

    if (!jsonData) {
      throw new Error("Could not extract JSON from Gemini response")
    }

    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonData)

      // Return the structured reflection
      return {
        upgrade: parsedResponse.upgrade || "Reflection not available.",
        spark: parsedResponse.spark || "What else comes to mind about this?",
      }
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError)
      console.log("Raw text from Gemini:", jsonText)

      // Return a default response if parsing fails
      return {
        upgrade:
          "I found meaning in what you wrote. Reflecting on our priorities helps us align our actions with our values.",
        spark: "How does this connect to what matters most to you?",
      }
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    throw error
  }
}
