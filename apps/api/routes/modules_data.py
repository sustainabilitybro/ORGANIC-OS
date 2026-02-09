"""
Module Data Routes

API endpoints for accessing comprehensive module data.
This provides content for all Organic OS modules without requiring database queries.
"""
from fastapi import APIRouter, HTTPException
from typing import Optional, List
import json

router = APIRouter(prefix="/api/v1/modules", tags=["modules"])

# Import module data functions
def get_identity_data():
    """Return identity module data"""
    return {
        "values_categories": [
            {
                "category": "Self-Transcendence",
                "values": ["Benevolence", "Universalism"]
            },
            {
                "category": "Self-Enhancement", 
                "values": ["Achievement", "Power", "Hedonism"]
            },
            {
                "category": "Openness to Change",
                "values": ["Self-Direction", "Stimulation"]
            },
            {
                "category": "Conservation",
                "values": ["Security", "Tradition", "Conformity"]
            }
        ],
        "purpose_exercises": [
            {"id": "ikigai", "title": "Ikigai Discovery", "duration": "45 min"},
            {"id": "legacy", "title": "Legacy Letter", "duration": "30 min"},
            {"id": "eulogy", "title": "Eulogy Exercise", "duration": "20 min"},
            {"id": "values_clarification", "title": "Values Clarification", "duration": "60 min"},
            {"id": "strengths_discovery", "title": "Signature Strengths", "duration": "30 min"}
        ],
        "daily_prompts": [
            "What aspect of yourself are you exploring right now?",
            "How has your sense of self changed in the past year?",
            "What parts of yourself are you still discovering?"
        ]
    }

def get_emotional_data():
    """Return emotional intelligence module data"""
    return {
        "emotions": [
            {"name": "Joy", "function": "Signals satisfaction and connection"},
            {"name": "Trust", "function": "Enables cooperation and vulnerability"},
            {"name": "Fear", "function": "Protects from danger"},
            {"name": "Anxiety", "function": "Mobilizes preparation"},
            {"name": "Sadness", "function": "Promotes support-seeking"},
            {"name": "Anger", "function": "Signals boundary violations"},
            {"name": "Disgust", "function": "Protects from contamination"},
            {"name": "Surprise", "function": "Captures attention"},
            {"name": "Anticipation", "function": "Motivates planning"},
            {"name": "Shame", "function": "Signals social threat"},
            {"name": "Guilt", "function": "Motivates repair of wrongdoing"},
            {"name": "Envy", "function": "Highlights unmet desires"},
            {"name": "Pride", "function": "Reinforces identity"},
            {"name": "Hope", "function": "Motivates goal-directed behavior"}
        ],
        "coping_strategies": {
            "problem_focused": ["Problem Solving", "Time Management", "Communication"],
            "emotion_focused": ["Deep Breathing", "PMR", "Mindfulness", "Grounding"],
            "social_support": ["Emotional Support", "Professional Help", "Support Groups"],
            "acceptance": ["Radical Acceptance", "Values Clarification", "Self-Compassion"]
        },
        "emotion_regulation_skills": [
            {"skill": "Emotion Awareness", "description": "Recognize and name emotions"},
            {"skill": "Opposite Action", "description": "Act opposite to emotion urges"},
            {"skill": "Cognitive Reframing", "description": "Change interpretation"},
            {"skill": "Attention Deployment", "description": "Direct focus strategically"},
            {"skill": "Physiological Smoothing", "description": "Use body to influence emotion"}
        ]
    }

def get_wellness_data():
    """Return wellness module data"""
    return {
        "metrics": {
            "sleep": {"optimal_range": [7, 9], "unit": "hours"},
            "nutrition": {"water_goal": "30-35ml per kg body weight"},
            "exercise": {"weekly_minutes": "150-300 moderate OR 75-150 vigorous"}
        },
        "daily_goals": [
            {"area": "Sleep", "goal": "7-9 hours"},
            {"area": "Water", "goal": "8+ glasses"},
            {"area": "Movement", "goal": "30 minutes"},
            {"area": "Mindfulness", "goal": "10 minutes"},
            {"area": "Nutrition", "goal": "3 balanced meals"}
        ],
        "mindfulness_practices": [
            {"name": "Breath Awareness", "duration": "5-20 min"},
            {"name": "Body Scan", "duration": "10-30 min"},
            {"name": "Loving Kindness", "duration": "5-15 min"},
            {"name": "Walking Meditation", "duration": "15-30 min"}
        ],
        "seasonal_wellness": {
            "spring": ["Deep clean living space", "Increase outdoor exercise"],
            "summer": ["Stay hydrated", "Exercise early/late"],
            "fall": ["Transition to warmer meals", "Prepare for daylight saving"],
            "winter": ["Light therapy", "Social connection", "Rest"]
        }
    }

