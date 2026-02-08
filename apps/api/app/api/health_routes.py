"""
Health Feature API Routes for Naturopath OS.
Includes symptom checker, health dashboard, protocol generator, and treatment tracking.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, date
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
from pydantic import BaseModel, Field

from ..database.connection import get_db
from ..models import (
    Organism, Indication, RemedyIndication, 
    UserProfile, SymptomEntry, TreatmentLog, 
    TreatmentProtocol, SavedProtocol, SymptomConditionMapping
)


router = APIRouter(prefix="/api/v1", tags=["Health Features"])


# ============================================
# Pydantic Schemas
# ============================================

class SymptomInput(BaseModel):
    """Input for symptom checker."""
    symptoms: List[str] = Field(..., description="List of symptom descriptions")
    severity: Optional[int] = Field(None, ge=1, le=10, description="Overall severity 1-10")
    duration_hours: Optional[float] = None
    body_area: Optional[str] = None
    additional_context: Optional[str] = None


class ConditionMatch(BaseModel):
    """A potential condition match from symptom analysis."""
    condition_id: int
    condition_name: str
    category: str
    match_score: float
    matching_symptoms: List[str]
    confidence: str
    is_red_flag: bool = False
    recommended_action: str


class SymptomCheckResult(BaseModel):
    """Result from the symptom checker."""
    input_symptoms: List[str]
    potential_conditions: List[ConditionMatch]
    general_recommendations: List[str]
    when_to_seek_care: List[str]
    disclaimer: str


class RemedyRecommendation(BaseModel):
    """A recommended remedy."""
    remedy_id: int
    remedy_name: str
    scientific_name: Optional[str]
    evidence_level: int
    evidence_description: str
    dosage: Optional[str]
    mechanism: Optional[str]
    safety_notes: Optional[str]
    match_reason: str


class ProtocolStep(BaseModel):
    """A step in a treatment protocol."""
    phase: int
    phase_name: str
    duration_weeks: Optional[int]
    primary_remedies: List[Dict[str, Any]]
    lifestyle_recommendations: List[str]
    monitoring_notes: Optional[str]


class GeneratedProtocol(BaseModel):
    """A generated treatment protocol."""
    protocol_name: str
    target_condition: str
    overall_approach: str
    evidence_summary: str
    steps: List[ProtocolStep]
    safety_warnings: List[str]
    contraindications: List[str]
    expected_timeline: str
    monitoring_markers: List[str]


class UserProfileCreate(BaseModel):
    """Create a new user profile."""
    email: str
    display_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    known_allergies: List[str] = []
    dietary_restrictions: List[str] = []
    current_medications: List[Dict[str, str]] = []
    activity_level: Optional[str] = None


class TreatmentLogCreate(BaseModel):
    """Log a treatment/remedy usage."""
    organism_id: Optional[int] = None
    custom_remedy_name: Optional[str] = None
    dose_amount: Optional[float] = None
    dose_unit: Optional[str] = None
    preparation_method: Optional[str] = None
    target_condition: Optional[str] = None
    target_symptoms: List[str] = []
    effectiveness_rating: Optional[int] = Field(None, ge=1, le=10)
    side_effects_experienced: List[Dict[str, Any]] = []
    notes: Optional[str] = None


class SymptomEntryCreate(BaseModel):
    """Log a symptom entry."""
    symptom_name: str
    symptom_category: Optional[str] = None
    body_area: Optional[str] = None
    severity: Optional[int] = Field(None, ge=1, le=10)
    duration_hours: Optional[float] = None
    frequency: Optional[str] = None
    triggers: List[str] = []
    notes: Optional[str] = None


class DashboardStats(BaseModel):
    """User health dashboard statistics."""
    total_treatments_logged: int
    total_symptoms_tracked: int
    active_protocols: int
    most_used_remedies: List[Dict[str, Any]]
    symptom_trends: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    health_score: Optional[float] = None


# ============================================
# Symptom Checker Endpoints
# ============================================

@router.post("/symptom-checker", response_model=SymptomCheckResult)
async def check_symptoms(
    symptom_input: SymptomInput,
    db: Session = Depends(get_db)
):
    """
    AI-powered symptom checker that analyzes symptoms and suggests
    potential conditions with natural remedy recommendations.
    """
    # Find matching symptom-condition mappings
    matches = []
    condition_scores: Dict[int, Dict] = {}
    
    for symptom in symptom_input.symptoms:
        # Search symptom mappings
        mappings = db.query(SymptomConditionMapping).filter(
            or_(
                SymptomConditionMapping.symptom_name.ilike(f"%{symptom}%"),
                SymptomConditionMapping.symptom_description.ilike(f"%{symptom}%")
            )
        ).all()
        
        for mapping in mappings:
            cond_id = mapping.indication_id
            if cond_id not in condition_scores:
                condition_scores[cond_id] = {
                    'condition_name': mapping.condition_name,
                    'category': mapping.symptom_category or 'general',
                    'matching_symptoms': [],
                    'score': 0,
                    'is_red_flag': False
                }
            
            # Add to score
            if mapping.is_primary_symptom:
                condition_scores[cond_id]['score'] += 0.4
            else:
                condition_scores[cond_id]['score'] += 0.2
            
            if mapping.association_strength == 'strong':
                condition_scores[cond_id]['score'] += 0.2
            
            condition_scores[cond_id]['matching_symptoms'].append(symptom)
            
            if mapping.red_flag:
                condition_scores[cond_id]['is_red_flag'] = True
    
    # Also search condition names directly in Indications table
    for symptom in symptom_input.symptoms:
        indications = db.query(Indication).filter(
            or_(
                Indication.condition_name.ilike(f"%{symptom}%"),
                func.json_contains(Indication.primary_symptoms, f'"{symptom}"'),
                func.json_contains(Indication.secondary_symptoms, f'"{symptom}"')
            )
        ).limit(10).all()
        
        for ind in indications:
            if ind.id not in condition_scores:
                condition_scores[ind.id] = {
                    'condition_name': ind.condition_name,
                    'category': ind.disease_category or 'general',
                    'matching_symptoms': [symptom],
                    'score': 0.3,
                    'is_red_flag': False
                }
    
    # Sort by score and create results
    sorted_conditions = sorted(
        condition_scores.items(),
        key=lambda x: x[1]['score'],
        reverse=True
    )[:10]  # Top 10 matches
    
    potential_conditions = []
    for cond_id, data in sorted_conditions:
        if data['score'] > 0.1:  # Minimum threshold
            confidence = "high" if data['score'] > 0.6 else "moderate" if data['score'] > 0.3 else "low"
            
            potential_conditions.append(ConditionMatch(
                condition_id=cond_id,
                condition_name=data['condition_name'],
                category=data['category'],
                match_score=min(data['score'], 1.0),
                matching_symptoms=list(set(data['matching_symptoms'])),
                confidence=confidence,
                is_red_flag=data['is_red_flag'],
                recommended_action="View natural remedies" if not data['is_red_flag'] else "Consult healthcare provider"
            ))
    
    # Generate general recommendations
    general_recommendations = [
        "These results are for informational purposes only",
        "Consider lifestyle factors that may be contributing",
        "Track your symptoms over time for better insights",
        "Natural remedies work best as part of a holistic approach"
    ]
    
    when_to_seek_care = [
        "Symptoms are severe or rapidly worsening",
        "You experience chest pain, difficulty breathing, or severe headache",
        "Symptoms persist for more than 2 weeks without improvement",
        "You have a high fever (over 103°F / 39.4°C)",
        "You're taking medications that may interact with natural remedies"
    ]
    
    return SymptomCheckResult(
        input_symptoms=symptom_input.symptoms,
        potential_conditions=potential_conditions,
        general_recommendations=general_recommendations,
        when_to_seek_care=when_to_seek_care,
        disclaimer="This symptom checker is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment."
    )


@router.get("/symptom-checker/remedies/{condition_id}", response_model=List[RemedyRecommendation])
async def get_condition_remedies(
    condition_id: int,
    evidence_threshold: int = Query(3, ge=1, le=5, description="Maximum evidence level (1=strongest)"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get recommended natural remedies for a specific condition.
    """
    # Get remedy indications for this condition
    remedy_indications = db.query(RemedyIndication, Organism).join(
        Organism, RemedyIndication.organism_id == Organism.id
    ).filter(
        RemedyIndication.indication_id == condition_id,
        RemedyIndication.evidence_level <= evidence_threshold,
        RemedyIndication.is_published == True
    ).order_by(
        RemedyIndication.evidence_level.asc()
    ).limit(limit).all()
    
    evidence_descriptions = {
        1: "Strong Evidence - Multiple large clinical trials",
        2: "Good Evidence - Large RCTs with positive findings",
        3: "Moderate Evidence - Smaller trials/observational studies",
        4: "Limited Evidence - Case reports/expert opinion",
        5: "Traditional Use - Historical use without clinical trials"
    }
    
    recommendations = []
    for ri, organism in remedy_indications:
        # Format dosage
        dosage = None
        if ri.typical_dose_min_mg:
            if ri.typical_dose_max_mg:
                dosage = f"{ri.typical_dose_min_mg}-{ri.typical_dose_max_mg} mg"
            else:
                dosage = f"{ri.typical_dose_min_mg} mg"
            if ri.typical_dose_frequency:
                dosage += f" {ri.typical_dose_frequency}"
        
        # Get mechanism
        mechanism = None
        if ri.proposed_mechanisms:
            mechanisms = ri.proposed_mechanisms[:2]  # First 2 mechanisms
            mechanism = "; ".join([m.get('mechanism', str(m)) for m in mechanisms])
        
        # Get safety notes
        safety = ri.safety_profile_assessment
        if ri.contraindications:
            safety = f"{safety}. Contraindications: {', '.join(ri.contraindications[:3])}"
        
        recommendations.append(RemedyRecommendation(
            remedy_id=organism.id,
            remedy_name=organism.common_name_en,
            scientific_name=organism.get_scientific_name(),
            evidence_level=ri.evidence_level,
            evidence_description=evidence_descriptions.get(ri.evidence_level, "Unknown"),
            dosage=dosage,
            mechanism=mechanism,
            safety_notes=safety,
            match_reason=f"Evidence Level {ri.evidence_level} for this condition"
        ))
    
    return recommendations


