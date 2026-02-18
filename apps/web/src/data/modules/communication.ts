// Communication Module Data
// Public speaking, active listening, and communication skills

export const PUBLIC_SPEAKING = {
  fear_management: {
    causes: [
      "Fear of judgment",
      "Past negative experiences",
      "Lack of preparation",
      "Perfectionism",
      "Physical symptoms of anxiety",
      "Fear of forgetting",
      "High stakes situations",
      "Lack of control"
    ],
    strategies: [
      "Power poses before speaking",
      "Deep breathing (4-7-8)",
      "Reframe anxiety as excitement",
      "Focus on message, not self",
      "Know your content thoroughly",
      "Visualize success",
      "Start with a smile",
      "Connect with friendly faces",
      "Accept imperfection",
      "Practice, practice, practice"
    ],
    physical_tips: [
      "Stand with feet shoulder-width apart",
      "Open posture",
      "Gestures at waist level",
      "Pause after key points",
      "Speak slower than feels natural",
      "Project from diaphragm",
      "Make eye contact (3-5 seconds each)",
      "Avoid filler words"
    ]
  },
  structure: {
    opening: [
      "Start with a hook (question, story, statistic)",
      "Establish credibility",
      "Preview main points",
      "Set expectations",
      "Transition to body"
    ],
    body: [
      "Limit to 3-5 main points",
      "Use stories to illustrate",
      "Include statistics sparingly",
      "Make one point at a time",
      "Use transitions between points",
      "Include call-to-action"
    ],
    closing: [
      "Summarize key takeaways",
      "End with powerful quote or story",
      "Include clear call-to-action",
      "Thank audience",
      "End with strong final statement"
    ]
  },
  storytelling: {
    elements: [
      "Strong opening hook",
      "Clear protagonist",
      "Central conflict/challenge",
      "Emotional journey",
      "Transformation/insight",
      "Connection to audience",
      "Clear lesson or meaning",
      "Satisfying resolution"
    ],
    types: [
      { name: "Personal Story", purpose: "Builds connection and credibility" },
      { name: "Customer/User Story", purpose: "Demonstrates impact" },
      { name: "Hypothetical Scenario", purpose: "Creates vivid picture" },
      { name: "Historical Anecdote", purpose: "Provides context" },
      { name: "Parable/Analogy", purpose: "Makes abstract concrete" }
    ],
    tips: [
      "Start in the middle of action",
      "Include sensory details",
      "Show, don't tell",
      "Include struggle and triumph",
      "Be authentic and vulnerable",
      "Practice delivery",
      "Know your ending",
      "Connect to message"
    ]
  },
  vocal_variety: {
    volume: [
      "Project without shouting",
      "Vary volume for emphasis",
      "Speak quieter for suspense",
      "Louder for key points"
    ],
    pace: [
      "Slow down for important points",
      "Speed up for less critical info",
      "Use pauses strategically",
      "Avoid rushing when nervous",
      "Normal pace: 130-150 words/min"
    ],
    pitch: [
      "Vary pitch for engagement",
      "Higher pitch shows enthusiasm",
      "Lower pitch for authority",
      "Avoid monotone"
    ],
    tone: [
      "Match tone to content",
      "Show enthusiasm for your topic",
      "Convey authenticity",
      "Adjust for audience"
    ]
  },
  body_language: {
    posture: [
      "Stand tall with shoulders back",
      "Weight evenly distributed",
      "Open stance",
      "Avoid fidgeting",
      "Plant feet for stability"
    ],
    gestures: [
      "Use purposeful gestures",
      "Hands visible and open",
      "Gesture at natural waist level",
      "Avoid crossing arms",
      "Pointing is okay (open hand)"
    ],
    eye_contact: [
      "Triangle method (left, center, right)",
      "3-5 seconds per person",
      "Connect with different sections",
      "Acknowledge questions",
      "Avoid looking at notes/screens"
    ],
    movement: [
      "Use space purposefully",
      "Move to emphasize points",
      "Avoid pacing",
      "Come forward when important",
      "Step back for transitions"
    ]
  }
}

