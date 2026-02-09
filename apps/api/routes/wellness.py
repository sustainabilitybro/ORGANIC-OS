from fastapi import APIRouter, HTTPException, status, Depends, Request
from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime, date
from uuid import uuid4
import os

router = APIRouter()

# User isolation: Use user_id as prefix for data separation
# In production, replace with actual database
_wellness_db = {}  # {user_id: {entry_id: entry_data}}


# Validated schemas with constraints
class WellnessEntryCreate(BaseModel):
    date: date
    sleep_hours: Optional[float] = None
    water_intake_ml: Optional[int] = None
    exercise_minutes: Optional[int] = None
    meditation_minutes: Optional[int] = None
    mood_score: Optional[float] = None
    energy_level: Optional[float] = None
    nutrition_notes: Optional[str] = None

    @field_validator('sleep_hours')
    @classmethod
    def validate_sleep(cls, v):
        if v is not None and (v < 0 or v > 24):
            raise ValueError('sleep_hours must be between 0 and 24')
        return v

    @field_validator('mood_score', 'energy_level')
    @classmethod
    def validate_score(cls, v):
        if v is not None and (v < 0 or v > 10):
            raise ValueError('Score must be between 0 and 10')
        return v

    @field_validator('water_intake_ml', 'exercise_minutes', 'meditation_minutes')
    @classmethod
    def validate_positive(cls, v):
        if v is not None and v < 0:
            raise ValueError('Value must be non-negative')
        return v


class WellnessEntryUpdate(BaseModel):
    sleep_hours: Optional[float] = None
    water_intake_ml: Optional[int] = None
    exercise_minutes: Optional[int] = None
    meditation_minutes: Optional[int] = None
    mood_score: Optional[float] = None
    energy_level: Optional[float] = None
    nutrition_notes: Optional[str] = None

    @field_validator('sleep_hours')
    @classmethod
    def validate_sleep(cls, v):
        if v is not None and (v < 0 or v > 24):
            raise ValueError('sleep_hours must be between 0 and 24')
        return v

    @field_validator('mood_score', 'energy_level')
    @classmethod
    def validate_score(cls, v):
        if v is not None and (v < 0 or v > 10):
            raise ValueError('Score must be between 0 and 10')
        return v


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


WELLNESS_PROMPTS = [
    DailyPromptResponse(prompt="What are you grateful for today?", category="gratitude"),
    DailyPromptResponse(prompt="What challenged you today and how did you respond?", category="growth"),
    DailyPromptResponse(prompt="How did you take care of your body today?", category="physical"),
    DailyPromptResponse(prompt="What brought you peace today?", category="mindfulness"),
    DailyPromptResponse(prompt="Who did you connect with today?", category="relationships"),
]


def get_user_id(request: Request) -> str:
    """Extract user ID from authorization header or query param."""
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        # In production, decode JWT and extract user_id
        return auth_header[7:43] or 'anonymous'
    
    # Fallback to query param for development
    user_id = request.query_params.get('user_id')
    if user_id:
        return user_id
    
    return 'anonymous'


@router.get("/entries", response_model=List[WellnessEntryResponse])
async def get_entries(
    request: Request,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    user_id: str = Depends(get_user_id)
):
    """Get wellness entries for authenticated user."""
    user_data = _wellness_db.get(user_id, {})
    
    # Filter by user and date range
    user_entries = [
        entry for entry in user_data.values()
        if entry["user_id"] == user_id
    ]
    
    if start_date:
        user_entries = [e for e in user_entries if e["date"] >= start_date]
    if end_date:
        user_entries = [e for e in user_entries if e["date"] <= end_date]
    
    # Sort by date descending
    return sorted(user_entries, key=lambda x: x["date"], reverse=True)


