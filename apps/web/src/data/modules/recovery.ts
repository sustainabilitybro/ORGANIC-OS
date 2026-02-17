// Recovery Module Data
// Burnout prevention, stress management, and recovery strategies

export const BURNOUT_ASSESSMENT = {
  dimensions: [
    {
      name: "Exhaustion",
      description: "Feeling drained, depleted, and exhausted",
      questions: [
        "How often do you feel physically drained?",
        "How often do you feel emotionally exhausted?",
        "How often do you feel tired upon waking?",
        "How often do you lack energy for daily tasks?"
      ],
      scale: "0-6 (Never to Daily)",
      thresholds: {
        low: [0, 9],
        moderate: [10, 17],
        high: [18, 24]
      }
    },
    {
      name: "Cynicism",
      description: "Detachment, negativity, and emotional distance from work/life",
      questions: [
        "How often do you feel detached from your work?",
        "How often do you doubt the meaning of your work?",
        "How often do you feel indifferent about your responsibilities?",
        "How often do you criticize your work environment?"
      ],
      scale: "0-6 (Never to Daily)",
      thresholds: {
        low: [0, 3],
        moderate: [4, 9],
        high: [10, 24]
      }
    },
    {
      name: "Inefficacy",
      description: "Feeling incompetent, unproductive, and lacking achievement",
      questions: [
        "How often do you feel you're not making progress?",
        "How often do you doubt your abilities?",
        "How often do you feel you don't contribute meaningfully?",
        "How often do you feel inadequate?"
      ],
      scale: "0-6 (Never to Daily)",
      thresholds: {
        low: [0, 5],
        moderate: [6, 11],
        high: [12, 24]
      }
    }
  ],
  total_score_interpretation: {
    "0-19": "Low burnout risk - Maintain your practices",
    "20-39": "Moderate burnout risk - Increase recovery activities",
    "40-59": "High burnout risk - Immediate intervention needed",
    "60+": "Severe burnout - Professional help recommended"
  }
}

export const STRESS_MANAGEMENT = {
  categories: [
    {
      name: "Acute Stress",
      duration: "Minutes to hours",
      description: "Short-term stress response to immediate threats or demands",
      examples: ["Deadlines", "Presentation", "Argument", "Traffic"],
      management: [
        "Deep breathing (4-7-8)",
        "Progressive muscle relaxation",
        "Brief meditation (5-10 min)",
        "Physical activity",
        "Grounding (5-4-3-2-1)",
        "Positive self-talk",
        "Brief time-out"
      ]
    },
    {
      name: "Episodic Acute Stress",
      duration: "Frequent acute stress episodes",
      description: "When acute stressors happen frequently",
      examples: ["Constant deadlines", "Chronic conflict", "Unstable environment"],
      management: [
        "Long-term stressor identification",
        "Lifestyle restructuring",
        "Regular relaxation practice",
        "Boundary setting",
        "Social support network",
        "Professional help (therapy)"
      ]
    },
    {
      name: "Chronic Stress",
      duration: "Weeks to years",
      description: "Persistent, ongoing stress that wears you down over time",
      examples: ["Difficult relationship", "Unfulfilling job", "Poverty", "Trauma"],
      management: [
        "Major life assessment",
        "Values clarification",
        "Significant changes (job, relationship)",
        "Regular therapy",
        "Strong support system",
        "Stress-resistant lifestyle"
      ]
    }
  ],
  stress_indicators: {
    physical: [
      "Headaches",
      "Muscle tension/pain",
      "Fatigue",
      "Sleep disturbances",
      "Digestive issues",
      "Weakened immune system",
      "Weight changes",
      "Chest pain",
      "Rapid heartbeat"
    ],
    emotional: [
      "Anxiety",
      "Depression",
      "Irritability",
      "Feeling overwhelmed",
      "Mood swings",
      "Feeling withdrawn",
      "Hopelessness",
      "Sadness"
    ],
    cognitive: [
      "Memory problems",
      "Difficulty concentrating",
      "Racing thoughts",
      "Negative thinking",
      "Poor judgment",
      "Constant worrying",
      "Forgetfulness",
      "Disorganization"
    ],
    behavioral: [
      "Social withdrawal",
      "Changes in appetite",
      "Substance use",
      "Procrastination",
      "Neglecting responsibilities",
      "Isolating from others",
      "Using drugs/alcohol",
      "Angry outbursts"
    ]
  },
  coping_strategies: {
    immediate: [
      { strategy: "Box Breathing", description: "4 counts in, 4 hold, 4 out, 4 hold", duration: "5 min" },
      { strategy: "5-4-3-2-1 Grounding", description: "5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste", duration: "2 min" },
      { strategy: "Progressive Relaxation", description: "Tense and release muscle groups", duration: "10 min" },
      { strategy: "Brief Walk", description: "Get outside, move your body", duration: "10-15 min" },
      { strategy: "Call a Friend", description: "Social support", duration: "15-30 min" },
      { strategy: "Journaling", description: "Dump thoughts on paper", duration: "10-15 min" }
    ],
    short_term: [
      "Schedule worry time (15 min daily)",
      "Prioritize tasks",
      "Delegate when possible",
      "Take breaks throughout day",
      "Practice gratitude",
      "Limit caffeine",
      "Ensure adequate sleep",
      "Exercise regularly"
    ],
    long_term: [
      "Lifestyle assessment and restructuring",
      "Build strong support network",
      "Regular therapy or coaching",
      "Mindfulness practice",
      "Find meaning and purpose",
      "Work on boundary skills",
      "Career/life transitions",
      "Spiritual practice"
    ]
  }
}

