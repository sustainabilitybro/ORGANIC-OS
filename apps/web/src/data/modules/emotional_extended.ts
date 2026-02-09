// Extended Emotional Intelligence Module
// Comprehensive emotion tracking, EQ skills, and coping strategies

// ============ Emotion Taxonomy ============

export interface EmotionEntry {
  timestamp: string;
  primary_emotion: string;
  secondary_emotions: string[];
  intensity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  triggers: string[];
  physical_sensations: string[];
  thoughts: string[];
  behaviors: string[];
  coping_strategy_used: string;
  outcome: 1 | 2 | 3 | 4 | 5; // 1=very negative, 5=very positive
  notes: string;
}

export interface EQAssessment {
  self_awareness: number; // 0-100
  self_regulation: number; // 0-100
  motivation: number; // 0-100
  empathy: number; // 0-100
  social_skills: number; // 0-100
  overall: number;
  assessment_date: string;
}

// Comprehensive emotion taxonomy
export const EMOTION_TAXONOMY = {
  primary: {
    joy: {
      synonyms: ["happy", "glad", "delighted", "pleased"],
      opposite: "sadness",
      valence: "positive",
      arousal: "high",
      emotions: ["happy", "glad", "delighted", "pleased", "content", "satisfied"]
    },
    sadness: {
      synonyms: ["unhappy", "sorrowful", "melancholy", "grief"],
      opposite: "joy",
      valence: "negative",
      arousal: "low",
      emotions: ["sad", "unhappy", "sorrowful", "melancholy", "disappointed", "discouraged"]
    },
    anger: {
      synonyms: ["mad", "furious", "irritated", "annoyed"],
      opposite: "calm",
      valence: "negative",
      arousal: "high",
      emotions: ["angry", "mad", "furious", "irritated", "annoyed", "frustrated", "resentful"]
    },
    fear: {
      synonyms: ["afraid", "scared", "anxious", "worried"],
      opposite: "courage",
      valence: "negative",
      arousal: "high",
      emotions: ["afraid", "scared", "anxious", "worried", "nervous", "tense", "insecure"]
    },
    surprise: {
      synonyms: ["amazed", "astonished", "shocked"],
      opposite: "expectation",
      valence: "neutral",
      arousal: "high",
      emotions: ["surprised", "amazed", "astonished", "shocked", "startled"]
    },
    disgust: {
      synonyms: ["revolted", "repulsed", "grossed out"],
      opposite: "attraction",
      valence: "negative",
      arousal: "medium",
      emotions: ["disgusted", "revolted", "repulsed", "grossed out", "aversion"]
    },
    anticipation: {
      synonyms: ["expecting", "looking forward", "excited"],
      opposite: "surprise",
      valence: "positive",
      arousal: "high",
      emotions: ["anticipating", "expecting", "excited", "eager", "hopeful"]
    },
    trust: {
      synonyms: ["confident", "faithful", "loyal"],
      opposite: "distrust",
      valence: "positive",
      arousal: "medium",
      emotions: ["trusting", "confident", "faithful", "loyal", "secure", "safe"]
    },
    calm: {
      synonyms: ["peaceful", "relaxed", "serene"],
      opposite: "anger",
      valence: "positive",
      arousal: "low",
      emotions: ["calm", "peaceful", "relaxed", "serene", "at ease", "content"]
    },
    interest: {
      synonyms: ["curious", "engaged", "fascinated"],
      opposite: "boredom",
      valence: "positive",
      arousal: "medium",
      emotions: ["curious", "engaged", "fascinated", "interested", "attentive", "absorbed"]
    },
    shame: {
      synonyms: ["embarrassed", "humiliated", "guilty"],
      opposite: "pride",
      valence: "negative",
      arousal: "high",
      emotions: ["ashamed", "embarrassed", "humiliated", "guilty", "remorseful"]
    },
    pride: {
      synonyms: ["accomplished", "successful", "confident"],
      opposite: "shame",
      valence: "positive",
      arousal: "high",
      emotions: ["proud", "accomplished", "successful", "confident", "triumphant"]
    },
    contempt: {
      synonyms: ["disdainful", "scornful", "superior"],
      opposite: "respect",
      valence: "negative",
      arousal: "medium",
      emotions: ["contemptuous", "disdainful", "scornful", "superior", "smug"]
    }
  },
  
  // Nuance levels for each emotion
  nuance: {
    joy: ["happy", "glad", "delighted", "pleased", "content", "satisfied", "elated", "ecstatic", "joyful", "thrilled"],
    sadness: ["sad", "unhappy", "sorrowful", "melancholy", "disappointed", "discouraged", "grief", "lonely", "hopeless", "despairing"],
    anger: ["angry", "mad", "furious", "irritated", "annoyed", "frustrated", "resentful", "hostile", "enraged", "hateful"],
    fear: ["afraid", "scared", "anxious", "worried", "nervous", "tense", "insecure", "terrified", "panicked", "horrified"],
    calm: ["calm", "peaceful", "relaxed", "serene", "at ease", "content", "tranquil", "centered", "balanced", "harmonious"]
  }
};

