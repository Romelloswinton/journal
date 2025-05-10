// journalTemplatesData.ts
import { v4 as uuidv4 } from "uuid"

export interface JournalTemplate {
  id: string
  title: string
  author: string
  category: "SITUATIONAL" | "DAILY" | "FRAMEWORKS"
  description: string
  emoji?: string
  image?: string
  prompts: string[]
  steps?: string[]
  structure?: {
    title: string
    fields: Array<{
      type: "text" | "textarea" | "rating" | "tags" | "select"
      label: string
      placeholder?: string
      options?: string[]
      required?: boolean
    }>
  }
}

export const journalTemplates: JournalTemplate[] = [
  // SITUATIONAL JOURNALS
  {
    id: uuidv4(),
    title: "Navigating Life Transitions",
    author: "Dr. Sarah Peterson",
    category: "SITUATIONAL",
    description: "A guide for processing and adapting to major life changes",
    emoji: "🧭",
    prompts: [
      "What aspects of this transition feel most challenging?",
      "What resources or strengths do you have to help navigate this change?",
      "What possibilities might this transition create in your life?",
    ],
    structure: {
      title: "Navigating Life Transitions",
      fields: [
        {
          type: "textarea",
          label: "What transition are you experiencing?",
          placeholder: "Describe the change you're going through...",
          required: true,
        },
        {
          type: "textarea",
          label: "What aspects of this transition feel most challenging?",
          placeholder: "Write about what feels difficult...",
          required: true,
        },
        {
          type: "textarea",
          label:
            "What resources or strengths do you have to help navigate this change?",
          placeholder: "List personal qualities, support systems, or tools...",
          required: true,
        },
        {
          type: "textarea",
          label:
            "What possibilities might this transition create in your life?",
          placeholder: "Consider new opportunities or growth...",
          required: true,
        },
        {
          type: "tags",
          label: "Key emotions",
          placeholder: "Add emotions you're experiencing",
          required: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Conflict Resolution Journal",
    author: "Michael Rivera, Mediator",
    category: "SITUATIONAL",
    description:
      "Framework for understanding and resolving interpersonal conflicts",
    emoji: "🤝",
    prompts: [
      "Describe the conflict situation objectively",
      "What needs of yours aren't being met?",
      "What might the other person's perspective be?",
      "What solutions might address both parties' needs?",
    ],
    structure: {
      title: "Conflict Resolution",
      fields: [
        {
          type: "textarea",
          label: "Describe the conflict situation objectively",
          placeholder: "Focus on observable facts without judgment...",
          required: true,
        },
        {
          type: "textarea",
          label: "What needs of yours aren't being met?",
          placeholder: "Consider your underlying needs...",
          required: true,
        },
        {
          type: "textarea",
          label: "What might the other person's perspective be?",
          placeholder: "Try to understand their point of view...",
          required: true,
        },
        {
          type: "textarea",
          label: "What solutions might address both parties' needs?",
          placeholder: "Brainstorm possible win-win options...",
          required: true,
        },
        {
          type: "rating",
          label: "Emotional intensity",
          required: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Decision-Making Compass",
    author: "Dr. Alex Montgomery",
    category: "SITUATIONAL",
    description: "Structured approach to making important decisions",
    emoji: "🧠",
    prompts: [
      "What options are you considering?",
      "For each option, what are the potential benefits and drawbacks?",
      "What values are most important to consider in this decision?",
      "What does your intuition tell you?",
    ],
    structure: {
      title: "Decision-Making Compass",
      fields: [
        {
          type: "text",
          label: "What decision are you facing?",
          placeholder: "Describe the choice you need to make...",
          required: true,
        },
        {
          type: "textarea",
          label: "What options are you considering?",
          placeholder: "List all possible choices...",
          required: true,
        },
        {
          type: "textarea",
          label: "For each option, what are the potential benefits?",
          placeholder: "Consider positive outcomes...",
          required: true,
        },
        {
          type: "textarea",
          label: "For each option, what are the potential drawbacks?",
          placeholder: "Consider risks or downsides...",
          required: true,
        },
        {
          type: "textarea",
          label: "What values are most important to consider in this decision?",
          placeholder: "Think about what matters most to you...",
          required: true,
        },
        {
          type: "textarea",
          label: "What does your intuition tell you?",
          placeholder: "Pay attention to your gut feeling...",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Grief & Loss Processing",
    author: "Emma Thomas, Grief Counselor",
    category: "SITUATIONAL",
    description: "Supportive space for working through grief and loss",
    emoji: "🕊️",
    prompts: [
      "What memories are most present for you right now?",
      "What emotions are you experiencing?",
      "What has this loss taught you about what matters most?",
    ],
    structure: {
      title: "Grief & Loss Processing",
      fields: [
        {
          type: "textarea",
          label: "What loss are you processing?",
          placeholder: "Share what or who you've lost...",
          required: true,
        },
        {
          type: "textarea",
          label: "What memories are most present for you right now?",
          placeholder: "Reflect on meaningful moments...",
          required: true,
        },
        {
          type: "tags",
          label: "What emotions are you experiencing?",
          placeholder: "Identify feelings like sadness, anger, gratitude...",
          required: true,
        },
        {
          type: "textarea",
          label: "What has this loss taught you about what matters most?",
          placeholder: "Reflect on meaning and values...",
          required: true,
        },
        {
          type: "textarea",
          label: "What would help you feel supported right now?",
          placeholder: "Consider what might bring comfort...",
          required: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Stress Release Valve",
    author: "Dr. James Chen",
    category: "SITUATIONAL",
    description: "Quick intervention for moments of overwhelm",
    emoji: "🧘",
    prompts: [
      "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, 1 thing you can taste",
      "What's one thing you can control right now?",
      "What self-care action would help most in this moment?",
    ],
    structure: {
      title: "Stress Release Valve",
      fields: [
        {
          type: "rating",
          label: "Current stress level (1-10)",
          required: true,
        },
        {
          type: "textarea",
          label: "What's causing your stress right now?",
          placeholder: "Briefly describe what's overwhelming you...",
          required: true,
        },
        {
          type: "textarea",
          label: "5-4-3-2-1 Grounding Exercise",
          placeholder:
            "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, 1 thing you can taste...",
          required: true,
        },
        {
          type: "textarea",
          label: "What's one thing you can control right now?",
          placeholder: "Focus on what's within your power...",
          required: true,
        },
        {
          type: "textarea",
          label: "What self-care action would help most in this moment?",
          placeholder: "Identify a specific, immediate step...",
          required: true,
        },
        {
          type: "rating",
          label: "Stress level after completing this exercise (1-10)",
          required: false,
        },
      ],
    },
  },

  // DAILY JOURNALS
  {
    id: uuidv4(),
    title: "Morning Clarity Pages",
    author: "Julia Cameron",
    category: "DAILY",
    description: "Start your day with intention and focus",
    emoji: "☀️",
    prompts: [
      "What are your top 3 priorities today?",
      "What's one thing you're looking forward to?",
      "What potential challenges might arise and how might you handle them?",
    ],
    structure: {
      title: "Morning Clarity Pages",
      fields: [
        {
          type: "textarea",
          label: "Stream of consciousness",
          placeholder: "Write whatever comes to mind for 5 minutes...",
          required: true,
        },
        {
          type: "textarea",
          label: "What are your top 3 priorities today?",
          placeholder: "List your most important tasks...",
          required: true,
        },
        {
          type: "textarea",
          label: "What's one thing you're looking forward to?",
          placeholder: "Focus on something positive ahead...",
          required: true,
        },
        {
          type: "textarea",
          label:
            "What potential challenges might arise and how might you handle them?",
          placeholder: "Prepare for possible obstacles...",
          required: true,
        },
        {
          type: "rating",
          label: "Energy level",
          required: false,
        },
        {
          type: "rating",
          label: "Mood",
          required: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Daily Gratitude Practice",
    author: "Robert Emmons, Ph.D.",
    category: "DAILY",
    description: "Cultivate appreciation for the small and significant",
    emoji: "🙏",
    prompts: [
      "What are three things you're grateful for today?",
      "Who made a positive difference in your day and how?",
      "What small pleasure did you enjoy today?",
    ],
    structure: {
      title: "Daily Gratitude Practice",
      fields: [
        {
          type: "textarea",
          label: "What are three things you're grateful for today?",
          placeholder: "List specific things, events, or people...",
          required: true,
        },
        {
          type: "textarea",
          label: "Who made a positive difference in your day and how?",
          placeholder: "Reflect on someone's impact...",
          required: true,
        },
        {
          type: "textarea",
          label: "What small pleasure did you enjoy today?",
          placeholder: "Consider a simple moment of joy...",
          required: true,
        },
        {
          type: "rating",
          label: "Gratitude level today",
          required: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Evening Reflection",
    author: "Dr. Laura Wilson",
    category: "DAILY",
    description: "Process your day and prepare for restful sleep",
    emoji: "🌙",
    prompts: [
      "What went well today?",
      "What challenged you?",
      "What did you learn?",
      "What would you like to release before sleep?",
    ],
    structure: {
      title: "Evening Reflection",
      fields: [
        {
          type: "textarea",
          label: "What went well today?",
          placeholder: "Celebrate accomplishments and positive moments...",
          required: true,
        },
        {
          type: "textarea",
          label: "What challenged you?",
          placeholder: "Reflect on difficulties without judgment...",
          required: true,
        },
        {
          type: "textarea",
          label: "What did you learn?",
          placeholder: "Consider insights or lessons...",
          required: true,
        },
        {
          type: "textarea",
          label: "What would you like to release before sleep?",
          placeholder: "Let go of thoughts that might disturb rest...",
          required: true,
        },
        {
          type: "tags",
          label: "Key emotions from today",
          placeholder: "Add emotions you experienced",
          required: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Emotional Weather Report",
    author: "Dr. Marc Brackett",
    category: "DAILY",
    description: "Track your emotional patterns and triggers",
    emoji: "🌈",
    prompts: [
      "What emotions have been present today?",
      "What triggered these feelings?",
      "How did you respond to these emotions?",
      "What might you need right now?",
    ],
    structure: {
      title: "Emotional Weather Report",
      fields: [
        {
          type: "tags",
          label: "What emotions have been present today?",
          placeholder: "Name specific feelings...",
          required: true,
        },
        {
          type: "textarea",
          label: "What triggered these feelings?",
          placeholder: "Identify events, thoughts, or interactions...",
          required: true,
        },
        {
          type: "textarea",
          label: "How did you respond to these emotions?",
          placeholder: "Describe your actions or reactions...",
          required: true,
        },
        {
          type: "textarea",
          label: "What might you need right now?",
          placeholder: "Consider what would support your wellbeing...",
          required: true,
        },
        {
          type: "rating",
          label: "Overall emotional intensity",
          required: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Daily Wins Journal",
    author: "Dr. Teresa Amabile",
    category: "DAILY",
    description: "Celebrate progress and build momentum",
    emoji: "🏆",
    prompts: [
      "What are 3 wins you experienced today, no matter how small?",
      "What progress did you make toward your goals?",
      "How did you show up as your best self today?",
    ],
    structure: {
      title: "Daily Wins Journal",
      fields: [
        {
          type: "textarea",
          label: "What are 3 wins you experienced today, no matter how small?",
          placeholder: "Celebrate all progress, not just major achievements...",
          required: true,
        },
        {
          type: "textarea",
          label: "What progress did you make toward your goals?",
          placeholder: "Note any steps forward...",
          required: true,
        },
        {
          type: "textarea",
          label: "How did you show up as your best self today?",
          placeholder: "Recognize your positive qualities in action...",
          required: true,
        },
        {
          type: "rating",
          label: "Satisfaction with progress",
          required: false,
        },
      ],
    },
  },

  // FRAMEWORK JOURNALS
  {
    id: uuidv4(),
    title: "Values Clarification",
    author: "Dr. Russ Harris",
    category: "FRAMEWORKS",
    description: "Identify and align with your core values",
    emoji: "🧭",
    prompts: [
      "What matters most to you in life?",
      "When have you felt most fulfilled?",
      "What principles do you want to guide your choices?",
      "How aligned are your current actions with these values?",
    ],
    structure: {
      title: "Values Clarification",
      fields: [
        {
          type: "textarea",
          label: "What matters most to you in life?",
          placeholder: "Consider what gives your life meaning...",
          required: true,
        },
        {
          type: "textarea",
          label: "When have you felt most fulfilled?",
          placeholder: "Describe moments of alignment and purpose...",
          required: true,
        },
        {
          type: "tags",
          label: "Core values",
          placeholder:
            "Add values like 'connection', 'creativity', 'growth'...",
          required: true,
        },
        {
          type: "textarea",
          label: "How aligned are your current actions with these values?",
          placeholder: "Reflect on consistency between values and behaviors...",
          required: true,
        },
        {
          type: "textarea",
          label:
            "What small step could you take to live more aligned with your values?",
          placeholder: "Identify a specific action...",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Self-Compassion Practice",
    author: "Dr. Kristin Neff",
    category: "FRAMEWORKS",
    description: "Develop greater kindness toward yourself",
    emoji: "💗",
    prompts: [
      "What difficult situation are you facing?",
      "How would you speak to a friend facing this challenge?",
      "Can you offer yourself the same kindness?",
      "What would self-compassion look like in this situation?",
    ],
    structure: {
      title: "Self-Compassion Practice",
      fields: [
        {
          type: "textarea",
          label: "What difficult situation are you facing?",
          placeholder: "Describe your challenge without judgment...",
          required: true,
        },
        {
          type: "textarea",
          label: "How would you speak to a friend facing this challenge?",
          placeholder: "Write words of support and understanding...",
          required: true,
        },
        {
          type: "textarea",
          label: "What common humanity exists in this experience?",
          placeholder: "How is this part of being human?",
          required: true,
        },
        {
          type: "textarea",
          label: "Can you offer yourself the same kindness?",
          placeholder: "Write a self-compassionate response...",
          required: true,
        },
        {
          type: "textarea",
          label: "What would self-compassion look like in this situation?",
          placeholder: "Identify specific actions or thoughts...",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "CBT Thought Record",
    author: "Dr. Aaron Beck",
    category: "FRAMEWORKS",
    description: "Examine and reframe unhelpful thought patterns",
    emoji: "🧠",
    prompts: [
      "What situation triggered distress?",
      "What automatic thoughts arose?",
      "What evidence supports or contradicts these thoughts?",
      "What's a more balanced perspective?",
    ],
    structure: {
      title: "CBT Thought Record",
      fields: [
        {
          type: "textarea",
          label: "What situation triggered distress?",
          placeholder: "Describe the event objectively...",
          required: true,
        },
        {
          type: "textarea",
          label: "What automatic thoughts arose?",
          placeholder: "Note your immediate thoughts...",
          required: true,
        },
        {
          type: "tags",
          label: "Emotions experienced",
          placeholder: "Add emotions like 'anxious', 'sad', 'angry'...",
          required: true,
        },
        {
          type: "rating",
          label: "Intensity of distress (1-10)",
          required: true,
        },
        {
          type: "textarea",
          label: "What evidence supports these thoughts?",
          placeholder: "List facts supporting the thought...",
          required: true,
        },
        {
          type: "textarea",
          label: "What evidence contradicts these thoughts?",
          placeholder: "List facts challenging the thought...",
          required: true,
        },
        {
          type: "textarea",
          label: "What's a more balanced perspective?",
          placeholder: "Create a thought that considers all evidence...",
          required: true,
        },
        {
          type: "rating",
          label: "Intensity of distress after reframing (1-10)",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Future Self Visioning",
    author: "Dr. Daniel Gilbert",
    category: "FRAMEWORKS",
    description: "Connect with your future potential",
    emoji: "🔮",
    prompts: [
      "Imagine yourself one year from now living your ideal life. What does that look like?",
      "What small steps could present-you take to move toward this vision?",
      "What advice would your future self offer you now?",
    ],
    structure: {
      title: "Future Self Visioning",
      fields: [
        {
          type: "select",
          label: "Time horizon",
          options: ["6 months", "1 year", "3 years", "5 years", "10 years"],
          required: true,
        },
        {
          type: "textarea",
          label:
            "Imagine yourself at this future time living your ideal life. What does that look like?",
          placeholder:
            "Describe in vivid detail - work, relationships, health, location, etc...",
          required: true,
        },
        {
          type: "textarea",
          label: "What qualities has this future version of you developed?",
          placeholder: "Consider growth, skills, mindsets...",
          required: true,
        },
        {
          type: "textarea",
          label:
            "What small steps could present-you take to move toward this vision?",
          placeholder: "Identify practical actions...",
          required: true,
        },
        {
          type: "textarea",
          label: "What advice would your future self offer you now?",
          placeholder: "What wisdom would they share?",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Strengths Spotlight",
    author: "Dr. Martin Seligman",
    category: "FRAMEWORKS",
    description: "Identify and leverage your natural talents",
    emoji: "💪",
    prompts: [
      "When do you feel most energized and in flow?",
      "What do others often compliment you on?",
      "How might you use your strengths more intentionally today?",
    ],
    structure: {
      title: "Strengths Spotlight",
      fields: [
        {
          type: "textarea",
          label: "When do you feel most energized and in flow?",
          placeholder: "Describe activities where time flies...",
          required: true,
        },
        {
          type: "textarea",
          label: "What do others often compliment you on?",
          placeholder: "Consider feedback you've received...",
          required: true,
        },
        {
          type: "tags",
          label: "Your top strengths",
          placeholder:
            "Add strengths like 'creativity', 'empathy', 'analysis'...",
          required: true,
        },
        {
          type: "textarea",
          label: "How have these strengths helped you in the past?",
          placeholder: "Recall specific examples...",
          required: true,
        },
        {
          type: "textarea",
          label: "How might you use your strengths more intentionally today?",
          placeholder: "Identify specific applications...",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Shadow Work Journal",
    author: "Dr. Carl Jung",
    category: "FRAMEWORKS",
    description: "Explore and integrate disowned aspects of yourself",
    emoji: "🌓",
    prompts: [
      "What traits do you find most triggering in others?",
      "When do you feel shame or unworthiness?",
      "What parts of yourself do you hide from others?",
      "How might accepting these aspects transform your life?",
    ],
    structure: {
      title: "Shadow Work Journal",
      fields: [
        {
          type: "textarea",
          label: "What traits do you find most triggering in others?",
          placeholder: "Consider qualities that provoke strong reactions...",
          required: true,
        },
        {
          type: "textarea",
          label: "When do you feel shame or unworthiness?",
          placeholder: "Identify patterns or triggers...",
          required: true,
        },
        {
          type: "textarea",
          label: "What parts of yourself do you hide from others?",
          placeholder: "Reflect on aspects you conceal...",
          required: true,
        },
        {
          type: "textarea",
          label: "How might these 'shadow' qualities serve a positive purpose?",
          placeholder: "Consider potential strengths in these traits...",
          required: true,
        },
        {
          type: "textarea",
          label: "How might accepting these aspects transform your life?",
          placeholder: "Imagine greater wholeness and integration...",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Limiting Beliefs Breakthrough",
    author: "Byron Katie",
    category: "FRAMEWORKS",
    description: "Identify and transform restrictive thought patterns",
    emoji: "🚀",
    prompts: [
      "What belief do you hold that limits your potential?",
      "Where did this belief originate?",
      "What evidence contradicts this belief?",
      "What would be possible if you let this belief go?",
    ],
    structure: {
      title: "Limiting Beliefs Breakthrough",
      fields: [
        {
          type: "textarea",
          label: "What belief do you hold that limits your potential?",
          placeholder: "Identify a thought that restricts you...",
          required: true,
        },
        {
          type: "textarea",
          label: "Where did this belief originate?",
          placeholder: "Consider its historical roots...",
          required: true,
        },
        {
          type: "textarea",
          label: "Is this belief absolutely true? How do you know?",
          placeholder: "Question its validity...",
          required: true,
        },
        {
          type: "textarea",
          label: "What evidence contradicts this belief?",
          placeholder: "Find examples that challenge it...",
          required: true,
        },
        {
          type: "textarea",
          label: "How does this belief impact your life?",
          placeholder: "Consider its consequences...",
          required: true,
        },
        {
          type: "textarea",
          label: "What would be possible if you let this belief go?",
          placeholder: "Imagine life without this limitation...",
          required: true,
        },
        // journalTemplatesData.ts (continued)
        {
          type: "textarea",
          label: "What new belief would better serve you?",
          placeholder: "Create an empowering alternative...",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Boundaries Exploration",
    author: "Dr. Henry Cloud",
    category: "FRAMEWORKS",
    description: "Define healthy boundaries for greater wellbeing",
    emoji: "🛡️",
    prompts: [
      "In what relationships or situations do you feel drained?",
      "What boundaries might support your wellbeing?",
      "What makes setting boundaries difficult for you?",
      "How can you communicate your boundaries with compassion?",
    ],
    structure: {
      title: "Boundaries Exploration",
      fields: [
        {
          type: "textarea",
          label: "In what relationships or situations do you feel drained?",
          placeholder: "Note where you lose energy...",
          required: true,
        },
        {
          type: "textarea",
          label: "What specific behaviors or patterns disturb your peace?",
          placeholder: "Identify triggers or violations...",
          required: true,
        },
        {
          type: "textarea",
          label: "What boundaries might support your wellbeing?",
          placeholder: "Define limits that protect your energy...",
          required: true,
        },
        {
          type: "textarea",
          label: "What makes setting boundaries difficult for you?",
          placeholder: "Explore fears or hesitations...",
          required: true,
        },
        {
          type: "textarea",
          label: "How can you communicate your boundaries with compassion?",
          placeholder: "Craft clear, kind language...",
          required: true,
        },
        {
          type: "textarea",
          label: "What support do you need to maintain these boundaries?",
          placeholder: "Identify resources or practices...",
          required: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Knowing Your Needs",
    author: "Dr. Marshall Rosenberg",
    category: "FRAMEWORKS",
    description: "Identify and honor your authentic needs",
    emoji: "🌱",
    prompts: [
      "What needs do you have that aren't being met?",
      "How do you feel when these needs go unmet?",
      "What specific requests could help meet these needs?",
      "What small step can you take today to honor a need?",
    ],
    structure: {
      title: "Knowing Your Needs",
      fields: [
        {
          type: "select",
          label:
            "Would you like to explore needs in your current moment or in a specific situation?",
          options: ["Current moment", "Specific situation"],
          required: true,
        },
        {
          type: "textarea",
          label: "If exploring a specific situation, please describe it:",
          placeholder: "Describe the circumstance or relationship...",
          required: false,
        },
        {
          type: "tags",
          label: "What needs do you have that aren't being met?",
          placeholder: "Examples: autonomy, connection, rest, meaning...",
          required: true,
        },
        {
          type: "textarea",
          label: "How do you feel when these needs go unmet?",
          placeholder: "Identify emotions that arise...",
          required: true,
        },
        {
          type: "textarea",
          label: "What specific requests could help meet these needs?",
          placeholder: "Consider clear, doable actions...",
          required: true,
        },
        {
          type: "textarea",
          label: "What small step can you take today to honor a need?",
          placeholder: "Identify one action within your control...",
          required: true,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Reframing Journal",
    author: "Dr. Carol Dweck",
    category: "FRAMEWORKS",
    description: "Transform negative thoughts into growth opportunities",
    emoji: "🔄",
    prompts: [
      "What negative thought are you experiencing?",
      "How is this thought affecting you?",
      "What evidence challenges this thought?",
      "What alternative perspective would be more helpful?",
    ],
    structure: {
      title: "Reframing Journal",
      fields: [
        {
          type: "textarea",
          label: "What negative thought are you experiencing?",
          placeholder: "Identify the specific thought...",
          required: true,
        },
        {
          type: "textarea",
          label: "How is this thought affecting you?",
          placeholder: "Note impacts on emotions, behaviors, energy...",
          required: true,
        },
        {
          type: "textarea",
          label: "What evidence challenges this thought?",
          placeholder: "Consider facts that contradict it...",
          required: true,
        },
        {
          type: "textarea",
          label:
            "What's a more balanced or growth-oriented way to view this situation?",
          placeholder: "Create an alternative perspective...",
          required: true,
        },
        {
          type: "textarea",
          label: "What potential growth opportunity exists here?",
          placeholder: "Look for lessons or development...",
          required: true,
        },
        {
          type: "rating",
          label: "Belief in original negative thought (1-10)",
          required: false,
        },
        {
          type: "rating",
          label: "Belief in new perspective (1-10)",
          required: false,
        },
      ],
    },
  },
]
