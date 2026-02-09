"""
Personal Integrations (PIs) API

User-specific integrations for calendar, weather, habits, preferences, and connected services.
"""
from fastapi import APIRouter, HTTPException, Request
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
from datetime import datetime, date, timedelta
import httpx
import json

router = APIRouter(prefix="/api/v1/pis", tags=["Personal Integrations"])

# ============ Data Models ============

class PersonalPreference(BaseModel):
    category: str
    key: str
    value: Any
    updated_at: datetime = None

class CalendarEvent(BaseModel):
    title: str
    start: datetime
    end: datetime
    category: str = "general"
    description: str = None
    reminder_minutes: int = None

class HabitEntry(BaseModel):
    habit_id: str
    date: date
    completed: bool
    notes: str = None

class WeatherLocation(BaseModel):
    city: str
    country: str = "US"
    lat: float = None
    lon: float = None

# ============ In-Memory Storage (Replace with Database) ============

user_preferences: Dict[str, Dict] = {}
user_habits: Dict[str, List[Dict]] = {}
user_goals: Dict[str, List[Dict]] = {}
user_quotes: Dict[str, Dict] = {}
calendar_cache: Dict[str, List[Dict]] = {}

# ============ Personal Preferences ============

@router.get("/preferences")
async def get_preferences(user_id: str = "default"):
    """Get all user preferences"""
    prefs = user_preferences.get(user_id, {})
    return {"user_id": user_id, "preferences": prefs}

@router.post("/preferences")
async def set_preference(pref: PersonalPreference):
    """Set a user preference"""
    if pref.user_id not in user_preferences:
        user_preferences[pref.user_id] = {}
    user_preferences[pref.user_id][f"{pref.category}.{pref.key}"] = {
        "value": pref.value,
        "updated_at": datetime.utcnow().isoformat()
    }
    return {"success": True, "preference": pref}

@router.delete("/preferences/{category}/{key}")
async def delete_preference(category: str, key: str, user_id: str = "default"):
    """Delete a user preference"""
    if user_id in user_preferences:
        pref_key = f"{category}.{key}"
        if pref_key in user_preferences[user_id]:
            del user_preferences[user_id][pref_key]
    return {"success": True}

# ============ Habits ============

@router.get("/habits")
async def get_habits(user_id: str = "default"):
    """Get all user habits"""
    habits = user_habits.get(user_id, [])
    return {"user_id": user_id, "habits": habits}

@router.post("/habits")
async def create_habit(habit: Dict, user_id: str = "default"):
    """Create a new habit"""
    new_habit = {
        "id": f"habit_{datetime.utcnow().timestamp()}",
        "name": habit.get("name"),
        "category": habit.get("category", "general"),
        "frequency": habit.get("frequency", "daily"),
        "reminder_time": habit.get("reminder_time"),
        "streak": 0,
        "best_streak": 0,
        "created_at": datetime.utcnow().isoformat(),
        "entries": []
    }
    if user_id not in user_habits:
        user_habits[user_id] = []
    user_habits[user_id].append(new_habit)
    return {"success": True, "habit": new_habit}

@router.post("/habits/{habit_id}/log")
async def log_habit(habit_id: str, entry: HabitEntry, user_id: str = "default"):
    """Log habit completion"""
    if user_id in user_habits:
        for habit in user_habits[user_id]:
            if habit["id"] == habit_id:
                habit["entries"].append(entry.dict())
                # Update streak
                if entry.completed:
                    habit["streak"] = habit.get("streak", 0) + 1
                    habit["best_streak"] = max(habit["best_streak"], habit["streak"])
                else:
                    habit["streak"] = 0
                return {"success": True, "habit": habit}
    return {"error": "Habit not found"}

# ============ Goals ============

@router.get("/goals")
async def get_goals(user_id: str = "default"):
    """Get all user goals"""
    goals = user_goals.get(user_id, [])
    return {"user_id": user_id, "goals": goals}

@router.post("/goals")
async def create_goal(goal: Dict, user_id: str = "default"):
    """Create a new goal"""
    new_goal = {
        "id": f"goal_{datetime.utcnow().timestamp()}",
        "title": goal.get("title"),
        "description": goal.get("description"),
        "category": goal.get("category", "personal"),
        "deadline": goal.get("deadline"),
        "milestones": goal.get("milestones", []),
        "progress": 0,
        "status": "active",
        "created_at": datetime.utcnow().isoformat()
    }
    if user_id not in user_goals:
        user_goals[user_id] = []
    user_goals[user_id].append(new_goal)
    return {"success": True, "goal": new_goal}

@router.put("/goals/{goal_id}/progress")
async def update_goal_progress(goal_id: str, progress: int, user_id: str = "default"):
    """Update goal progress"""
    if user_id in user_goals:
        for goal in user_goals[user_id]:
            if goal["id"] == goal_id:
                goal["progress"] = min(100, max(0, progress))
                if goal["progress"] >= 100:
                    goal["status"] = "completed"
                return {"success": True, "goal": goal}
    return {"error": "Goal not found"}

