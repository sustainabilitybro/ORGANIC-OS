"""
SafetyProfile model - comprehensive safety data for organisms and compounds.
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database.connection import Base


class SafetyProfile(Base):
    """
    Comprehensive safety data for an organism or compound.
    Maps to the 'safety_profiles' table from the spec.
    """
    __tablename__ = "safety_profiles"

    id = Column(Integer, primary_key=True, index=True)
    
    # Entity
    organism_id = Column(Integer, ForeignKey("organisms.id"), index=True)
    compound_id = Column(Integer, ForeignKey("compounds.id"))
    remedy_indication_id = Column(Integer, ForeignKey("remedy_indications.id"))
    
    # Adverse Events
    adverse_events = Column(JSON, default=list)  # [{event, frequency, severity, onset_hours}, ...]
    serious_adverse_events = Column(JSON, default=list)
    adverse_event_onset_pattern = Column(String(100))  # 'immediate', 'delayed', 'dose_dependent'
    
    # Toxicity Data
    acute_toxicity_ld50 = Column(Float)
    acute_toxicity_species = Column(String(50))
    chronic_toxicity_noael_mg_kg = Column(Float)  # No Observed Adverse Effect Level
    chronic_toxicity_duration_weeks = Column(Integer)
    
    # Organ Toxicity
    hepatotoxicity = Column(Boolean, default=False)
    hepatotoxicity_severity = Column(String(50))
    hepatotoxicity_mechanism = Column(String(500))
    hepatotoxicity_reversibility = Column(Boolean)
    
    nephrotoxicity = Column(Boolean, default=False)
    nephrotoxicity_severity = Column(String(50))
    
    neurotoxicity = Column(Boolean, default=False)
    genotoxicity = Column(Boolean, default=False)
    mutagenicity = Column(Boolean, default=False)
    carcinogenicity = Column(Boolean, default=False)
    reproductive_toxicity = Column(Boolean, default=False)
    developmental_toxicity = Column(Boolean, default=False)
    
    # Specific Populations
    pediatric_safety = Column(String(500))
    geriatric_safety = Column(String(500))
    pregnancy_safety = Column(String(500))
    pregnancy_category = Column(String(10))  # FDA categories or similar
    lactation_safety = Column(String(500))
    
    # Contraindications
    absolute_contraindications = Column(JSON, default=list)
    relative_contraindications = Column(JSON, default=list)
    
    # Drug Interactions
    herb_drug_interactions = Column(JSON, default=list)  # [{drug_name, mechanism, severity, evidence}, ...]
    
    # Allergy
    allergenic_potential = Column(String(50))  # 'none', 'low', 'moderate', 'high'
    known_allergens = Column(JSON, default=list)
    cross_reactivity = Column(JSON, default=list)
    
    # Long-term Safety
    long_term_safety_weeks = Column(Integer)
    long_term_safety_data = Column(JSON)
    cumulative_toxicity_risk = Column(Boolean, default=False)
    
    # Quality/Contamination
    contamination_risks = Column(JSON, default=list)
    adulteration_risks = Column(JSON, default=list)
    batch_testing_recommendation = Column(Boolean, default=False)
    
    # Monitoring
    baseline_testing_recommended = Column(JSON, default=list)
    periodic_monitoring_recommended = Column(JSON, default=list)
    monitoring_frequency_weeks = Column(Integer)
    
    # Data Quality
    evidence_source_count = Column(Integer, default=0)
    highest_quality_evidence_level = Column(Integer, default=5)
    data_confidence_score = Column(Float, default=0.5)
    last_updated = Column(DateTime)
    
    # Status
    verification_status = Column(String(50), default='pending')
    is_published = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    organism = relationship("Organism", back_populates="safety_profiles")
