// Emotional Intelligence Module Data
// Comprehensive emotion taxonomy, coping strategies, and EQ exercises

export const EMOTION_TAXONOMY = [
  {
    emotion: "Joy",
    definition: "The emotion of well-being, happiness, contentment, and joy",
    category: "Positive",
    intensity_levels: [
      { level: 1, name: "Content", description: "Satisfied, peaceful" },
      { level: 3, name: "Happy", description: "Pleased, cheerful" },
      { level: 5, name: "Delighted", description: "Very pleased, gratified" },
      { level: 7, name: "Elated", description: "Extremely happy, triumphant" },
      { level: 10, name: "Ecstatic", description: "Overwhelmingly happy, euphoric" }
    ],
    function: "Signals satisfaction, safety, and connection. Reinforces relationships and motivates approach behaviors.",
    healthy_expression: ["Celebrating achievements", "Expressing gratitude", "Sharing happiness"],
    coping_strategies: {
      increase: ["Savoring the moment", "Expressing gratitude", "Sharing with others", "Physical expression"],
      decrease: ["Mindful observation", "Grounding techniques", "Deep breathing"]
    },
    triggers: ["Achievements", "Positive feedback", "Time with loved ones", "Nature", "Music"],
    questions: [
      "What brought you joy today?",
      "How do you typically express joy?",
      "What maximizes your joy?",
      "How does joy feel in your body?"
    ],
    physiology: ["Smiling", "Laughter", "Warmth in chest", "Increased energy"]
  },
  {
    emotion: "Trust",
    definition: "A firm belief in the reliability, truth, ability, or strength of someone or something",
    category: "Positive",
    intensity_levels: [
      { level: 1, name: "Confidence", description: "Assured, certain" },
      { level: 5, name: "Trust", description: "Reliance on another" },
      { level: 10, name: "Faith", description: "Complete confidence, belief without proof" }
    ],
    function: "Enables cooperation, vulnerability, and intimate connections. Reduces perceived threat.",
    healthy_expression: ["Being vulnerable", "Asking for help", "Delegating tasks", "Deep conversations"],
    coping_strategies: {
      build: ["Small acts of reliability", "Consistent follow-through", "Radical honesty"],
      repair: ["Honest conversations", "Making amends", "Time and patience"]
    },
    triggers: ["Reliable people", "Safety signals", "Competence demonstrations", "Consistency"],
    questions: [
      "Who do you trust completely?",
      "What eroded trust in your past?",
      "How do you rebuild trust?",
      "What makes trust easy for you?"
    ],
    physiology: ["Relaxed muscles", "Open posture", "Eye contact", "Calm breathing"]
  },
  {
    emotion: "Fear",
    definition: "An unpleasant emotion caused by the belief that someone or something is dangerous, likely to cause pain, or a threat",
    category: "Primary",
    intensity_levels: [
      { level: 1, name: "Apprehension", description: "Uneasy feeling about future" },
      { level: 3, name: "Anxiety", description: "Worry about uncertain outcomes" },
      { level: 5, name: "Fear", description: "Response to identified threat" },
      { level: 7, name: "Terror", description: "Intense, overwhelming fear" },
      { level: 10, name: "Horror", description: "Extreme shock and fear" }
    ],
    function: "Protects from danger. Heightens awareness and prepares body for fight or flight.",
    healthy_expression: ["Cautious assessment", "Seeking information", "Safety behaviors", "Proactive preparation"],
    coping_strategies: {
      immediate: ["Box breathing (4-4-4)", "5-4-3-2-1 grounding", "Progressive muscle relaxation"],
      short_term: ["Challenge thoughts", "Exposure to fear", "Support from others"],
      long_term: ["Fear face-to-face", "Build self-efficacy", "Therapy (CBT, EMDR)"]
    },
    types: [
      { name: "Fear of failure", strategies: ["Reframe failure as learning", "Set process goals", "Accept imperfection"] },
      { name: "Fear of rejection", strategies: ["Build self-worth", "Practice vulnerability", "Expand social circles"] },
      { name: "Fear of the unknown", strategies: ["Information gathering", "Flexibility training", "Mindfulness practice"] },
      { name: "Fear of abandonment", strategies: ["Build secure attachment", "Self-soothing skills", "Trust building"] }
    ],
    triggers: ["Uncertainty", "Past trauma", "Health concerns", "Financial insecurity", "Conflict"],
    questions: [
      "What fears hold you back?",
      "What evidence contradicts your fear?",
      "What would you do if you weren't afraid?",
      "What small step can you take toward your fear?"
    ],
    physiology: ["Rapid heartbeat", "Shallow breathing", "Sweating", "Tense muscles", "Dilated pupils"]
  },
  {
    emotion: "Anxiety",
    definition: "A feeling of worry, nervousness, or unease about something with an uncertain outcome",
    category: "Primary",
    function: "Signals potential future threat. Mobilizes preparation and caution.",
    healthy_expression: ["Careful planning", "Seeking information", "Problem-solving", "Preparation"],
    coping_strategies: {
      cognitive: ["Challenge catastrophic thinking", "Identify worst/best/most likely outcomes", "Thought records"],
      behavioral: ["Worry time scheduling", "Worry exposure", "Behavioral experiments"],
      physical: ["Exercise", "Deep breathing", "Progressive relaxation", "Sleep hygiene"],
      lifestyle: ["Caffeine reduction", "Regular sleep", "Social support", "Mindfulness practice"]
    },
    types: [
      { name: "Generalized", strategies: ["Mindfulness", "Acceptance", "Values-based action"] },
      { name: "Social", strategies: ["Cognitive restructuring", "Social skills practice", "Exposure hierarchy"] },
      { name: "Panic", strategies: ["Breath training", "Interoceptive exposure", "Coping cards"] },
      { name: "Health", strategies: ["Medical reassurance", "Symptom education", "Acceptance"] }
    ],
    triggers: ["Deadlines", "Social situations", "Health concerns", "Financial stress", "Uncertainty"],
    questions: [
      "What are you anxious about right now?",
      "What's the evidence for and against your anxious thoughts?",
      "What would you do if anxiety wasn't a factor?",
      "What can you control in this situation?"
    ],
    physiology: ["Racing thoughts", "Muscle tension", "Restlessness", "Sleep disturbance", "Fatigue"]
  },
  {
    emotion: "Sadness",
    definition: "Emotional pain associated with, or characterized by, feelings of disadvantage, loss, despair, grief, hopelessness, or sorrow",
    category: "Primary",
    function: "Signals loss or disconnection. Promotes support-seeking and attachment.",
    healthy_expression: ["Crying", "Seeking support", "Reflecting on loss", "Honoring feelings"],
    coping_strategies: {
      immediate: ["Allow the feelings", "Self-compassion", "Comfort items", "Gentle movement"],
      short_term: ["Support from others", "Rituals of mourning", "Memory sharing"],
      long_term: ["Grief counseling", "Finding meaning", "Legacy work", "Time and patience"]
    },
    types: [
      { name: "Grief", strategies: ["Allow grieving process", "Create memorials", "Talk about loss"] },
      { name: "Depression", strategies: ["Behavioral activation", "Social connection", "Professional help"] },
      { name: "Disappointment", strategies: ["Reframe expectations", "Self-compassion", "New goals"] },
      { name: "Loneliness", strategies: ["Reach out", "Community involvement", "Self-connection"] }
    ],
    triggers: ["Loss of loved one", "Relationship ending", "Loss of job/health", "Missed opportunities", "Unmet expectations"],
    questions: [
      "What have you lost that you're grieving?",
      "How are you honoring your grief?",
      "What support do you need right now?",
      "What would self-compassion look like in this moment?"
    ],
    physiology: ["Heavy feeling in chest", "Tearfulness", "Low energy", "Withdrawal", "Changes in appetite/sleep"]
  },
  {
    emotion: "Anger",
    definition: "A strong feeling of annoyance, displeasure, or hostility",
    category: "Primary",
    intensity_levels: [
      { level: 1, name: "Irritation", description: "Mild annoyance" },
      { level: 3, name: "Frustration", description: "Blocked from goal" },
      { level: 5, name: "Anger", description: "Active displeasure" },
      { level: 7, name: "Rage", description: "Uncontrolled fury" },
      { level: 10, name: "Fury", description: "Violent passion, extreme anger" }
    ],
    function: "Signals boundary violations. Mobilizes energy to protect self or others.",
    healthy_expression: ["Clear communication", "Boundary setting", "Problem-solving", "Constructive action"],
    coping_strategies: {
      immediate: ["Cool down (breathing, time)", "Count to 10", "Physical release (exercise)", "Journaling"],
      expression: ["I-statements", "De-escalation techniques", "Conflict resolution", "Mediation"],
      long_term: ["Anger management", "Boundary work", "Trauma processing", "Values clarification"]
    },
    triggers: ["Unfairness", "Disrespect", "Violation of boundaries", "Frustration", "Feeling controlled", "Physical discomfort"],
    questions: [
      "What boundary has been crossed?",
      "What need is going unmet?",
      "What would healthy assertiveness look like?",
      "How can you express this constructively?"
    ],
    physiology: ["Increased heart rate", "Muscle tension", "Flushing", "Clenched jaw", "Elevated energy"]
  },
  {
    emotion: "Disgust",
    definition: "An intense feeling of revulsion or strong disapproval",
    category: "Primary",
    function: "Protects from contamination and moral violations. Signals rejection.",
    healthy_expression: ["Avoidance of harmful substances", "Moral outrage", "Setting standards"],
    coping_strategies: ["Identify values violations", "Set boundaries", "Remove yourself from situation"],
    triggers: ["Physical contamination", "Moral violations", "Poor hygiene", "Dishonesty", "Cruelty"],
    questions: [
      "What disgusts you and why?",
      "What values are being violated?",
      "How do you respond to disgust appropriately?"
    ]
  },
  {
    emotion: "Surprise",
    definition: "A short, sharp emotional reaction to something unexpected",
    category: "Primary",
    function: "Captures attention and aids memory formation. Orients response to novel events.",
    healthy_expression: ["Openness to novelty", "Learning from surprises", "Flexibility in response"],
    types: ["Positive surprise", "Neutral surprise", "Negative surprise"],
    coping_strategies: ["Practice flexibility", "Expect the unexpected", "Quick recovery skills"],
    triggers: ["Unexpected events", "Sudden changes", "Novel experiences", "Revealed information"],
    questions: [
      "How do you typically respond to surprises?",
      "What surprises have led to growth?",
      "How can you become more adaptable to the unexpected?"
    ],
    physiology: ["Sharp intake of breath", "Widened eyes", "Tensing of muscles", "Quick heartbeat"]
  },
  {
    emotion: "Anticipation",
    definition: "The emotion of looking forward to something, especially something good or exciting",
    category: "Positive",
    function: "Motivates planning and preparation. Enhances enjoyment of upcoming positive events.",
    healthy_expression: ["Goal-setting", "Planning and preparation", "Savoring the build-up"],
    coping_strategies: ["Balance anticipation with present-moment focus", "Manage expectations", "Enjoy the journey"],
    triggers: ["Upcoming events", "New experiences", "Goals in progress", "Plans for future"],
    questions: [
      "What are you looking forward to?",
      "How do you balance anticipation with presence?",
      "How does anticipation affect your enjoyment?"
    ],
    physiology: ["Smiling", "Leaning forward", "Energized feeling", "Increased focus"]
  },
  {
    emotion: "Shame",
    definition: "An intensely painful feeling or experience of believing we are flawed and therefore unworthy of acceptance and belonging",
    category: "Secondary",
    function: "Signals social threat. Can motivate prosocial behavior or lead to withdrawal.",
    healthy_expression: ["Taking responsibility", "Making amends", "Self-improvement", "Seeking support"],
    coping_strategies: {
      immediate: ["Self-compassion", "Recognize it's a feeling not fact", "Reach out to safe person"],
      short_term: ["Acknowledge without rumination", "Apologize if needed", "Make amends"],
      long_term: ["Shame resilience", "Therapy", "Support groups", "Values-based living"]
    },
    triggers: ["Social comparison", "Failure", "Rejection", "Embarrassment", "Unmet expectations"],
    questions: [
      "What experiences of shame do you carry?",
      "How does shame differ from guilt?",
      "What would self-compassion look like right now?",
      "What do you need to hear from a supportive friend?"
    ],
    physiology: ["Heat in face/neck", "Avoiding eye contact", "Desire to disappear", "Withdrawal"]
  },
  {
    emotion: "Guilt",
    definition: "The feeling that you have done something wrong or that you have failed to do something you should have done",
    category: "Secondary",
    function: "Moral compass. Motivates repair of wrongdoing and adherence to values.",
    healthy_expression: ["Taking responsibility", "Making amends", "Learning from mistake", "Behavior change"],
    coping_strategies: ["Distinguish guilt from shame", "Apologize if appropriate", "Make restitution", "Learn and grow"],
    triggers: ["Violating personal values", "Hurting others", "Not meeting obligations", "Dishonesty"],
    questions: [
      "What do you feel guilty about?",
      "Is there action you need to take?",
      "How can you make amends?",
      "What would you do differently?"
    ],
    physiology: ["Remorseful feeling", "Desire to fix", "Cognitive focus on wrongdoing"]
  },
  {
    emotion: "Envy",
    definition: "A feeling of discontented or resentful longing aroused by someone else's possessions, qualities, or luck",
    category: "Secondary",
    function: "Can highlight unmet desires and motivate aspiration.",
    healthy_expression: ["Identifying unmet desires", "Using as motivation", "Celebrating others", "Gratitude practice"],
    coping_strategies: ["Reframe as inspiration", "Focus on own journey", "Celebrate others' success", "Identify what you truly want"],
    triggers: ["Social comparison", "Seeing others' success", "Unmet desires", "Perceived unfairness"],
    questions: [
      "What specifically do you envy?",
      "What does their success reveal about your desires?",
      "What steps can you take toward your own goals?",
      "How can you genuinely celebrate others?"
    ]
  },
  {
    emotion: "Pride",
    definition: "A feeling or deep pleasure or satisfaction derived from one's own achievements or the achievements of those with whom one is closely associated",
    category: "Secondary",
    function: "Reinforces identity and competence. Motivates continued achievement.",
    healthy_expression: ["Celebrating achievements", "Acknowledging growth", "Healthy self-esteem", "Recognition of others"],
    coping_strategies: ["Balance with humility", "Focus on process", "Share credit", "Set new goals"],
    triggers: ["Personal achievements", "Recognition", "Helping others succeed", "Mastery of skills"],
    questions: [
      "What achievements are you most proud of?",
      "How do you celebrate wins healthily?",
      "What would balanced pride look like?",
      "How do you share credit with others?"
    ],
    physiology: ["Chest expansion", "Head held high", "Smiling", "Increased energy"]
  },
  {
    emotion: "Hope",
    definition: "A feeling of expectation and desire for a certain thing to happen",
    category: "Secondary",
    function: "Motivates goal-directed behavior. Provides resilience during adversity.",
    healthy_expression: ["Goal-setting", "Optimism about future", "Perseverance", "Positive visualization"],
    coping_strategies: ["Set realistic goals", "Build pathways", "Identify agency", "Practice gratitude", "Learn from setbacks"],
    triggers: ["Positive expectations", "Supportive relationships", "Past overcoming of adversity", "Clear goals"],
    questions: [
      "What are you hoping for?",
      "What steps can you take toward your hope?",
      "What has helped you maintain hope in the past?",
      "Who supports your hopefulness?"
    ],
    physiology: ["Open posture", "Forward leaning", "Energized feeling", "Positive facial expression"]
  }
]