@router.get("/entries/{entry_id}", response_model=WellnessEntryResponse)
async def get_entry(
    entry_id: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    """Get a specific wellness entry."""
    user_data = _wellness_db.get(user_id, {})
    
    if entry_id not in user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    entry = user_data[entry_id]
    if entry["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this entry"
        )
    
    return entry


@router.post("/entries", response_model=WellnessEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry: WellnessEntryCreate,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    """Create a new wellness entry."""
    # Ensure user data dict exists
    if user_id not in _wellness_db:
        _wellness_db[user_id] = {}
    
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
    
    # User-isolated storage
    _wellness_db[user_id][entry_id] = new_entry
    
    return new_entry


@router.patch("/entries/{entry_id}", response_model=WellnessEntryResponse)
async def update_entry(
    entry_id: str,
    updates: WellnessEntryUpdate,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    """Update a wellness entry."""
    user_data = _wellness_db.get(user_id, {})
    
    if entry_id not in user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    entry = user_data[entry_id]
    if entry["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this entry"
        )
    
    # Apply updates
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            entry[field] = value
    entry["updated_at"] = datetime.now()
    
    return entry


@router.delete("/entries/{entry_id}")
async def delete_entry(
    entry_id: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    """Delete a wellness entry."""
    user_data = _wellness_db.get(user_id, {})
    
    if entry_id not in user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    entry = user_data[entry_id]
    if entry["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this entry"
        )
    
    del user_data[entry_id]
    return {"status": "deleted"}


@router.get("/stats", response_model=WellnessStats)
async def get_stats(
    request: Request,
    days: int = 30,
    user_id: str = Depends(get_user_id)
):
    """Get wellness statistics for the last N days."""
    from datetime import timedelta
    
    if days > 365:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 365 days allowed"
        )
    
    start_date = date.today() - timedelta(days=days)
    user_data = _wellness_db.get(user_id, {})
    
    user_entries = [
        entry for entry in user_data.values()
        if entry["user_id"] == user_id and entry["date"] >= start_date
    ]
    
    if not user_entries:
        return WellnessStats(
            avg_sleep=0, avg_mood=0, avg_energy=0,
            avg_water=0, avg_exercise=0, avg_meditation=0,
            entries_count=0
        )
    
    # Calculate averages with safe division
    count = len(user_entries)
    
    def safe_avg(field: str) -> float:
        values = [e.get(field) for e in user_entries if e.get(field) is not None]
        return round(sum(values) / len(values), 2) if values else 0
    
    return WellnessStats(
        avg_sleep=safe_avg("sleep_hours"),
        avg_mood=safe_avg("mood_score"),
        avg_energy=safe_avg("energy_level"),
        avg_water=safe_avg("water_intake_ml"),
        avg_exercise=safe_avg("exercise_minutes"),
        avg_meditation=safe_avg("meditation_minutes"),
        entries_count=count
    )


@router.get("/prompt", response_model=DailyPromptResponse)
async def get_daily_prompt(category: Optional[str] = None):
    """Get a daily wellness prompt."""
    import random
    
    if category:
        filtered = [p for p in WELLNESS_PROMPTS if p.category == category]
        if filtered:
            return random.choice(filtered)
    
    return random.choice(WELLNESS_PROMPTS)


@router.get("/streak")
async def get_streak(
    request: Request,
    user_id: str = Depends(get_user_id)
):
    """Get the user's wellness tracking streak."""
    from datetime import timedelta
    
    user_data = _wellness_db.get(user_id, {})
    user_entries = [
        entry for entry in user_data.values()
        if entry["user_id"] == user_id
    ]
    
    if not user_entries:
        return {"streak": 0, "last_entry": None, "total_entries": 0}
    
    # Get unique dates
    dates = sorted(set(e["date"] for e in user_entries), reverse=True)
    today = date.today()
    
    # Calculate consecutive days
    streak = 0
    current_date = today
    
    # Check if there's an entry for today or yesterday
    if dates[0] != today and dates[0] != today - timedelta(days=1):
        return {"streak": 0, "last_entry": dates[0], "total_entries": len(user_entries)}
    
    if dates[0] != today:
        current_date = today - timedelta(days=1)
    
    date_set = set(dates)
    while date_set and date_set.__contains__(current_date):
        streak += 1
        current_date = current_date - timedelta(days=1)
        date_set.discard(current_date + timedelta(days=1))
    
    return {
        "streak": streak,
        "last_entry": dates[0] if dates else None,
        "total_entries": len(user_entries)
    }
