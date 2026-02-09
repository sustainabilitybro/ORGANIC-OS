// Atom Economy Module Data
// Process optimization and efficiency principles

export const ATOM_ECONOMY_PRINCIPLES = {
  definition: "Atom economy = (Molecular Weight of Desired Product / Sum of Molecular Weights of All Reactants) × 100",
  application_to_life: [
    { principle: "Maximize desired outputs", description: "Focus energy on what matters most" },
    { principle: "Minimize waste", description: "Reduce unnecessary effort, time, resources" },
    { principle: "Efficient reactions", description: "Get most results from least input" },
    { principle: "Byproduct utilization", description: "Find use for what might be wasted" },
    { principle: "Design for efficiency", description: "Create systems that work well" }
  ],
  metrics: [
    { name: "Task Completion Rate", calculation: "Completed / Total × 100" },
    { name: "Focus Time Ratio", calculation: "Deep work / Total work time × 100" },
    { name: "Energy Allocation", calculation: "Essential / Total energy × 100" },
    { name: "Outcome Efficiency", calculation: "Desired outcomes / Actions taken × 100" }
  ]
}

export const PRODUCTIVITY_SYSTEMS = [
  {
    name: "Getting Things Done (GTD)",
    creator: "David Allen",
    principles: [
      "Capture everything that has your attention",
      "Clarify what things mean and what to do about them",
      "Organize into actionable categories",
      "Reflect on what's happening",
      "Engage with appropriate tasks"
    ],
    steps: [
      {
        step: "Capture",
        actions: [
          "Collect all inputs (emails, tasks, ideas)",
          "Use trusted system (notebooks, apps)",
          "Empty mind regularly"
        ]
      },
      {
        step: "Clarify",
        actions: [
          "Is it actionable?",
          "If yes: What's the next action?",
          "If no: Delete, reference, or incubate"
        ]
      },
      {
        step: "Organize",
        actions: [
          "Projects list",
          "Next actions by context (@phone, @computer, @errands)",
          "Waiting for list",
          "Someday/maybe list",
          "Reference system"
        ]
      },
      {
        step: "Reflect",
        actions: [
          "Weekly review",
          "Update lists",
          "Clean inbox",
          "Plan next week"
        ]
      },
      {
        step: "Engage",
        actions: [
          "Choose based on context, energy, priority",
          "4 criteria: Available time, Available energy, Priority, Context"
        ]
      }
    ]
  },
  {
    name: "Time Blocking",
    principles: [
      "Schedule everything",
      "Protect deep work blocks",
      "Batch similar tasks",
      "Build in buffers"
    ],
    implementation: [
      {
        time: "Morning",
        block: "Deep work (2-4 hours)",
        tip: "Most important task first"
      },
      {
        time: "Mid-morning",
        block: "Admin tasks",
        tip: "Email, meetings"
      },
      {
        time: "Afternoon",
        block: "Collaborative work",
        tip: "Calls, reviews"
      },
      {
        time: "Late afternoon",
        block: "Planning tomorrow",
        tip: "Review and prep"
      }
    ]
  },
  {
    name: "Pomodoro Technique",
    principles: [
      "Work in focused sprints",
      "Take regular breaks",
      "Protect focus time",
      "Use timer as commitment"
    ],
    structure: [
      { interval: "25 min", type: "Work", focus: "Single task only" },
      { interval: "5 min", type: "Break", focus: "Rest, stretch, move" },
      { interval: "25 min", type: "Work", focus: "Continue task" },
      { interval: "5 min", type: "Break", focus: "Rest, stretch" },
      { interval: "25 min", type: "Work", focus: "Continue task" },
      { interval: "5 min", type: "Break", focus: "Rest, stretch" },
      { interval: "25 min", type: "Work", focus: "Continue task" },
      { interval: "5 min", type: "Break", focus: "Rest, stretch" },
      { interval: "25 min", type: "Work", focus: "Continue task" },
      { interval: "20-30 min", type: "Long break", focus: "Major rest, walk, meal" }
    ]
  },
  {
    name: "Eat That Frog",
    principles: [
      "Do your most important task first",
      "Don't start with easy tasks to procrastinate",
      "Tackle what scares you most"
    ],
    implementation: [
      "Identify 3 most important tasks each day",
      "Do #1 before anything else",
      "Don't check email first",
      "No social media first",
      "Reward yourself after"
    ]
  }
]

export const FOCUS_OPTIMIZATION = {
  conditions: [
    {
      factor: "Environment",
      optimal: [
        "Quiet dedicated workspace",
        "Clean, organized desk",
        "Good lighting",
        "Comfortable temperature",
        "Plants/nature elements"
      ],
      avoid: [
        "Cluttered spaces",
        "Noisy environments",
        "Poor lighting",
        "Discomfort",
        "Digital distractions"
      ]
    },
    {
      factor: "Mental State",
      optimal: [
        "Clear mind (GTD captured)",
        "Good sleep",
        "Proper nutrition",
        "Exercise completed",
        "Meditation practiced"
      ],
      avoid: [
        "Unresolved tasks on mind",
        "Hunger/thirst",
        "Physical discomfort",
        "High stress",
        "Decision fatigue"
      ]
    },
    {
      factor: "Time of Day",
      optimal: [
        "Know your chronotype",
        "Schedule deep work in peak hours",
        "Match tasks to energy levels",
        "Use morning for important work"
      ],
      tips: [
        "Track energy for 2 weeks",
        "Identify peak and dip times",
        "Schedule accordingly",
        "Experiment with schedules"
      ]
    }
  ],
  techniques: [
    {
      name: "Single-Tasking",
      description: "Focus on one thing at a time",
      benefits: ["40% faster completion", "Higher quality", "Less stress"],
      implementation: [
        "Turn off notifications",
        "Close unrelated tabs/apps",
        "Use website blockers if needed",
        "Practice returning to task"
      ]
    },
    {
      name: "Theme Days",
      description: "Assign themes to days",
      examples: [
        "Monday: Planning & Strategy",
        "Tuesday: Deep Work",
        "Wednesday: Collaboration",
        "Thursday: Deep Work",
        "Friday: Review & Admin"
      ]
    },
    {
      name: "Task Batching",
      description: "Group similar tasks together",
      examples: [
        "Email batch (check 3x daily)",
        "Calls batch (all calls one block)",
        "Meetings cluster (back-to-back)",
        "Admin tasks cluster",
        "Creative work block"
      ]
    }
  ]
}