export const COPING_STRATEGIES_DB = {
  problem_focused: [
    { name: "Problem Solving", description: "Identify problem, generate solutions, evaluate, implement", steps: ["Define the problem", "Brainstorm solutions", "Evaluate options", "Create action plan", "Implement and review"] },
    { name: "Time Management", description: "Prioritize tasks, schedule effectively", steps: ["List all tasks", "Prioritize by importance/urgency", "Schedule blocks", "Protect time", "Review and adjust"] },
    { name: "Communication", description: "Express needs, assert boundaries, seek support", steps: ["Identify need", "Choose right time", "Use I-statements", "Listen to response", "Negotiate solution"] },
    { name: "Seeking Information", description: "Gather facts to reduce uncertainty", steps: ["Identify information gaps", "Find reliable sources", "Evaluate credibility", "Synthesize findings", "Make informed decision"] }
  ],
  emotion_focused: [
    { name: "Deep Breathing", description: "Activate parasympathetic nervous system", variations: ["Box breathing (4-4-4-4)", "4-7-8 breathing", "Belly breathing", "Alternate nostril"] },
    { name: "Progressive Muscle Relaxation", description: "Systematically tense and release muscle groups", steps: ["Find quiet space", "Start with feet", "Tense for 5 seconds", "Release", "Notice contrast", "Move upward"] },
    { name: "Mindfulness Meditation", description: "Present-moment awareness without judgment", practices: ["Body scan", "Breath awareness", "Loving kindness", "Observing thoughts"] },
    { name: "Grounding Techniques", description: "Connect with present moment", techniques: ["5-4-3-2-1 senses", "Rooting stance", "Cold water on face", "Walking meditation"] },
    { name: "Journaling", description: "Process emotions through writing", types: ["Gratitude journal", "Emotion journal", "Brain dump", "Stream of consciousness", "Prompted reflection"] }
  ],
  social_support: [
    { name: "Emotional Support", description: "Share feelings with trusted person", steps: ["Identify need", "Choose right person", "Share honestly", "Ask for what you need", "Express gratitude"] },
    { name: "Practical Support", description: "Delegate or ask for help with tasks", steps: ["Identify task", "Make specific request", "Choose appropriate person", "Express appreciation", "Reciprocate when possible"] },
    { name: "Professional Help", description: "Seek therapy or counseling", options: ["CBT", "DBT", "ACT", "EMDR", "Psychodynamic", "Coaching"] },
    { name: "Support Groups", description: "Connect with others experiencing similar challenges", types: ["In-person groups", "Online communities", "12-step programs", "Interest-based groups"] }
  ],
  avoidance: [
    { name: "Distraction", description: "Temporary shift of attention", healthy: ["Reading", "Music", "Nature walk", "Creative activity", "Light exercise"],
      unhealthy: ["Excessive screen time", "Substance use", "Overworking", "Emotional eating"] },
    { name: "Time-Out", description: "Brief break from situation", guidelines: ["Set time limit", "Return to issue", "Use for cooling down", "Not permanent avoidance"] }
  ],
  acceptance: [
    { name: "Radical Acceptance", description: "Fully accepting reality without judgment", steps: ["Notice resistance", "Acknowledge situation", "Accept without approving", "Let go of struggle", "Focus on what you can control"] },
    { name: "Values Clarification", description: "Identify what matters most", process: ["List values", "Rank order", "Identify conflicts", "Align action with values"] },
    { name: "Self-Compassion", description: "Treat yourself with kindness", practices: ["Self-kindness", "Common humanity", "Mindfulness"] }
  ]
}

