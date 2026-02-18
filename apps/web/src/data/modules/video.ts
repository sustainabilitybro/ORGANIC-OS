// Video Module Data
// On-camera practice and self-expression skills

export const VIDEO_SKILLS = [
  {
    name: "Eye Contact",
    description: "Creating connection through the lens",
    techniques: [
      {
        name: "Camera-as-person",
        description: "Treat the camera lens as a person you're speaking to",
        practice: "Place a sticky note with a face on your camera",
        tip: "Imagine talking to your ideal audience member"
      },
      {
        name: "Triangle method",
        description: "Look at lens, then slightly left, then slightly right",
        practice: "Look at lens for key points, away for pauses",
        tip: "Avoid staring at one spot - creates disconnection"
      },
      {
        name: "Intimate eye contact",
        description: "Brief, warm glances at the lens",
        practice: "Sustain 3-5 seconds, then look away naturally",
        tip: "Practice with a friend watching playback"
      }
    ],
    common_mistakes: [
      "Looking at yourself (not lens)",
      "Eyes darting around",
      "Staring too intensely",
      "Never looking at lens"
    ],
    exercises: [
      {
        name: "30-Second Introduction",
        goal: "Practice sustained eye contact",
        instructions: [
          "Set timer for 30 seconds",
          "Introduce yourself on camera",
          "Maintain eye contact with lens",
          "Review playback",
          "Notice disconnection points"
        ]
      }
    ]
  },
  {
    name: "Facial Expression",
    description: "Communicating emotion through face",
    techniques: [
      {
        name: "Authentic smiles",
        description: "Real vs. forced smiles",
        anatomy: [
          "Zygomatic major (mouth to ear)",
          "Orbicularis oculi (eye crinkles)",
          "Duchenne marker: crinkled eyes = genuine"
        ],
        practice: "Think of something that genuinely makes you happy"
      },
      {
        name: "Micro-expressions",
        description: "Brief flickers of true emotion",
        tip: "Be aware of nervous tics, practice neutral baseline"
      },
      {
        name: "Pacing expressions",
        description: "Match expression to content",
        practice: "When talking about exciting topic - show excitement"
      }
    ],
    exercises: [
      {
        name: "Emotion Walk",
        goal: "Practice different expressions",
        instructions: [
          "Practice expressions for: Joy, Interest, Surprise, Sadness, Determination",
          "Hold each for 5 seconds",
          "Record and review",
          "Notice what feels natural"
        ]
      }
    ]
  },
  {
    name: "Posture & Presence",
    description: "Non-verbal communication through body",
    techniques: [
      {
        name: "Power stance",
        description: "Confident body positioning",
        elements: [
          "Feet shoulder-width apart",
          "Weight evenly distributed",
          "Shoulders back, relaxed",
          "Chest slightly open",
          "Hands visible or purposeful"
        ],
        practice: "Stand this way 2 minutes before filming"
      },
      {
        name: "Open posture",
        description: "Appears approachable and confident",
        elements: [
          "Arms uncrossed",
          "Hands visible",
          "Facing camera directly",
          "Leaning slightly forward = engagement"
        ]
      },
      {
        name: "Gestures",
        description: "Purposeful hand movements",
        rules: [
          "Keep above waist",
          "Stay in frame",
          "Make gestures deliberate",
          "Avoid repetitive fidgeting"
        ]
      }
    ],
    common_mistakes: [
      "Slouching",
      "Crossed arms",
      "Hands hidden",
      "Rocking back and forth",
      "Looking down at notes"
    ]
  },
  {
    name: "Voice & Speaking",
    description: "Verbal delivery skills",
    techniques: [
      {
        name: "Vocal variety",
        description: "Changing pace, pitch, volume",
        elements: [
          "Volume: Louder for emphasis",
          "Pitch: Higher for excitement, lower for seriousness",
          "Pace: Slower for impact, faster for enthusiasm",
          "Pause: Strategic silence"
        ],
        practice: "Read same sentence 5 different ways"
      },
      {
        name: "Pacing",
        description: "Speaking rhythm",
        optimal: "130-150 words per minute",
        adjustments: [
          "Slow down: Key points, complex ideas",
          "Speed up: Stories, less critical sections",
          "Pause: After key statements"
        ]
      },
      {
        name: "Clarity",
        description: "Articulation and pronunciation",
        tips: [
          "Open your mouth more",
          "Enunciate consonants",
          "Project from diaphragm",
          "Practice tongue twisters"
        ]
      }
    ],
    fillers_elimination: {
      fillers: ["Um", "uh", "like", "you know", "so"],
      strategies: [
        "Pause instead of filler",
        "Practice with recordings",
        "Slow down when nervous",
        "Know your content well"
      ]
    }
  },
  {
    name: "Script & Structure",
    description: "Organizing your content",
    techniques: [
      {
        name: "Hook",
        description: "Grab attention in first 5 seconds",
        types: [
          "Question", "Stat", "Story", "Contrarian view", "Promise"
        ],
        examples: [
          "What if everything you knew about success was wrong?",
          "I reduced my screen time by 70% using this one trick...",
          "Most advice about productivity is actually counterproductive."
        ]
      },
      {
        name: "Structure",
        description: "Organize for clarity",
        formats: [
          { name: "Problem-Solution", steps: ["State problem", "Explain solution", "Call to action"] },
          { name: "Story Arc", steps: ["Set scene", "Present conflict", "Climax", "Resolution"] },
          { name: "List", steps: ["Preview list", "Present each item", "Summarize"] },
          { name: "How-To", steps: ["Promise result", "Explain method", "Demonstrate"] }
        ]
      },
      {
        name: "Call to Action",
        description: "Tell viewers what to do next",
        types: [
          "Subscribe",
          "Comment question",
          "Share with friend",
          "Try exercise",
          "Follow for more"
        ]
      }
    ]
  }
]