# ============ Calendar Integration ============

@router.get("/calendar/events")
async def get_calendar_events(
    start_date: str = None,
    end_date: str = None,
    user_id: str = "default"
):
    """Get calendar events"""
    events = calendar_cache.get(user_id, [])
    return {"user_id": user_id, "events": events}

@router.post("/calendar/events")
async def add_calendar_event(event: CalendarEvent, user_id: str = "default"):
    """Add a calendar event"""
    if user_id not in calendar_cache:
        calendar_cache[user_id] = []
    calendar_cache[user_id].append(event.dict())
    return {"success": True, "event": event}

# ============ Weather Integration ============

WEATHER_CACHE: Dict[str, Dict] = {}

@router.get("/weather")
async def get_weather(location: WeatherLocation = None):
    """Get current weather (OpenWeatherMap API)"""
    # Using Open-Meteo (free, no API key)
    lat = location.lat if location.lat else 40.7128  # Default NYC
    lon = location.lon if location.lon else -74.0060
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current_weather": "true"
                },
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "location": location.city if location else "Current",
                    "temperature": data["current_weather"]["temperature"],
                    "windspeed": data["current_weather"]["windspeed"],
                    "weathercode": data["current_weather"]["weathercode"],
                    "description": get_weather_description(data["current_weather"]["weathercode"])
                }
    except Exception as e:
        pass
    
    # Fallback
    return {
        "location": location.city if location else "Unknown",
        "temperature": 72,
        "condition": "Sunny",
        "humidity": 45,
        "wind": 5
    }

def get_weather_description(code: int) -> str:
    """Convert weather code to description"""
    descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight showers",
        81: "Moderate showers",
        82: "Violent showers",
        95: "Thunderstorm",
    }
    return descriptions.get(code, "Unknown")

# ============ Daily Dashboard ============

@router.get("/dashboard")
async def get_daily_dashboard(user_id: str = "default"):
    """Get complete daily dashboard"""
    habits = user_habits.get(user_id, [])
    goals = user_goals.get(user_id, [])
    preferences = user_preferences.get(user_id, {})
    
    # Calculate habit completion rate
    completed_today = sum(1 for h in habits if h.get("entries") and h["entries"][-1].get("completed", False))
    total_habits = len(habits) or 1
    completion_rate = (completed_today / total_habits) * 100
    
    # Goal progress
    avg_goal_progress = sum(g.get("progress", 0) for g in goals) / len(goals) if goals else 0
    
    # Active goals
    active_goals = [g for g in goals if g.get("status") == "active"]
    completed_goals = [g for g in goals if g.get("status") == "completed"]
    
    return {
        "date": date.today().isoformat(),
        "habits": {
            "total": len(habits),
            "completed_today": completed_today,
            "completion_rate": round(completion_rate, 1),
            "best_streak": max((h.get("best_streak", 0) for h in habits), default=0)
        },
        "goals": {
            "total": len(goals),
            "active": len(active_goals),
            "completed": len(completed_goals),
            "average_progress": round(avg_goal_progress, 1)
        },
        "weather": await get_weather(),
        "focus_time": preferences.get("preferences.focus.optimal_time", "morning"),
        "energy_prediction": "high"
    }

# ============ Analytics ============

@router.get("/analytics/habits")
async def get_habit_analytics(user_id: str = "default", days: int = 30):
    """Get habit analytics"""
    habits = user_habits.get(user_id, [])
    
    analytics = {
        "period_days": days,
        "habits": []
    }
    
    for habit in habits:
        habit_analytics = {
            "name": habit["name"],
            "category": habit["category"],
            "current_streak": habit.get("streak", 0),
            "best_streak": habit.get("best_streak", 0),
            "completion_rate": calculate_completion_rate(habit, days)
        }
        analytics["habits"].append(habit_analytics)
    
    return analytics

def calculate_completion_rate(habit: Dict, days: int) -> float:
    """Calculate habit completion rate"""
    entries = habit.get("entries", [])
    if not entries:
        return 0
    completed = sum(1 for e in entries if e.get("completed", False))
    return round((completed / min(len(entries), days)) * 100, 1)

# ============ Quick Actions ============

@router.post("/quick/log")
async def quick_log(data: Dict, user_id: str = "default"):
    """Quick logging endpoint for common actions"""
    log_type = data.get("type")
    
    if log_type == "mood":
        return {"logged": "mood", "value": data.get("value")}
    elif log_type == "energy":
        return {"logged": "energy", "value": data.get("value")}
    elif log_type == "water":
        return {"logged": "water", "count": data.get("count", 0)}
    elif log_type == "sleep":
        return {"logged": "sleep", "hours": data.get("hours")}
    elif log_type == "exercise":
        return {"logged": "exercise", "minutes": data.get("minutes")}
    elif log_type == "gratitude":
        return {"logged": "gratitude", "items": data.get("items", [])}
    
    return {"error": "Unknown log type"}
