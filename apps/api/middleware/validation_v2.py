"""
Input Validation Middleware - Pydantic V2 Style

Comprehensive input validation for all API requests.
"""
from pydantic import BaseModel, field_validator, EmailStr, field_validator, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import re
import bleach

# ============ Validation Models (Pydantic V2) ============

class UserRegistration(BaseModel):
    """User registration validation"""
    email: EmailStr
    password: str
    name: str
    timezone: str = "UTC"
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if len(v) > 128:
            raise ValueError('Password must be at most 128 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain special character')
        return v
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if len(v) < 2:
            raise ValueError('Name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('Name must be at most 100 characters')
        return v
    
    @field_validator('timezone')
    @classmethod
    def validate_timezone(cls, v):
        if len(v) < 3:
            raise ValueError('Timezone must be at least 3 characters')
        return v


class UserLogin(BaseModel):
    """User login validation"""
    email: EmailStr
    password: str


class WellnessCheckIn(BaseModel):
    """Wellness check-in validation"""
    mood: int = 1
    energy: int = 1
    sleep_hours: Optional[float] = None
    sleep_quality: Optional[int] = None
    stress_level: Optional[int] = None
    notes: Optional[str] = None
    
    @field_validator('mood', 'energy', 'stress_level')
    @classmethod
    def validate_range(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Value must be between 1 and 5')
        return v
    
    @field_validator('sleep_hours')
    @classmethod
    def validate_sleep_hours(cls, v):
        if v is not None and (v < 0 or v > 24):
            raise ValueError('Sleep hours must be between 0 and 24')
        return v
    
    @field_validator('sleep_quality')
    @classmethod
    def validate_sleep_quality(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Sleep quality must be between 1 and 5')
        return v
    
    @field_validator('notes')
    @classmethod
    def sanitize_notes(cls, v):
        if v:
            return bleach.clean(v)
        return v


class HabitCreate(BaseModel):
    """Habit creation validation"""
    name: str
    frequency: str
    goal: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None
    
    @field_validator('frequency')
    @classmethod
    def validate_frequency(cls, v):
        valid_frequencies = ['daily', 'weekly', 'monthly', 'custom']
        if v not in valid_frequencies:
            raise ValueError(f'Frequency must be one of: {", ".join(valid_frequencies)}')
        return v
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if len(v) < 2:
            raise ValueError('Name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('Name must be at most 100 characters')
        return v


class GoalCreate(BaseModel):
    """Goal creation validation"""
    title: str
    description: Optional[str] = None
    deadline: Optional[date] = None
    category: Optional[str] = None
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if len(v) < 3:
            raise ValueError('Title must be at least 3 characters')
        if len(v) > 200:
            raise ValueError('Title must be at most 200 characters')
        return v
    
    @field_validator('deadline')
    @classmethod
    def validate_deadline(cls, v):
        if v and v < date.today():
            raise ValueError('Deadline must be in the future')
        return v


class ChatMessage(BaseModel):
    """Chat message validation"""
    message: str
    context: Optional[Dict[str, Any]] = None
    
    @field_validator('message')
    @classmethod
    def validate_message(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Message cannot be empty')
        if len(v) > 5000:
            raise ValueError('Message must be at most 5000 characters')
        return v.strip()


class CalendarEvent(BaseModel):
    """Calendar event validation"""
    title: str
    start: datetime
    end: Optional[datetime] = None
    category: Optional[str] = None
    description: Optional[str] = None
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if len(v) < 2:
            raise ValueError('Title must be at least 2 characters')
        return v
    
    @field_validator('end')
    @classmethod
    def validate_end(cls, v, info):
        # Get start time if available
        if v and 'start' in info.data:
            start = info.data['start']
            if start and v < start:
                raise ValueError('End time must be after start time')
        return v
    
    @model_validator(mode='after')
    def validate_event(self):
        if self.end and self.start and self.end <= self.start:
            raise ValueError('End time must be after start time')
        return self
