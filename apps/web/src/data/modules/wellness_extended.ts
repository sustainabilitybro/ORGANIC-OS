// Extended Wellness Module with comprehensive tracking
// Evidence-based interventions for sleep, nutrition, exercise, and mindfulness

// ============ Sleep Module ============

export interface SleepEntry {
  date: string;
  bedtime: string;
  waketime: string;
  duration: number; // hours
  quality: 1 | 2 | 3 | 4 | 5; // 1=poor, 5=excellent
  disruptions: number;
  notes: string;
}

export interface SleepRecommendations {
  optimal_hours: number;
  bedtime_routine: SleepRoutineStep[];
  environmental_factors: EnvironmentalFactor[];
  common_issues: SleepIssue[];
}

interface SleepRoutineStep {
  time_offset: number; // minutes before bed
  activity: string;
  description: string;
}

interface EnvironmentalFactor {
  factor: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}

interface SleepIssue {
  issue: string;
  symptoms: string[];
  solutions: string[];
}

export const SLEEP_DATA: SleepRecommendations = {
  optimal_hours: 7.5, // 7-9 hours recommended, 7.5 for full cycles
  
  bedtime_routine: [
    { time_offset: 60, activity: "Screen-free time", description: "Stop using phones, tablets, and computers" },
    { time_offset: 45, activity: "Dim lights", description: "Reduce bright lights to signal melatonin production" },
    { time_offset: 30, activity: "Warm bath or shower", description: "Body temperature drop after bath promotes sleepiness" },
    { time_offset: 20, activity: "Light reading", description: "Fiction or calming content (avoid stimulating news)" },
    { time_offset: 15, activity: "Breathing exercises", description: "4-7-8 breathing: inhale 4s, hold 7s, exhale 8s" },
    { time_offset: 10, activity: "Gratitude journaling", description: "Write 3 things you're grateful for" },
    { time_offset: 0, activity: "Bedtime", description: "Aim for consistent sleep/wake times" }
  ],
  
  environmental_factors: [
    { factor: "Temperature", recommendation: "65-68°F (18-20°C)", impact: "high" },
    { factor: "Darkness", recommendation: "Complete blackout curtains", impact: "high" },
    { factor: "Noise", recommendation: "White noise or earplugs", impact: "medium" },
    { factor: "Mattress", recommendation: "Replace every 7-10 years", impact: "high" },
    { factor: "Pillows", recommendation: "Replace every 1-2 years", impact: "medium" },
    { factor: "Scent", recommendation: "Lavender or chamomile", impact: "low" }
  ],
  
  common_issues: [
    {
      issue: "Difficulty falling asleep",
      symptoms: ["Racing thoughts", "Physical tension", "Time checking"],
      solutions: ["Cognitive defusion technique", "Progressive muscle relaxation", "Sleep restriction therapy"]
    },
    {
      issue: "Nighttime awakenings",
      symptoms: ["Waking 2-3 times", "Difficulty returning to sleep", "Daytime fatigue"],
      solutions: ["Don't clock-watch", "Brief mindfulness return", "Limit fluid intake evening"]
    },
    {
      issue: "Early morning waking",
      symptoms: ["Waking before alarm", "Can't return to sleep", "Anxiety on waking"],
      solutions: ["Morning light exposure", "Worry journal before bed", "Sleep compression"]
    }
  ]
};

// ============ Nutrition Module ============

export interface NutritionEntry {
  date: string;
  meals: MealEntry[];
  water_intake: number; // glasses
  caffeine: number; // cups
  alcohol: number; // drinks
  notes: string;
}

export interface MealEntry {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  foods: FoodItem[];
  calories: number;
  macros: MacroBreakdown;
  mood_before: 1 | 2 | 3 | 4 | 5;
  mood_after: 1 | 2 | 3 | 4 | 5;
}

interface FoodItem {
  name: string;
  servings: number;
  category: string;
}

interface MacroBreakdown {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
}

export const NUTRITION_GUIDELINES = {
  daily_targets: {
    calories: { min: 1800, max: 2500, description: "Varies by age, sex, activity level" },
    protein: { min: 50, max: 180, description: "0.8g per kg body weight minimum" },
    carbs: { min: 130, max: 300, description: "45-65% of calories" },
    fat: { min: 44, max: 100, description: "20-35% of calories" },
    fiber: { min: 25, max: 38, description: "Women 25g, Men 38g" },
    water: { min: 8, max: 12, description: "8 glasses (64-96 oz)" }
  },
  
  meal_timing: {
    breakfast: { time: "7-8 AM", importance: "Jumpstarts metabolism" },
    lunch: { time: "12-1 PM", importance: "Midday energy" },
    dinner: { time: "6-7 PM", importance: "Light, early dinner" },
    snacks: { time: "3-4 PM", importance: "Prevent energy crash" }
  },
  
  mindful_eating: [
    { principle: "Eat slowly", description: "Take 20 minutes per meal", benefit: "Better satiety signals" },
    { principle: "Put down utensils", description: "Between bites", benefit: "Pacing and digestion" },
    { principle: "Chew thoroughly", description: "20-30 chews per bite", benefit: "Nutrient absorption" },
    { principle: "Eliminate distractions", description: "No screens while eating", benefit: "Mindful awareness" },
    { principle: "Check hunger cues", description: "Rate hunger 1-10", benefit: "Prevent overeating" }
  ]
};

