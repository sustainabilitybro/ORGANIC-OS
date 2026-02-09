// Holistic Alchemy Module Data
// Evidence-based interventions for mental health

export const DEPRESSION_INTERVENTIONS = {
  assessments: [
    {
      name: "PHQ-9",
      description: "Patient Health Questionnaire - 9 items",
      frequency: "Weekly",
      purpose: "Screen and measure severity of depression"
    },
    {
      name: "Beck Depression Inventory",
      description: "21-item self-report inventory",
      frequency: "Bi-weekly",
      purpose: "Measure cognitive symptoms of depression"
    }
  ],
  interventions: [
    {
      name: "Behavioral Activation",
      evidence: "Strong - Meta-analyses show large effect sizes",
      description: "Scheduling positive activities to increase contact with reinforcing environmental contingencies",
      steps: [
        "Activity monitoring for 1 week",
        "Identify pleasurable and meaningful activities",
        "Schedule activities in advance",
        "Start with small, achievable goals",
        "Gradually increase activity level",
        "Review and adjust weekly"
      ],
      exercises: [
        "Morning routine (起床, hygiene, dress)",
        "Social contact (call a friend)",
        "Physical activity (short walk)",
        "Productive task (small work item)",
        "Leisure activity (reading, music)"
      ]
    },
    {
      name: "Cognitive Restructuring",
      evidence: "Strong - Core CBT component",
      description: "Identifying and challenging distorted thoughts",
      techniques: [
        {
          name: "Thought Record",
          steps: [
            "Identify triggering situation",
            "Note automatic thoughts",
            "Identify cognitive distortions",
            "Generate balanced thought",
            "Rate belief in balanced thought"
          ]
        },
        {
          name: "Common Distortions",
          types: [
            "All-or-nothing thinking",
            "Overgeneralization",
            "Mental filter",
            "Disqualifying positive",
            "Mind reading",
            "Fortune telling",
            "Catastrophizing",
            "Emotional reasoning",
            "Should statements",
            "Labeling",
            "Personalization"
          ]
        }
      ]
    },
    {
      name: "Pleasant Activity Scheduling",
      evidence: "Moderate - Component of CBT and BA",
      description: "Planning and engaging in enjoyable activities",
      categories: [
        { type: "Social", examples: ["Coffee with friend", "Phone call", "Group activity"] },
        { type: "Physical", examples: ["Walk", "Stretch", "Exercise", "Swimming"] },
        { type: "Cognitive", examples: ["Reading", "Learning", "Puzzle", "Game"] },
        { type: "Sensory", examples: ["Bath", "Massage", "Nature", "Music"] },
        { type: "Productive", examples: ["Task completion", "Cleaning", "Project"] }
      ]
    }
  ],
  warning_signs: [
    "Persistent sadness > 2 weeks",
    "Thoughts of self-harm",
    "Inability to function at work/home",
    "Substance abuse",
    "Significant weight change",
    "Sleep disruption",
    "Loss of interest in all activities"
  ],
  resources: [
    "Crisis: 988 Suicide & Crisis Lifeline",
    "National Alliance on Mental Illness (NAMI)",
    "Psychology Today Therapist Directory",
    "SAMHSA National Helpline"
  ]
}

