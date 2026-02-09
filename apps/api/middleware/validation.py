"""
Input Validation Middleware

Comprehensive input validation for all API requests.
"""
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel, validator, EmailStr, constr
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import re
import bleach

# ============ Validation Models ============

class UserRegistration(BaseModel):
    """User registration validation"""
    email: EmailStr
    password: constr(min_length=8, max_length=128)
    name: constr(min_length=2, max_length=100)
    timezone: constr(min_length=3, max_length=50) = "UTC"
    
    @validator('password')
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain special character')
        return v

class UserLogin(BaseModel):
    """User login validation"""
    email: EmailStr
    password: constr(min_length=1, max_length=128)

class WellnessCheckIn(BaseModel):
    """Wellness check-in validation"""
    mood: int = 1
    energy: int = 1
    sleep_hours: Optional[float] = None
    sleep_quality: Optional[int] = None
    stress_level: Optional[int] = None
    notes: Optional[str] = None
    
    @validator('mood', 'energy', 'stress_level')
    def validate_range(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Value must be between 1 and 5')
        return v
    
    @validator('sleep_hours')
    def validate_sleep_hours(cls, v):
        if v is not None and (v < 0 or v > 24):
            raise ValueError('Sleep hours must be between 0 and 24')
        return v
    
    @validator('notes')
    def sanitize_notes(cls, v):
        if v is not None:
            # Bleach sanitizes HTML tags
            v = bleach.clean(v, tags=[], strip=True)
            # Limit length
            if len(v) > 1000:
                v = v[:1000]
        return v

class HabitCreate(BaseModel):
    """Habit creation validation"""
    name: constr(min_length=1, max_length=100)
    category: constr(min_length=1, max_length=50)
    frequency: constr(min_length=1, max_length=20) = "daily"
    reminder_time: Optional[str] = None
    
    @validator('frequency')
    def validate_frequency(cls, v):
        valid = ['daily', 'weekly', 'monthual', 'custom']
        if v not in valid:
            raise ValueError(f'Frequency must be one of: {valid}')
        return v

class GoalCreate(BaseModel):
    """Goal creation validation"""
    title: constr(min_length=1, max_length=200)
    description: Optional[str] = None
    category: constr(min_length=1, max_length=50)
    deadline: Optional[date] = None
    milestones: Optional[List[Dict]] = None
    
    @validator('deadline')
    def validate_deadline(cls, v):
        if v is not None and v < date.today():
            raise ValueError('Deadline must be in the future')
        return v

class ChatMessage(BaseModel):
    """Chat message validation"""
    message: constr(min_length=1, max_length=2000)
    agent: constr(min_length=1, max_length=50) = "coach"
    context: Optional[Dict[str, Any]] = None
    
    @validator('message')
    def sanitize_message(cls, v):
        # Allow normal text, block potential injection
        v = bleach.clean(v, tags=[], strip=True)
        if len(v) > 2000:
            raise ValueError('Message too long (max 2000 characters)')
        return v

class CalendarEvent(BaseModel):
    """Calendar event validation"""
    title: constr(min_length=1, max_length=200)
    start: datetime
    end: datetime
    category: constr(min_length=1, max_length=50) = "general"
    description: Optional[str] = None
    
    @validator('end')
    def validate_end_time(cls, v, values):
        if 'start' in values and v <= values['start']:
            raise ValueError('End time must be after start time')
        return v

class PreferenceUpdate(BaseModel):
    """Preference update validation"""
    category: constr(min_length=1, max_length=50)
    key: constr(min_length=1, max_length=100)
    value: Any

# ============ Validation Middleware ============

class ValidationMiddleware:
    """Request validation middleware"""
    
    # Blocked patterns (SQL injection, XSS, etc.)
    BLOCKED_PATTERNS = [
        r'(\%27)|(\')|(--)|(\%23)|(#)',
        r'(\%3D)|(=)[^\n]*((\%27)|(\')|(--)|(\%3B)|(;))',
        r'\w*(\%27)|(\')|((\%6F)|(o)|(\%4F))((\%72)|(r)|(\%52))',
        r'((\%27)|(\')|)union|(\%27)|(\')',
        r'(exec|execute|select|insert|update|delete|drop|create|alter)\s',
        r'<script>',
        r'javascript:',
        r'on\w+\s*=',
    ]
    
    def __init__(self):
        self.blocked_patterns = [re.compile(p, re.IGNORECASE) for p in self.BLOCKED_PATTERNS]
    
    def validate_request(self, request: Request) -> bool:
        """Validate incoming request"""
        # Check URL path
        path = str(request.url.path)
        for pattern in self.blocked_patterns:
            if pattern.search(path):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid request pattern detected"
                )
        
        return True

# ============ Sanitization Functions ============

def sanitize_html(content: str) -> str:
    """Remove HTML tags and sanitize content"""
    if not content:
        return content
    return bleach.clean(content, tags=[], strip=True)

def sanitize_filename(filename: str) -> str:
    """Sanitize uploaded filename"""
    # Remove path components
    filename = filename.split('/')[-1]
    filename = filename.split('\\')[-1]
    # Remove special characters except dots
    filename = re.sub(r'[^\w\s\-\.]', '', filename)
    # Limit length
    return filename[:255]

def validate_uuid(value: str) -> bool:
    """Validate UUID format"""
    pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    return bool(re.match(pattern, value.lower()))

def truncate_text(text: str, max_length: int = 500) -> str:
    """Truncate text to max length"""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + '...'

# ============ Setup Function ============

def setup_validation(app: FastAPI):
    """Setup validation middleware for FastAPI app"""
    middleware = ValidationMiddleware()
    
    @app.middleware("http")
    async def validation_middleware(request: Request, call_next):
        # Skip validation for health endpoints
        if request.url.path.startswith(("/api/v1/health", "/api/v1/ready", "/docs", "/redoc")):
            return await call_next(request)
        
        try:
            middleware.validate_request(request)
            response = await call_next(request)
            return response
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Validation error: {str(e)}"
            )
