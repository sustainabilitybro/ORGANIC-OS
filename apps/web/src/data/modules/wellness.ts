// Wellness Module Data
// Comprehensive wellness tracking, habits, and health information

export const WELLNESS_METRICS = {
  sleep: {
    name: "Sleep",
    unit: "hours",
    optimal_range: [7, 9],
    tracking_fields: ["bedtime", "waketime", "sleep_quality", "dreams", "night_wakes"],
    tips: [
      "Consistent sleep/wake times are more important than 8 hours",
      "Avoid screens 1 hour before bed",
      "Keep bedroom cool (65-68°F)",
      "Avoid caffeine after 2 PM",
      "Use bed only for sleep (and sex)",
      "Get morning sunlight within 30 minutes of waking",
      "Wind down 30 minutes before bed with calm activities",
      "Limit alcohol close to bedtime",
      "Exercise regularly, but not too late",
      "If you can't sleep, get up and do something calm"
    ],
    stages: [
      { name: "N1 (Light)", duration: "5-10 min", description: "Transition from wakefulness, easily awakened" },
      { name: "N2 (Light)", duration: "10-25 min", description: "True sleep onset, brain waves slow" },
      { name: "N3 (Deep)", duration: "20-40 min", description: "Restorative sleep, growth hormone release" },
      { name: "REM", duration: "10-60 min", description: "Dreaming, memory consolidation, emotional processing" }
    ],
    cycle_duration: "90 minutes",
    cycles_needed: "4-6 cycles",
   影响因素: ["Caffeine", "Alcohol", "Screen time", "Exercise timing", "Stress", "Environment", "Diet", "Naps"]
  },
  nutrition: {
    name: "Nutrition",
    tracking_fields: ["meals", "water", "fruits_veggies", "protein", "processed_foods", "snacking"],
    tips: [
      "Eat mostly whole foods",
      "Fill half plate with vegetables",
      "Include protein at each meal",
      "Stay hydrated (30-35ml per kg body weight)",
      "Limit processed foods and added sugars",
      "Eat mindfully, without distraction",
      "Practice intuitive eating",
      "Don't restrict - nourish",
      "Plan meals ahead",
      "Cook more at home"
    ],
    macronutrients: {
      protein: { 
        daily_need: "0.8-1.2g per kg body weight",
        sources: ["Meat", "Fish", "Eggs", "Dairy", "Legumes", "Tofu", "Nuts"],
        function: "Muscle repair, enzyme production, immune function"
      },
      carbohydrates: {
        daily_need: "45-65% of calories",
        sources: ["Whole grains", "Fruits", "Vegetables", "Legumes"],
        function: "Primary energy source for brain and body"
      },
      fats: {
        daily_need: "20-35% of calories",
        sources: ["Olive oil", "Avocado", "Nuts", "Fatty fish", "Seeds"],
        function: "Hormone production, brain health, nutrient absorption"
      }
    },
    micronutrients: [
      { name: "Vitamin D", sources: ["Sunlight", "Fatty fish", "Egg yolks", "Fortified foods"] },
      { name: "Omega-3", sources: ["Fatty fish", "Walnuts", "Flaxseeds", "Chia seeds"] },
      { name: "Magnesium", sources: ["Leafy greens", "Nuts", "Seeds", "Whole grains"] },
      { name: "Iron", sources: ["Red meat", "Spinach", "Legumes", "Fortified cereals"] },
      { name: "Calcium", sources: ["Dairy", "Fortified alternatives", "Leafy greens"] }
    ]
  },
  exercise: {
    name: "Physical Activity",
    tracking_fields: ["type", "duration", "intensity", "steps", "stretching"],
    guidelines: {
      aerobic: {
        weekly_minutes: "150-300 moderate OR 75-150 vigorous",
        examples: ["Walking", "Running", "Swimming", "Cycling", "Dancing"],
        benefits: ["Heart health", "Weight management", "Mood improvement", "Energy"]
      },
      strength: {
        weekly_sessions: "2-3 sessions",
        exercises: ["Weight training", "Bodyweight", "Resistance bands", "Calisthenics"],
        benefits: ["Muscle mass", "Bone density", "Metabolism", "Functionality"]
      },
      flexibility: {
        daily_minutes: "10-15",
        practices: ["Stretching", "Yoga", "Mobility work"],
        benefits: ["Range of motion", "Injury prevention", "Relaxation"]
      },
      balance: {
        importance: "Critical for aging, but valuable at all ages",
        practices: ["Single leg balance", "Tai Chi", "Balance boards"]
      }
    },
    tips: [
      "Find activities you enjoy",
      "Start small and build gradually",
      "Schedule exercise like an appointment",
      "Exercise with others for accountability",
      "Track progress to stay motivated",
      "Mix up activities to prevent boredom",
      "Listen to your body",
      "Rest when needed",
      "Warm up and cool down",
      "Stay hydrated"
    ]
  },
  hydration: {
    name: "Hydration",
    tracking_fields: ["water_intake", "urine_color", "thirst"],
    daily_goal: "30-35ml per kg body weight",
    tips: [
      "Drink water throughout the day",
      "Carry a water bottle",
      "Drink before you feel thirsty",
      "Increase intake with exercise",
      "Eat water-rich foods (fruits, vegetables)",
      "Watch for signs of dehydration",
      "Limit sugary drinks",
      "Herbal tea counts toward intake",
      "Morning glass of water jumpstarts hydration",
      "Set reminders if you forget"
    ],
    signs_of_dehydration: [
      "Thirst",
      "Dark urine",
      "Fatigue",
      "Headache",
      "Dry mouth",
      "Dizziness",
      "Rapid heartbeat",
      "Confusion (severe)"
    ]
  },
  mindfulness: {
    name: "Mindfulness",
    tracking_fields: ["meditation_minutes", "sessions", "techniques"],
    practices: [
      { name: "Breath Awareness", duration: "5-20 min", description: "Simply observe breath without controlling" },
      { name: "Body Scan", duration: "10-30 min", description: "Systematically bring attention to body parts" },
      { name: "Loving Kindness", duration: "5-15 min", description: "Cultivate compassion for self and others" },
      { name: "Mindful Movement", duration: "10-45 min", description: "Yoga, tai chi, or walking meditation" },
      { name: "Open Monitoring", duration: "10-20 min", description: "Observe all arising experiences without focus" }
    ],
    benefits: [
      "Reduced stress",
      "Improved focus",
      "Better emotional regulation",
      "Increased self-awareness",
      "Enhanced well-being",
      "Improved relationships",
      "Better sleep",
      "Reduced anxiety"
    ],
    tips: [
      "Start with just 5 minutes",
      "Practice at the same time daily",
      "Use guided meditations to begin",
      "Don't try to empty your mind",
      "Gentle redirection when distracted is the practice",
      "Consistency matters more than duration",
      "Mindfulness can be practiced anywhere",
      "Be patient with yourself"
    ]
  },
  mood: {
    name: "Mood",
    tracking_fields: ["mood_score", "energy_level", "stress_level", "anxiety_level"],
    scale: {
      range: [1, 10],
      labels: {
        1: "Very low - Feeling terrible",
        3: "Low - Struggling",
        5: "Neutral - Getting by",
        7: "Good - Feeling positive",
        9: "Excellent - Thriving",
        10: "Amazing - At peak"
      }
    },
    factors: [
      "Sleep quality and duration",
      "Physical activity",
      "Social connection",
      "Nutrition and hydration",
      "Sunlight exposure",
      "Stress levels",
      "Meaningful activities",
      "Achievements and progress",
      "Environment",
      "Health status"
    ],
    tips: [
      "Track patterns over time",
      "Note what correlates with good days",
      "Don't try to be positive all the time",
      "Accept all emotions as information",
      "Seek help if persistent low mood",
      "Build activities that boost mood",
      "Maintain routines",
      "Connect with others",
      "Get outside daily",
      "Limit alcohol"
    ]
  },
  energy: {
    name: "Energy",
    tracking_fields: ["morning_energy", "afternoon_energy", "evening_energy"],
    factors: [
      "Sleep quality",
      "Blood sugar stability",
      "Hydration",
      "Movement",
      "Stress",
      "Nutrition",
      "Sunlight",
      "Breathing",
      "Purpose/meaning",
      "Social engagement"
    ],
    tips: [
      "Prioritize 7-9 hours sleep",
      "Eat balanced meals with protein",
      "Stay hydrated",
      "Move every hour",
      "Get morning sunlight",
      "Take strategic breaks",
      "Manage stress",
      "Know your peak energy times",
      "Align tasks with energy levels",
      "Power nap if needed (20 min)"
    ]
  }
}