export const RECOVERY_ACTIVITIES = [
  {
    name: "Physical Recovery",
    activities: [
      { name: "Sleep", tip: "Prioritize 7-9 hours, consistent schedule" },
      { name: "Restorative Yoga", tip: "Gentle poses, long holds" },
      { name: "Massage", tip: "Professional or self-massage" },
      { name: "Hot Bath", tip: "Epsom salts, essential oils" },
      { name: "Nature Walk", tip: "Slow pace, mindful observation" },
      { name: "Stretching", tip: "Full body, focus on tight areas" },
      { name: "Sleep Hygiene", tip: "Cool, dark, quiet room" },
      { name: "Napping", tip: "20 min power nap or 90 min full cycle" }
    ]
  },
  {
    name: "Mental Recovery",
    activities: [
      { name: "Meditation", tip: "Start with 10 min, guided" },
      { name: "Reading", tip: "Fiction for pure escape" },
      { name: "Nature Exposure", tip: "Sit outside, forest bathing" },
      { name: "Creative Expression", tip: "Art, music, writing" },
      { name: "Daydreaming", tip: "Allow your mind to wander" },
      { name: "Puzzles/Games", tip: "Crosswords, jigsaw, chess" },
      { name: "Mindful Eating", tip: "Without screens, savor flavors" },
      { name: "Digital Detox", tip: "Screen-free time" }
    ]
  },
  {
    name: "Emotional Recovery",
    activities: [
      { name: "Therapy", tip: "Regular sessions with professional" },
      { name: "Journaling", tip: "Express feelings freely" },
      { name: "Gratitude Practice", tip: "Daily list of 3 things" },
      { name: "Inner Child Work", tip: "Address past wounds" },
      { name: "Boundary Setting", tip: "Say no to draining requests" },
      { name: "Forgiveness Practice", tip: "Release resentments" },
      { name: "Counseling", tip: "Professional guidance" },
      { name: "Support Groups", tip: "Connect with peers" }
    ]
  },
  {
    name: "Social Recovery",
    activities: [
      { name: "Quality Time", tip: "Deep connection with loved ones" },
      { name: "Play", tip: "With children or pets" },
      { name: "Laughter", tip: "Comedy, funny friends" },
      { name: "Hugs", tip: "Physical affection releases oxytocin" },
      { name: "Conversation", tip: "Deep, meaningful talk" },
      { name: "Community", tip: "Group activities, volunteering" },
      { name: "Solitude", tip: "Alone time for introverts" },
      { name: "Boundaries", tip: "Limit draining relationships" }
    ]
  },
  {
    name: "Sensory Recovery",
    activities: [
      { name: "Aromatherapy", tip: "Calming scents (lavender)" },
      { name: "Sound Healing", tip: "Binaural beats, nature sounds" },
      { name: "Light Therapy", tip: "Morning bright light" },
      { name: "Warmth", tip: "Blankets, warm drinks" },
      { name: "Touch", tip: "Massage, holding warm drink" },
      { name: "Nature", tip: "Greenery, natural environments" },
      { name: "Comfort Items", tip: "Cozy surroundings" },
      { name: "Minimal Stimulation", tip: "Quiet, dimly lit space" }
    ]
  }
]