export const ANXIETY_INTERVENTIONS = {
  assessments: [
    {
      name: "GAD-7",
      description: "Generalized Anxiety Disorder - 7 items",
      frequency: "Weekly",
      purpose: "Screen for generalized anxiety"
    },
    {
      name: "BAI",
      description: "Beck Anxiety Inventory - 21 items",
      frequency: "Bi-weekly",
      purpose: "Measure severity of anxiety symptoms"
    }
  ],
  interventions: [
    {
      name: "Exposure Therapy",
      evidence: "Strongest - Gold standard for anxiety disorders",
      description: "Systematic confrontation with feared stimuli",
      types: [
        {
          name: "In Vivo Exposure",
          description: "Direct confrontation with feared situation",
          examples: ["Fear of public speaking → Give a speech", "Fear of driving → Drive on highway"]
        },
        {
          name: "Imaginal Exposure",
          description: "Vivid imagination of feared situation",
          examples: ["PTSD trauma processing", "Specific phobia preparation"]
        },
        {
          name: "Interoceptive Exposure",
          description: "Deliberate induction of bodily sensations",
          examples: ["Hyperventilation for panic", "Exercise for anxiety sensations"]
        }
      ],
      steps: [
        "Create fear hierarchy (0-100)",
        "Start with lowest fear item",
        "Stay in situation until anxiety decreases 50%",
        "Repeat until habituated",
        "Move up hierarchy",
        "Practice regularly"
      ]
    },
    {
      name: "Relaxation Training",
      evidence: "Moderate - Symptom management",
      description: "Developing relaxation response to counteract anxiety",
      techniques: [
        {
          name: "Progressive Muscle Relaxation",
          instructions: [
            "Tense muscle group for 5 seconds",
            "Release and notice relaxation (20 seconds)",
            "Move to next muscle group",
            "Work from feet to head",
            "Practice twice daily"
          ]
        },
        {
          name: "Diaphragmatic Breathing",
          instructions: [
            "Breathe in through nose for 4 counts",
            "Hold for 4 counts",
            "Exhale through mouth for 6 counts",
            "Practice 5-10 minutes",
            "Use during anxiety episodes"
          ]
        }
      ]
    },
    {
      name: "Cognitive Therapy",
      evidence: "Strong - Core CBT component",
      description: "Challenging anxious thoughts",
      common_anxious_thoughts: [
        "Catastrophizing - Assuming worst outcome",
        "Fortune telling - Predicting negative outcomes",
        "Mind reading - Assuming others think negatively",
        "Overestimation of danger",
        "Underestimation of coping ability"
      ],
      challenging_questions: [
        "What's the evidence for/against?",
        "What's the most realistic outcome?",
        "What's the worst that could happen?",
        "Could I cope if the worst happened?",
        "What would I tell a friend?",
        "What have I handled before?"
      ]
    }
  ],
  panic_protocol: [
    {
      step: "Recognize",
      action: "Identify panic symptoms",
      symptoms: ["Rapid heartbeat", "Shortness of breath", "Dizziness", "Tingling", "Chest pain"]
    },
    {
      step: "Stop",
      action: "Pause and stay present",
      techniques: ["5-4-3-2-1 grounding", "Focus on breath", "Remember: panic won't kill you"]
    },
    {
      step: "Breathe",
      action: "Controlled breathing",
      technique: "Box breathing (4-4-4-4)"
    },
    {
      step: "Challenge",
      action: "Question thoughts",
      questions: ["What's actually happening?", "Am I in danger?", "What does my body need?"]
    },
    {
      step: "Continue",
      action: "Return to activity",
      advice: "Don't avoid - stay in situation until anxiety decreases"
    }
  ]
}