// ============ EQ Skills Framework ============

export interface EQSkill {
  name: string;
  category: 'self_awareness' | 'self_regulation' | 'motivation' | 'empathy' | 'social_skills';
  description: string;
  exercises: EQExercise[];
  assessment_questions: string[];
  improvement_tips: string[];
}

interface EQExercise {
  name: string;
  duration: string;
  description: string;
  frequency: string;
  expected_outcome: string;
}

export const EQ_SKILLS: EQSkill[] = [
  {
    name: "Emotional Awareness",
    category: "self_awareness",
    description: "The ability to recognize your emotions as they occur",
    exercises: [
      { name: "Emotion Check-ins", duration: "2 min", description: "Rate current emotions 1-10", frequency: "3x daily", expected_outcome: "Improved recognition speed" },
      { name: "Body Scan", duration: "5 min", description: "Notice physical sensations tied to emotions", frequency: "Daily", expected_outcome: "Body-emotion connection" },
      { name: "Emotion Journaling", duration: "10 min", description: "Write about emotional experiences", frequency: "Daily", expected_outcome: "Pattern recognition" }
    ],
    assessment_questions: [
      "Can you name your current emotion right now?",
      "How intense is this emotion on a scale of 1-10?",
      "What triggered this emotion?",
      "Where do you feel this in your body?"
    ],
    improvement_tips: [
      "Practice naming emotions without judgment",
      "Use emotion wheel for vocabulary expansion",
      "Notice physical cues before emotional reactions",
      "Ask others for feedback on your emotional expression"
    ]
  },
  
  {
    name: "Emotional Clarity",
    category: "self_awareness",
    description: "Understanding why you feel a certain way and what it means",
    exercises: [
      { name: "Why Ladder", duration: "5 min", description: "Ask 'why' 5 times to find root cause", frequency: "When confused", expected_outcome: "Deeper understanding" },
      { name: "Timeline Analysis", duration: "15 min", description: "Map emotional events over a day/week", frequency: "Weekly", expected_outcome: "Pattern recognition" }
    ],
    assessment_questions: [
      "What caused this emotion?",
      "Is this emotion proportional to the trigger?",
      "What does this emotion tell you about your needs?",
      "How does this emotion relate to your values?"
    ],
    improvement_tips: [
      "Distinguish between thoughts and feelings",
      "Identify underlying needs",
      "Consider context and history",
      "Seek to understand before judging"
    ]
  },
  
  {
    name: "Self-Regulation",
    category: "self_regulation",
    description: "Managing disruptive emotions and impulses",
    exercises: [
      { name: "STOP Method", duration: "1 min", description: "Stop, Take breath, Observe, Proceed", frequency: "As needed", expected_outcome: "Impulse control" },
      { name: "Delayed Response", duration: "Variable", description: "Wait 24 hours before emotional responses", frequency: "When triggered", expected_outcome: "Better decisions" },
      { name: "Anxiety Log", duration: "5 min", description: "Document anxious thoughts and challenge them", frequency: "Daily", expected_outcome: "Reduced anxiety" }
    ],
    assessment_questions: [
      "How long do emotional reactions typically last?",
      "Do you act impulsively when emotional?",
      "Can you calm yourself down quickly?",
      "What coping strategies work for you?"
    ],
    improvement_tips: [
      "Practice mindfulness meditation",
      "Use breathing techniques",
      "Create response pauses",
      "Develop alternative responses"
    ]
  },
  
  {
    name: "Adaptability",
    category: "self_regulation",
    description: "Flexibility in handling change and new situations",
    exercises: [
      { name: "Change Journal", duration: "10 min", description: "Document reactions to changes", frequency: "Weekly", expected_outcome: "Increased flexibility" },
      { name: "Worst Case Scenario", duration: "15 min", description: "Plan for feared outcomes", frequency: "Monthly", expected_outcome: "Reduced fear" }
    ],
    assessment_questions: [
      "How do you react to unexpected changes?",
      "Do you resist or embrace uncertainty?",
      "Can you adjust your plans easily?",
      "How comfortable are you with ambiguity?"
    ],
    improvement_tips: [
      "Start with small changes",
      "Reframe change as opportunity",
      "Build tolerance for uncertainty",
      "Practice acceptance"
    ]
  },
  
  {
    name: "Achievement Drive",
    category: "motivation",
    description: "Internal drive to succeed and improve",
    exercises: [
      { name: "Goal Setting", duration: "20 min", description: "Set SMART goals", frequency: "Weekly", expected_outcome: "Clear direction" },
      { name: "Progress Tracking", duration: "5 min", description: "Daily progress review", frequency: "Daily", expected_outcome: "Momentum" }
    ],
    assessment_questions: [
      "What goals are you working toward?",
      "What motivates you to keep going?",
      "How do you handle setbacks?",
      "What achievements are you proud of?"
    ],
    improvement_tips: [
      "Break large goals into small steps",
      "Celebrate small wins",
      "Find meaning in your work",
      "Connect goals to values"
    ]
  },
  
  {
    name: "Optimism",
    category: "motivation",
    description: "Positive outlook and hope for the future",
    exercises: [
      { name: "Gratitude Practice", duration: "5 min", description: "Write 3 things you're grateful for", frequency: "Daily", expected_outcome: "More positive outlook" },
      { name: "Best Possible Self", duration: "15 min", description: "Visualize your best future self", frequency: "Weekly", expected_outcome: "Increased hope" }
    ],
    assessment_questions: [
      "Do you expect positive or negative outcomes?",
      "How do you interpret setbacks?",
      "Do you see opportunities in challenges?",
      "What's your typical outlook?"
    ],
    improvement_tips: [
      "Challenge negative thoughts",
      "Practice gratitude",
      "Focus on solutions not problems",
      "Surround yourself with optimists"
    ]
  },
  
  {
    name: "Empathy",
    category: "empathy",
    description: "Understanding others' emotions and perspectives",
    exercises: [
      { name: "Perspective Taking", duration: "5 min", description: "See situation from other's view", frequency: "Daily", expected_outcome: "Better understanding" },
      { name: "Active Listening", duration: "Variable", description: "Listen without planning response", frequency: "Conversations", expected_outcome: "Deeper connections" }
    ],
    assessment_questions: [
      "Can you easily sense others' emotions?",
      "Do you try to understand before being understood?",
      "How accurate are you at reading people?",
      "Do others feel understood by you?"
    ],
    improvement_tips: [
      "Pay attention to nonverbal cues",
      "Ask open questions",
      "Listen more than you speak",
      "Validate others' feelings"
    ]
  },
  
  {
    name: "Social Awareness",
    category: "empathy",
    description: "Reading group dynamics and social cues",
    exercises: [
      { name: "Group Observation", duration: "Variable", description: "Notice group energy and dynamics", frequency: "Social events", expected_outcome: "Better social reading" },
      { name: "Network Mapping", duration: "30 min", description: "Map your relationships and connections", frequency: "Monthly", expected_outcome: "Relationship awareness" }
    ],
    assessment_questions: [
      "Do you notice group dynamics?",
      "Can you read the room quickly?",
      "Do you pick up on social tensions?",
      "How do you navigate group settings?"
    ],
    improvement_tips: [
      "Observe before participating",
      "Notice who has influence",
      "Pay attention to the quiet ones",
      "Understand group norms"
    ]
  },
  
  {
    name: "Conflict Management",
    category: "social_skills",
    description: "Resolving disagreements constructively",
    exercises: [
      { name: "Conflict Analysis", duration: "15 min", description: "Review past conflicts for patterns", frequency: "Monthly", expected_outcome: "Pattern recognition" },
      { name: "Role Play", duration: "20 min", description: "Practice difficult conversations", frequency: "Before challenging talks", expected_outcome: "Preparedness" }
    ],
    assessment_questions: [
      "How do you typically handle conflict?",
      "Do you avoid, confront, or collaborate?",
      "Can you find win-win solutions?",
      "Do conflicts often get resolved?"
    ],
    improvement_tips: [
      "Focus on interests not positions",
      "Look for common ground",
      "Use I-statements",
      "Take breaks when heated"
    ]
  },
  
  {
    name: "Communication",
    category: "social_skills",
    description: "Expressing ideas and feelings clearly",
    exercises: [
      { name: "I-Statement Practice", duration: "10 min", description: "Convert complaints to I-statements", frequency: "Daily", expected_outcome: "Clearer expression" },
      { name: "Feedback Practice", duration: "15 min", description: "Give and receive feedback", frequency: "Weekly", expected_outcome: "Better exchanges" }
    ],
    assessment_questions: [
      "Do others understand your message?",
      "Are you heard in conversations?",
      "Do you express yourself clearly?",
      "How do others respond to you?"
    ],
    improvement_tips: [
      "Be specific not general",
      "Use concrete examples",
      "Check for understanding",
      "Match medium to message"
    ]
  }
];

