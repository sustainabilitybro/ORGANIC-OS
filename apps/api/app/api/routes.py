"""
Main API routes for the Natural Remedies Database.
"""

from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status, Security
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func

from ..database.connection import get_db
from ..models.organisms import Organism
from ..models.indications import Indication
from ..models.remedy_indications import RemedyIndication
from ..models.evidence import EvidenceItem
from ..models.safety import SafetyProfile
from ..models.curators import Curator
from ..models.compounds import Compound
from .schemas import (
    OrganismResponse, OrganismDetail, OrganismCreate,
    IndicationResponse, IndicationCreate,
    RemedyIndicationDetail, RemedyIndicationSummary, RemedyIndicationCreate,
    EvidenceItemResponse, EvidenceItemCreate,
    SearchQuery, SearchResponse, SearchResult, SuggestionResponse,
    InteractionCheckRequest, InteractionCheckResponse, Interaction,
    PubMedSearchRequest, IngestionResult
)
from ..ingestion.pubmed import PubMedIngester
from .auth import create_access_token, get_current_active_curator, verify_password, Token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()


# ============================================
# Auth Endpoints
# ============================================

@router.post("/auth/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Curator).where(Curator.username == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Determine scopes based on curator role
    scopes = ["read"]
    if user.role in ["lead_curator", "admin"]:
        scopes.extend(["curate", "admin", "contribute", "research"])
    elif user.role == "curator":
        scopes.extend(["curate", "contribute"])
    elif user.role == "contributor":
        scopes.append("contribute")
        
    access_token = create_access_token(
        data={"sub": user.username, "scopes": scopes}
    )
    return {"access_token": access_token, "token_type": "bearer"}



# ============================================
# Health Check
# ============================================

@router.get("/health")
async def health_check():
    """API health check endpoint."""
    return {"status": "healthy", "service": "Natural Remedies Database API", "version": "1.0.0"}


# ============================================
# Search Endpoints
# ============================================

@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(..., min_length=1, max_length=500),
    type: str = Query("all", pattern="^(remedy|condition|all)$"),
    evidence_level_min: int = Query(1, ge=1, le=5),
    evidence_level_max: int = Query(5, ge=1, le=5),
    safety_level: Optional[List[str]] = Query(None),
    traditional_system: Optional[List[str]] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Search remedies and conditions.
    
    - **q**: Search query (remedy name, condition, compound, etc.)
    - **type**: Filter by type ('remedy', 'condition', 'all')
    - **evidence_level_min/max**: Filter by evidence level (1=strongest, 5=weakest)
    - **safety_level**: Filter by safety profile
    - **traditional_system**: Filter by traditional medicine system
    """
    results = []
    total = 0
    offset = (page - 1) * limit
    
    search_term = f"%{q.lower()}%"
    
    if type in ["remedy", "all"]:
        # Optimized joined search for organisms with best evidence and safety
        # We use a subquery to get the minimum evidence level per organism efficiently
        
        evidence_sub = select(
            RemedyIndication.organism_id,
            func.min(RemedyIndication.evidence_level).label("min_level")
        ).where(RemedyIndication.is_deleted == False).group_by(RemedyIndication.organism_id).subquery()

        query = select(
            Organism, 
            evidence_sub.c.min_level,
            SafetyProfile
        ).outerjoin(
            evidence_sub, Organism.id == evidence_sub.c.organism_id
        ).outerjoin(
            SafetyProfile, Organism.id == SafetyProfile.organism_id
        ).where(
            and_(
                Organism.is_deleted == False,
                or_(
                    func.lower(Organism.common_name_en).like(search_term),
                    func.lower(Organism.taxonomy_genus).like(search_term),
                    func.lower(Organism.taxonomy_species).like(search_term),
                    func.lower(Organism.description).like(search_term)
                )
            )
        )
        
        # Apply evidence filters in SQL if possible (coalesce to 5 if no evidence)
        if evidence_level_min > 1 or evidence_level_max < 5:
            query = query.where(
                and_(
                    func.coalesce(evidence_sub.c.min_level, 5) >= evidence_level_min,
                    func.coalesce(evidence_sub.c.min_level, 5) <= evidence_level_max
                )
            )

        result = await db.execute(query.offset(offset).limit(limit))
        rows = result.all()
        
        for org, best_level, safety in rows:
            best_evidence = best_level or 5
            
            # Get only required indications for preview (top 3)
            # This is still a small extra query but much better than before
            ind_query = select(RemedyIndication, Indication).join(
                Indication, RemedyIndication.indication_id == Indication.id
            ).where(
                RemedyIndication.organism_id == org.id,
                RemedyIndication.is_deleted == False
            ).order_by(RemedyIndication.evidence_level).limit(3)
            
            ind_result = await db.execute(ind_query)
            remedy_inds = ind_result.all()
            
            indications_list = [
                {
                    "indication_name": ind.condition_name,
                    "role": ri.remedy_role,
                    "evidence_strength": ri.evidence_certainty,
                    "typical_dose": f"{ri.typical_dose_min_mg}-{ri.typical_dose_max_mg}mg" if ri.typical_dose_min_mg else None
                } for ri, ind in remedy_inds
            ]
            
            # Determine safety categorical value
            safety_profile = "unknown"
            if safety:
                if any([safety.hepatotoxicity, safety.nephrotoxicity, safety.neurotoxicity]):
                    safety_profile = "significant_concerns"
                elif safety.adverse_events and len(safety.adverse_events) > 3:
                    safety_profile = "minor_side_effects"
                else:
                    safety_profile = "well_tolerated"
            
            if safety_level and safety_profile not in safety_level:
                continue
                
            results.append(SearchResult(
                id=org.id,
                type="remedy",
                name=org.common_name_en or "",
                scientific_name=f"{org.taxonomy_genus} {org.taxonomy_species}",
                summary=org.description[:200] if org.description else None,
                evidence_level=best_evidence,
                evidence_certainty=remedy_inds[0][0].evidence_certainty if remedy_inds else None,
                safety_profile=safety_profile,
                indications=indications_list
            ))
            total += 1

    
    if type in ["condition", "all"]:
        # Search indications
        query = select(Indication).where(
            or_(
                func.lower(Indication.condition_name).like(search_term),
                func.lower(Indication.description).like(search_term),
                func.lower(Indication.disease_category).like(search_term),
                func.lower(Indication.dsm_5_code).like(search_term)
            )
        )
        
        result = await db.execute(query.offset(offset).limit(limit))
        indications = result.scalars().all()
        
        for ind in indications:
            results.append(SearchResult(
                id=ind.id,
                type="condition",
                name=ind.condition_name,
                scientific_name=None,
                summary=ind.description[:200] if ind.description else None,
                evidence_level=None,
                evidence_certainty=None,
                safety_profile=None,
                indications=[]
            ))
            total += 1
    
    if type in ["remedy", "all"]:
        # Search compounds
        query = select(Compound).where(
            or_(
                func.lower(Compound.common_name).like(search_term),
                func.lower(Compound.iupac_name).like(search_term),
                func.lower(Compound.description).like(search_term)
            )
        )
        
        result = await db.execute(query.offset(offset).limit(limit))
        compounds = result.scalars().all()
        
        for comp in compounds:
            results.append(SearchResult(
                id=comp.id,
                type="compound",
                name=comp.common_name or "",
                scientific_name=comp.iupac_name,
                summary=comp.description[:200] if comp.description else None,
                evidence_level=None,
                evidence_certainty=None,
                safety_profile=None,
                indications=[]
            ))
            total += 1
    
    pages_total = (total + limit - 1) // limit if total > 0 else 1
    
    return SearchResponse(
        results=results[:limit],
        total_results=total,
        page=page,
        pages_total=pages_total,
        query=q
    )


@router.get("/search/suggestions", response_model=SuggestionResponse)
async def get_suggestions(
    q: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(10, ge=1, le=20),
    db: AsyncSession = Depends(get_db)
):
    """Get autocomplete suggestions for search."""
    search_term = f"{q.lower()}%"
    suggestions = []
    
    # Get organism names
    org_query = select(Organism.common_name_en).where(
        func.lower(Organism.common_name_en).like(search_term),
        Organism.is_deleted == False
    ).limit(limit // 2)
    result = await db.execute(org_query)
    suggestions.extend([r[0] for r in result.all() if r[0]])
    
    # Get condition names
    ind_query = select(Indication.condition_name).where(
        func.lower(Indication.condition_name).like(search_term)
    ).limit(limit // 2)
    result = await db.execute(ind_query)
    suggestions.extend([r[0] for r in result.all() if r[0]])
    
    return SuggestionResponse(suggestions=suggestions[:limit], query=q)


# ============================================
# Remedy (Organism) Endpoints
# ============================================

@router.get("/remedies", response_model=List[OrganismResponse])
async def list_remedies(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    organism_type: Optional[str] = None,
    traditional_system: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all remedies with optional filters."""
    offset = (page - 1) * limit
    
    query = select(Organism).where(Organism.is_deleted == False)
    
    if organism_type:
        query = query.where(Organism.organism_type == organism_type)
    
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    organisms = result.scalars().all()
    
    return [OrganismResponse(
        id=org.id,
        common_name_en=org.common_name_en or "",
        taxonomy_genus=org.taxonomy_genus,
        taxonomy_species=org.taxonomy_species,
        taxonomy_family=org.taxonomy_family,
        organism_type=org.organism_type,
        organism_subtype=org.organism_subtype,
        description=org.description,
        scientific_name=f"{org.taxonomy_genus} {org.taxonomy_species}" if org.taxonomy_genus else None,
        synonyms=org.synonyms or [],
        traditional_systems=org.traditional_systems or [],
        known_compounds=org.known_compounds or [],
        parts_used=org.parts_used or [],
        iucn_conservation_status=org.iucn_conservation_status,
        verification_status=org.verification_status,
        confidence_score=org.confidence_score,
        created_at=org.created_at
    ) for org in organisms]


@router.get("/remedies/{remedy_id}", response_model=OrganismDetail)
async def get_remedy(
    remedy_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed information about a specific remedy."""
    result = await db.execute(
        select(Organism).where(Organism.id == remedy_id, Organism.is_deleted == False)
    )
    organism = result.scalar_one_or_none()
    
    if not organism:
        raise HTTPException(status_code=404, detail="Remedy not found")
    
    # Get remedy-indication relationships
    ri_query = select(RemedyIndication, Indication).join(
        Indication, RemedyIndication.indication_id == Indication.id
    ).where(
        RemedyIndication.organism_id == remedy_id,
        RemedyIndication.is_deleted == False
    ).order_by(RemedyIndication.evidence_level)
    
    ri_result = await db.execute(ri_query)
    remedy_inds = ri_result.all()
    
    remedy_indications = []
    for ri, ind in remedy_inds:
        remedy_indications.append(RemedyIndicationSummary(
            id=ri.id,
            organism_id=ri.organism_id,
            indication_id=ri.indication_id,
            organism_name=organism.common_name_en,
            indication_name=ind.condition_name,
            evidence_level=ri.evidence_level or 5,
            evidence_certainty=ri.evidence_certainty,
            remedy_role=ri.remedy_role,
            safety_profile_assessment=ri.safety_profile_assessment,
            typical_dose_min_mg=ri.typical_dose_min_mg,
            typical_dose_max_mg=ri.typical_dose_max_mg,
            typical_dose_frequency=ri.typical_dose_frequency
        ))
    
    # Get safety profiles
    safety_query = select(SafetyProfile).where(SafetyProfile.organism_id == remedy_id)
    safety_result = await db.execute(safety_query)
    safety_profiles = safety_result.scalars().all()
    
    safety_summaries = []
    for sp in safety_profiles:
        safety_summaries.append({
            "id": sp.id,
            "adverse_events": sp.adverse_events or [],
            "hepatotoxicity": sp.hepatotoxicity,
            "pregnancy_safety": sp.pregnancy_safety,
            "absolute_contraindications": sp.absolute_contraindications or [],
            "herb_drug_interactions": sp.herb_drug_interactions or [],
            "allergenic_potential": sp.allergenic_potential
        })
    
    return OrganismDetail(
        id=organism.id,
        common_name_en=organism.common_name_en or "",
        taxonomy_genus=organism.taxonomy_genus,
        taxonomy_species=organism.taxonomy_species,
        taxonomy_family=organism.taxonomy_family,
        organism_type=organism.organism_type,
        organism_subtype=organism.organism_subtype,
        description=organism.description,
        scientific_name=f"{organism.taxonomy_genus} {organism.taxonomy_species}" if organism.taxonomy_genus else None,
        synonyms=organism.synonyms or [],
        traditional_systems=organism.traditional_systems or [],
        known_compounds=organism.known_compounds or [],
        parts_used=organism.parts_used or [],
        iucn_conservation_status=organism.iucn_conservation_status,
        verification_status=organism.verification_status,
        confidence_score=organism.confidence_score,
        created_at=organism.created_at,
        remedy_indications=remedy_indications,
        safety_profiles=safety_summaries
    )


@router.post("/remedies", response_model=OrganismResponse)
async def create_remedy(
    remedy: OrganismCreate,
    current_user: Annotated[Curator, Security(get_current_user, scopes=["contribute"])],
    db: AsyncSession = Depends(get_db)
):
    """Create a new remedy entry."""
    organism = Organism(
        common_name_en=remedy.common_name_en,
        taxonomy_genus=remedy.taxonomy_genus,
        taxonomy_species=remedy.taxonomy_species,
        taxonomy_family=remedy.taxonomy_family,
        organism_type=remedy.organism_type,
        organism_subtype=remedy.organism_subtype,
        description=remedy.description,
        synonyms=remedy.synonyms,
        traditional_systems=remedy.traditional_systems,
        known_compounds=remedy.known_compounds,
        parts_used=remedy.parts_used,
        verification_status="pending"
    )
    
    db.add(organism)
    await db.commit()
    await db.refresh(organism)
    
    return OrganismResponse(
        id=organism.id,
        common_name_en=organism.common_name_en or "",
        taxonomy_genus=organism.taxonomy_genus,
        taxonomy_species=organism.taxonomy_species,
        taxonomy_family=organism.taxonomy_family,
        organism_type=organism.organism_type,
        organism_subtype=organism.organism_subtype,
        description=organism.description,
        synonyms=organism.synonyms or [],
        traditional_systems=organism.traditional_systems or [],
        known_compounds=organism.known_compounds or [],
        parts_used=organism.parts_used or [],
        verification_status=organism.verification_status,
        confidence_score=organism.confidence_score,
        created_at=organism.created_at
    )


# ============================================
# Condition (Indication) Endpoints
# ============================================

@router.get("/conditions", response_model=List[IndicationResponse])
async def list_conditions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all conditions with optional filters."""
    offset = (page - 1) * limit
    
    query = select(Indication)
    
    if category:
        query = query.where(Indication.disease_category == category)
    
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    indications = result.scalars().all()
    
    return [IndicationResponse(
        id=ind.id,
        condition_name=ind.condition_name,
        disease_category=ind.disease_category,
        disease_subcategory=ind.disease_subcategory,
        description=ind.description,
        alternative_names=ind.alternative_names or [],
        icd_11_code=ind.icd_11_code,
        body_system=ind.body_system or [],
        primary_symptoms=ind.primary_symptoms or [],
        prevalence_per_100k_global=ind.prevalence_per_100k_global,
        verification_status=ind.verification_status
    ) for ind in indications]


@router.get("/conditions/{condition_id}", response_model=IndicationResponse)
async def get_condition(
    condition_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed information about a specific condition."""
    result = await db.execute(
        select(Indication).where(Indication.id == condition_id)
    )
    indication = result.scalar_one_or_none()
    
    if not indication:
        raise HTTPException(status_code=404, detail="Condition not found")
    
    return IndicationResponse(
        id=indication.id,
        condition_name=indication.condition_name,
        disease_category=indication.disease_category,
        disease_subcategory=indication.disease_subcategory,
        description=indication.description,
        alternative_names=indication.alternative_names or [],
        icd_11_code=indication.icd_11_code,
        body_system=indication.body_system or [],
        primary_symptoms=indication.primary_symptoms or [],
        prevalence_per_100k_global=indication.prevalence_per_100k_global,
        verification_status=indication.verification_status
    )


# ============================================
# Remedy-Indication Relationship Endpoints
# ============================================

@router.get("/remedy-indications/{ri_id}", response_model=RemedyIndicationDetail)
async def get_remedy_indication(
    ri_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed evidence for a specific remedy-condition relationship."""
    result = await db.execute(
        select(RemedyIndication, Organism, Indication).join(
            Organism, RemedyIndication.organism_id == Organism.id
        ).join(
            Indication, RemedyIndication.indication_id == Indication.id
        ).where(RemedyIndication.id == ri_id)
    )
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Remedy-indication relationship not found")
    
    ri, org, ind = row
    
    return RemedyIndicationDetail(
        id=ri.id,
        organism_id=ri.organism_id,
        indication_id=ri.indication_id,
        organism_name=org.common_name_en,
        indication_name=ind.condition_name,
        preparation_method=ri.preparation_method,
        remedy_role=ri.remedy_role,
        evidence_level=ri.evidence_level or 5,
        evidence_certainty=ri.evidence_certainty,
        rct_count=ri.rct_count,
        rct_total_participants=ri.rct_total_participants,
        meta_analyses_count=ri.meta_analyses_count,
        systematic_reviews_count=ri.systematic_reviews_count,
        observational_studies_count=ri.observational_studies_count,
        effect_size_magnitude=ri.effect_size_magnitude,
        effect_size_95ci=ri.effect_size_95ci,
        primary_outcome_measured=ri.primary_outcome_measured,
        primary_outcome_effect=ri.primary_outcome_effect,
        primary_outcome_magnitude=ri.primary_outcome_magnitude,
        safety_evidence_level=ri.safety_evidence_level,
        safety_profile_assessment=ri.safety_profile_assessment,
        adverse_events=ri.adverse_events or [],
        adverse_event_frequency_percent=ri.adverse_event_frequency_percent,
        typical_dose_min_mg=ri.typical_dose_min_mg,
        typical_dose_max_mg=ri.typical_dose_max_mg,
        typical_dose_frequency=ri.typical_dose_frequency,
        dose_duration_weeks_min=ri.dose_duration_weeks_min,
        dose_duration_weeks_max=ri.dose_duration_weeks_max,
        herb_drug_interactions=ri.herb_drug_interactions or [],
        contraindications=ri.contraindications or [],
        precautions=ri.precautions or [],
        proposed_mechanisms=ri.proposed_mechanisms or [],
        biomarkers_affected=ri.biomarkers_affected or [],
        traditional_systems_using=ri.traditional_systems_using or [],
        years_of_traditional_use=ri.years_of_traditional_use,
        overall_recommendation=ri.overall_recommendation,
        recommendation_for_use=ri.recommendation_for_use,
        primary_evidence_sources=ri.primary_evidence_sources or [],
        verification_status=ri.verification_status,
        last_reviewed_date=ri.last_reviewed_date
    )


# ============================================
# Interaction Checker
# ============================================

@router.post("/interactions/check", response_model=InteractionCheckResponse)
async def check_interactions(
    request: InteractionCheckRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Check for interactions between remedies and/or drugs.
    
    - **remedies**: List of remedy (organism) IDs
    - **drugs**: List of drug names (optional)
    """
    interactions = []
    critical_warnings = []
    
    # Get all remedy-indication data for requested remedies
    ri_query = select(RemedyIndication, Organism).join(
        Organism, RemedyIndication.organism_id == Organism.id
    ).where(RemedyIndication.organism_id.in_(request.remedies))
    
    result = await db.execute(ri_query)
    remedy_data = result.all()
    
    # Check herb-drug interactions
    for ri, org in remedy_data:
        if ri.herb_drug_interactions:
            for interaction in ri.herb_drug_interactions:
                drug_name = interaction.get("drug", "").lower()
                
                # Check if this drug is in the user's list
                if request.drugs:
                    for user_drug in request.drugs:
                        if user_drug.lower() in drug_name or drug_name in user_drug.lower():
                            severity = interaction.get("severity", "unknown")
                            
                            interactions.append(Interaction(
                                substance_1=org.common_name_en or "",
                                substance_2=user_drug,
                                interaction_type="herb_drug",
                                severity=severity,
                                mechanism=interaction.get("mechanism"),
                                clinical_significance=interaction.get("clinical_significance"),
                                advice=interaction.get("advice"),
                                evidence_quality=interaction.get("evidence")
                            ))
                            
                            if severity in ["high", "critical"]:
                                critical_warnings.append(
                                    f"CRITICAL: {org.common_name_en} may interact with {user_drug}. "
                                    f"{interaction.get('clinical_significance', 'Consult your doctor.')}"
                                )
        
        # --- ROBUSTNESS UPGRADE: Pharmacokinetic (PK) Modeling ---
        # Even if a specific interaction isn't in our DB, we check for metabolic path conflicts
        # Example: Remedy inhibits CYP3A4 + Drug is a CYP3A4 substrate
        if ri.pharmacokinetics and "inhibits" in ri.pharmacokinetics:
            inhibited_enzymes = ri.pharmacokinetics.get("inhibits", [])
            # In a real system, we'd have a 'DrugEnzymeRegistry' to check substrates
            # Mocking logic for robustness demo:
            if "CYP3A4" in inhibited_enzymes and request.drugs:
                for user_drug in request.drugs:
                    # Known common CYP3A4 substrates (statins, etc)
                    if any(drug in user_drug.lower() for drug in ["simvastatin", "atorvastatin", "cyclosporine"]):
                        interactions.append(Interaction(
                            substance_1=org.common_name_en or "",
                            substance_2=user_drug,
                            interaction_type="pharmacokinetic",
                            severity="high",
                            mechanism=f"Inhibition of CYP3A4 by {org.common_name_en}",
                            clinical_significance=f"May significantly increase serum concentration of {user_drug}",
                            advice="Dose reduction or alternative medication recommended. Monitor for toxicity.",
                            evidence_quality="pharmacological_prediction"
                        ))

    
    # Check herb-herb interactions between selected remedies
    if len(request.remedies) > 1:
        # Get all remedy names
        remedy_names = {org.id: org.common_name_en for ri, org in remedy_data}
        
        for ri, org in remedy_data:
            if ri.herb_herb_interactions:
                for interaction in ri.herb_herb_interactions:
                    other_id = interaction.get("herb2_id")
                    if other_id in request.remedies and other_id != org.id:
                        interactions.append(Interaction(
                            substance_1=org.common_name_en or "",
                            substance_2=remedy_names.get(other_id, "Unknown"),
                            interaction_type="herb_herb",
                            severity=interaction.get("severity", "unknown"),
                            mechanism=interaction.get("interaction"),
                            clinical_significance=interaction.get("clinical_significance"),
                            advice=interaction.get("advice"),
                            evidence_quality="theoretical"
                        ))
    
    recommendations = "No significant interactions detected." if not interactions else \
        "Discuss these interactions with your healthcare provider before starting any new remedies."
    
    return InteractionCheckResponse(
        interactions_found=len(interactions) > 0,
        interaction_matrix=interactions,
        critical_warnings=critical_warnings,
        recommendations=recommendations
    )


# ============================================
# Evidence Ingestion Endpoints
# ============================================

@router.post("/ingest/pubmed", response_model=IngestionResult)
async def ingest_from_pubmed(
    request: PubMedSearchRequest,
    current_user: Annotated[Curator, Security(get_current_user, scopes=["curate"])],
    db: AsyncSession = Depends(get_db)
):
    """
    Ingest research articles from PubMed.
    
    Example queries:
    - "turmeric AND inflammation"
    - "(curcumin OR turmeric) AND rheumatoid arthritis"
    - "ashwagandha AND (anxiety OR stress)"
    """
    async with PubMedIngester() as ingester:
        results = await ingester.ingest_to_database(
            db=db,
            query=request.query,
            max_results=request.max_results,
            date_from=request.date_from,
            date_to=request.date_to
        )
    
    return IngestionResult(**results)


@router.get("/evidence", response_model=List[EvidenceItemResponse])
async def list_evidence(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    study_design: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List evidence items with optional filters."""
    offset = (page - 1) * limit
    
    query = select(EvidenceItem).where(EvidenceItem.is_deleted == False)
    
    if study_design:
        query = query.where(EvidenceItem.study_design == study_design)
    
    query = query.order_by(EvidenceItem.publication_year.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()
    
    return [EvidenceItemResponse(
        id=item.id,
        source_type=item.source_type or "",
        title=item.title or "",
        source_id=item.source_id,
        pmid=item.pmid,
        doi=item.doi,
        publication_year=item.publication_year,
        journal_name=item.journal_name,
        authors=item.authors or [],
        abstract=item.abstract,
        study_design=item.study_design,
        sample_size_total=item.sample_size_total,
        quality_score_jadad=item.quality_score_jadad,
        risk_of_bias_category=item.risk_of_bias_category,
        citation_count=item.citation_count,
        open_access=item.open_access
    ) for item in items]
