// Identity Module Data
// Comprehensive values, purpose, and identity exercises

export const VALUES_CATEGORIES = [
  {
    category: "Self-Transcendence",
    values: [
      {
        name: "Benevolence",
        description: "Preserving and enhancing the welfare of those with whom one is in frequent personal contact",
        questions: [
          "How do you show kindness to others daily?",
          "When have you put others' needs before your own?",
          "What acts of service bring you the most fulfillment?"
        ],
        behaviors: ["Helping colleagues", "Volunteering", "Mentoring", "Charitable giving"],
        opposites: ["Selfishness", "Self-centeredness"]
      },
      {
        name: "Universalism",
        description: "Understanding, appreciation, tolerance, and protection for the welfare of all people",
        questions: [
          "How do you contribute to global causes?",
          "What injustices trouble you most?",
          "How do you practice environmental stewardship?"
        ],
        behaviors: ["Environmental activism", "Human rights advocacy", "Cultural openness"],
        opposites: ["Prejudice", "Nationalism"]
      }
    ]
  },
  {
    category: "Self-Enhancement",
    values: [
      {
        name: "Achievement",
        description: "Personal success through demonstrating competence according to social standards",
        questions: [
          "What achievements are you most proud of?",
          "How do you measure success?",
          "What skills are you developing right now?"
        ],
        behaviors: ["Setting goals", "Tracking progress", "Seeking feedback", "Continuous learning"],
        opposites: ["Underachievement", "Complacency"]
      },
      {
        name: "Power",
        description: "Social status and prestige, control or dominance over people and resources",
        questions: [
          "Where do you seek influence?",
          "How do you empower others?",
          "What leadership opportunities have you taken?"
        ],
        behaviors: ["Leadership roles", "Decision-making", "Inspiring others"],
        opposites: ["Submissiveness", "Powerlessness"]
      },
      {
        name: "Hedonism",
        description: "Pleasure and sensuous gratification for oneself",
        questions: [
          "What brings you physical pleasure?",
          "How do you practice self-care?",
          "What indulgences are worth it to you?"
        ],
        behaviors: ["Enjoying美食", "Physical comfort", "Leisure activities", "Travel"],
        opposites: ["Asceticism", "Self-denial"]
      }
    ]
  },
  {
    category: "Openness to Change",
    values: [
      {
        name: "Self-Direction",
        description: "Independent thought and action-choosing, creating, exploring",
        questions: [
          "How do you assert your independence?",
          "What new things have you tried recently?",
          "How do you resist conformity?"
        ],
        behaviors: ["Learning new skills", "Questioning norms", "Personal projects"],
        opposites: ["Conformity", "Tradition"]
      },
      {
        name: "Stimulation",
        description: "Excitement, novelty, and challenge in life",
        questions: [
          "What thrills you?",
          "How do you break out of routine?",
          "What adventures are on your bucket list?"
        ],
        behaviors: ["Travel", "Extreme sports", "Creative pursuits", "Learning"],
        opposites: ["Routine", "Boredom"]
      }
    ]
  },
  {
    category: "Conservation",
    values: [
      {
        name: "Security",
        description: "Safety, harmony, and stability of society, relationships, and self",
        questions: [
          "What makes you feel safe?",
          "How do you plan for the future?",
          "What routines provide stability?"
        ],
        behaviors: ["Emergency savings", "Insurance", "Stable relationships", "Home"],
        opposites: ["Risk-taking", "Chaos"]
      },
      {
        name: "Tradition",
        description: "Respect, commitment, and acceptance of the customs and ideas that one's culture or religion provides",
        questions: [
          "What family traditions do you maintain?",
          "What cultural practices are meaningful to you?",
          "How do you honor your heritage?"
        ],
        behaviors: ["Religious practices", "Family rituals", "Cultural celebrations"],
        opposites: ["Iconoclasm", "Revolution"]
      },
      {
        name: "Conformity",
        description: "Restraint of actions, inclinations, and impulses that may violate social expectations",
        questions: [
          "How do you navigate social norms?",
          "When do you prioritize group harmony?",
          "What rules do you follow willingly?"
        ],
        behaviors: ["Etiquette", "Politeness", "Reliability", "Responsibility"],
        opposites: ["Rebellion", "Disrespect"]
      }
    ]
  }
]