// ============ Coping Strategies Database ============

export interface CopingStrategy {
  name: string;
  category: 'emotion_focused' | 'problem_focused' | 'avoidance' | 'social';
  emotions: string[];
  effectiveness: number; // 1-5
  difficulty: 1 | 2 | 3; // 1=easy, 3=hard
  time_needed: string;
  steps: string[];
  when_to_use: string[];
  contraindications: string[];
}

export const COPING_STRATEGIES: CopingStrategy[] = [
  // Emotion-Focused Strategies
  {
    name: "Deep Breathing (4-7-8)",
    category: "emotion_focused",
    emotions: ["anxiety", "fear", "stress", "anger"],
    effectiveness: 5,
    difficulty: 1,
    time_needed: "2-5 minutes",
    steps: [
      "Inhale quietly through your nose for 4 seconds",
      "Hold your breath for 7 seconds",
      "Exhale completely through your mouth for 8 seconds",
      "Repeat 3-4 cycles"
    ],
    when_to_use: ["Anxiety spikes", "Before stressful events", "Difficulty sleeping", "Feeling overwhelmed"],
    contraindications: ["Respiratory conditions", "If feeling lightheaded"]
  },
  
  {
    name: "Progressive Muscle Relaxation",
    category: "emotion_focused",
    emotions: ["anxiety", "stress", "tension", "fear"],
    effectiveness: 5,
    difficulty: 2,
    time_needed: "15-20 minutes",
    steps: [
      "Find a comfortable position",
      "Tense muscle groups for 5 seconds (feet, calves, thighs, etc.)",
      "Release and notice relaxation for 15-20 seconds",
      "Move progressively through all muscle groups",
      "End with full body relaxation"
    ],
    when_to_use: ["Physical tension", "Before sleep", "High stress days", "After exercise"],
    contraindications: ["Recent injuries", "Joint problems"]
  },
  
  {
    name: "Cognitive Reframing",
    category: "emotion_focused",
    emotions: ["sadness", "anger", "fear", "anxiety", "frustration"],
    effectiveness: 4,
    difficulty: 3,
    time_needed: "10-20 minutes",
    steps: [
      "Identify the thought causing distress",
      "Examine the evidence for/against it",
      "Consider alternative explanations",
      "Create a balanced, realistic thought",
      "Notice emotional shift"
    ],
    when_to_use: ["Repeated negative thoughts", "After emotional triggers", "Before bed rumination"],
    contraindications: ["Active psychosis", "Severe depression (seek professional help)"]
  },
  
  {
    name: "Gratitude Practice",
    category: "emotion_focused",
    emotions: ["sadness", "anxiety", "stress", "boredom", "dissatisfaction"],
    effectiveness: 4,
    difficulty: 1,
    time_needed: "5 minutes",
    steps: [
      "Think of 3 things you're grateful for",
      "Why are these meaningful to you?",
      "How would life be different without them?",
      "Write them down or say them aloud"
    ],
    when_to_use: ["Daily morning/evening", "When feeling down", "Before sleep", "During stress"],
    contraindications: ["None - generally beneficial"]
  },
  
  // Problem-Focused Strategies
  {
    name: "Problem Solving",
    category: "problem_focused",
    emotions: ["stress", "anxiety", "overwhelm", "frustration"],
    effectiveness: 4,
    difficulty: 2,
    time_needed: "30-60 minutes",
    steps: [
      "Define the problem clearly",
      "Generate multiple solutions",
      "Evaluate pros/cons of each",
      "Choose and implement one solution",
      "Review and adjust as needed"
    ],
    when_to_use: ["Clear solvable problems", "When feeling stuck", "Decision-making situations"],
    contraindications: ["When emotions are too high (calm first)", "Problems outside your control"]
  },
  
  {
    name: "Time Management",
    category: "problem_focused",
    emotions: ["overwhelm", "stress", "anxiety", "frustration"],
    effectiveness: 4,
    difficulty: 2,
    time_needed: "15 minutes planning",
    steps: [
      "List all current tasks",
      "Prioritize by importance/urgency",
      "Break large tasks into smaller steps",
      "Schedule specific time blocks",
      "Build in buffer time"
    ],
    when_to_use: ["Feeling overwhelmed", "Procrastination", "Multiple deadlines", "Daily planning"],
    contraindications: ["Perfectionism can lead to more stress"]
  },
  
  // Social Coping Strategies
  {
    name: "Social Support Seeking",
    category: "social",
    emotions: ["sadness", "anxiety", "stress", "fear", "loneliness"],
    effectiveness: 5,
    difficulty: 2,
    time_needed: "Variable",
    steps: [
      "Identify who might help",
      "Reach out and share your feelings",
      "Ask for specific support needed",
      "Accept help graciously"
    ],
    when_to_use: ["When struggling alone", "After difficult events", "When lonely", "Major decisions"],
    contraindications: ["Over-reliance on others", "When professional help is needed"]
  },
  
  {
    name: "Help from Professional",
    category: "social",
    emotions: ["depression", "severe anxiety", "trauma", "long-term distress"],
    effectiveness: 5,
    difficulty: 3,
    time_needed: "Ongoing",
    steps: [
      "Recognize when self-help isn't enough",
      "Research therapists/counselors",
      "Schedule initial consultation",
      "Commit to the process",
      "Be open and honest"
    ],
    when_to_use: ["Persistent symptoms >2 weeks", "Thoughts of self-harm", "Major life crises", "When stuck"],
    contraindications: ["None - seeking help is always appropriate"]
  },
  
  // Quick In-the-Moment Strategies
  {
    name: "5-4-3-2-1 Grounding",
    category: "emotion_focused",
    emotions: ["anxiety", "fear", "panic", "dissociation", "overwhelm"],
    effectiveness: 5,
    difficulty: 1,
    time_needed: "2-3 minutes",
    steps: [
      "Acknowledge 5 things you can SEE",
      "Acknowledge 4 things you can TOUCH",
      "Acknowledge 3 things you can HEAR",
      "Acknowledge 2 things you can SMELL",
      "Acknowledge 1 thing you can TASTE"
    ],
    when_to_use: ["Panic attacks", "Anxiety spikes", "Flashbacks", "Disconnection"],
    contraindications: ["None"]
  },
  
  {
    name: "Cold Water Face Dunk",
    category: "emotion_focused",
    emotions: ["anxiety", "panic", "anger", "overwhelm"],
    effectiveness: 4,
    difficulty: 1,
    time_needed: "30 seconds",
    steps: [
      "Fill a bowl with cold water",
      "Hold your breath",
      "Submerge face in water for 15-30 seconds",
      "Slowly lift your face",
      "Notice the calm response"
    ],
    when_to_use: ["Acute anxiety", "Panic starting", "Emotional overload", "Before difficult tasks"],
    contraindications: ["Heart conditions", "Respiratory issues", "Cold sensitivity"]
  }
];