export const STRESS_RESILIENCE = {
  factors: [
    {
      factor: "Social Support",
      description: "Having people to rely on during difficult times",
      building: [
        "Cultivate relationships",
        "Join groups/communities",
        "Be a good listener",
        "Ask for help when needed",
        "Reciprocate support"
      ]
    },
    {
      factor: "Sense of Control",
      description: "Believing you can influence outcomes",
      building: [
        "Focus on what you can control",
        "Set achievable goals",
        "Build competence through mastery",
        "Practice decision-making",
        "Challenge victim mentality"
      ]
    },
    {
      factor: "Stress Management Skills",
      description: "Having effective tools to cope with stress",
      building: [
        "Learn relaxation techniques",
        "Practice mindfulness",
        "Develop problem-solving skills",
        "Build emotional regulation",
        "Exercise regularly"
      ]
    },
    {
      factor: "Positive Outlook",
      description: "Ability to find meaning and maintain hope",
      building: [
        "Practice gratitude",
        "Find meaning in challenges",
        "Learn from setbacks",
        "Focus on growth",
        "Cultivate optimism"
      ]
    },
    {
      factor: "Physical Health",
      description: "A healthy body supports mental resilience",
      building: [
        "Prioritize sleep",
        "Exercise regularly",
        "Eat nutritious foods",
        "Avoid substance abuse",
        "Get regular check-ups"
      ]
    },
    {
      factor: "Purpose/Meaning",
      description: "Having goals and meaning in life",
      building: [
        "Identify core values",
        "Set meaningful goals",
        "Engage in purposeful work",
        "Help others",
        "Align actions with values"
      ]
    }
  ],
  daily_practices: [
    "Morning meditation (5-10 min)",
    "Gratitude journaling (3 things)",
    "Movement/exercise",
    "Social connection",
    "Nature exposure",
    "Evening reflection",
    "Quality sleep",
    "Healthy meals",
    "Breathwork",
    "Boundaries"
  ]
}

export const WORK_RECOVERY = {
  lunch_break_activities: [
    "Walking (even 10 min)",
    "Meditation (5-10 min)",
    "Reading",
    "Napping (20 min)",
    "Mindful eating",
    "Stretching",
    "Nature exposure",
    "Brief journaling"
  ],
  micro_breaks: [
    "Every 90 min, take 5-10 min break",
    "Look away from screens (20-20-20 rule)",
    "Stretch standing",
    "Walk to get water",
    "Deep breathing (1-2 min)",
    "Shoulder/neck rolls",
    "Quick mindfulness check-in"
  ],
  end_of_day_ritual: [
    "Review tomorrow's tasks",
    "Write down incomplete items",
    "Close all tabs/documents",
    "Shut down computer",
    "Transition activity (walk, commute)",
    "Change clothes",
    "Notice the transition"
  ],
  weekend_recovery: [
    "No work email/Slack (if possible)",
    "Sleep as needed",
    "Physical activity for fun",
    "Creative/hobby pursuits",
    "Social connection",
    "Nature time",
    "Complete rest days",
    "Screen-free periods"
  ]
}