export const SLEEP_INTERVENTIONS = {
  assessment: {
    name: "ISI",
    description: "Insomnia Severity Index - 7 items",
    frequency: "Weekly",
    purpose: "Measure insomnia severity"
  },
  interventions: [
    {
      name: "Sleep Restriction",
      evidence: "Strong - Core CBT-I component",
      description: "Restricting time in bed to match actual sleep time",
      steps: [
        "Record sleep for 2 weeks (time in bed, sleep time, quality)",
        "Calculate average sleep time",
        "Set time in bed = average sleep time (minimum 5 hours)",
        "Wake at fixed time every morning",
        "Go to bed only when sleepy",
        "If unable to sleep > 20 min, get up",
        "Gradually increase time in bed by 15-30 min weekly"
      ]
    },
    {
      name: "Stimulus Control",
      evidence: "Strong - Core CBT-I component",
      description: "Strengthening bed/sleep association",
      instructions: [
        "Use bed only for sleep and sex (no reading, TV, phone)",
        "Go to bed only when sleepy",
        "If unable to sleep in 20 min, get up",
        "If unable to return to sleep in 20 min, get up",
        "Wake at same time every day",
        "No napping during day"
      ]
    },
    {
      name: "Sleep Hygiene",
      evidence: "Moderate - Important foundation",
      description: "Environmental and behavioral factors affecting sleep",
      do: [
        "Maintain consistent sleep schedule",
        "Exercise regularly (not late)",
        "Cool, dark, quiet bedroom",
        "Bedtime routine (wind down)",
        "Exposure to morning sunlight",
        "Comfortable mattress/pillows"
      ],
      avoid: [
        "Caffeine after 2 PM",
        "Alcohol close to bedtime",
        "Large meals before bed",
        "Screen time 1 hour before bed",
        "Naps after 3 PM",
        "Irregular sleep times"
      ]
    },
    {
      name: "Cognitive Therapy for Sleep",
      evidence: "Moderate - CBT-I component",
      description: "Challenging unhelpful beliefs about sleep",
      common_misconceptions: [
        "I need 8 hours exactly",
        "If I don't sleep well tonight, tomorrow is ruined",
        "I can't function without sleep",
        "Medication is the only solution",
        "I should be able to control my sleep",
        "My sleep is worse than everyone else's"
      ],
      reality: [
        "Sleep needs vary (7-9 hours is normal range)",
        "One bad night won't ruin everything",
        "You can function on less sleep than you think",
        "Behavioral changes work",
        "Sleep takes practice",
        "Everyone has occasional poor sleep"
      ]
    }
  ],
  relaxation_for_sleep: [
    {
      name: "Body Scan for Sleep",
      duration: "15 min",
      instructions: [
        "Lie comfortably",
        "Start at toes",
        "Notice sensations, release tension",
        "Move slowly up body",
        "End at top of head",
        "Practice with eyes closed"
      ]
    },
    {
      name: "4-7-8 Breathing",
      duration: "3-5 min",
      instructions: [
        "Inhale through nose: 4 counts",
        "Hold breath: 7 counts",
        "Exhale through mouth: 8 counts",
        "Repeat 4-6 cycles",
        "Focus on exhale (parasympathetic)"
      ]
    }
  ]
}

export const OCD_INTERVENTIONS = {
  assessment: {
    name: "Y-BOCS",
    description: "Yale-Brown Obsessive Compulsive Scale",
    frequency: "Bi-weekly",
    purpose: "Measure OCD severity"
  },
  interventions: [
    {
      name: "Exposure and Response Prevention",
      evidence: "Strongest - Gold standard treatment",
      description: "Systematic exposure to obsessions while preventing compulsions",
      principles: [
        "ERP is more effective than medication alone",
        "Exposure creates short-term anxiety but long-term relief",
        "Response prevention breaks the cycle",
        "Practice makes anxiety decrease faster",
        "Acceptance of uncertainty is key"
      ],
      steps: [
        "Create fear hierarchy (0-100)",
        "Start with lowest item",
        "Expose to obsession (thought, image, situation)",
        "Prevent ALL compulsions (mental and behavioral)",
        "Stay in situation until anxiety decreases 50%",
        "Repeat until habituated",
        "Move up hierarchy"
      ]
    },
    {
      name: "Cognitive Therapy",
      evidence: "Moderate - Adjunct to ERP",
      description: "Challenging OCD-related beliefs",
      common_distortions: [
        "Overestimation of threat",
        "Intolerance of uncertainty",
        "Perfectionism",
        "Need for control",
        "Inflated responsibility",
        "Magical thinking"
      ],
      challenges: [
        "What's the evidence?",
        "What's the probability?",
        "What would I do without OCD?",
        "Can I tolerate the uncertainty?",
        "What would I tell a friend?"
      ]
    }
  ],
  compulsions: [
    {
      type: "Checking",
      examples: ["Locks", "Appliances", "Body (health)", "Intentions"],
      ERP: "Leave unchecked, use touch technique, set timer"
    },
    {
      type: "Washing",
      examples: ["Contamination fears", "Hand washing", "Showering", "Cleaning"],
      ERP: "Touch 'contaminated' surface, don't wash, delay washing"
    },
    {
      type: "Mental",
      examples: ["Praying", "Counting", "Reviewing", "Neutralizing thoughts"],
      ERP: "Accept thought without neutralizing, postpone mental acts"
    },
    {
      type: "Ordering/Arranging",
      examples: ["Symmetry", "Perfection", "Lists"],
      ERP: "Leave imperfect, resist rearranging"
    }
  ]
}

