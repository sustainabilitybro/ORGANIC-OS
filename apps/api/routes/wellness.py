from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID, uuid4

router = APIRouter()

# In-memory storage (replace with database in production)
wellness_entries = {}


# Pydantic schemas
class WellnessEntryCreate(BaseModel):
    date: date
    sleep_hours: Optional[float] = None
    water_intake_ml: Optional[int] = None
    exercise_minutes: Optional[int] = None
    meditation_minutes: Optional[int] = None
    mood_score: Optional[float] = None
    energy_level: Optional[float] = None
    nutrition_notes: Optional[str] = None


class WellnessEntryUpdate(BaseModel):
    sleep_hours: Optional[float] = None
    water_intake_ml: Optional[int] = None
    exercise_minutes: Optional[int] = None
    meditation_minutes: Optional[int] = None
    mood_score: Optional[float] = None
    energy_level: Optional[float] = None
    nutrition_notes: Optional[str] = None


class WellnessEntryResponse(BaseModel):
    id: str
    user_id: str
    date: date
    sleep_hours: Optional[float]
    water_intake_ml: Optional[int]
    exercise_minutes: Optional[int]
    meditation_minutes: Optional[int]
    mood_score: Optional[float]
    energy_level: Optional[float]
    nutrition_notes: Optional[str]
    created_at: datetime
    updated_at: datetime


class WellnessStats(BaseModel):
    avg_sleep: float
    avg_mood: float
    avg_energy: float
    avg_water: float
    avg_exercise: float
    avg_meditation: float
    entries_count: int


class DailyPromptResponse(BaseModel):
    prompt: str
    category: str


# Wellness prompts for daily engagement
WELLNESS_PROMPTS = [
    DailyPromptResponse(prompt="What are you grateful for today?", category="gratitude"),
    DailyPromptResponse(prompt="What challenged you today and how did you respond?", category="growth"),
    DailyPromptResponse(prompt="How did you take care of your body today?", category="physical"),
    DailyPromptResponse(prompt="What brought you peace today?", category="mindfulness"),
    DailyPromptResponse(prompt="Who did you connect with today?", category="relationships"),
]


@router.get("/entries", response_model=List[WellnessEntryResponse])
async def get_entries(
    user_id: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """
    Get wellness entries for a user, optionally filtered by date range.
    """
    user_entries = [
        entry for entry in wellness_entries.values()
        if entry["user_id"] == user_id
    ]
    
    if start_date:
        user_entries = [e for e in user_entries if e["date"] >= start_date]
    if end_date:
        user_entries = [e for e in user_entries if e["date"] <= end_date]
    
    return sorted(user_entries, key=lambda x: x["date"])


@router.get("/entries/{entry_id}", response_model=WellnessEntryResponse)
async def get_entry(entry_id: str, user_id: str):
    """
    Get a specific wellness entry.
    """
    if entry_id not in wellness_entries:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    entry = wellness_entries[entry_id]
    if entry["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this entry"
        )
    
    return entry


@router.post("/entries", response_model=WellnessEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(user_id: str, entry: WellnessEntryCreate):
    """
    Create a new wellness entry.
    """
    entry_id = str(uuid4())
    now = datetime.now()
    
    new_entry = {
        "id": entry_id,
        "user_id": user_id,
        "date": entry.date,
        "sleep_hours": entry.sleep_hours,
        "water_intake_ml": entry.water_intake_ml,
        "exercise_minutes": entry.exercise_minutes,
        "meditation_minutes": entry.meditation_minutes,
        "mood_score": entry.mood_score,
        "energy_level": entry.energy_level,
        "nutrition_notes": entry.nutrition_notes,
        "created_at": now,
        "updated_at": now,
    }
    
    wellness_entries[entry_id] = new_entry
    return new_entry


@router.patch("/entries/{entry_id}", response_model=WellnessEntryResponse)
async def update_entry(
    entry_id: str,
    user_id: str,
    updates: WellnessEntryUpdate
):
    """
    Update a wellness entry.
    """
    if entry_id not in wellness_entries:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    entry = wellness_entries[entry_id]
    if entry["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this entry"
        )
    
    # Apply updates
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        entry[field] = value
    entry["updated_at"] = datetime.now()
    
    return entry


@router.get("/stats", response_model=WellnessStats)
async def get_stats(user_id: str, days: int = 30):
    """
    Get wellness statistics for the last N days.
    """
    from datetime import timedelta
    
    start_date = date.today() - timedelta(days=days)
    
    user_entries = [
        entry for entry in wellness_entries.values()
        if entry["user_id"] == user_id
        and entry["date"] >= start_date
    ]
    
    if not user_entries:
        return WellnessStats(
            avg_sleep=0, avg_mood=0, avg_energy=0,
            avg_water=0, avg_exercise=0, avg_meditation=0,
            entries_count=0
        )
    
    def safe_avg(field: str) -> float:
        values = [e.get(field) for e in user_entries if e.get(field) is not None]
        return round(sum(values) / len(values), 1) if values else 0
    
    return WellnessStats(
        avg_sleep=safe_avg("sleep_hours"),
        avg_mood=safe_avg("mood_score"),
        avg_energy=safe_avg("energy_level"),
        avg_water=safe_avg("water_intake_ml"),
        avg_exercise=safe_avg("exercise_minutes"),
        avg_meditation=safe_avg("meditation_minutes"),
        entries_count=len(user_entries)
    )


@router.get("/prompt")
async def get_daily_prompt(category: Optional[str] = None):
    """
    Get a daily wellness prompt.
    """
    import random
    
    if category:
        filtered = [p for p in WELLNESS_PROMPTS if p.category == category]
        if filtered:
            return random.choice(filtered)
    
    return random.choice(WELLNESS_PROMPTS)


@router.get("/streak")
async def get_streak(user_id: str):
    """
    Get the user's wellness tracking streak.
    """
    user_entries = [
        entry for entry in wellness_entries.values()
        if entry["user_id"] == user_id
    ]
    
    if not user_entries:
        return {"streak": 0, "last_entry": None}
    
    # Calculate consecutive days
    dates = sorted(set(e["date"] for e in user_entries), reverse=True)
    today = date.today()
    
    streak = 0
    current_date = today
    
    for d in dates:
        if d == current_date or d == current_date - timedelta(days=1):
            streak += 1
            current_date = d
        else:
            break
    
    return {
        "streak": streak,
        "last_entry": dates[0] if dates else None,
        "total_entries": len(user_entries)
    }