// ============ Exercise Module ============

export interface ExerciseEntry {
  date: string;
  type: string;
  duration: number; // minutes
  intensity: 'light' | 'moderate' | 'vigorous';
  calories: number;
  heart_rate_avg: number;
  heart_rate_max: number;
  notes: string;
}

export const EXERCISE_RECOMMENDATIONS = {
  weekly_targets: {
    aerobic: { min: 150, max: 300, unit: "minutes", description: "Moderate-intensity" },
    strength: { min: 2, max: 4, unit: "sessions", description: "All major muscle groups" },
    flexibility: { min: 10, max: 15, unit: "minutes", description: "Daily stretching" }
  },
  
  exercise_types: {
    aerobic: [
      { name: "Walking", intensity: "light", calories_per_hour: 250, benefits: ["Joint-friendly", "Accessible", "Sustainable"] },
      { name: "Running", intensity: "vigorous", calories_per_hour: 600, benefits: ["Cardio fitness", "Mental health", "Weight management"] },
      { name: "Cycling", intensity: "moderate", calories_per_hour: 450, benefits: ["Low impact", "Leg strength", "Cardio"] },
      { name: "Swimming", intensity: "moderate", calories_per_hour: 500, benefits: ["Full body", "No impact", "Breathing"] },
      { name: "HIIT", intensity: "vigorous", calories_per_hour: 700, benefits: ["EPOC effect", "Time efficient", "Metabolism"] }
    ],
    strength: [
      { name: "Bodyweight", equipment: "None", difficulty: "Beginner", benefits: ["Convenient", "Scalable", "Functional"] },
      { name: "Dumbbells", equipment: "Dumbbells", difficulty: "Intermediate", benefits: ["Muscle isolation", "Bone density"] },
      { name: "Barbell", equipment: "Barbell + weights", difficulty: "Advanced", benefits: ["Progressive overload", "Compound moves"] },
      { name: "Resistance bands", equipment: "Bands", difficulty: "Beginner", benefits: ["Travel-friendly", "Joint-friendly"] },
      { name: "Kettlebell", equipment: "Kettlebell", difficulty: "Intermediate", benefits: ["Functional strength", "Cardio"] }
    ],
    flexibility: [
      { name: "Static stretching", duration: "15-30s per stretch", benefits: ["Range of motion", "Injury prevention"] },
      { name: "Dynamic stretching", duration: "10-15 min warm-up", benefits: ["Movement prep", "Circulation"] },
      { name: "Yoga", duration: "20-60 min", benefits: ["Flexibility", "Strength", "Mindfulness"] },
      { name: "Foam rolling", duration: "5-10 min", benefits: ["Recovery", "Mobility", "Pain relief"] }
    ]
  },
  
  workout_structure: {
    warmup: [
      { duration: "5 min", type: "Light cardio", purpose: "Increase blood flow" },
      { duration: "5 min", type: "Dynamic stretches", purpose: "Prepare joints" }
    ],
    main: [
      { duration: "20-45 min", type: "Primary workout", purpose: "Fitness goals" }
    ],
    cooldown: [
      { duration: "5 min", type: "Gradually reduce intensity", purpose: "Heart rate normalization" },
      { duration: "5-10 min", type: "Static stretching", purpose: "Flexibility and Recovery" }
    ]
  }
};

// ============ Mindfulness Module ============