export const PTSD_INTERVENTIONS = {
  assessment: {
    name: "PCL-5",
    description: "PTSD Checklist for DSM-5 - 20 items",
    frequency: "Monthly",
    purpose: "Screen and measure PTSD symptoms"
  },
  interventions: [
    {
      name: "EMDR",
      evidence: "Strong - Effective for PTSD",
      description: "Eye Movement Desensitization and Reprocessing",
      phases: [
        "History and treatment planning",
        "Preparation (stabilization)",
        "Assessment (identify target memories)",
        "Desensitization (BLS + trauma memory)",
        "Installation (positive cognition)",
        "Body scan",
        "Closure (return to equilibrium)",
        "Reevaluation"
      ],
      when_appropriate: [
        "Single incident trauma",
        "Good ego strength",
        "Stabilized (no current danger)",
        "Able to tolerate distress",
        "Motivated for treatment"
      ]
    },
    {
      name: "Prolonged Exposure",
      evidence: "Strong - Gold standard",
      description: "Systematic exposure to trauma memories and reminders",
      components: [
        {
          name: "Imaginal Exposure",
          description: "Repeated telling of trauma memory",
          process: [
            "Identify trauma memory",
            "Record detailed account (30+ min)",
            "Listen to recording daily",
            "Rate distress before/after",
            "Continue until distress decreases"
          ]
        },
        {
          name: "In Vivo Exposure",
          description: "Gradual approach to avoided situations",
          process: [
            "Create hierarchy of avoided situations",
            "Start with moderately avoided",
            "Practice exposure regularly",
            "Move up hierarchy",
            "Until no longer avoided"
          ]
        }
      ]
    },
    {
      name: "Cognitive Processing Therapy",
      evidence: "Strong - Effective for PTSD",
      description: "Addressing trauma-related cognitions",
      stuck_points: [
        "Safety concerns",
        "Trust issues",
        "Control/powerlessness",
        "Esteem (self/other)",
        "Intimacy issues",
        "Future expectations"
      ],
      techniques: [
        "Socratic questioning",
        "Identifying stuck points",
        "Examining evidence",
        "Developing alternative thoughts",
        "Writing trauma narrative"
      ]
    }
  ],
  grounding_techniques: [
    {
      name: "5-4-3-2-1",
      description: "Engage senses to return to present",
      steps: [
        "5 things you can SEE",
        "4 things you can TOUCH",
        "3 things you can HEAR",
        "2 things you can SMELL",
        "1 thing you can TASTE"
      ]
    },
    {
      name: "Safe Place Visualization",
      description: "Create mental calm space",
      steps: [
        "Close eyes",
        "Imagine peaceful, safe place",
        "Engage all senses",
        "Details: sights, sounds, smells, textures",
        "Stay until calm",
        "Practice regularly"
      ]
    }
  ]
}

export const WELLNESS_CHECKLIST = {
  daily: [
    "☐ Sleep 7-9 hours",
    "☐ Eat 3 balanced meals",
    "☐ Exercise 30+ minutes",
    "☐ Drink 8 glasses water",
    "☐ Practice mindfulness 10 min",
    "☐ Connect with someone",
    "☐ Do one productive task",
    "☐ Do one enjoyable activity"
  ],
  weekly: [
    "☐ Social time with friends/family",
    "☐ Exercise 150+ minutes total",
    "☐ Strength training 2x",
    "☐ Nature exposure 2+ hours",
    "☐ Creative/hobby time",
    "☐ Reflection/journaling",
    "☐ Medical check-ups if needed",
    "☐ Plan next week"
  ],
  monthly: [
    "☐ Review sleep patterns",
    "☐ Review mood tracking",
    "☐ Check physical health metrics",
    "☐ Assess relationships",
    "☐ Financial review",
    "☐ Environment decluttering",
    "☐ Learn something new",
    "☐ Set monthly goals"
  ]
}
