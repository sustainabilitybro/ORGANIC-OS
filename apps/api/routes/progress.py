from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import uuid4

router = APIRouter()
progress_records = {}

class ProgressUpdate(BaseModel):
    module_name: str
    progress_percentage: float = 0
    completed_topics: List[str] = []
    current_focus: Optional[str] = None
    notes: Optional[str] = None

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

@router.get("/modules", response_model=List[ProgressResponse])
async def get_all_progress(user_id: str):
    return [r for r in progress_records.values() if r["user_id"] == user_id]

@router.get("/modules/{module_name}", response_model=ProgressResponse)
async def get_module_progress(user_id: str, module_name: str):
    for record in progress_records.values():
        if record["user_id"] == user_id and record["module_name"] == module_name:
            return record
    return {"id": "", "user_id": user_id, "module_name": module_name,
            "progress_percentage": 0, "completed_topics": [], "current_focus": None,
            "notes": None, "last_activity": datetime.now(), "created_at": datetime.now(), "updated_at": datetime.now()}

@router.post("/modules", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED)
async def update_progress(user_id: str, update: ProgressUpdate):
    now = datetime.now()
    for record in progress_records.values():
        if record["user_id"] == user_id and record["module_name"] == update.module_name:
            record.update({**update.model_dump(), "last_activity": now, "updated_at": now})
            return record
    new_id = str(uuid4())
    new_record = {"id": new_id, "user_id": user_id, **update.model_dump(),
                   "last_activity": now, "created_at": now, "updated_at": now}
    progress_records[new_id] = new_record
    return new_record

@router.get("/summary", response_model=OverallProgress)
async def get_overall_progress(user_id: str):
    user_progress = {r["module_name"]: r for r in progress_records.values() if r["user_id"] == user_id}
    summaries = []
    for mkey, meta in MODULES.items():
        prog = user_progress.get(mkey, {})
        pct = prog.get("progress_percentage", 0)
        summaries.append(ModuleSummary(module_name=mkey, display_name=meta["display_name"],
                                   icon=meta["icon"], progress_percentage=pct, is_completed=pct>=100,
                                   last_activity=prog.get("last_activity")))
    completed = sum(1 for s in summaries if s.is_completed)
    overall = sum(s.progress_percentage for s in summaries) / len(summaries) if summaries else 0
    return OverallProgress(total_modules=len(MODULES), completed_modules=completed,
                         overall_percentage=round(overall, 1),
                         module_summaries=sorted(summaries, key=lambda x: x.progress_percentage, reverse=True))