# ============================================
# Protocol Generator Endpoints
# ============================================

@router.get("/protocols/condition/{condition_id}", response_model=GeneratedProtocol)
async def generate_protocol(
    condition_id: int,
    severity: str = Query("moderate", enum=["mild", "moderate", "severe"]),
    include_lifestyle: bool = True,
    db: Session = Depends(get_db)
):
    """
    Generate a personalized treatment protocol for a condition.
    """
    # Get the condition
    indication = db.query(Indication).filter(Indication.id == condition_id).first()
    if not indication:
        raise HTTPException(status_code=404, detail="Condition not found")
    
    # Check for existing protocol
    existing_protocol = db.query(TreatmentProtocol).filter(
        TreatmentProtocol.indication_id == condition_id,
        TreatmentProtocol.is_active == True
    ).first()
    
    # Get remedies for this condition
    remedy_indications = db.query(RemedyIndication, Organism).join(
        Organism, RemedyIndication.organism_id == Organism.id
    ).filter(
        RemedyIndication.indication_id == condition_id,
        RemedyIndication.is_published == True
    ).order_by(
        RemedyIndication.evidence_level.asc()
    ).all()
    
    # Categorize remedies by evidence level
    strong_remedies = []
    moderate_remedies = []
    supportive_remedies = []
    
    all_contraindications = []
    all_safety_warnings = []
    
    for ri, organism in remedy_indications:
        remedy_info = {
            'name': organism.common_name_en,
            'scientific_name': organism.get_scientific_name(),
            'evidence_level': ri.evidence_level,
            'dosage': f"{ri.typical_dose_min_mg or 'TBD'}-{ri.typical_dose_max_mg or 'TBD'} mg" if ri.typical_dose_min_mg else "See product label",
            'frequency': ri.typical_dose_frequency or "As directed",
            'duration_weeks': ri.dose_duration_weeks_min or 8
        }
        
        if ri.evidence_level <= 1:
            strong_remedies.append(remedy_info)
        elif ri.evidence_level <= 2:
            moderate_remedies.append(remedy_info)
        else:
            supportive_remedies.append(remedy_info)
        
        if ri.contraindications:
            all_contraindications.extend(ri.contraindications)
        if ri.herb_drug_interactions:
            for interaction in ri.herb_drug_interactions[:3]:
                if isinstance(interaction, dict):
                    all_safety_warnings.append(interaction.get('interaction', str(interaction)))
                else:
                    all_safety_warnings.append(str(interaction))
    
    # Build protocol steps
    steps = []
    
    # Phase 1: Foundation
    steps.append(ProtocolStep(
        phase=1,
        phase_name="Foundation Phase",
        duration_weeks=2,
        primary_remedies=strong_remedies[:2] if strong_remedies else moderate_remedies[:2],
        lifestyle_recommendations=[
            "Establish consistent sleep schedule (7-9 hours)",
            "Reduce processed foods and increase whole foods",
            "Stay hydrated (8+ glasses of water daily)",
            "Begin gentle movement practice (walking, stretching)"
        ] if include_lifestyle else [],
        monitoring_notes="Track symptoms daily. Note any side effects."
    ))
    
    # Phase 2: Optimization
    steps.append(ProtocolStep(
        phase=2,
        phase_name="Optimization Phase",
        duration_weeks=4,
        primary_remedies=strong_remedies[:3] if strong_remedies else moderate_remedies[:3],
        lifestyle_recommendations=[
            "Add stress management practice (meditation, breathing exercises)",
            "Optimize nutrition for condition",
            "Establish regular exercise routine",
            "Consider gut health support (probiotics, fiber)"
        ] if include_lifestyle else [],
        monitoring_notes="Assess symptom improvement. Adjust dosages if needed."
    ))
    
    # Phase 3: Maintenance
    steps.append(ProtocolStep(
        phase=3,
        phase_name="Maintenance Phase",
        duration_weeks=8,
        primary_remedies=(strong_remedies + moderate_remedies)[:4],
        lifestyle_recommendations=[
            "Continue successful interventions",
            "Focus on triggers and prevention",
            "Build sustainable long-term habits",
            "Regular health check-ins"
        ] if include_lifestyle else [],
        monitoring_notes="Evaluate overall progress. Consider dose reduction if stable."
    ))
    
    # Determine overall evidence summary
    if strong_remedies:
        evidence_summary = "This protocol includes remedies with strong clinical evidence (Level 1-2)."
    elif moderate_remedies:
        evidence_summary = "This protocol includes remedies with moderate clinical evidence (Level 2-3)."
    else:
        evidence_summary = "This protocol includes remedies with preliminary evidence. More research may be needed."
    
    # Use existing protocol description if available
    overall_approach = ""
    if existing_protocol:
        overall_approach = existing_protocol.description or ""
    
    if not overall_approach:
        overall_approach = f"A phased natural medicine approach for {indication.condition_name}, starting with well-researched remedies and progressing to comprehensive lifestyle integration."
    
    return GeneratedProtocol(
        protocol_name=f"{indication.condition_name} Support Protocol",
        target_condition=indication.condition_name,
        overall_approach=overall_approach,
        evidence_summary=evidence_summary,
        steps=steps,
        safety_warnings=list(set(all_safety_warnings))[:5],
        contraindications=list(set(all_contraindications))[:5],
        expected_timeline="12-14 weeks for full protocol completion",
        monitoring_markers=[
            "Symptom severity (1-10 scale)",
            "Quality of life assessment",
            "Sleep quality",
            "Energy levels",
            "Side effects log"
        ]
    )