export const WELLNESS_GOALS = {
  daily: [
    { area: "Sleep", goal: "7-9 hours", tip: "Set consistent bedtime" },
    { area: "Water", goal: "8+ glasses", tip: "Carry a water bottle" },
    { area: "Movement", goal: "30 minutes", tip: "Walk while on calls" },
    { area: "Mindfulness", goal: "10 minutes", tip: "Morning meditation" },
    { area: "Nutrition", goal: "3 balanced meals", tip: "Protein at each meal" },
    { area: "Nature", goal: "15 minutes", tip: "Open a window or step outside" },
    { area: "Gratitude", goal: "3 things", tip: "Write in morning or evening" },
    { area: "Social", goal: "1 meaningful connection", tip: "Call a friend" }
  ],
  weekly: [
    { area: "Exercise", goal: "150 minutes", tip: "Mix cardio and strength" },
    { area: "Strength", goal: "2-3 sessions", tip: "Bodyweight works anywhere" },
    { area: "Flexibility", goal: "2-3 sessions", tip: "Stretch while watching TV" },
    { area: "Sleep", goal: "Consistent schedule", tip: "Same bedtime every night" },
    { area: "Social", goal: "3 deep conversations", tip: "Quality over quantity" },
    { area: "Learning", goal: "1 hour", tip: "Read or listen to educational content" },
    { area: "Rest", goal: "1 true rest day", tip: "No work, just recharge" },
    { area: "Screen-free", goal: "1 hour before bed", tip: "Read a book instead" }
  ],
  monthly: [
    { area: "Health", goal: "Check-in with body", tip: "Note any changes or concerns" },
    { area: "Goals", goal: "Review progress", tip: "Adjust as needed" },
    { area: "Finances", goal: "Review budget", tip: "Align spending with values" },
    { area: "Relationships", goal: "Plan quality time", tip: "Schedule ahead" },
    { area: "Environment", goal: "Declutter one area", tip: "Start small" },
    { area: "Reflection", goal: "Monthly review", tip: "What worked? What didn't?" },
    { area: "Challenge", goal: "Try something new", tip: "Expand comfort zone" },
    { area: "Celebration", goal: "Acknowledge wins", tip: "No matter how small" }
  ]
}

