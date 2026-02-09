from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter()

# Module-specific endpoints


# ====================
# IDENTITY MODULE
# ====================

class ValuesAssessment(BaseModel):
    values: list[str]


@router.post("/identity/values")
async def assess_values(assessment: ValuesAssessment):
    """
    Analyze user-provided values and provide AI insights.
    """
    return {
        "values": assessment.values,
        "insights": "AI-generated insights about these values",
        "recommendations": ["Recommended exercises for value alignment"]
    }


@router.get("/identity/purpose")
async def get_purpose_prompt():
    """
    Get a prompt to help user reflect on life purpose.
    """
    return {
        "prompt": "What brings you alive? When do you feel most like yourself?",
        "exercises": [
            "Values clarification exercise",
            "Legacy writing prompt",
            "Ikigai discovery questions"
        ]
    }


# ====================
# SENSORY MODULE
# ====================

class SensoryProfile(BaseModel):
    sense_type: str  # visual, auditory, kinesthetic, olfactory, gustatory
    sensitivity_level: int  # 1-10
    preferences: Optional[str] = None


@router.post("/sensory/profile")
async def save_sensory_profile(profile: SensoryProfile):
    """
    Save user's sensory profile.
    """
    return {"status": "saved", "profile": profile}


@router.get("/sensory/exercises/{sense_type}")
async def get_sensory_exercises(sense_type: str):
    """
    Get exercises for a specific sense.
    """
    exercises = {
        "visual": ["Peripheral vision practice", "Nature observation", "Art appreciation"],
        "auditory": ["Deep listening", "Sound mapping", "Music appreciation"],
        "kinesthetic": ["Body awareness", "Movement meditation", "Grounding exercises"],
        "olfactory": ["Aromatherapy basics", "Scent journaling", "Essential oils guide"],
        "gustatory": ["Mindful eating", "Flavor exploration", "Food appreciation"]
    }
    return {"sense_type": sense_type, "exercises": exercises.get(sense_type, [])}


# ====================
# EMOTIONAL MODULE
# ====================

class EmotionEntry(BaseModel):
    emotion: str
    intensity: int  # 1-10
    triggers: Optional[str] = None
    thoughts: Optional[str] = None
    behaviors: Optional[str] = None


class EmotionInsight(BaseModel):
    emotion: str
    category: str  # primary, secondary, shadow
    function: str  # What purpose does this emotion serve?
    healthy_expression: str
    coping_strategies: list[str]


@router.post("/emotional/analyze")
async def analyze_emotion(entry: EmotionEntry):
    """
    AI analysis of an emotion entry.
    """
    return EmotionInsight(
        emotion=entry.emotion,
        category="primary",
        function="This emotion signals...",
        healthy_expression="Ways to express this emotion constructively...",
        coping_strategies=["Strategy 1", "Strategy 2", "Strategy 3"]
    )


@router.get("/emotional/taxonomy/{emotion}")
async def get_emotion_info(emotion: str):
    """
    Get information about a specific emotion.
    """
    return {
        "emotion": emotion,
        "definition": f"Definition of {emotion}",
        "intensity_range": "1-10 scale recommendation",
        "opposite_emotion": f"Opposite of {emotion}",
        "questions_to_explore": [
            f"When do you feel {emotion}?",
            f"What triggers {emotion} in you?",
            f"How do you typically express {emotion}?"
        ]
    }


# ====================
# WELLNESS MODULE
# ====================

@router.get("/wellness/goals")
async def get_default_goals():
    """
    Get suggested wellness goals based on common patterns.
    """
    return {
        "nutrition": [
            "Eat 5 servings of vegetables daily",
            "Reduce sugar intake by 50%",
            "Practice intermittent fasting 16:8"
        ],
        "movement": [
            "Walk 10,000 steps daily",
            "Stretch for 10 minutes each morning",
            "Strength train 3x per week"
        ],
        "sleep": [
            "Maintain consistent sleep schedule",
            "No screens 1 hour before bed",
            "Aim for 7-9 hours of sleep"
        ],
        "stress": [
            "Daily meditation practice",
            "Journaling 3x per week",
            "Nature exposure 2x per week"
        ],
        "mindfulness": [
            "5-minute breathing exercises",
            "Body scan meditation",
            "Gratitude practice"
        ]
    }


# ====================
# RECOVERY MODULE
# ====================

class BurnoutAssessment(BaseModel):
    exhaustion: int  # 1-10
    cynicism: int  # 1-10
    inefficacy: int  # 1-10


@router.post("/recovery/assess-burnout")
async def assess_burnout(assessment: BurnoutAssessment):
    """
    Calculate burnout risk level based on assessment.
    """
    avg = (assessment.exhaustion + assessment.cynicism + assessment.inefficacy) / 3
    
    if avg >= 7.5:
        level = "severe"
        recommendations = [
            "Immediate rest recommended",
            "Consider professional support",
            "Reduce workload significantly"
        ]
    elif avg >= 5:
        level = "moderate"
        recommendations = [
            "Implement recovery practices",
            "Set boundaries",
            "Prioritize self-care"
        ]
    else:
        level = "low"
        recommendations = [
            "Continue healthy practices",
            "Monitor for early warning signs",
            "Maintain work-life balance"
        ]
    
    return {
        "score": round(avg, 1),
        "level": level,
        "recommendations": recommendations
    }


# ====================
# COMMUNICATION MODULE
# ====================

@router.get("/communication/goals")
async def get_communication_goals():
    """
    Get suggested communication improvement goals.
    """
    return {
        "public_speaking": [
            "Practice 5-minute speeches weekly",
            "Join a speaking club (Toastmasters)",
            "Record and review practice sessions"
        ],
        "active_listening": [
            "Practice 100% attention during conversations",
            "Summarize what others say before responding",
            "Ask clarifying questions"
        ],
        "conflict_resolution": [
            "Use 'I' statements",
            "Seek to understand before being understood",
            "Practice de-escalation techniques"
        ],
        "written_communication": [
            "Review emails before sending",
            "Practice clarity and brevity",
            "Adapt tone to audience"
        ]
    }


# ====================
# SUSTAINABILITY MODULE
# ====================

@router.get("/sustainability/footprint")
async def get_footprint_baseline():
    """
    Get baseline sustainability metrics to track.
    """
    return {
        "energy": ["Electricity usage (kWh)", "Renewable energy %"],
        "transportation": ["Miles driven", "Public transit usage", "Flights taken"],
        "waste": ["Recycling rate", "Single-use plastic usage", "Food waste"],
        "consumption": ["Purchasing habits", "Local vs imported goods", "Fast fashion avoidance"],
        "carbon_footprint": "Calculate based on above metrics"
    }


# ====================
# VIDEO MODULE
# ====================

@router.get("/video/prompts")
async def get_video_prompts():
    """
    Get practice prompts for video module.
    """
    return {
        "impromptu": [
            "30-second自我介绍",
            "Explain your work in 60 seconds",
            "React to recent news topic"
        ],
        "prepared": [
            "5-minute presentation on favorite topic",
            "How-to tutorial video",
            "Personal story or experience"
        ],
        "reflection": [
            "What did I learn today?",
            "My goals for the week",
            "Lessons from recent experience"
        ]
    }