export const VIDEO_TYPES = [
  {
    type: "Vlog",
    description: "Video log of daily life",
    characteristics: ["Personal", "Frequent", "Behind-the-scenes"],
    length: "5-15 minutes",
    frequency: "Daily to weekly",
    examples: ["Morning routine", "Day in the life", "Reflections"]
  },
  {
    type: "Tutorial",
    description: "Educational how-to content",
    characteristics: ["Instructional", "Clear steps", "Problem-solving"],
    length: "5-20 minutes",
    frequency: "Weekly",
    examples: ["How to meditate", "Productivity tips", "Cooking guide"]
  },
  {
    type: "Explainer",
    description: "Complex topic simplified",
    characteristics: ["Educational", "Visual-heavy", "Engaging"],
    length: "3-10 minutes",
    frequency: "Bi-weekly",
    examples: ["Concept explanation", "History lesson", "Analysis"]
  },
  {
    type: "Personal Brand",
    description: "Showcasing expertise/personality",
    characteristics: ["Professional", "Authentic", "Story-driven"],
    length: "2-10 minutes",
    frequency: "Weekly",
    examples: ["Thought leadership", "Storytelling", "Expertise"]
  },
  {
    type: "Presentation",
    description: "Formal speaking on camera",
    characteristics: ["Structured", "Professional", "Slide support"],
    length: "10-30 minutes",
    frequency: "Monthly",
    examples: ["Keynote", "Lecture", "Pitch"]
  },
  {
    type: "Reflection",
    description: "Introspective video essays",
    characteristics: ["Personal", "Thoughtful", "Deep"],
    length: "5-20 minutes",
    frequency: "Monthly",
    examples: ["Monthly review", "Lessons learned", "Goals update"]
  }
]

export const CAMERA_SETUP = {
  positioning: [
    {
      element: "Camera height",
      ideal: "Eye level or slightly above",
      tip: "Not too high (looks submissive) or low (looks dominant)"
    },
    {
      element: "Distance",
      ideal: "Head and shoulders in frame",
      tip: "Use zoom, not physical position"
    },
    {
      element: "Lighting",
      ideal: "Natural light or soft box from 45-degree angle",
      tip: "Avoid backlight (silhouette) or harsh overhead"
    },
    {
      element: "Background",
      ideal: "Simple, uncluttered, relevant",
      tip: "Blurred background or intentional backdrop"
    }
  ],
  equipment_basics: [
    {
      level: "Beginner",
      camera: "Smartphone (portrait mode, landscape)",
      lighting: "Ring light or window",
      audio: "Phone mic or lapel mic",
      tripod: "Basic phone tripod"
    },
    {
      level: "Intermediate",
      camera: "Webcam (Logitech Brio/C920) or mirrorless",
      lighting: "Two-point lighting setup",
      audio: "USB microphone (Blue Yeti, Audio-Technica)",
      tripod: "Adjustable tripod with phone/camera mount"
    },
    {
      level: "Professional",
      camera: "Mirrorless (Sony ZV-1, Canon M50) or DSLR",
      lighting: "Three-point lighting kit",
      audio: "XLR microphone or wireless lavalier",
      equipment: "Teleprompter, monitor, lights"
    }
  ]
}