def get_recovery_data():
    """Return recovery/burnout module data"""
    return {
        "burnout_assessment": {
            "dimensions": ["Exhaustion", "Cynicism", "Inefficacy"],
            "total_score_ranges": {
                "0_19": "Low burnout risk",
                "20_39": "Moderate burnout risk", 
                "40_59": "High burnout risk",
                "60_plus": "Severe burnout"
            }
        },
        "stress_types": [
            {"type": "Acute", "duration": "Minutes to hours"},
            {"type": "Episodic Acute", "duration": "Frequent acute stress"},
            {"type": "Chronic", "duration": "Weeks to years"}
        ],
        "recovery_activities": {
            "physical": ["Sleep", "Restorative Yoga", "Massage", "Nature Walk"],
            "mental": ["Meditation", "Reading", "Nature Exposure", "Digital Detox"],
            "emotional": ["Therapy", "Journaling", "Gratitude", "Boundary Setting"],
            "social": ["Quality Time", "Play", "Laughter", "Solitude"]
        },
        "relaxation_techniques": [
            {"name": "Box Breathing", "pattern": "4-4-4-4"},
            {"name": "4-7-8 Breathing", "pattern": "4-7-8"},
            {"name": "Progressive Muscle Relaxation", "pattern": "Tense-release"},
            {"name": "Body Scan", "pattern": "Top to bottom"}
        ]
    }

def get_communication_data():
    """Return communication module data"""
    return {
        "public_speaking": {
            "fear_management": [
                "Power poses before speaking",
                "Deep breathing (4-7-8)",
                "Reframe anxiety as excitement",
                "Practice, practice, practice"
            ],
            "structure": ["Opening hook", "3-5 main points", "Strong closing"],
            "vocal_variety": {
                "pace": "130-150 words/min optimal",
                "volume": "Project from diaphragm",
                "pauses": "Strategic silence for emphasis"
            }
        },
        "active_listening": {
            "components": ["Attending", "Following", "Reflecting", "Suspending"],
            "barriers": [
                "Thinking about response",
                "Distractions",
                "Prejudice",
                "Interrupting"
            ]
        },
        "nonviolent_communication": {
            "components": ["Observations", "Feelings", "Needs", "Requests"],
            "formula": "When [observation], I feel [feeling], because I need [need]. Would you [request]?"
        },
        "conflict_styles": [
            {"style": "Competing", "approach": "Assertive, win-lose"},
            {"style": "Collaborating", "approach": "Assertive and cooperative, win-win"},
            {"style": "Compromising", "approach": "Moderate both"},
            {"style": "Accommodating", "approach": "Cooperative, unassertive"},
            {"style": "Avoiding", "approach": "Unassertive, uncooperative"}
        ]
    }

def get_sensory_data():
    """Return sensory module data"""
    return {
        "senses": [
            {
                "name": "Visual",
                "exercises": [
                    {"name": "Peripheral Vision", "duration": "5 min"},
                    {"name": "Nature Observation", "duration": "10-15 min"},
                    {"name": "Art Appreciation", "duration": "15-30 min"}
                ]
            },
            {
                "name": "Auditory", 
                "exercises": [
                    {"name": "Active Listening", "duration": "10 min"},
                    {"name": "Sound Meditation", "duration": "15 min"},
                    {"name": "Nature Sounds", "duration": "20-30 min"}
                ]
            },
            {
                "name": "Olfactory",
                "exercises": [
                    {"name": "Scent Journaling", "duration": "5-10 min"},
                    {"name": "Aromatherapy Awareness", "duration": "10 min"},
                    {"name": "Mindful Eating - Smell", "duration": "15 min"}
                ]
            },
            {
                "name": "Gustatory",
                "exercises": [
                    {"name": "Mindful Eating", "duration": "20-30 min"},
                    {"name": "Flavor Exploration", "duration": "15 min"},
                    {"name": "Texture Exploration", "duration": "10 min"}
                ]
            },
            {
                "name": "Kinesthetic",
                "exercises": [
                    {"name": "Body Scan", "duration": "15-20 min"},
                    {"name": "Grounding Exercise", "duration": "5-10 min"},
                    {"name": "Movement Meditation", "duration": "20-30 min"}
                ]
            }
        ],
        "mindfulness_practices": [
            {"name": "Breath Awareness", "level": "Beginner", "duration": "5-20 min"},
            {"name": "Body Scan", "level": "Beginner", "duration": "15-30 min"},
            {"name": "Loving Kindness", "level": "Beginner-Intermediate", "duration": "10-15 min"},
            {"name": "Walking Meditation", "level": "Beginner", "duration": "15-30 min"},
            {"name": "Observing Thoughts", "level": "Intermediate", "duration": "10-15 min"}
        ]
    }