export const RELAXATION_TECHNIQUES = [
  {
    name: "Box Breathing",
    steps: [
      "Inhale slowly for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale slowly for 4 counts",
      "Hold empty for 4 counts",
      "Repeat 4-10 cycles"
    ],
    benefits: ["Reduces stress", "Lowers blood pressure", "Improves focus", "Calms nervous system"],
    when: "Before stressful events, during breaks, before bed"
  },
  {
    name: "4-7-8 Breathing",
    steps: [
      "Inhale quietly through nose for 4 counts",
      "Hold breath for 7 counts",
      "Exhale completely through mouth for 8 counts",
      "Repeat 3-4 cycles"
    ],
    benefits: ["Promotes sleep", "Reduces anxiety", "Manages cravings", "Calms mind"],
    when: "Before sleep, when anxious, when can't sleep"
  },
  {
    name: "Progressive Muscle Relaxation",
    steps: [
      "Find comfortable position",
      "Start with feet and work up",
      "Tense each muscle group for 5 sec",
      "Release and notice relaxation",
      "Progress through all muscle groups"
    ],
    benefits: ["Releases physical tension", "Improves sleep", "Reduces anxiety", "Body awareness"],
    when: "Before bed, after exercise, during stress"
  },
  {
    name: "Body Scan Meditation",
    steps: [
      "Lie down comfortably",
      "Close eyes, take deep breaths",
      "Bring attention to toes",
      "Slowly move attention up through body",
      "Notice sensations without judgment",
      "End at top of head"
    ],
    benefits: ["Body awareness", "Relaxation", "Pain management", "Stress relief"],
    when: "Before bed, during breaks, when tense"
  },
  {
    name: "Visualization",
    steps: [
      "Close eyes, get comfortable",
      "Imagine peaceful place in detail",
      "Engage all senses",
      "Stay in visualization",
      "Gradually return to present"
    ],
    benefits: ["Stress reduction", "Improved focus", "Better sleep", "Performance enhancement"],
    when: "Before sleep, before events, during breaks"
  },
  {
    name: "Mindful Breathing",
    steps: [
      "Sit comfortably",
      "Close eyes or soften gaze",
      "Follow breath without controlling",
      "Notice sensations of breathing",
      "When mind wanders, gently return",
      "Continue for 5-20 min"
    ],
    benefits: ["Reduces stress", "Improves focus", "Emotional regulation", "Present-moment awareness"],
    when: "Morning, breaks, anytime you feel stressed"
  }
]

export const BURNOUT_PREVENTION_PLAN = {
  weekly: [
    "At least 1 full rest day",
    "2-3 sessions of physical exercise",
    "Daily meditation or mindfulness",
    "Social connection with friends/family",
    "Hobby time for enjoyment",
    "Nature exposure (minimum 2 hours)",
    "Reflection on energy levels"
  ],
  monthly: [
    "One day off from all work",
    "Activity completely unrelated to work",
    "Review of stress levels and triggers",
    "Adjustment of boundaries as needed",
    "Professional development or learning",
    "Physical health check-up",
    "Financial review and stress assessment"
  ],
  quarterly: [
    "Major life assessment",
    "Goal review and reset",
    "Vacation or extended break",
    "Relationship check-in",
    "Career/professional development review",
    "Home/work environment decluttering",
    "Therapy or coaching session"
  ],
  annually: [
    "Extended vacation (1-2 weeks)",
    "Major life reflection",
    "Value clarification exercise",
    "Complete life audit",
    "Long-term goal setting",
    "Relationship investment",
    "Physical comprehensive check-up"
  ]
}
