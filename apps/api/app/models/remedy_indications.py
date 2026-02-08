"""
RemedyIndication model - the core relationship connecting remedies to conditions.
This is the heart of the database with evidence grading.
"""

from typing import Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database.connection import Base


class RemedyIndication(Base):
    """
    Evidence-graded connection between a remedy (organism) and indication (condition).
    This is the core relationship table.
    """
    __tablename__ = "remedy_indications"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    organism_id = Column(Integer, ForeignKey("organisms.id"), nullable=True, index=True)
    compound_id = Column(Integer, ForeignKey("compounds.id"), nullable=True)  # Optional - for whole-plant vs specific compound
    indication_id = Column(Integer, ForeignKey("indications.id"), nullable=False, index=True)
    
    # Remedy Identity
    preparation_method = Column(String(100))  # 'decoction', 'tincture', 'standardized_extract', etc.
    standardization_level = Column(String(100))  # 'unstandardized', 'lightly_standardized', 'highly_standardized'
    compound_specification = Column(JSON)  # {main_compound: 'curcumin', min_percent: 95}
    
    # Role and Context
    remedy_role = Column(String(50))  # 'preventive', 'symptomatic', 'adjunctive', 'potential_disease_modifying'
    clinical_context = Column(String(500))  # "Adjunctive to conventional IBD medications"
    population_specificity = Column(JSON)  # {ages: ['adult'], comorbidities: ['no_liver_disease']}
    
    # EVIDENCE GRADING (CRITICAL)
    # 1: Multiple large RCTs or meta-analyses with consistent positive findings
    # 2: Large RCT or multiple moderate RCTs with positive findings  
    # 3: Smaller RCTs, quasi-experimental, or observational studies
    # 4: Case reports, expert opinion, or limited observational data
    # 5: Traditional use only, in vitro/animal studies, theoretical basis
    evidence_level = Column(Integer, default=5, index=True)
    evidence_certainty = Column(String(50))  # 'high', 'moderate', 'low', 'very_low'
    
    # Detailed Evidence Counts
    rct_count = Column(Integer, default=0)
    rct_total_participants = Column(Integer)
    rct_avg_sample_size = Column(Integer)
    meta_analyses_count = Column(Integer, default=0)
    systematic_reviews_count = Column(Integer, default=0)
    observational_studies_count = Column(Integer, default=0)
    case_reports_count = Column(Integer, default=0)
    animal_studies_count = Column(Integer, default=0)
    in_vitro_studies_count = Column(Integer, default=0)
    
    # Effect Size
    effect_size_type = Column(String(50))  # 'cohen_d', 'odds_ratio', 'mean_difference'
    effect_size_magnitude = Column(Float)
    effect_size_95ci = Column(JSON)  # {lower: 0.45, upper: 0.89}
    heterogeneity_i_squared = Column(Float)  # For meta-analyses
    publication_bias_risk = Column(String(50))  # 'low', 'moderate', 'high'
    
    # Primary Evidence Summary
    primary_outcome_measured = Column(String(500))
    primary_outcome_effect = Column(String(50))  # 'significantly_improved', 'moderately_improved', 'no_change'
    primary_outcome_magnitude = Column(String(100))  # "42% reduction in symptoms (95% CI: 28-56%)"
    secondary_outcomes = Column(JSON, default=list)
    
    # Safety Evidence
    safety_evidence_level = Column(Integer, default=5)
    adverse_event_frequency_percent = Column(Float)
    serious_adverse_events_documented = Column(Boolean, default=False)
    safety_profile_assessment = Column(String(100))  # 'well_tolerated', 'minor_side_effects', 'significant_concerns'
    adverse_events = Column(JSON, default=list)  # [{event, frequency, severity}, ...]
    
    # Interactions
    herb_drug_interactions = Column(JSON, default=list)
    herb_herb_interactions = Column(JSON, default=list)
    food_interactions = Column(JSON, default=list)
    pharmacokinetics = Column(JSON, default=dict)
    
    # Dosing
    typical_dose_min_mg = Column(Float)
    typical_dose_max_mg = Column(Float)
    typical_dose_frequency = Column(String(100))  # "twice daily"
    dose_duration_weeks_min = Column(Integer)
    dose_duration_weeks_max = Column(Integer)
    dose_frequency_basis = Column(String(100))  # 'clinical_trials', 'traditional_use', 'pharmacokinetics'
    
    # Contraindications
    contraindications = Column(JSON, default=list)  # ['pregnancy', 'liver_disease']
    precautions = Column(JSON, default=list)
    population_cautions = Column(JSON)  # {pediatric: 'safety_data_limited', elderly: '...'}
    
    # Mechanisms
    proposed_mechanisms = Column(JSON, default=list)  # [{mechanism, confidence, source_count}, ...]
    biomarkers_affected = Column(JSON, default=list)  # [{biomarker, direction, effect_size}, ...]
    
    # Timeline
    typical_onset_weeks = Column(Integer)
    expected_improvement_magnitude = Column(String(100))
    long_term_data_available = Column(Boolean, default=False)
    long_term_safety_years = Column(Integer)
    
    # Research Quality and Gaps
    study_quality_issues = Column(JSON, default=list)
    research_gaps = Column(JSON, default=list)
    research_priority = Column(Integer)  # 1-5 scale (1=high priority)
    active_clinical_trials = Column(Integer, default=0)
    
    # Cost and Accessibility
    environmental_sustainability_score = Column(Float)  # 0-1 scale
    cost_per_month_usd = Column(Float)
    accessibility_score = Column(Float)  # 0-1 (how easy to obtain?)
    supply_security_assessment = Column(String(100))  # 'secure', 'moderate_risk', 'high_risk'
    
    # Integration
    integration_level = Column(String(50))  # 'replacement', 'adjunctive', 'preventive', 'research_phase'
    evidence_for_combination_therapy = Column(Boolean, default=False)
    
    # Traditional Context
    traditional_systems_using = Column(JSON, default=list)  # ['TCM', 'Ayurveda']
    traditional_application_context = Column(String(500))
    traditional_evidence_strength = Column(String(50))  # 'strong_consensus', 'moderate', 'weak'
    years_of_traditional_use = Column(Integer)
    
    # Overall Rating
    overall_recommendation = Column(String(100))  # 'strongly_supported', 'moderately_supported', 'weak_evidence', etc.
    recommendation_for_use = Column(String(100))  # 'first_line', 'second_line', 'adjunctive', 'experimental'
    curation_confidence_score = Column(Float)  # 0-1
    
    # Source Materials
    primary_evidence_sources = Column(JSON, default=list)  # [{pmid, title, year, evidence_level}, ...]
    monograph_sources = Column(JSON, default=list)
    traditional_source_citations = Column(JSON, default=list)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_reviewed_date = Column(DateTime)
    next_review_due_date = Column(DateTime)
    review_frequency_months = Column(Integer, default=12)
    
    # Status
    verification_status = Column(String(50), default='pending')
    dispute_notes = Column(Text)
    is_published = Column(Boolean, default=False)
    
    # Versioning
    version_number = Column(Integer, default=1)
    change_log = Column(JSON, default=list)
    
    # Audit
    is_deleted = Column(Boolean, default=False)
    
    # Relationships
    organism = relationship("Organism", back_populates="remedy_indications")
    indication = relationship("Indication", back_populates="remedy_indications")