export const DAILY_ROUTINES = {
  morning: [
    { time: "Upon waking", activity: "Drink glass of water", duration: "1 min" },
    { time: "Upon waking", activity: "Open curtains/get sunlight", duration: "2 min" },
    { time: "5-30 min after waking", activity: "Meditation or breathwork", duration: "10-20 min" },
    { time: "Morning", activity: "Movement/exercise", duration: "20-60 min" },
    { time: "Morning", activity: "Cold shower (optional)", duration: "5 min" },
    { time: "Breakfast", activity: "Protein-rich breakfast", duration: "15 min" },
    { time: "Before work", activity: "Set daily intentions", duration: "5 min" }
  ],
  midday: [
    { time: "Mid-morning", activity: "Break/stretch every 90 min", duration: "5-10 min" },
    { time: "Lunch", activity: "Balanced meal with vegetables", duration: "20-30 min" },
    { time: "After lunch", activity: "10-min walk", duration: "10 min" },
    { time: "Afternoon", activity: "Power snack if needed", duration: "5 min" },
    { time: "3 PM", activity: "Hydration check", duration: "1 min" }
  ],
  evening: [
    { time: "Afternoon/evening", activity: "Exercise (not too late)", duration: "30-60 min" },
    { time: "Dinner", activity: "Lighter meal, early", duration: "30 min" },
    { time: "Evening", activity: "Family/connection time", duration: "30-60 min" },
    { time: "2 hours before bed", activity: "Screen detox", duration: "120 min" },
    { time: "1 hour before bed", activity: "Wind-down routine", duration: "60 min" },
    { time: "30 min before bed", activity: "Gratitude journaling", duration: "5-10 min" },
    { time: "Bedtime", activity: "Consistent sleep time", duration: "1 min" }
  ]
}

