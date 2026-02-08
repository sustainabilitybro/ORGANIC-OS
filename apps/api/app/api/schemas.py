"""
Pydantic schemas for API request/response validation.
"""

from typing import Optional, List, Any
from pydantic import BaseModel, Field
from datetime import datetime


# ============================================
# Organism Schemas
# ============================================

class OrganismBase(BaseModel):
    common_name_en: str
    taxonomy_genus: Optional[str] = None
    taxonomy_species: Optional[str] = None
    taxonomy_family: Optional[str] = None
    organism_type: Optional[str] = None
    organism_subtype: Optional[str] = None
    description: Optional[str] = None


class OrganismCreate(OrganismBase):
    synonyms: Optional[List[str]] = []
    traditional_systems: Optional[List[str]] = []
    known_compounds: Optional[List[dict]] = []
    parts_used: Optional[List[str]] = []


class OrganismResponse(OrganismBase):
    id: int
    scientific_name: Optional[str] = None
    synonyms: Optional[List[str]] = []
    traditional_systems: Optional[List[str]] = []
    known_compounds: Optional[List[dict]] = []
    parts_used: Optional[List[str]] = []
    iucn_conservation_status: Optional[str] = None
    verification_status: Optional[str] = None
    confidence_score: Optional[float] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class OrganismDetail(OrganismResponse):
    """Extended organism details including remedy indications."""
    remedy_indications: Optional[List["RemedyIndicationSummary"]] = []
    safety_profiles: Optional[List["SafetyProfileSummary"]] = []


# ============================================
# Indication Schemas
# ============================================

class IndicationBase(BaseModel):
    condition_name: str
    disease_category: Optional[str] = None
    disease_subcategory: Optional[str] = None
    description: Optional[str] = None
    dsm_5_code: Optional[str] = None


class IndicationCreate(IndicationBase):
    alternative_names: Optional[List[str]] = []
    icd_11_code: Optional[str] = None
    snomed_ct_code: Optional[str] = None
    body_system: Optional[List[str]] = []
    primary_symptoms: Optional[List[str]] = []


class IndicationResponse(IndicationBase):
    id: int
    alternative_names: Optional[List[str]] = []
    icd_11_code: Optional[str] = None
    body_system: Optional[List[str]] = []
    primary_symptoms: Optional[List[str]] = []
    prevalence_per_100k_global: Optional[float] = None
    dsm_5_code: Optional[str] = None
    verification_status: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============================================
# RemedyIndication Schemas (Core relationship)
# ============================================

class RemedyIndicationBase(BaseModel):
    organism_id: int
    indication_id: int
    preparation_method: Optional[str] = None
    remedy_role: Optional[str] = None
    evidence_level: int = Field(default=5, ge=1, le=5)
    evidence_certainty: Optional[str] = None


class RemedyIndicationCreate(RemedyIndicationBase):
    typical_dose_min_mg: Optional[float] = None
    typical_dose_max_mg: Optional[float] = None
    typical_dose_frequency: Optional[str] = None
    safety_profile_assessment: Optional[str] = None
    adverse_events: Optional[List[dict]] = []
    contraindications: Optional[List[str]] = []
    herb_drug_interactions: Optional[List[dict]] = []
    proposed_mechanisms: Optional[List[dict]] = []
    primary_evidence_sources: Optional[List[dict]] = []


class RemedyIndicationSummary(BaseModel):
    """Summary for embedding in organism/indication responses."""
    id: int
    organism_id: int
    indication_id: int
    organism_name: Optional[str] = None
    indication_name: Optional[str] = None
    evidence_level: int
    evidence_certainty: Optional[str] = None
    remedy_role: Optional[str] = None
    safety_profile_assessment: Optional[str] = None
    typical_dose_min_mg: Optional[float] = None
    typical_dose_max_mg: Optional[float] = None
    typical_dose_frequency: Optional[str] = None
    
    class Config:
        from_attributes = True


class RemedyIndicationDetail(RemedyIndicationBase):
    """Full remedy-indication detail."""
    id: int
    organism_name: Optional[str] = None
    indication_name: Optional[str] = None
    
    # Evidence details
    rct_count: Optional[int] = 0
    rct_total_participants: Optional[int] = None
    meta_analyses_count: Optional[int] = 0
    systematic_reviews_count: Optional[int] = 0
    observational_studies_count: Optional[int] = 0
    
    # Effect and safety
    effect_size_magnitude: Optional[float] = None
    effect_size_95ci: Optional[dict] = None
    primary_outcome_measured: Optional[str] = None
    primary_outcome_effect: Optional[str] = None
    primary_outcome_magnitude: Optional[str] = None
    
    safety_evidence_level: Optional[int] = None
    safety_profile_assessment: Optional[str] = None
    adverse_events: Optional[List[dict]] = []
    adverse_event_frequency_percent: Optional[float] = None
    
    # Dosing
    typical_dose_min_mg: Optional[float] = None
    typical_dose_max_mg: Optional[float] = None
    typical_dose_frequency: Optional[str] = None
    dose_duration_weeks_min: Optional[int] = None
    dose_duration_weeks_max: Optional[int] = None
    
    # Interactions and contraindications
    herb_drug_interactions: Optional[List[dict]] = []
    contraindications: Optional[List[str]] = []
    precautions: Optional[List[str]] = []
    
    # Mechanisms
    proposed_mechanisms: Optional[List[dict]] = []
    biomarkers_affected: Optional[List[dict]] = []
    
    # Traditional context
    traditional_systems_using: Optional[List[str]] = []
    years_of_traditional_use: Optional[int] = None
    
    # Overall
    overall_recommendation: Optional[str] = None
    recommendation_for_use: Optional[str] = None
    
    # Sources
    primary_evidence_sources: Optional[List[dict]] = []
    
    # Metadata
    verification_status: Optional[str] = None
    last_reviewed_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============================================