export const ACTIVE_LISTENING = {
  components: [
    {
      name: "Attending",
      description: "Giving full attention to the speaker",
      techniques: [
        "Maintain eye contact",
        "Face the speaker",
        "Remove distractions",
        "Show you're listening (nodding)",
        "Adopt open posture"
      ]
    },
    {
      name: "Following",
      description: "Showing engagement and encouraging speaker",
      techniques: [
        "Use verbal encouragers (I see, go on)",
        "Ask clarifying questions",
        "Paraphrase what you heard",
        "Summarize periodically",
        "Don't interrupt"
      ]
    },
    {
      name: "Reflecting",
      description: "Mirroring the speaker's feelings and content",
      techniques: [
        "Reflect content: So what I hear is...",
        "Reflect feelings: It sounds like you're feeling...",
        "Validate emotions: That makes complete sense",
        "Show empathy",
        "Avoid judgment"
      ]
    },
    {
      name: "Suspending",
      description: "Putting aside your own agenda",
      techniques: [
        "Avoid preparing your response",
        "Let go of assumptions",
        "Be curious, not critical",
        "Allow silence",
        "Focus on understanding"
      ]
    }
  ],
  barriers: [
    "Thinking about response",
    "Distractions (phone, environment)",
    "Prejudice or bias",
    "Interrupting",
    "Finishing sentences",
    "Making it about yourself",
    "Giving unsolicited advice",
    "Judging or criticizing",
    "Lack of interest",
    "Physical discomfort"
  ],
  practice_exercises: [
    {
      name: "Mirroring Practice",
      steps: [
        "Find a partner",
        "Speaker talks for 2 min on any topic",
        "Listener reflects back content and feelings",
        "Speaker confirms accuracy",
        "Switch roles"
      ]
    },
    {
      name: "Question Ladder",
      steps: [
        "Start with surface questions",
        "Move to open questions",
        "Ask about feelings",
        "Explore values and beliefs",
        "Deep understanding questions"
      ]
    },
    {
      name: "Silence Practice",
      steps: [
        "Practice comfortable pauses",
        "Count to 5 before responding",
        "Allow space for thoughts",
        "Don't rush to fill silence",
        "Notice what arises"
      ]
    }
  ]
}

export const NONVIOLENT_COMMUNICATION = {
  components: [
    {
      name: "Observations",
      description: "Stating facts without evaluation",
      vs: [
        "Criticizing: You never listen",
        "Observing: When you look at your phone during our conversation",
        "Criticizing: You're so lazy",
        "Observing: I notice the dishes haven't been washed in 3 days"
      ],
      tips: [
        "Use specific, observable language",
        "Avoid generalizations (never, always)",
        "Separate observation from interpretation",
        "State what you noticed"
      ]
    },
    {
      name: "Feelings",
      description: "Identifying and expressing emotions",
      vs: [
        "What we often say: I feel like you don't care",
        "Feelings: I feel lonely, hurt, scared",
        "What we often say: I feel that you're wrong",
        "Feelings: I feel frustrated, confused"
      ],
      feelings_list: {
        angry: ["frustrated", "annoyed", "irritated", "enraged"],
        sad: ["disappointed", "hurt", "lonely", "grief"],
        scared: ["anxious", "worried", "terrified", "nervous"],
        happy: ["joyful", "grateful", "excited", "peaceful"],
        surprised: ["amazed", "confused", "shocked", "disbelief"]
      },
      tips: [
        "Own your feelings (I feel, not you make me feel)",
        "Distinguish feelings from thoughts",
        "Be vulnerable",
        "Check in with body for emotions"
      ]
    },
    {
      name: "Needs",
      description: "Identifying underlying needs",
      universal_needs: [
        "Autonomy", "Connection", "Integrity", "Play",
        "Peace", "Meaning", "Celebration", "Interdependence"
      ],
      tips: [
        "Connect feelings to needs",
        "Needs are different from strategies",
        "All needs are valid",
        "Find the underlying need"
      ]
    },
    {
      name: "Requests",
      description: "Making clear, actionable requests",
      vs: [
        "Demands: You must stop doing this",
        "Requests: Would you be willing to...?",
        "Demands: You have to listen",
        "Requests: Can you repeat what you heard me say?"
      ],
      characteristics: [
        "Positive (what to do, not what not to do)",
        "Specific and concrete",
        "Actionable and doable",
        "Asked with respect",
        "Open to hearing no"
      ]
    }
  ],
  practice: [
    {
      scenario: "Partner comes home late",
      nvc: "When you come home after 10pm (observation), I feel lonely and scared (feelings) because I need connection and safety (needs). Would you be willing to text me if you'll be late? (request)"
    },
    {
      scenario: "Colleague takes credit for your work",
      nvc: "When you presented my ideas as yours in the meeting (observation), I feel hurt and angry (feelings) because I need recognition and fairness (needs). Would you be willing to acknowledge my contribution next time? (request)"
    },
    {
      scenario: "Friend cancels plans",
      nvc: "When you cancelled our lunch plans again (observation), I feel disappointed (feelings) because I need connection and predictability (needs). Would you be willing to plan something specific for next week? (request)"
    }
  ]
}

