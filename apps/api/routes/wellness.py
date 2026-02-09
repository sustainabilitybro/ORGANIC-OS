"""
Wellness Routes - Enhanced with Streak Rewards

This module provides wellness tracking with gamification elements.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/v1/wellness", tags=["wellness"])

# ============ Models ============

class WellnessEntry(BaseModel):
    date: str
    sleep_hours: Optional[float] = None
    water_intake_ml: Optional[int] = None
    exercise_minutes: Optional[int] = None
    meditation_minutes: Optional[int] = None
    mood_score: Optional[int] = None  # 1-10
    energy_level: Optional[int] = None  # 1-10
    nutrition_notes: Optional[str] = None

class WellnessResponse(BaseModel):
    id: str
    user_id: str
    date: str
    sleep_hours: float
    water_intake_ml: int
    exercise_minutes: int
    meditation_minutes: int
    mood_score: int
    energy_level: int
    nutrition_notes: str
    created_at: str
    updated_at: str

class StreakReward(BaseModel):
    streak_days: int
    reward_type: str  # "badge", "points", "unlock"
    reward_name: str
    reward_description: str

# ============ Gamification ============

STREAK_REWARDS = [
    {"streak": 3, "type": "badge", "name": "🌱 Starter", "description": "3-day wellness streak"},
    {"streak": 7, "type": "points", "name": "+100 XP", "description": "Complete 7-day streak"},
    {"streak": 14, "type": "badge", "name": "🔥 Consistent", "description": "2-week wellness streak"},
    {"streak": 30, "type": "unlock", "name": "🎯 Focus Mode", "description": "Unlock advanced analytics"},
    {"streak": 50, "type": "badge", "name": "💪 Dedication", "description": "50-day wellness streak"},
    {"streak": 100, "type": "points", "name": "+1000 XP", "description": "Complete 100-day streak"},
]

MOTIVATIONAL_QUOTES = [
    "Every step toward wellness counts.",
    "You are investing in your future self.",
    "Small habits create big changes.",
    "Consistency beats perfection.",
    "Your body hears everything your mind says.",
    "Wellness is not a destination, it's a way of life.",
]

# ============ Routes ============

@router.get("/prompt")
async def get_daily_prompt(category: Optional[str] = None) -> dict:
    """
    Get a daily wellness reflection prompt.
    """
    prompts_by_category = {
        "gratitude": [
            "What are you grateful for today?",
            "Who made a positive impact on your day?",
            "What's something small that brought you joy?"
        ],
        "growth": [
            "What's one thing you learned today?",
            "How did you step outside your comfort zone?",
            "What challenge are you working through?"
        ],
        "physical": [
            "How did you take care of your body today?",
            "What did you eat that nourished you?",
            "How did you move your body today?"
        ],
        "mindfulness": [
            "When did you feel most present today?",
            "What thoughts did you observe without judgment?",
            "How did you practice stillness today?"
        ],
        "social": [
            "Who did you connect with meaningfully?",
            "How did you show up for others today?",
            "What conversation left you feeling good?"
        ]
    }
    
    if category and category in prompts_by_category:
        prompt = random.choice(prompts_by_category[category])
    else:
        all_prompts = [p for sublist in prompts_by_category.values() for p in sublist]
        prompt = random.choice(all_prompts)
    
    return {
        "prompt": prompt,
        "category": category or random.choice(list(prompts_by_category.keys())),
        "quote": random.choice(MOTIVATIONAL_QUOTES)
    }

@router.get("/stats")
async def get_wellness_stats(
    user_id: str = "demo-user",
    days: int = 30
) -> dict:
    """
    Get aggregated wellness statistics.
    """
    # In production, fetch from database
    return {
        "avg_sleep": round(random.uniform(6.5, 8.5), 1),
        "avg_mood": round(random.uniform(6.5, 8.5), 1),
        "avg_energy": round(random.uniform(6.0, 8.0), 1),
        "avg_water": round(random.uniform(2000, 3000)),
        "avg_exercise": round(random.uniform(20, 45)),
        "avg_meditation": round(random.uniform(5, 20)),
        "entries_count": min(days, random.randint(14, days))
    }

@router.get("/streak")
async def get_wellness_streak(user_id: str = "demo-user") -> dict:
    """
    Get current wellness streak and rewards.
    """
    current_streak = random.randint(0, 25)
    
    # Calculate rewards
    rewards = []
    for reward in STREAK_REWARDS:
        if current_streak >= reward["streak"]:
            rewards.append({
                "earned": True,
                **reward
            })
        else:
            rewards.append({
                "earned": False,
                "progress": f"{current_streak}/{reward['streak']}",
                **reward
            })
    
    return {
        "current_streak": current_streak,
        "longest_streak": random.randint(15, 100),
        "total_entries": random.randint(30, 200),
        "rewards": rewards,
        "next_reward": next(
            (r for r in STREAK_REWARDS if r["streak"] > current_streak),
            None
        )
    }

@router.get("/goals")
async def get_wellness_goals() -> dict:
    """
    Get suggested wellness goals.
    """
    return {
        "daily": [
            {"area": "Sleep", "goal": "7-9 hours", "tip": "Consistent bedtime"},
            {"area": "Water", "goal": "2.5L", "tip": "Carry a water bottle"},
            {"area": "Movement", "goal": "30 min", "tip": "Walk while on calls"},
            {"area": "Mindfulness", "goal": "10 min", "tip": "Morning meditation"},
            {"area": "Nutrition", "goal": "3 meals", "tip": "Balance protein & veggies"}
        ],
        "weekly": [
            {"area": "Exercise", "goal": "150 min", "tip": "Mix cardio & strength"},
            {"area": "Social", "goal": "3 connections", "tip": "Quality over quantity"},
            {"area": "Nature", "goal": "2 hours", "tip": "Parks, walks, windows"},
            {"area": "Learning", "goal": "1 hour", "tip": "Read or listen"},
            {"area": "Rest", "goal": "1 day off", "tip": "True digital detox"}
        ],
        "monthly": [
            {"area": "Checkup", "goal": "Health metrics", "tip": "BP, weight, energy"},
            {"area": "Review", "goal": "Progress check", "tip": "Compare to last month"},
            {"area": "Adjust", "goal": "Update goals", "tip": "Based on results"}
        ]
    }

@router.post("/check-in")
async def wellness_check_in(entry: WellnessEntry, user_id: str = "demo-user") -> dict:
    """
    Quick wellness check-in with instant feedback.
    """
    # Calculate wellness score
    score = 0
    feedback = []
    
    if entry.sleep_hours:
        if 7 <= entry.sleep_hours <= 9:
            score += 25
            feedback.append("✅ Great sleep duration!")
        elif 6 <= entry.sleep_hours < 7:
            score += 15
            feedback.append("💡 Try 15 more minutes of sleep")
        else:
            score += 5
            feedback.append("⚠️ Sleep affects everything - prioritize it")
    
    if entry.water_intake_ml:
        if entry.water_intake_ml >= 2500:
            score += 25
            feedback.append("💧 Hydration on point!")
        elif entry.water_intake_ml >= 1500:
            score += 15
            feedback.append("💡 Add one more glass of water")
        else:
            score += 5
            feedback.append("💧 Start tomorrow with a full glass")
    
    if entry.exercise_minutes:
        if entry.exercise_minutes >= 30:
            score += 25
            feedback.append("🏃 Movement is medicine!")
        elif entry.exercise_minutes >= 15:
            score += 15
            feedback.append("💡 Double your movement tomorrow")
        else:
            score += 5
            feedback.append("🚶 A 10-minute walk makes a difference")
    
    if entry.mood_score:
        if entry.mood_score >= 7:
            score += 25
            feedback.append("😊 Your energy is contagious!")
        elif entry.mood_score >= 5:
            score += 15
            feedback.append("💡 What made today okay?")
        else:
            score += 5
            feedback.append("🤗 Tomorrow is a new opportunity")
    
    return {
        "status": "logged",
        "wellness_score": min(score, 100),
        "feedback": feedback,
        "encouragement": random.choice(MOTIVATIONAL_QUOTES),
        "streak_tip": "Log 3 days in a row to start your streak! 🔥"
    }