export const ENERGY_MANAGEMENT = {
  pillars: [
    {
      name: "Physical Energy",
      sources: ["Sleep", "Nutrition", "Exercise", "Hydration"],
      optimization: [
        "Sleep 7-9 hours consistently",
        "Balanced meals with protein",
        "Regular exercise (cardio + strength)",
        "Drink 2-3L water daily"
      ]
    },
    {
      name: "Emotional Energy",
      sources: ["Relationships", "Achievement", "Autonomy", "Purpose"],
      optimization: [
        "Connect with loved ones",
        "Complete meaningful tasks",
        "Make choices aligned with values",
        "Engage in purposeful work"
      ]
    },
    {
      name: "Mental Energy",
      sources: ["Focus time", "Learning", "Problem-solving", "Creativity"],
      optimization: [
        "Deep work practice",
        "Continuous learning",
        "Puzzles and challenges",
        "Creative expression"
      ]
    },
    {
      name: "Spiritual Energy",
      sources: ["Meaning", "Values", "Growth", "Contribution"],
      optimization: [
        "Clarify core values",
        "Live according to values",
        "Pursue growth",
        "Help others"
      ]
    }
  ],
  strategies: [
    {
      name: "Energy Audit",
      description: "Track energy throughout day",
      implementation: [
        "Rate energy 1-10 every 2 hours",
        "Note activities, food, sleep, exercise",
        "Identify patterns and correlations",
        "Adjust schedule to energy"
      ]
    },
    {
      name: "Strategic Rest",
      description: "Rest before depletion",
      types: [
        { name: "Micro-break", duration: "2-5 min", action: "Stretch, breathe, look away" },
        { name: "Short rest", duration: "15-30 min", action: "Walk, snack, nap" },
        { name: "Daily recovery", duration: "Evening", action: "Complete work transition" },
        { name: "Weekly rest", duration: "1 day", action: "Complete work sabbatical" }
      ]
    }
  ]
}

export const WORKFLOW_OPTIMIZATION = {
  communication: [
    {
      type: "Email",
      best_practices: [
        "Check email 3x daily (9am, 1pm, 4pm)",
        "Use subject line convention",
        "Keep emails under 5 sentences",
        "Action required? State clearly",
        "No reply needed? State: NRN"
      ]
    },
    {
      type: "Meetings",
      best_practices: [
        "Question every meeting",
        "Agenda required",
        "Start/end on time",
        "Take notes",
        "Assign action items",
        "Default: 25 min or 50 min"
      ]
    },
    {
      type: "Notifications",
      rules: [
        "Turn off all non-essential",
        "Phone on do not disturb 9-12",
        "Slack: Check 3x daily",
        "Social: Check once daily",
        "Alerts: Only urgent/critical"
      ]
    }
  ],
  decision_making: [
    {
      level: "Quick decisions (<$100, <10 min)",
      approach: "Trust gut, make call"
    },
    {
      level: "Standard decisions",
      approach: "Sleep on it, get one perspective"
    },
    {
      level: "Major decisions",
      approach: "Gather data, get multiple inputs, deliberate"
    },
    {
      level: "Irreversible decisions",
      approach: "Full analysis, expert input, major time"
    }
  ],
  delegation: [
    {
      principle: "What can others do better/faster?",
      questions: [
        "Can someone else do this?",
        "Do I need to approve or just inform?",
        "What's the worst if not perfect?",
        "What would I pay someone to do?"
      ]
    }
  ]
}

export const PERSONAL_METRICS = {
  weekly_review: [
    { metric: "Wins", question: "What went well?" },
    { metric: "Lessons", question: "What could improve?" },
    { metric: "Energy", question: "How did energy track?" },
    { metric: "Progress", question: "Move closer to goals?" },
    { metric: "Relationships", question: "Invested in connections?" },
    { metric: "Health", question: "Sleep, exercise, nutrition?" },
    { metric: "Next Week", question: "What are top 3 priorities?" }
  ],
  monthly_metrics: [
    "Goals progress (% complete)",
    "Habits streak (days)",
    "Key results achieved",
    "Energy rating (avg 1-10)",
    "Relationships quality (1-10)",
    "Health indicators (sleep, exercise)",
    "Financial health (budget adherence)",
    "Learning/growth (hours)"
  ],
  quarterly_review: [
    "Big picture goal review",
    "Strategy assessment",
    "Major life areas check-in",
    "Annual goal adjustment",
    "Celebrate major wins",
    "Learn from misses",
    "Plan next quarter"
  ]
}