export const EMOTION_REGULATION_SKILLS = [
  {
    skill: "Emotion Awareness",
    description: "Recognizing and naming emotions accurately",
    exercises: [
      "Emotion wheel check-in 3x daily",
      "Body scan for emotion sensations",
      "Emotion vocabulary expansion",
      "Tracking patterns over time"
    ]
  },
  {
    skill: "Opposite Action",
    description: "Acting opposite to the emotion's urges",
    examples: [
      { emotion: "Fear", urge: "Avoid", opposite: "Approach slowly" },
      { emotion: "Anger", urge: "Attack", opposite: "Gentle communication" },
      { emotion: "Sadness", urge: "Withdraw", opposite: "Reach out" },
      { emotion: "Anxiety", urge: "Escape", opposite: "Stay present" }
    ]
  },
  {
    skill: "Cognitive Reframing",
    description: "Changing the interpretation of a situation",
    techniques: [
      "Evidence for/against thought",
      "Perspective taking (5 years, 10 years)",
      "Replacing catastrophizing with realistic thinking",
      "Finding meaning in difficulty"
    ]
  },
  {
    skill: "Attention Deployment",
    description: "Directing focus strategically",
    techniques: [
      "Selective attention (focus on positive/important)",
      "Attentional shifting (away from rumination)",
      "Mindful attention (observing without engaging)",
      "Problem-focused attention (solutions)"
    ]
  },
  {
    skill: "Physiological Smoothing",
    description: "Using body to influence emotion",
    techniques: [
      "Breath regulation",
      "Exercise and movement",
      "Facial expression (smile, relax jaw)",
      "Posture (power poses, relaxed stance)"
    ]
  }
]