# Evidence Item Schemas
# ============================================

class EvidenceItemBase(BaseModel):
    source_type: str
    title: str
    publication_year: Optional[int] = None


class EvidenceItemCreate(EvidenceItemBase):
    source_id: Optional[str] = None
    pmid: Optional[int] = None
    doi: Optional[str] = None
    journal_name: Optional[str] = None
    authors: Optional[List[dict]] = []
    abstract: Optional[str] = None
    study_design: Optional[str] = None
    sample_size_total: Optional[int] = None


class EvidenceItemResponse(EvidenceItemBase):
    id: int
    source_id: Optional[str] = None
    pmid: Optional[int] = None
    doi: Optional[str] = None
    journal_name: Optional[str] = None
    authors: Optional[List[dict]] = []
    abstract: Optional[str] = None
    study_design: Optional[str] = None
    sample_size_total: Optional[int] = None
    quality_score_jadad: Optional[int] = None
    risk_of_bias_category: Optional[str] = None
    citation_count: Optional[int] = None
    open_access: Optional[bool] = None
    
    class Config:
        from_attributes = True


# ============================================
# Safety Profile Schemas
# ============================================

class SafetyProfileSummary(BaseModel):
    id: int
    adverse_events: Optional[List[dict]] = []
    hepatotoxicity: Optional[bool] = False
    pregnancy_safety: Optional[str] = None
    absolute_contraindications: Optional[List[Any]] = []
    herb_drug_interactions: Optional[List[dict]] = []
    allergenic_potential: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============================================
# Search Schemas
# ============================================

class SearchQuery(BaseModel):
    q: str = Field(..., min_length=1, max_length=500)
    type: Optional[str] = "all"  # 'remedy', 'condition', 'all'
    evidence_level_min: Optional[int] = Field(default=1, ge=1, le=5)
    evidence_level_max: Optional[int] = Field(default=5, ge=1, le=5)
    safety_level: Optional[List[str]] = None  # ['well_tolerated', 'minor_side_effects']
    traditional_system: Optional[List[str]] = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)


class SearchResult(BaseModel):
    id: int
    type: str  # 'remedy', 'condition', or 'compound'
    name: str
    scientific_name: Optional[str] = None
    summary: Optional[str] = None
    evidence_level: Optional[int] = None
    evidence_certainty: Optional[str] = None
    safety_profile: Optional[str] = None
    indications: Optional[List[dict]] = []
    
    class Config:
        from_attributes = True


class SearchResponse(BaseModel):
    results: List[SearchResult]
    total_results: int
    page: int
    pages_total: int
    query: str


class SuggestionResponse(BaseModel):
    suggestions: List[str]
    query: str


# ============================================
# Interaction Check Schemas
# ============================================

class InteractionCheckRequest(BaseModel):
    remedies: List[int] = Field(..., description="List of remedy (organism) IDs")
    drugs: Optional[List[str]] = Field(default=[], description="List of drug names")


class Interaction(BaseModel):
    substance_1: str
    substance_2: str
    interaction_type: str  # 'herb_drug', 'herb_herb', 'food_herb'
    severity: str  # 'low', 'moderate', 'high', 'critical'
    mechanism: Optional[str] = None
    clinical_significance: Optional[str] = None
    advice: Optional[str] = None
    evidence_quality: Optional[str] = None


class InteractionCheckResponse(BaseModel):
    interactions_found: bool
    interaction_matrix: List[Interaction]
    critical_warnings: List[str]
    recommendations: str


# ============================================
# Ingestion Schemas
# ============================================

class PubMedSearchRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500)
    max_results: int = Field(default=20, ge=1, le=100)
    date_from: Optional[str] = None  # YYYY/MM/DD
    date_to: Optional[str] = None


class IngestionResult(BaseModel):
    query: str
    articles_found: int
    articles_ingested: int
    duplicates_skipped: int
    errors: List[str]


# Forward refs for nested models
OrganismDetail.model_rebuild()