export const CONFLICT_RESOLUTION = {
  styles: [
    {
      style: "Competing",
      approach: "Assertive, win-lose",
      use_when: ["Emergencies", "Quick decisions needed", "Unpopular actions", "Protecting rights"],
      avoid_when: ["Long-term relationships", "Complex issues", "When you may be wrong"]
    },
    {
      style: "Collaborating",
      approach: "Assertive and cooperative, win-win",
      use_when: ["Important relationships", "Complex issues", "Both perspectives needed", "Long-term solutions"],
      avoid_when: ["Quick decisions needed", "Minor issues", "No time"]
    },
    {
      style: "Compromising",
      approach: "Moderate on both axes",
      use_when: ["Temporary solutions", "Equal power balance", "Deadline pressure"],
      avoid_when: ["Major issues", "Long-term relationships"]
    },
    {
      style: "Accommodating",
      approach: "Cooperative, unassertive",
      use_when: ["Preserving relationships", "You know you're wrong", "Building goodwill"],
      avoid_when: ["Important issues", "Being taken advantage of"]
    },
    {
      style: "Avoiding",
      approach: "Unassertive, uncooperative",
      use_when: ["Trivial issues", "Cooling off needed", "No chance of resolution"],
      avoid_when: ["Important issues", "Time pressure"]
    }
  ],
  process: [
    {
      step: "Prepare",
      actions: [
        "Clarify your interests",
        "Know your BATNA (Best Alternative to Negotiated Agreement)",
        "Anticipate other side's position",
        "Choose right time and place",
        "Manage your emotions"
      ]
    },
    {
      step: "Open",
      actions: [
        "Create safe environment",
        "Share your perspective without blame",
        "Invite their perspective",
        "Show genuine curiosity"
      ]
    },
    {
      step: "Explore",
      actions: [
        "Listen actively",
        "Ask open questions",
        "Paraphrase to confirm understanding",
        "Identify underlying interests",
        "Look for common ground"
      ]
    },
    {
      step: "Negotiate",
      actions: [
        "Generate options together",
        "Focus on interests, not positions",
        "Look for win-win solutions",
        "Be creative",
        "Stay focused on goals"
      ]
    },
    {
      step: "Agree",
      actions: [
        "Summarize agreement",
        "Clarify actions and responsibilities",
        "Set follow-up if needed",
        "Express appreciation",
        "Document if important"
      ]
    },
  ]
}

export const WRITTEN_COMMUNICATION = {
  emails: {
    structure: [
      "Clear subject line",
      "Personal greeting",
      "Opening statement (purpose)",
      "Body (main content)",
      "Call to action",
      "Closing",
      "Signature"
    ],
    tips: [
      "Subject line: Clear and specific",
      "Get to point quickly",
      "Use short paragraphs",
      "Bullet points for lists",
      "Proofread before sending",
      "Consider timing",
      "CC only necessary people",
      "Reply-all sparingly"
    ]
  },
  messages: {
    professional: [
      "Clear purpose",
      "Appropriate greeting",
      "Complete thoughts",
      "Proper grammar",
      "Respectful tone",
      "Quick response time",
      "Appropriate emoji use",
      "Right channel for message"
    ],
    difficult: [
      "Wait before responding",
      "Assume positive intent",
      "Be direct but kind",
      "Focus on issue, not person",
      "Offer solutions",
      "Pick up the phone if needed"
    ]
  }
}

export const FEEDBACK_SKILLS = {
  receiving_feedback: [
    "Listen without defending",
    "Ask clarifying questions",
    "Thank the person for feedback",
    "Reflect before responding",
    "Separate feedback from your worth",
    "Look for patterns",
    "Decide what to implement",
    "Follow up on changes"
  ],
  giving_feedback: {
    sandwich_method: [
      "Positive observation",
      "Constructive feedback",
      "Positive reinforcement"
    ],
    SBI_model: [
      "Situation: When [specific situation]",
      "Behavior: [observable behavior]",
      "Impact: [what you observed]"
    ],
    tips: [
      "Be specific, not general",
      "Focus on behavior, not person",
      "Timely (close to event)",
      "Private setting",
      "Ask permission if appropriate",
      "Offer to help improve",
      "Balance positive and constructive"
    ]
  }
}
