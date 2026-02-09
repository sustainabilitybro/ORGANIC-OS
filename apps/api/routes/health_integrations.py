"""
Health & Wellness API Integrations

Additional free APIs for health and wellness data.
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, List, Optional
import httpx
import json

router = APIRouter(prefix="/api/v1/health", tags=["health"])

# ============ Health APIs ============

async def get_exercise_db(exercise: str) -> Dict:
    """Search exercise database (Wger API)"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://wger.de/api/v2/exercise/search",
                params={"term": exercise, "language": 2},
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass
    return {"error": "Could not fetch exercise data"}

async def get_nutrition_food(food: str) -> Dict:
    """Search nutrition database (USDA FoodData)"""
    # Free API - no key needed
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.nal.usda.gov/fdc/v1/foods/search",
                params={"query": food, "api_key": "DEMO_KEY", "limit": 5},
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass
    return {"error": "Could not fetch nutrition data"}

async def get_meditation_scripture() -> Dict:
    """Get calming scripture or quote"""
    calming_texts = [
        {"text": "Be still, and know that I am God.", "source": "Psalm 46:10"},
        {"text": "Peace I leave with you; my peace I give to you.", "source": "John 14:27"},
        {"text": "The Lord will fight for you; you need only to be still.", "source": "Exodus 14:14"},
        {"text": "Cast all your anxiety on him because he cares for you.", "source": "1 Peter 5:7"},
        {"text": "Do not be anxious about anything.", "source": "Philippians 4:6"},
        {"text": "I can do all things through Christ who strengthens me.", "source": "Philippians 4:13"},
        {"text": "The fruit of the Spirit is love, joy, peace...", "source": "Galatians 5:22-23"},
    ]
    return {"scripture": calming_texts[0], "all": calming_texts}

async def get_mindfulness_prompt() -> Dict:
    """Get mindfulness prompts"""
    prompts = [
        {"category": "Breath", "prompt": "Focus on your breath. Feel the air entering your lungs."},
        {"category": "Body", "prompt": "Notice any tension in your body. Breathe into those areas."},
        {"category": "Sound", "prompt": "Listen to the sounds around you. Don't judge them, just notice."},
        {"category": "Gratitude", "prompt": "Think of three things you're grateful for right now."},
        {"category": "Present", "prompt": "You are safe. You are here. You are okay."},
        {"category": "Acceptance", "prompt": "Accept this moment exactly as it is."},
        {"category": "Compassion", "prompt": "Treat yourself with the kindness you'd show a good friend."},
    ]
    return {"prompt": prompts[0], "all": prompts}

async def get_yoga_pose(category: str = "beginner") -> Dict:
    """Get yoga pose suggestions"""
    poses = {
        "beginner": [
            {"name": "Mountain Pose", "english": "Tadasana", "benefits": "Improves posture"},
            {"name": "Child's Pose", "english": "Balasana", "benefits": "Calms the mind"},
            {"name": "Cat-Cow", "english": "Marjaryasana-Bitilasana", "benefits": "Spine flexibility"},
            {"name": "Standing Forward Fold", "english": "Uttanasana", "benefits": "Stretches hamstrings"},
        ],
        "intermediate": [
            {"name": "Downward Dog", "english": "Adho Mukha Svanasana", "benefits": "Full body stretch"},
            {"name": "Warrior I", "english": "Virabhadrasana I", "benefits": "Strengthens legs"},
            {"name": "Tree Pose", "english": "Vrksasana", "benefits": "Improves balance"},
            {"name": "Bridge Pose", "english": "Setu Bandhasana", "benefits": "Opens chest"},
        ]
    }
    return {"category": category, "poses": poses.get(category, poses["beginner"])}

async def get_sleep_tip() -> Dict:
    """Get sleep improvement tip"""
    tips = [
        {"tip": "Keep your bedroom cool (65-68°F)", "category": "Environment"},
        {"tip": "No screens 1 hour before bed", "category": "Routine"},
        {"tip": "Consistent sleep/wake times daily", "category": "Schedule"},
        {"tip": "Avoid caffeine after 2 PM", "category": "Diet"},
        {"tip": "Use your bed only for sleep", "category": "Association"},
        {"tip": "Try 4-7-8 breathing before bed", "category": "Relaxation"},
        {"tip": "Write worries down before sleep", "category": "Mental"},
        {"tip": "Get morning sunlight within 30 min of waking", "category": "Light"},
    ]
    return {"tip": tips[0], "all": tips}

