from fastapi import APIRouter, HTTPException, status, Depends, Request
from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import uuid4

router = APIRouter()

# User-isolated storage: {user_id: {record_id: data}}
_progress_db = {}


class ProgressUpdate(BaseModel):
    module_name: str
    progress_percentage: float = 0
    completed_topics: List[str] = []
    current_focus: Optional[str] = None
    notes: Optional[str] = None

    @field_validator('progress_percentage')
    @classmethod
    def validate_progress(cls, v):
        if v < 0 or v > 100:
            raise ValueError('progress_percentage must be between 0 and 100')
        return v


class ProgressResponse(BaseModel):
    id: str
    user_id: str
    module_name: str
    progress_percentage: float
    completed_topics: List[str]
    current_focus: Optional[str]
    notes: Optional[str]
    last_activity: datetime
    created_at: datetime
    updated_at: datetime


class ModuleSummary(BaseModel):
    module_name: str
    display_name: str
    icon: str
    progress_percentage: float
    is_completed: bool
    last_activity: Optional[datetime]


class OverallProgress(BaseModel):
    total_modules: int
    completed_modules: int
    overall_percentage: float
    module_summaries: List[ModuleSummary]


MODULES = {
    "identity": {"display_name": "Identity", "icon": "👤"},
    "sensory": {"display_name": "Sensory", "icon": "👁️"},
    "emotional": {"display_name": "Emotional", "icon": "💚"},
    "wellness": {"display_name": "Wellness", "icon": "🌿"},
    "recovery": {"display_name": "Recovery", "icon": "🔋"},
    "communication": {"display_name": "Communication", "icon": "🎤"},
    "sustainability": {"display_name": "Sustainability", "icon": "🌱"},
    "holistic-alchemy": {"display_name": "Holistic Alchemy", "icon": "🧪"},
    "atom-economy": {"display_name": "Atom Economy", "icon": "⚛️"},
    "video": {"display_name": "Video", "icon": "📹"},
}


def get_user_id(request: Request) -> str:
    """Extract user ID from authorization header or query param."""
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        # In production, decode JWT and extract user_id
        return auth_header[7:43] or 'anonymous'
    
    user_id = request.query_params.get('user_id')
    if user_id:
        return user_id
    
    return 'anonymous'


@router.get("/modules", response_model=List[ProgressResponse])
async def get_all_progress(user_id: str = Depends(get_user_id)):
    """Get all progress records for authenticated user."""
    user_data = _progress_db.get(user_id, {})
    return [r for r in user_data.values() if r["user_id"] == user_id]


@router.get("/modules/{module_name}", response_model=ProgressResponse)
async def get_module_progress(
    module_name: str,
    user_id: str = Depends(get_user_id)
):
    """Get progress for a specific module."""
    user_data = _progress_db.get(user_id, {})
    
    for record in user_data.values():
        if record["user_id"] == user_id and record["module_name"] == module_name:
            return record
    
    # Return default if not found
    now = datetime.now()
    return {
        "id": "",
        "user_id": user_id,
        "module_name": module_name,
        "progress_percentage": 0,
        "completed_topics": [],
        "current_focus": None,
        "notes": None,
        "last_activity": now,
        "created_at": now,
        "updated_at": now,
    }


@router.post("/modules", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED)
async def update_progress(
    update: ProgressUpdate,
    user_id: str = Depends(get_user_id)
):
    """Update progress for a module (creates if doesn't exist)."""
    if user_id not in _progress_db:
        _progress_db[user_id] = {}
    
    user_data = _progress_db[user_id]
    now = datetime.now()
    
    # Find existing record
    for record_id, record in user_data.items():
        if record["user_id"] == user_id and record["module_name"] == update.module_name:
            # Update existing
            record["progress_percentage"] = update.progress_percentage
            record["completed_topics"] = update.completed_topics
            record["current_focus"] = update.current_focus
            record["notes"] = update.notes
            record["last_activity"] = now
            record["updated_at"] = now
            return record
    
    # Create new
    record_id = str(uuid4())
    new_record = {
        "id": record_id,
        "user_id": user_id,
        "module_name": update.module_name,
        "progress_percentage": update.progress_percentage,
        "completed_topics": update.completed_topics,
        "current_focus": update.current_focus,
        "notes": update.notes,
        "last_activity": now,
        "created_at": now,
        "updated_at": now,
    }
    user_data[record_id] = new_record
    return new_record


@router.patch("/modules/{module_name}", response_model=ProgressResponse)
async def partial_update(
    module_name: str,
    update: ProgressUpdate,
    user_id: str = Depends(get_user_id)
):
    """Partially update module progress."""
    if user_id not in _progress_db:
        _progress_db[user_id] = {}
    
    user_data = _progress_db[user_id]
    now = datetime.now()
    
    existing = None
    for record in user_data.values():
        if record["user_id"] == user_id and record["module_name"] == module_name:
            existing = record
            break
    
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress record not found"
        )
    
    # Apply updates
    update_data = update.model_dump(exclude_unset=True, exclude={"module_name"})
    for field, value in update_data.items():
        if value is not None:
            existing[field] = value
    existing["updated_at"] = now
    existing["last_activity"] = now
    
    return existing


@router.get("/summary", response_model=OverallProgress)
async def get_overall_progress(user_id: str = Depends(get_user_id)):
    """Get overall progress summary across all modules."""
    user_data = _progress_db.get(user_id, {})
    
    # Build progress map for user
    user_progress = {
        record["module_name"]: record
        for record in user_data.values()
        if record["user_id"] == user_id
    }
    
    summaries = []
    for module_key, metadata in MODULES.items():
        progress = user_progress.get(module_key, {})
        percentage = progress.get("progress_percentage", 0)
        
        summaries.append(ModuleSummary(
            module_name=module_key,
            display_name=metadata["display_name"],
            icon=metadata["icon"],
            progress_percentage=percentage,
            is_completed=percentage >= 100,
            last_activity=progress.get("last_activity")
        ))
    
    completed = sum(1 for s in summaries if s.is_completed)
    overall = sum(s.progress_percentage for s in summaries) / len(summaries) if summaries else 0
    
    return OverallProgress(
        total_modules=len(MODULES),
        completed_modules=completed,
        overall_percentage=round(overall, 1),
        module_summaries=sorted(summaries, key=lambda x: x.progress_percentage, reverse=True)
    )


@router.post("/modules/{module_name}/complete-topic")
async def mark_topic_complete(
    module_name: str,
    topic: str,
    user_id: str = Depends(get_user_id)
):
    """Mark a topic as completed in a module."""
    if user_id not in _progress_db:
        _progress_db[user_id] = {}
    
    user_data = _progress_db[user_id]
    now = datetime.now()
    
    existing = None
    for record in user_data.values():
        if record["user_id"] == user_id and record["module_name"] == module_name:
            existing = record
            break
    
    if existing:
        if topic not in existing["completed_topics"]:
            existing["completed_topics"].append(topic)
        existing["updated_at"] = now
    else:
        record_id = str(uuid4())
        new_record = {
            "id": record_id,
            "user_id": user_id,
            "module_name": module_name,
            "progress_percentage": 0,
            "completed_topics": [topic],
            "current_focus": None,
            "notes": None,
            "last_activity": now,
            "created_at": now,
            "updated_at": now,
        }
        user_data[record_id] = new_record
    
    return {"status": "success", "topic": topic, "module": module_name}