export interface MindfulnessSession {
  date: string;
  type: 'breath' | 'body_scan' | 'loving_kindness' | 'open_monitoring' | 'visualization';
  duration: number; // minutes
  depth: 1 | 2 | 3 | 4 | 5; // 1=surface, 5=deep
  distractions: number;
  effectiveness: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export const MINDFULNESS_PRACTICES = {
  breath_techniques: [
    {
      name: "4-7-8 Breathing",
      pattern: "Inhale 4s, Hold 7s, Exhale 8s",
      rounds: "4 rounds",
      benefits: ["Anxiety reduction", "Sleep induction", "Calming"],
      when: "Before bed, anxiety moments"
    },
    {
      name: "Box Breathing",
      pattern: "Inhale 4s, Hold 4s, Exhale 4s, Hold 4s",
      rounds: "4-6 rounds",
      benefits: ["Focus improvement", "Stress response", "Clarity"],
      when: "Before presentations, work tasks"
    },
    {
      name: "Paced Breathing",
      pattern: "Inhale 5s, Exhale 5s",
      rounds: "10 rounds",
      benefits: ["Vagal tone", "Heart rate variability", "Relaxation"],
      when: "Throughout day, as needed"
    },
    {
      name: "Breath Counting",
      pattern: "Count to 10, then restart",
      rounds: "10-20 min",
      benefits: ["Concentration", "Present moment", "Monkey mind"],
      when: "Meditation sessions"
    }
  ],
  
  meditation_guides: {
    body_scan: {
      duration: "15-20 min",
      steps: [
        "Lie down comfortably", "Close eyes", "Notice breathing",
        "Move attention to toes", "Notice sensations in feet", "Move to ankles",
        "Up to calves", "Knees", "Thighs", "Pelvis", "Abdomen", "Chest",
        "Hands", "Arms", "Shoulders", "Neck", "Face", "Whole body",
        "Notice the body as a whole", "Rest in awareness"
      ]
    },
    loving_kindness: {
      duration: "10-15 min",
      sequence: [
        "Start with yourself: May I be safe", "May I be happy", "May I be healthy", "May I live with ease",
        "Someone you love: May you be safe", "May you be happy", "May you be healthy", "May you live with ease",
        "Neutral person: May you be safe", "May you be happy", "May you be healthy", "May you live with ease",
        "Difficult person: May you be safe", "May you be happy", "May you be healthy", "May you live with ease",
        "All beings: May all beings be safe", "May all beings be happy", "May all beings be healthy", "May all beings live with ease"
      ]
    },
    open_monitoring: {
      duration: "10-20 min",
      instruction: "Simply notice whatever arises in experience - thoughts, emotions, sensations - without engaging or judging. When you notice you've wandered, gently return to noticing."
    }
  },
  
  daily_practices: [
    { time: "Morning", practice: "5 min breathwork", purpose: "Set intention, center" },
    { time: "Midday", practice: "2 min check-in", purpose: "Reset, notice state" },
    { time: "Pre-meeting", practice: "3 breaths", purpose: "Calm nerves, focus" },
    { time: "Evening", practice: "10 min meditation", purpose: "Process day, wind down" },
    { time: "Before sleep", practice: "Body scan", purpose: "Release tension" }
  ]
};

// ============ Wellness Dashboard Data ============

export interface WellnessDashboard {
  date: string;
  sleep: SleepEntry;
  nutrition: NutritionEntry;
  exercise: ExerciseEntry[];
  mindfulness: MindfulnessSession[];
  overall_score: number; // 0-100
  streak_days: number;
  insights: WellnessInsight[];
}

interface WellnessInsight {
  category: 'sleep' | 'nutrition' | 'exercise' | 'mindfulness';
  type: 'success' | 'warning' | 'tip';
  message: string;
}

export function calculateWellnessScore(
  sleepQuality: number,
  nutritionScore: number,
  exerciseMinutes: number,
  mindfulnessMinutes: number
): number {
  // Weighted calculation
  const sleepWeight = 0.35;
  const nutritionWeight = 0.25;
  const exerciseWeight = 0.25;
  const mindfulnessWeight = 0.15;
  
  const exerciseScore = Math.min(exerciseMinutes / 45, 1) * 100; // 45 min target
  const mindfulnessScore = Math.min(mindfulnessMinutes / 15, 1) * 100; // 15 min target
  
  return Math.round(
    (sleepQuality * sleepWeight) +
    (nutritionScore * nutritionWeight) +
    (exerciseScore * exerciseWeight) +
    (mindfulnessScore * mindfulnessWeight)
  );
}

export const WELLNESS_GOALS = {
  daily: {
    sleep_hours: { target: 7.5, unit: "hours" },
    water_glasses: { target: 8, unit: "glasses" },
    exercise_minutes: { target: 45, unit: "minutes" },
    mindfulness_minutes: { target: 15, unit: "minutes" },
    meals_regular: { target: 3, unit: "meals" },
    fruits_veggies: { target: 5, unit: "servings" }
  },
  weekly: {
    sleep_consistency: { target: 7, unit: "days" },
    exercise_sessions: { target: 5, unit: "sessions" },
    strength_training: { target: 2, unit: "sessions" },
    meditation_sessions: { target: 7, unit: "days" },
    outdoor_time: { target: 7, unit: "days" }
  }
};