def get_sustainability_data():
    """Return sustainability module data"""
    return {
        "carbon_footprint": {
            "categories": ["Transportation", "Energy", "Food", "Shopping", "Waste"],
            "targets": {
                "excellent": {"daily": 3, "annual": 1.1},
                "good": {"daily": 6, "annual": 2.2},
                "average": {"daily": 10, "annual": 3.6}
            }
        },
        "eco_tips": {
            "home": [
                "LED bulbs use 75% less energy",
                "Smart thermostat can save 10%",
                "Draft-proof windows and doors"
            ],
            "transport": [
                "One less flight/year saves 1.6 tons",
                "Work from home 2x/week = 1 ton saved"
            ],
            "food": [
                "One vegetarian meal/day = 0.8 tons/year",
                "Reduce food waste 50% = 0.25 tons/year"
            ]
        },
        "climate_anxiety": {
            "coping": [
                {"strategy": "Take action", "description": "Vote, reduce footprint, educate"},
                {"strategy": "Find community", "description": "Connect with like-minded people"},
                {"strategy": "Focus on control", "description": "Personal lifestyle changes"},
                {"strategy": "Practice acceptance", "description": "Acknowledge emotions without judgment"}
            ]
        }
    }

def get_holistic_alchemy_data():
    """Return holistic alchemy/mental health module data"""
    return {
        "depression": {
            "interventions": [
                {"name": "Behavioral Activation", "evidence": "Strong"},
                {"name": "Cognitive Restructuring", "evidence": "Strong"},
                {"name": "Pleasant Activity Scheduling", "evidence": "Moderate"}
            ],
            "warning_signs": [
                "Persistent sadness > 2 weeks",
                "Thoughts of self-harm",
                "Inability to function"
            ]
        },
        "anxiety": {
            "interventions": [
                {"name": "Exposure Therapy", "evidence": "Strongest"},
                {"name": "Relaxation Training", "evidence": "Moderate"},
                {"name": "Cognitive Therapy", "evidence": "Strong"}
            ],
            "panic_protocol": ["Recognize", "Stop", "Breathe", "Challenge", "Continue"]
        },
        "sleep": {
            "interventions": [
                {"name": "Sleep Restriction", "evidence": "Strong"},
                {"name": "Stimulus Control", "evidence": "Strong"},
                {"name": "Sleep Hygiene", "evidence": "Moderate"}
            ]
        },
        "ocd": {
            "intervention": "Exposure and Response Prevention (ERP)",
            "evidence": "Strongest"
        },
        "ptsd": {
            "interventions": [
                {"name": "EMDR", "evidence": "Strong"},
                {"name": "Prolonged Exposure", "evidence": "Strong"},
                {"name": "Cognitive Processing Therapy", "evidence": "Strong"}
            ]
        }
    }

def get_atom_economy_data():
    """Return atom economy/productivity module data"""
    return {
        "productivity_systems": [
            {"name": "GTD", "creator": "David Allen"},
            {"name": "Time Blocking", "principle": "Schedule everything"},
            {"name": "Pomodoro", "principle": "25 min work, 5 min break"},
            {"name": "Eat That Frog", "principle": "Do most important task first"}
        ],
        "focus_optimization": {
            "conditions": ["Environment", "Mental State", "Time of Day"],
            "techniques": ["Single-Tasking", "Theme Days", "Task Batching"]
        },
        "energy_management": {
            "pillars": ["Physical", "Emotional", "Mental", "Spiritual"],
            "strategies": ["Energy Audit", "Strategic Rest"]
        },
        "decision_making": {
            "quick": {"time": "<$100, <10 min", "approach": "Trust gut"},
            "standard": {"time": "10-60 min", "approach": "Sleep on it"},
            "major": {"time": "Hours", "approach": "Gather data, deliberate"},
            "irreversible": {"time": "Days", "approach": "Full analysis"}
        }
    }