export const HABIT_TRACKING = {
  streak_benefits: [
    "Builds identity as someone who follows through",
    "Creates compounding effects over time",
    "Provides natural motivation through momentum",
    "Makes behavior automatic over time",
    "Creates social accountability"
  ],
  habit_stacking: [
    "After [current habit], I will [new habit]",
    "When I [current trigger], I will [new behavior]",
    "After I [morning routine], I will [new habit]"
  ],
  implementation_intentions: [
    "I will [behavior] at [time] in [location]",
    "When [cue] happens, I will [behavior]",
    "I will do [behavior] until [completion criteria]"
  ],
  tracking_methods: [
    "Paper habit tracker",
    "App (Habitica, Streaks, Loop)",
    "Calendar with X marks",
    "Bullet journal",
    "Simple checklist"
  ],
  relapse_prevention: [
    "Never miss twice in a row",
    "Accept imperfect compliance",
    "Focus on minimum viable habit",
    "Have backup plans for obstacles",
    "Connect with accountability partner"
  ]
}

export const SEASONAL_WELLNESS = {
  spring: [
    "Deep clean your living space",
    "Increase raw and light foods",
    "Start outdoor exercise routine",
    "Open windows for fresh air",
    "Allergy management",
    "Spring forward - adjust sleep schedule"
  ],
  summer: [
    "Stay hydrated",
    "Exercise early morning or evening",
    "Eat seasonal fruits and vegetables",
    "Get vitamin D from sun (safely)",
    "Practice heat safety",
    "Maintain sleep routines despite longer days"
  ],
  fall: [
    "Transition to warmer meals",
    "Increase indoor activity",
    "Prepare for daylight saving",
    "Cozy home environment",
    "Immune support (vitamin C, rest)",
    "Set intentions for year-end"
  ],
  winter: [
    "Combat seasonal mood changes with light therapy",
    "Stay active despite cold",
    "Warm, nourishing foods",
    "Vitamin D supplementation",
    "Social connection indoors",
    "Rest and reflection"
  ]
}

export const WORK_LIFE_BALANCE = {
  boundaries: [
    "Set clear work hours and stick to them",
    "Create physical workspace separation",
    "Turn off notifications after hours",
    "Use email scheduling for after-hours emails",
    "Take lunch away from desk",
    "Schedule personal time like meetings",
    "Learn to say no"
  ],
  recovery_strategies: [
    "Take regular breaks throughout day",
    "Use vacation time fully",
    "Have screen-free evenings",
    "Engage in hobbies",
    "Spend time in nature",
    "Practice saying 'I'm not available'",
    "Delegate effectively"
  ],
  signs_of_burnout: [
    "Chronic fatigue",
    "Insomnia",
    "Forgetfulness",
    "Increased illness",
    "Anxiety",
    "Detachment",
    "Feeling ineffective",
    "Cynicism"
  ],
  prevention: [
    "Maintain boundaries",
    "Regular exercise",
    "Social connections",
    "Sleep priority",
    "Mindfulness practice",
    "Hobbies outside work",
    "Regular vacations",
    "Support system"
  ]
}
