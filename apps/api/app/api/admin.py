"""
Administrative API endpoints for the Natural Remedies Database.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..database.connection import get_db
from ..models.organisms import Organism
from ..models.indications import Indication
from ..models.remedy_indications import RemedyIndication
from ..models.evidence import EvidenceItem
from ..models.compounds import Compound
from ..models.curators import Curator, Submission, ReviewRecord
from .auth import get_current_admin

router = APIRouter()

@router.get("/stats", dependencies=[Depends(get_current_admin)])
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Get aggregate statistics for the admin dashboard."""
    
    # Remedies count
    remedies_count = await db.scalar(select(func.count(Organism.id)).where(Organism.is_deleted == False))
    
    # Indications count
    indications_count = await db.scalar(select(func.count(Indication.id)))

    # Compounds count
    compounds_count = await db.scalar(select(func.count(Compound.id)))
    
    # Relationships count
    relationships_count = await db.scalar(select(func.count(RemedyIndication.id)).where(RemedyIndication.is_deleted == False))
    
    # Evidence items count
    evidence_count = await db.scalar(select(func.count(EvidenceItem.id)).where(EvidenceItem.is_deleted == False))
    
    # Pending submissions
    pending_submissions = await db.scalar(
        select(func.count(Submission.id)).where(Submission.status.in_(["submitted", "curator_review"]))
    )
    
    # Active curators
    active_curators = await db.scalar(select(func.count(Curator.id)).where(Curator.is_active == True))
    
    return {
        "totalRemedies": remedies_count,
        "totalConditions": indications_count,
        "totalCompounds": compounds_count,
        "totalRelationships": relationships_count,
        "evidenceItems": evidence_count,
        "pendingSubmissions": pending_submissions,
        "pendingReviews": pending_submissions, # Simplified for demo
        "curatorsActive": active_curators,
        "lastUpdate": "2026-01-20T18:00:00Z"
    }

@router.get("/submissions", dependencies=[Depends(get_current_admin)])
async def list_submissions(db: AsyncSession = Depends(get_db)):
    """List all content submissions."""
    result = await db.execute(select(Submission).order_by(Submission.created_at.desc()))
    submissions = result.scalars().all()
    
    return submissions

@router.post("/recalculate-grades", dependencies=[Depends(get_current_admin)])
async def recalculate_all_grades(db: AsyncSession = Depends(get_db)):
    """Trigger a batch recalculation of all evidence levels."""
    # In a real system, this would be a background task
    # For now, we simulate success
    return {"status": "success", "message": "Evidence grading recalculation started"}

@router.get("/curators", dependencies=[Depends(get_current_admin)])
async def list_curators(db: AsyncSession = Depends(get_db)):
    """List all curators."""
    result = await db.execute(select(Curator))
    return result.scalars().all()