// ============ Emotional Intelligence Calculation ============

export function calculateEQScore(assessment: EQAssessment): number {
  const weights = {
    self_awareness: 0.20,
    self_regulation: 0.20,
    motivation: 0.20,
    empathy: 0.20,
    social_skills: 0.20
  };
  
  return Math.round(
    (assessment.self_awareness * weights.self_awareness) +
    (assessment.self_regulation * weights.self_regulation) +
    (assessment.motivation * weights.motivation) +
    (assessment.empathy * weights.empathy) +
    (assessment.social_skills * weights.social_skills)
  );
}

export function getEQLevel(score: number): { level: string; description: string; recommendations: string[] } {
  if (score >= 90) {
    return {
      level: "Exceptional",
      description: "Outstanding emotional intelligence",
      recommendations: ["Mentor others in EQ", "Continue practices", "Share your skills"]
    };
  } else if (score >= 75) {
    return {
      level: "Above Average",
      description: "Strong emotional skills",
      recommendations: ["Focus on weaker areas", "Continue growth practices", "Help others develop"]
    };
  } else if (score >= 60) {
    return {
      level: "Average",
      description: "Typical emotional intelligence",
      recommendations: ["Practice self-awareness daily", "Learn one new coping strategy weekly", "Seek feedback"]
    };
  } else if (score >= 40) {
    return {
      level: "Below Average",
      description: "Room for significant improvement",
      recommendations: ["Focus on one EQ skill at a time", "Consider therapy/coaching", "Daily journaling"]
    };
  } else {
    return {
      level: "Developing",
      description: "Building emotional intelligence",
      recommendations: ["Start with basic emotional awareness", "Practice daily self-reflection", "Be patient with progress"]
    };
  }
}