async def get_productivity_hack() -> Dict:
    """Get productivity technique"""
    hacks = [
        {"name": "Pomodoro", "desc": "25 min work, 5 min break, 4 cycles, 20 min break"},
        {"name": "Eat That Frog", "desc": "Do your hardest task first thing in the morning"},
        {"name": "Time Blocking", "desc": "Schedule everything on your calendar"},
        {"name": "Two-Minute Rule", "desc": "If it takes <2 min, do it now"},
        {"name": "Batching", "desc": "Group similar tasks together"},
        {"name": "MIT Method", "desc": "Do 3 Most Important Tasks before anything else"},
        {"name": "Single-Tasking", "desc": "Focus on one thing at a time"},
        {"name": "Weekend Planning", "desc": "Plan your week on Sunday evening"},
    ]
    return {"hack": hacks[0], "all": hacks}

async def get_self_care_idea() -> Dict:
    """Get self-care suggestion"""
    ideas = [
        {"name": "Take a warm bath", "duration": "20 min", "category": "Physical"},
        {"name": "Write in journal", "duration": "15 min", "category": "Mental"},
        {"name": "Call a friend", "duration": "30 min", "category": "Social"},
        {"name": "Nature walk", "duration": "30 min", "category": "Physical"},
        {"name": "Read fiction", "duration": "30 min", "category": "Mental"},
        {"name": "Practice deep breathing", "duration": "10 min", "category": "Relaxation"},
        {"name": "Digital detox hour", "duration": "60 min", "category": "Mental"},
        {"name": "Stretching routine", "duration": "15 min", "category": "Physical"},
    ]
    return {"idea": ideas[0], "all": ideas}

async def get_mood_boosters() -> Dict:
    """Get mood improvement activities"""
    boosters = [
        {"activity": "Exercise", "impact": "High", "duration": "20-30 min"},
        {"activity": "Sunlight exposure", "impact": "High", "duration": "15 min"},
        {"activity": "Gratitude practice", "impact": "Medium", "duration": "5 min"},
        {"activity": "Social connection", "impact": "High", "duration": "15 min"},
        {"activity": "Music", "impact": "Medium", "duration": "10 min"},
        {"activity": "Nature", "impact": "High", "duration": "20 min"},
        {"activity": "Accomplishment", "impact": "High", "duration": "Variable"},
        {"activity": "Kindness to others", "impact": "High", "duration": "Variable"},
    ]
    return {"boosters": boosters}

# ============ Routes ============

@router.get("/exercise/search")
async def search_exercise(q: str = "running"):
    """Search exercise database"""
    return await get_exercise_db(q)

@router.get("/nutrition/food")
async def search_food(food: str = "apple"):
    """Search nutrition database"""
    return await get_nutrition_food(food)

@router.get("/meditation/scripture")
async def get_calming_scripture():
    """Get calming scripture"""
    return await get_meditation_scripture()

@router.get("/mindfulness/prompt")
async def get_mindfulness_prompt():
    """Get mindfulness prompt"""
    return await get_mindfulness_prompt()

@router.get("/yoga/poses")
async def get_yoga_poses(level: str = "beginner"):
    """Get yoga poses by level"""
    return await get_yoga_pose(level)

@router.get("/sleep/tip")
async def get_sleep_tip():
    """Get sleep improvement tip"""
    return await get_sleep_tip()

@router.get("/productivity/hack")
async def get_productivity_hack():
    """Get productivity technique"""
    return await get_productivity_hack()

@router.get("/selfcare/idea")
async def get_self_care_idea():
    """Get self-care idea"""
    return await get_self_care_idea()

@router.get("/mood/boosters")
async def get_mood_boosters():
    """Get mood boosting activities"""
    return await get_mood_boosters()

@router.get("/wellness/routine")
async def get_wellness_routine():
    """Get complete wellness routine suggestion"""
    sleep_tip = await get_sleep_tip()
    productivity = await get_productivity_hack()
    selfcare = await get_self_care_idea()
    mood = await get_mood_boosters()
    
    return {
        "morning": {
            "routine": [
                "Wake at consistent time",
                "Get sunlight within 30 min",
                "Hydrate with water",
                "Exercise or stretch",
                "Plan your day"
            ]
        },
        "midday": {
            "routine": [
                "Deep work during peak hours",
                "Healthy lunch",
                "Brief walk outside",
                "Connect with someone"
            ]
        },
        "evening": {
            "routine": [
                "Exercise (not too late)",
                "Light dinner",
                "Screen-free time",
                "Journaling/gratitude",
                "Wind down routine"
            ]
        },
        "tips": {
            "sleep": sleep_tip,
            "productivity": productivity,
            "selfcare": selfcare,
            "mood": mood
        }
    }