export const SELF_REVIEW_FRAMEWORK = {
  watch_and_rate: [
    {
      category: "Eye Contact",
      criteria: ["Connection to camera", "Natural look", "Appropriate duration"],
      rating: "1-5"
    },
    {
      category: "Facial Expression",
      criteria: ["Authenticity", "Appropriate to content", "Expressiveness"],
      rating: "1-5"
    },
    {
      category: "Voice",
      criteria: ["Clarity", "Volume", "Pacing", "Enthusiasm"],
      rating: "1-5"
    },
    {
      category: "Body Language",
      criteria: ["Posture", "Gestures", "Movement", "Presence"],
      rating: "1-5"
    },
    {
      category: "Content",
      criteria: ["Clarity", "Structure", "Value delivered", "Engagement"],
      rating: "1-5"
    }
  ],
  improvement_plan: [
    "Identify lowest-rated category",
    "Practice specific technique",
    "Re-record same content",
    "Compare side by side",
    "Repeat weekly"
  ]
}

export const PRACTICE_EXERCISES = [
  {
    exercise: "Self-Introduction",
    duration: "60 seconds",
    goal: "Comfortable on camera",
    instructions: [
      "State your name",
      "Share what you do",
      "Add one interesting fact",
      "End with a question",
      "Record 5 times, review each"
    ]
  },
  {
    exercise: "Thought Leader Statement",
    duration: "90 seconds",
    goal: "Practice expertise communication",
    instructions: [
      "Identify your area of expertise",
      "State one contrarian or powerful insight",
      "Support with brief evidence or story",
      "Call others to action",
      "Record 3 times"
    ]
  },
  {
    exercise: "Storytelling",
    duration: "2 minutes",
    goal: "Engaging narrative",
    instructions: [
      "Choose a meaningful story (personal or other)",
      "Structure: Hook, context, conflict, resolution, lesson",
      "Include sensory details",
      "Show emotion authentically",
      "Record 3 times, note emotional beats"
    ]
  },
  {
    exercise: "Impromptu Speaking",
    duration: "60 seconds per topic",
    goal: "Comfort with unscripted content",
    instructions: [
      "Generate random topics",
      "Speak for full 60 seconds without stopping",
      "No ums, uhs, or long pauses",
      "Record and review",
      "Progress: Harder topics over time"
    ]
  },
  {
    exercise: "Presentation Practice",
    duration: "5 minutes",
    goal: "Full presentation delivery",
    instructions: [
      "Create simple slide deck (5 slides)",
      "Practice with minimal notes",
      "Record full rehearsal",
      "Review and note improvements",
      "Repeat 3 times total"
    ]
  }
]

export const COMMON_MISTAKES = [
  {
    mistake: "Speaking too fast",
    fix: "Practice with intentional pauses",
    tip: "When nervous, slow down"
  },
  {
    mistake: "No eye contact",
    fix: "Look at lens, not screen",
    tip: "Sticky note reminder on monitor"
  },
  {
    mistake: "Umms and uhs",
    fix: "Pause instead of filler",
    tip: "Record voice notes, eliminate fillers"
  },
  {
    mistake: "Looking at notes",
    fix: "Memorize key points",
    tip: "Use bullet point cue cards off-camera"
  },
  {
    mistake: "Rigid posture",
    fix: "Practice standing naturally",
    tip: "Use small movements intentionally"
  },
  {
    mistake: "Monotone voice",
    fix: "Record and listen",
    tip: "Emphasize key words intentionally"
  },
  {
    mistake: "Weak energy",
    fix: "Elevate energy 20% more than feels natural",
    tip: "Camera flattens energy"
  },
  {
    mistake: "Long intros",
    "fix": "Hook in first 5 seconds",
    tip: "Edit out dead air"
  }
]

export const CONFIDENCE_BUILDERS = [
  {
    activity: "Mirror practice",
    description: "Practice in front of mirror daily",
    duration: "10 minutes"
  },
  {
    activity: "Video journaling",
    description: "Record daily reflections",
    duration: "5 minutes"
  },
  {
    activity: "Peer review",
    description: "Get feedback from trusted friend",
    frequency: "Weekly"
  },
  {
    activity: "Watch and learn",
    description: "Study great presenters",
    action: "Analyze 1 video per week"
  },
  {
    activity: "Gradual exposure",
    description: "Slowly increase audience size",
    steps: [
      "Practice alone",
      "Practice for 1 trusted person",
      "Practice for small group",
      "Practice for larger audience",
      "Post on social media"
    ]
  }
]