export const PURPOSE_EXERCISES = [
  {
    id: "ikigai",
    title: "Ikigai Discovery",
    duration: "45 min",
    description: "Find your reason for being at the intersection of what you love, what you're good at, what the world needs, and what you can be paid for",
    questions: [
      "What do you love? (Passions)",
      "What are you good at? (Profession)",
      "What does the world need? (Mission)",
      "What can you be paid for? (Vocation)"
    ],
    outcomes: ["Clear purpose statement", "Career alignment", "Life satisfaction"]
  },
  {
    id: "legacy",
    title: "Legacy Letter",
    duration: "30 min",
    description: "Write a letter from your 80-year-old self to your current self",
    prompts: [
      "What did your life mean?",
      "What are you most proud of?",
      "What do you wish you had done differently?",
      "What advice does your future self have?"
    ],
    outcomes: ["Perspective on priorities", "Value clarification", "Motivation"]
  },
  {
    id: "eulogy",
    title: "Eulogy Exercise",
    duration: "20 min",
    description: "Write your ideal eulogy - how you want to be remembered",
    prompts: [
      "What relationships mattered most?",
      "What impact did you leave?",
      "What did you stand for?",
      "How did you make others feel?"
    ],
    outcomes: ["Relationship priorities", "Core values", "Character traits"]
  },
  {
    id: "values-clarification",
    title: "Values Clarification",
    duration: "60 min",
    description: "Deep dive into your top 5 core values using guided reflection",
    process: [
      "List 50 values you admire",
      "Narrow to 20",
      "Narrow to 10",
      "Narrow to 5",
      "Rank in order of importance",
      "Write scenarios for each"
    ],
    outcomes: ["Top 5 values", "Value hierarchy", "Decision-making framework"]
  },
  {
    id: "strengths-discovery",
    title: "Signature Strengths",
    duration: "30 min",
    description: "Identify and leverage your unique character strengths",
    framework: "VIA Character Strengths (24 strengths across 6 virtues)",
    strengths: [
      "Wisdom & Knowledge: Creativity, Curiosity, Openness, Love of Learning, Perspective",
      "Courage: Bravery, Persistence, Integrity, Vitality",
      "Humanity: Love, Kindness, Social Intelligence",
      "Justice: Fairness, Leadership, Teamwork",
      "Temperance: Forgiveness, Humility, Prudence, Self-Regulation",
      "Transcendence: Appreciation, Hope, Humor, Spirituality"
    ],
    outcomes: ["Top strengths", "Ways to use strengths daily", "Strength-based goals"]
  }
]

export const IDENTITY_PROMPTS = {
  daily: [
    "What aspect of yourself are you exploring right now?",
    "How has your sense of self changed in the past year?",
    "What parts of yourself are you still discovering?",
    "When do you feel most like your authentic self?",
    "What would your 80-year-old self teach you today?"
  ],
  weekly: [
    "What boundaries have you set this week to honor your values?",
    "How have you grown closer to your authentic self?",
    "What limiting beliefs about yourself are you releasing?",
    "How have you honored your core values this week?",
    "What new aspect of yourself are you curious about?"
  ],
  deep: [
    "Write about a time when you felt completely aligned with your values",
    "Describe your ideal life - what does it reveal about your values?",
    "What societal expectations have you internalized that may not be yours?",
    "How do you balance your multiple identities (professional, family, personal)?",
    "What would you do if you knew you could not fail?"
  ]
}

export const LEGACY_FRAMEWORK = {
  dimensions: [
    {
      name: "Impact",
      questions: [
        "How do you want to impact others?",
        "What change do you want to see in the world?",
        "What will you leave behind?"
      ],
      metrics: ["Lives touched", "Systems changed", "Knowledge shared"]
    },
    {
      name: "Relationships",
      questions: [
        "What relationships matter most?",
        "How do you want to be remembered as a friend/family member?",
        "What is your approach to love and connection?"
      ],
      metrics: ["Quality connections", "Time with loved ones", "Community building"]
    },
    {
      name: "Growth",
      questions: [
        "How do you want to evolve?",
        "What skills will you develop?",
        "What wisdom will you gain?"
      ],
      metrics: ["Lessons learned", "Personal milestones", "Transformation"]
    },
    {
      name: "Expression",
      questions: [
        "How do you express yourself?",
        "What creative contributions will you make?",
        "What stories will you tell?"
      ],
      metrics: ["Creative works", "Voices inspired", "Stories shared"]
    }
  ]
}

export const SELF_DISCOVERY_EXERCISES = [
  {
    title: "Values Integration",
    duration: "45 min",
    steps: [
      "Write your top 5 values",
      "For each value, write a story when you lived it fully",
      "For each value, write a story when you betrayed it",
      "Identify patterns",
      "Create action commitments"
    ]
  },
  {
    title: "Shadow Work",
    duration: "60 min",
    steps: [
      "List qualities you dislike in others",
      "Identify which of these you possess",
      "Explore where these shadows protect you",
      "Journal about accepting your shadow",
      "Create integration practices"
    ]
  },
  {
    title: "Future Self Visualization",
    duration: "20 min",
    steps: [
      "Close your eyes and imagine yourself at 80",
      "Notice your environment, relationships, health",
      "What advice does your future self give?",
      "What does your future self wish you knew now?",
      "Write a letter from your future self"
    ]
  },
  {
    title: "Identity Archetypes",
    duration: "45 min",
    framework: "Explore which archetypes resonate with you",
    archetypes: [
      { name: "Innocent", fear: "Punishment", desire: "Happiness", strategy: "Hope" },
      { name: "Orphan", fear: "Abandonment", desire: "Connection", strategy: "Belonging" },
      { name: "Warrior", fear: "Weakness", desire: "Strength", strategy: "Competence" },
      { name: "Caregiver", fear: "Selfishness", desire: "Compassion", strategy: "Generosity" },
      { name: "Explorer", fear: "Conformity", desire: "Freedom", strategy: "Discovery" },
      { name: "Rebel", fear: "Ineffectiveness", desire: "Revolution", strategy: "Disruption" },
      { name: "Creator", fear: "Mediocrity", desire: "Expression", strategy: "Innovation" },
      { name: "Jester", fear: "Boredom", desire: "Joy", strategy: "Play" },
      { name: "Sage", fear: "Deception", desire: "Truth", strategy: "Understanding" },
      { name: "Magician", fear: "Chaos", desire: "Transformation", strategy: "Mastery" }
    ]
  }
]