def get_video_data():
    """Return video/on-camera module data"""
    return {
        "skills": [
            {
                "name": "Eye Contact",
                "techniques": ["Camera-as-person", "Triangle method", "Intimate eye contact"]
            },
            {
                "name": "Facial Expression",
                "techniques": ["Authentic smiles", "Micro-expressions", "Pacing expressions"]
            },
            {
                "name": "Posture & Presence",
                "techniques": ["Power stance", "Open posture", "Purposeful gestures"]
            },
            {
                "name": "Voice & Speaking",
                "techniques": ["Vocal variety", "Pacing", "Clarity"]
            }
        ],
        "video_types": [
            {"type": "Vlog", "length": "5-15 min"},
            {"type": "Tutorial", "length": "5-20 min"},
            {"type": "Explainer", "length": "3-10 min"},
            {"type": "Presentation", "length": "10-30 min"}
        ],
        "camera_setup": {
            "positioning": ["Eye level camera", "Proper distance", "Good lighting", "Clean background"],
            "equipment": {
                "beginner": ["Smartphone", "Ring light", "Basic tripod"],
                "intermediate": ["Webcam", "Two-point lighting", "USB mic"],
                "professional": ["Mirrorless", "Three-point lighting", "XLR mic"]
            }
        },
        "practice_exercises": [
            {"exercise": "Self-Introduction", "duration": "60 seconds"},
            {"exercise": "Thought Leader Statement", "duration": "90 seconds"},
            {"exercise": "Storytelling", "duration": "2 minutes"},
            {"exercise": "Impromptu Speaking", "duration": "60 seconds per topic"}
        ]
    }

# ============ Routes ============

@router.get("/identity")
async def get_identity_module():
    """Get identity module data"""
    return get_identity_data()

@router.get("/emotional")
async def get_emotional_module():
    """Get emotional intelligence module data"""
    return get_emotional_data()

@router.get("/wellness")
async def get_wellness_module():
    """Get wellness module data"""
    return get_wellness_data()

@router.get("/recovery")
async def get_recovery_module():
    """Get recovery module data"""
    return get_recovery_data()

@router.get("/communication")
async def get_communication_module():
    """Get communication module data"""
    return get_communication_data()

@router.get("/sensory")
async def get_sensory_module():
    """Get sensory module data"""
    return get_sensory_data()

@router.get("/sustainability")
async def get_sustainability_module():
    """Get sustainability module data"""
    return get_sustainability_data()

@router.get("/holistic-alchemy")
async def get_holistic_alchemy_module():
    """Get holistic alchemy module data"""
    return get_holistic_alchemy_data()

@router.get("/atom-economy")
async def get_atom_economy_module():
    """Get atom economy module data"""
    return get_atom_economy_data()

@router.get("/video")
async def get_video_module():
    """Get video module data"""
    return get_video_data()

@router.get("/all")
async def get_all_modules():
    """Get all module data in one response"""
    return {
        "identity": get_identity_data(),
        "emotional": get_emotional_data(),
        "wellness": get_wellness_data(),
        "recovery": get_recovery_data(),
        "communication": get_communication_data(),
        "sensory": get_sensory_data(),
        "sustainability": get_sustainability_data(),
        "holistic_alchemy": get_holistic_alchemy_data(),
        "atom_economy": get_atom_economy_data(),
        "video": get_video_data()
    }

@router.get("/prompts/{module_name}")
async def get_module_prompts(module_name: str):
    """Get daily prompts for a specific module"""
    prompts_map = {
        "identity": get_identity_data()["daily_prompts"],
        "emotional": [
            "What emotion are you feeling right now?",
            "What triggered this feeling?",
            "How can you respond constructively?"
        ],
        "wellness": [
            "What are you grateful for today?",
            "How did you take care of your body?",
            "What's one thing you can improve tomorrow?"
        ],
        "recovery": [
            "How are you recovering today?",
            "What signs of burnout are you monitoring?",
            "What boundaries do you need?"
        ]
    }
    
    if module_name in prompts_map:
        return {"module": module_name, "prompts": prompts_map[module_name]}
    raise HTTPException(status_code=404, detail="Module not found")

@router.get("/exercises/{module_name}")
async def get_module_exercises(module_name: str):
    """Get exercises for a specific module"""
    exercises_map = {
        "identity": get_identity_data()["purpose_exercises"],
        "sensory": get_sensory_data()["senses"],
        "video": get_video_data()["practice_exercises"],
        "recovery": get_recovery_data()["relaxation_techniques"]
    }
    
    if module_name in exercises_map:
        return {"module": module_name, "exercises": exercises_map[module_name]}
    raise HTTPException(status_code=404, detail="Module not found")
