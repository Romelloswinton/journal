// promptsData.ts
import { v4 as uuidv4 } from "uuid"

export interface PromptData {
  id: string
  text: string
  category: string
  isSaved?: boolean
}

export const promptsData: PromptData[] = [
  // Gratitude Prompts
  {
    id: uuidv4(),
    text: "What are three things you're grateful for today, and why do they matter to you?",
    category: "Gratitude",
  },
  {
    id: uuidv4(),
    text: "Describe an unexpected moment of joy you experienced recently. What made it special?",
    category: "Gratitude",
  },
  {
    id: uuidv4(),
    text: "Who has positively influenced your life recently, and how can you express gratitude to them?",
    category: "Gratitude",
  },
  {
    id: uuidv4(),
    text: "What challenging situation are you grateful for in retrospect because of what it taught you?",
    category: "Gratitude",
  },
  {
    id: uuidv4(),
    text: "What simple pleasure brought you joy today that you might normally overlook?",
    category: "Gratitude",
  },

  // Self-Reflection Prompts
  {
    id: uuidv4(),
    text: "What personal accomplishment from the past month are you most proud of and why?",
    category: "Self-Reflection",
  },
  {
    id: uuidv4(),
    text: "In what ways have you grown or changed over the past year?",
    category: "Self-Reflection",
  },
  {
    id: uuidv4(),
    text: "What patterns or habits do you notice in your life that aren't serving your highest good?",
    category: "Self-Reflection",
  },
  {
    id: uuidv4(),
    text: "What do you know to be true about yourself today that you didn't understand a year ago?",
    category: "Self-Reflection",
  },
  {
    id: uuidv4(),
    text: "If you could give your younger self advice, what would you say?",
    category: "Self-Reflection",
  },

  // Mindfulness Prompts
  {
    id: uuidv4(),
    text: "Pause and observe your surroundings with all your senses. What do you notice that you typically miss?",
    category: "Mindfulness",
  },
  {
    id: uuidv4(),
    text: "Describe your current emotional state without judgment. Where do you feel these emotions in your body?",
    category: "Mindfulness",
  },
  {
    id: uuidv4(),
    text: "What thoughts keep reappearing in your mind today? Can you observe them without attachment?",
    category: "Mindfulness",
  },
  {
    id: uuidv4(),
    text: "Take a mindful moment with something ordinary (like eating an apple or taking a shower). Describe the experience in detail.",
    category: "Mindfulness",
  },
  {
    id: uuidv4(),
    text: "How present have you been today? What has helped or hindered your presence?",
    category: "Mindfulness",
  },

  // Growth Prompts
  {
    id: uuidv4(),
    text: "What skill or quality would you like to develop further, and what's one step you could take toward that growth?",
    category: "Growth",
  },
  {
    id: uuidv4(),
    text: "Describe a recent mistake or setback. What lessons can you extract from this experience?",
    category: "Growth",
  },
  {
    id: uuidv4(),
    text: "What fear has been holding you back, and how might you begin to move through it?",
    category: "Growth",
  },
  {
    id: uuidv4(),
    text: "What would you try if you knew you couldn't fail?",
    category: "Growth",
  },
  {
    id: uuidv4(),
    text: "How have your challenges shaped who you are today in positive ways?",
    category: "Growth",
  },

  // Vision Prompts
  {
    id: uuidv4(),
    text: "Imagine your ideal life five years from now. Describe it in vivid detail.",
    category: "Vision",
  },
  {
    id: uuidv4(),
    text: "What legacy would you like to leave? How are your current actions aligned with this vision?",
    category: "Vision",
  },
  {
    id: uuidv4(),
    text: "If you could design your perfect day, what would it include?",
    category: "Vision",
  },
  {
    id: uuidv4(),
    text: "What dream have you been postponing? What small step could you take toward it today?",
    category: "Vision",
  },
  {
    id: uuidv4(),
    text: "How would you like to feel one year from now? What habits might cultivate those feelings?",
    category: "Vision",
  },

  // Awareness Prompts
  {
    id: uuidv4(),
    text: "What triggers have you noticed today? How did they affect your thoughts and behaviors?",
    category: "Awareness",
  },
  {
    id: uuidv4(),
    text: "What limiting beliefs are you currently holding about yourself or your possibilities?",
    category: "Awareness",
  },
  {
    id: uuidv4(),
    text: "What personal values were honored or compromised in your actions today?",
    category: "Awareness",
  },
  {
    id: uuidv4(),
    text: "What do you need most right now that you're not allowing yourself to receive?",
    category: "Awareness",
  },
  {
    id: uuidv4(),
    text: "What patterns do you notice in your relationships? How do these patterns serve or limit you?",
    category: "Awareness",
  },

  // Problem-solving Prompts
  {
    id: uuidv4(),
    text: "What challenge are you currently facing? If your wisest friend were facing this situation, what advice would you give them?",
    category: "Problem-solving",
  },
  {
    id: uuidv4(),
    text: "What problem feels stuck? List five completely different approaches you could try.",
    category: "Problem-solving",
  },
  {
    id: uuidv4(),
    text: "What different perspective could you take on your current challenge that might reveal new solutions?",
    category: "Problem-solving",
  },
  {
    id: uuidv4(),
    text: "What resources or support might help you overcome your current obstacle?",
    category: "Problem-solving",
  },
  {
    id: uuidv4(),
    text: "If your problem were solved, what would be different? Work backward from there to find a solution.",
    category: "Problem-solving",
  },

  // Healing Prompts
  {
    id: uuidv4(),
    text: "What part of yourself needs more compassion today?",
    category: "Healing",
  },
  {
    id: uuidv4(),
    text: "What painful emotion have you been avoiding? Can you create space to feel it fully now?",
    category: "Healing",
  },
  {
    id: uuidv4(),
    text: "Write a letter of forgiveness to yourself or someone else (you don't need to send it).",
    category: "Healing",
  },
  {
    id: uuidv4(),
    text: "What unresolved grief or loss still affects you? What would help you process this further?",
    category: "Healing",
  },
  {
    id: uuidv4(),
    text: "In what ways do you need to establish better boundaries to protect your wellbeing?",
    category: "Healing",
  },

  // Planning Prompts
  {
    id: uuidv4(),
    text: "What are your top three priorities for the coming week, and why do they matter?",
    category: "Planning",
  },
  {
    id: uuidv4(),
    text: "What habits would you like to cultivate or release in the next month?",
    category: "Planning",
  },
  {
    id: uuidv4(),
    text: "What area of your life feels most out of balance, and how might you restore harmony?",
    category: "Planning",
  },
  {
    id: uuidv4(),
    text: "What is your intention for tomorrow? How will you remind yourself of it throughout the day?",
    category: "Planning",
  },
  {
    id: uuidv4(),
    text: "What milestone are you working toward? Break it down into smaller, manageable steps.",
    category: "Planning",
  },
]