@router.get("/protocols/catalog", response_model=List[Dict[str, Any]])
async def list_protocols(
    category: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    List available treatment protocols.
    """
    query = db.query(TreatmentProtocol).filter(TreatmentProtocol.is_active == True)
    
    if category:
        query = query.join(Indication).filter(Indication.disease_category == category)
    
    protocols = query.offset(offset).limit(limit).all()
    
    return [
        {
            'id': p.id,
            'name': p.protocol_name,
            'type': p.protocol_type,
            'condition': p.target_condition_name,
            'evidence_level': p.overall_evidence_level,
            'duration_weeks': p.protocol_duration_weeks,
            'has_lifestyle': bool(p.lifestyle_modifications),
            'source': p.source_document
        }
        for p in protocols
    ]


# ============================================
# Health Dashboard Endpoints
# ============================================

@router.post("/users", response_model=Dict[str, Any])
async def create_user_profile(
    profile: UserProfileCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new user profile for personalized health tracking.
    """
    # Check if email exists
    existing = db.query(UserProfile).filter(UserProfile.email == profile.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = UserProfile(
        email=profile.email,
        display_name=profile.display_name,
        date_of_birth=profile.date_of_birth,
        gender=profile.gender,
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
        known_allergies=profile.known_allergies,
        dietary_restrictions=profile.dietary_restrictions,
        current_medications=profile.current_medications,
        activity_level=profile.activity_level
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        'id': user.id,
        'email': user.email,
        'display_name': user.display_name,
        'created_at': user.created_at.isoformat()
    }


@router.get("/users/{user_id}/dashboard", response_model=DashboardStats)
async def get_user_dashboard(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get user's health dashboard with statistics and trends.
    """
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get treatment log stats
    total_treatments = db.query(TreatmentLog).filter(
        TreatmentLog.user_id == user_id
    ).count()
    
    # Get symptom tracking stats
    total_symptoms = db.query(SymptomEntry).filter(
        SymptomEntry.user_id == user_id
    ).count()
    
    # Get active protocols
    active_protocols = db.query(SavedProtocol).filter(
        SavedProtocol.user_id == user_id,
        SavedProtocol.status == 'active'
    ).count()
    
    # Get most used remedies
    most_used_query = db.query(
        TreatmentLog.organism_id,
        TreatmentLog.custom_remedy_name,
        func.count(TreatmentLog.id).label('usage_count'),
        func.avg(TreatmentLog.effectiveness_rating).label('avg_rating')
    ).filter(
        TreatmentLog.user_id == user_id
    ).group_by(
        TreatmentLog.organism_id,
        TreatmentLog.custom_remedy_name
    ).order_by(
        func.count(TreatmentLog.id).desc()
    ).limit(5).all()
    
    most_used = []
    for item in most_used_query:
        remedy_name = item.custom_remedy_name
        if item.organism_id:
            organism = db.query(Organism).filter(Organism.id == item.organism_id).first()
            if organism:
                remedy_name = organism.common_name_en
        
        most_used.append({
            'remedy_name': remedy_name,
            'usage_count': item.usage_count,
            'avg_effectiveness': round(float(item.avg_rating or 0), 1)
        })
    
    # Get symptom trends (last 30 days)
    from datetime import timedelta
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    symptom_trends = db.query(
        SymptomEntry.symptom_name,
        func.count(SymptomEntry.id).label('count'),
        func.avg(SymptomEntry.severity).label('avg_severity')
    ).filter(
        SymptomEntry.user_id == user_id,
        SymptomEntry.logged_at >= thirty_days_ago
    ).group_by(
        SymptomEntry.symptom_name
    ).order_by(
        func.count(SymptomEntry.id).desc()
    ).limit(5).all()
    
    trends = [
        {
            'symptom': s.symptom_name,
            'occurrences': s.count,
            'avg_severity': round(float(s.avg_severity or 0), 1)
        }
        for s in symptom_trends
    ]
    
    # Get recent activity
    recent_treatments = db.query(TreatmentLog).filter(
        TreatmentLog.user_id == user_id
    ).order_by(TreatmentLog.created_at.desc()).limit(5).all()
    
    recent_activity = [
        {
            'type': 'treatment',
            'description': f"Logged {t.custom_remedy_name or 'remedy'}",
            'timestamp': t.created_at.isoformat(),
            'effectiveness': t.effectiveness_rating
        }
        for t in recent_treatments
    ]
    
    # Calculate health score (simplified)
    health_score = None
    if total_treatments > 0:
        avg_effectiveness = db.query(
            func.avg(TreatmentLog.effectiveness_rating)
        ).filter(
            TreatmentLog.user_id == user_id,
            TreatmentLog.effectiveness_rating.isnot(None)
        ).scalar()
        
        if avg_effectiveness:
            health_score = round(float(avg_effectiveness) * 10, 1)
    
    return DashboardStats(
        total_treatments_logged=total_treatments,
        total_symptoms_tracked=total_symptoms,
        active_protocols=active_protocols,
        most_used_remedies=most_used,
        symptom_trends=trends,
        recent_activity=recent_activity,
        health_score=health_score
    )


# ============================================
# Treatment Tracking Endpoints
# ============================================

@router.post("/users/{user_id}/treatments", response_model=Dict[str, Any])
async def log_treatment(
    user_id: int,
    treatment: TreatmentLogCreate,
    db: Session = Depends(get_db)
):
    """
    Log a treatment/remedy usage.
    """
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    log_entry = TreatmentLog(
        user_id=user_id,
        organism_id=treatment.organism_id,
        custom_remedy_name=treatment.custom_remedy_name,
        dose_amount=treatment.dose_amount,
        dose_unit=treatment.dose_unit,
        preparation_method=treatment.preparation_method,
        target_condition=treatment.target_condition,
        target_symptoms=treatment.target_symptoms,
        effectiveness_rating=treatment.effectiveness_rating,
        side_effects_experienced=treatment.side_effects_experienced,
        notes=treatment.notes
    )
    
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    
    return {
        'id': log_entry.id,
        'logged_at': log_entry.taken_at.isoformat(),
        'message': 'Treatment logged successfully'
    }


@router.get("/users/{user_id}/treatments", response_model=List[Dict[str, Any]])
async def get_treatment_history(
    user_id: int,
    limit: int = Query(20, ge=1, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Get user's treatment history.
    """
    treatments = db.query(TreatmentLog).filter(
        TreatmentLog.user_id == user_id
    ).order_by(
        TreatmentLog.taken_at.desc()
    ).offset(offset).limit(limit).all()
    
    result = []
    for t in treatments:
        remedy_name = t.custom_remedy_name
        if t.organism_id:
            organism = db.query(Organism).filter(Organism.id == t.organism_id).first()
            if organism:
                remedy_name = organism.common_name_en
        
        result.append({
            'id': t.id,
            'remedy_name': remedy_name,
            'dose': f"{t.dose_amount} {t.dose_unit}" if t.dose_amount else None,
            'preparation': t.preparation_method,
            'target_condition': t.target_condition,
            'effectiveness': t.effectiveness_rating,
            'side_effects': t.side_effects_experienced,
            'taken_at': t.taken_at.isoformat(),
            'notes': t.notes
        })
    
    return result


# ============================================
# Symptom Tracking Endpoints
# ============================================

@router.post("/users/{user_id}/symptoms", response_model=Dict[str, Any])
async def log_symptom(
    user_id: int,
    symptom: SymptomEntryCreate,
    db: Session = Depends(get_db)
):
    """
    Log a symptom entry for tracking.
    """
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    entry = SymptomEntry(
        user_id=user_id,
        symptom_name=symptom.symptom_name,
        symptom_category=symptom.symptom_category,
        body_area=symptom.body_area,
        severity=symptom.severity,
        duration_hours=symptom.duration_hours,
        frequency=symptom.frequency,
        triggers=symptom.triggers,
        notes=symptom.notes,
        symptom_datetime=datetime.utcnow()
    )
    
    db.add(entry)
    db.commit()
    db.refresh(entry)
    
    return {
        'id': entry.id,
        'logged_at': entry.logged_at.isoformat(),
        'message': 'Symptom logged successfully'
    }


@router.get("/users/{user_id}/symptoms", response_model=List[Dict[str, Any]])
async def get_symptom_history(
    user_id: int,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Get user's symptom history.
    """
    from datetime import timedelta
    cutoff = datetime.utcnow() - timedelta(days=days)
    
    symptoms = db.query(SymptomEntry).filter(
        SymptomEntry.user_id == user_id,
        SymptomEntry.logged_at >= cutoff
    ).order_by(
        SymptomEntry.logged_at.desc()
    ).all()
    
    return [
        {
            'id': s.id,
            'symptom': s.symptom_name,
            'category': s.symptom_category,
            'body_area': s.body_area,
            'severity': s.severity,
            'duration_hours': s.duration_hours,
            'frequency': s.frequency,
            'triggers': s.triggers,
            'logged_at': s.logged_at.isoformat(),
            'notes': s.notes
        }
        for s in symptoms
    ]


# ============================================
# Dosage Calculator Endpoint
# ============================================

@router.get("/dosage-calculator/{remedy_id}")
async def calculate_dosage(
    remedy_id: int,
    condition_id: Optional[int] = None,
    age: Optional[int] = Query(None, ge=0, le=120),
    weight_kg: Optional[float] = Query(None, ge=1, le=500),
    severity: str = Query("moderate", enum=["mild", "moderate", "severe"]),
    db: Session = Depends(get_db)
):
    """
    Calculate personalized dosage for a remedy based on user parameters.
    """
    # Get base remedy information
    organism = db.query(Organism).filter(Organism.id == remedy_id).first()
    if not organism:
        raise HTTPException(status_code=404, detail="Remedy not found")
    
    # Get remedy indication for dosage data
    query = db.query(RemedyIndication).filter(
        RemedyIndication.organism_id == remedy_id,
        RemedyIndication.is_published == True
    )
    
    if condition_id:
        query = query.filter(RemedyIndication.indication_id == condition_id)
    
    remedy_indication = query.order_by(RemedyIndication.evidence_level.asc()).first()
    
    if not remedy_indication:
        raise HTTPException(status_code=404, detail="No dosage information available for this remedy")
    
    # Base dosage from database
    base_min = remedy_indication.typical_dose_min_mg or 0
    base_max = remedy_indication.typical_dose_max_mg or base_min * 2
    frequency = remedy_indication.typical_dose_frequency or "once daily"
    
    # Adjustments based on parameters
    adjustment_notes = []
    
    # Age adjustments
    age_multiplier = 1.0
    if age:
        if age < 12:
            age_multiplier = 0.5
            adjustment_notes.append("Reduced dose for children under 12")
        elif age < 18:
            age_multiplier = 0.75
            adjustment_notes.append("Reduced dose for adolescents")
        elif age > 65:
            age_multiplier = 0.8
            adjustment_notes.append("Reduced dose for adults over 65")
    
    # Weight adjustments (assuming base dose is for 70kg adult)
    weight_multiplier = 1.0
    if weight_kg:
        weight_multiplier = weight_kg / 70.0
        weight_multiplier = max(0.5, min(1.5, weight_multiplier))  # Clamp between 0.5 and 1.5
        if weight_multiplier != 1.0:
            adjustment_notes.append(f"Adjusted for body weight ({weight_kg} kg)")
    
    # Severity adjustments
    severity_multiplier = 1.0
    if severity == "mild":
        severity_multiplier = 0.75
        adjustment_notes.append("Lower dose for mild symptoms")
    elif severity == "severe":
        severity_multiplier = 1.25
        adjustment_notes.append("Higher dose for severe symptoms")
    
    # Calculate adjusted dosage
    total_multiplier = age_multiplier * weight_multiplier * severity_multiplier
    adjusted_min = round(base_min * total_multiplier, 0)
    adjusted_max = round(base_max * total_multiplier, 0)
    
    return {
        'remedy_name': organism.common_name_en,
        'scientific_name': organism.get_scientific_name(),
        'base_dosage': {
            'min_mg': base_min,
            'max_mg': base_max,
            'frequency': frequency
        },
        'adjusted_dosage': {
            'min_mg': adjusted_min,
            'max_mg': adjusted_max,
            'frequency': frequency,
            'multiplier': round(total_multiplier, 2)
        },
        'adjustment_notes': adjustment_notes,
        'onset_weeks': remedy_indication.typical_onset_weeks,
        'duration_recommendation': f"{remedy_indication.dose_duration_weeks_min or 4}-{remedy_indication.dose_duration_weeks_max or 12} weeks",
        'safety_notes': [
            "Always start with the lower end of the dosage range",
            "Monitor for side effects carefully",
            "Consult a healthcare provider for personalized advice",
            "Reduce dose or discontinue if adverse effects occur"
        ],
        'contraindications': remedy_indication.contraindications or [],
        'evidence_level': remedy_indication.evidence_level
    }


# ============================================
# Condition Encyclopedia Endpoint
# ============================================

@router.get("/encyclopedia/conditions")
async def list_encyclopedia_conditions(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    List conditions in the encyclopedia with their natural intervention counts.
    """
    query = db.query(Indication)
    
    if category:
        query = query.filter(Indication.disease_category == category)
    
    if search:
        query = query.filter(
            or_(
                Indication.condition_name.ilike(f"%{search}%"),
                func.json_contains(Indication.alternative_names, f'"{search}"')
            )
        )
    
    total = query.count()
    conditions = query.offset(offset).limit(limit).all()
    
    results = []
    for cond in conditions:
        # Count remedies for this condition
        remedy_count = db.query(RemedyIndication).filter(
            RemedyIndication.indication_id == cond.id,
            RemedyIndication.is_published == True
        ).count()
        
        # Get best evidence level
        best_evidence = db.query(func.min(RemedyIndication.evidence_level)).filter(
            RemedyIndication.indication_id == cond.id,
            RemedyIndication.is_published == True
        ).scalar()
        
        results.append({
            'id': cond.id,
            'name': cond.condition_name,
            'category': cond.disease_category,
            'subcategory': cond.disease_subcategory,
            'description': cond.description[:200] + "..." if cond.description and len(cond.description) > 200 else cond.description,
            'remedy_count': remedy_count,
            'best_evidence_level': best_evidence,
            'has_protocol': db.query(TreatmentProtocol).filter(
                TreatmentProtocol.indication_id == cond.id
            ).first() is not None
        })
    
    return {
        'total': total,
        'offset': offset,
        'limit': limit,
        'conditions': results
    }


@router.get("/encyclopedia/conditions/{condition_id}")
async def get_encyclopedia_entry(
    condition_id: int,
    db: Session = Depends(get_db)
):
    """
    Get comprehensive encyclopedia entry for a condition.
    """
    condition = db.query(Indication).filter(Indication.id == condition_id).first()
    if not condition:
        raise HTTPException(status_code=404, detail="Condition not found")
    
    # Get all remedies
    remedy_query = db.query(RemedyIndication, Organism).join(
        Organism, RemedyIndication.organism_id == Organism.id
    ).filter(
        RemedyIndication.indication_id == condition_id,
        RemedyIndication.is_published == True
    ).order_by(RemedyIndication.evidence_level.asc()).all()
    
    remedies_by_level = {1: [], 2: [], 3: [], 4: [], 5: []}
    for ri, org in remedy_query:
        remedy_data = {
            'id': org.id,
            'name': org.common_name_en,
            'scientific_name': org.get_scientific_name(),
            'dosage': f"{ri.typical_dose_min_mg}-{ri.typical_dose_max_mg} mg" if ri.typical_dose_min_mg else "See recommendations",
            'mechanisms': [m.get('mechanism', str(m)) for m in (ri.proposed_mechanisms or [])[:3]],
            'trials_count': ri.rct_count or 0,
            'safety': ri.safety_profile_assessment
        }
        level = ri.evidence_level if ri.evidence_level in remedies_by_level else 5
        remedies_by_level[level].append(remedy_data)
    
    # Get protocol if exists
    protocol = db.query(TreatmentProtocol).filter(
        TreatmentProtocol.indication_id == condition_id,
        TreatmentProtocol.is_active == True
    ).first()
    
    return {
        'id': condition.id,
        'name': condition.condition_name,
        'category': condition.disease_category,
        'subcategory': condition.disease_subcategory,
        'icd_code': condition.icd_11_code,
        'dsm5_code': condition.dsm_5_code,
        'description': condition.description,
        'diagnostic_criteria': condition.diagnostic_criteria,
        'primary_symptoms': condition.primary_symptoms,
        'secondary_symptoms': condition.secondary_symptoms,
        'conventional_treatment': condition.standard_of_care_primary,
        'lifestyle_factors': {
            'dietary': condition.dietary_factors,
            'lifestyle': condition.lifestyle_factors,
            'environmental': condition.environmental_factors
        },
        'natural_interventions': {
            'strong_evidence': remedies_by_level[1],
            'good_evidence': remedies_by_level[2],
            'moderate_evidence': remedies_by_level[3],
            'limited_evidence': remedies_by_level[4],
            'traditional_use': remedies_by_level[5]
        },
        'total_remedy_count': sum(len(v) for v in remedies_by_level.values()),
        'protocol_available': protocol is not None,
        'protocol_id': protocol.id if protocol else None
    }