export const EMOTIONAL_INTELLIGENCE_QUOTIENT = {
  self_awareness: [
    { question: "I can accurately name my emotions as I experience them", scale: "1-5" },
    { question: "I understand how my emotions affect my thoughts and behavior", scale: "1-5" },
    { question: "I recognize patterns in my emotional responses", scale: "1-5" },
    { question: "I can identify what triggers different emotions", scale: "1-5" }
  ],
  self_regulation: [
    { question: "I can calm myself down when upset", scale: "1-5" },
    { question: "I think before reacting to emotional situations", scale: "1-5" },
    { question: "I can adjust my emotions to fit the situation", scale: "1-5" },
    { question: "I manage stress without losing control", scale: "1-5" }
  ],
  motivation: [
    { question: "I am driven by internal rewards rather than external validation", scale: "1-5" },
    { question: "I persist through challenges despite setbacks", scale: "1-5" },
    { question: "I align my goals with my values", scale: "1-5" },
    { question: "I seek opportunities for growth", scale: "1-5" }
  ],
  empathy: [
    { question: "I can sense what others are feeling", scale: "1-5" },
    { question: "I listen attentively without judgment", scale: "1-5" },
    { question: "I understand others' perspectives", scale: "1-5" },
    { question: "I show compassion to others' struggles", scale: "1-5" }
  ],
  social_skills: [
    { question: "I communicate my needs clearly", scale: "1-5" },
    { question: "I navigate conflicts constructively", scale: "1-5" },
    { question: "I build and maintain relationships", scale: "1-5" },
    { question: "I influence others positively", scale: "1-5" }
  ]
}
