"""
Indication model - represents diseases/conditions that remedies may help with.
"""

from typing import List
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database.connection import Base


class Indication(Base):
    """
    Disease/condition entity.
    Maps to the 'indications' table from the spec.
    """
    __tablename__ = "indications"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identification
    condition_name = Column(String(500), nullable=False, index=True)
    alternative_names = Column(JSON, default=list)
    
    # Standardized Codes
    icd_11_code = Column(String(20))
    snomed_ct_code = Column(String(20))
    mesh_code = Column(String(20))
    orphanet_code = Column(String(50))  # For rare diseases
    dsm_5_code = Column(String(20))
    
    # Classification
    disease_category = Column(String(100))  # 'infectious', 'metabolic', 'autoimmune', etc.
    disease_subcategory = Column(String(100))
    body_system = Column(JSON, default=list)  # ['digestive', 'cardiovascular', 'endocrine']
    severity_spectrum = Column(String(100))  # 'mild', 'moderate', 'severe', 'critical'
    
    # Epidemiology
    prevalence_per_100k_global = Column(Float)
    prevalence_per_100k_regional = Column(JSON)  # {region: count}
    incidence_per_100k_global = Column(Float)
    mortality_rate_percent = Column(Float)
    quality_of_life_impact = Column(String(50))  # 'minimal', 'moderate', 'severe'
    
    # Clinical Description
    typical_age_of_onset = Column(String(100))
    primary_symptoms = Column(JSON, default=list)
    secondary_symptoms = Column(JSON, default=list)
    complications = Column(JSON, default=list)
    diagnostic_criteria = Column(Text)
    
    # Conventional Treatment
    standard_of_care_primary = Column(String(500))
    standard_of_care_secondary = Column(JSON, default=list)
    treatment_response_rate_percent = Column(Float)
    side_effect_profile = Column(JSON)
    remission_rate_percent = Column(Float)
    
    # Modifiable Risk Factors
    dietary_factors = Column(JSON, default=list)
    lifestyle_factors = Column(JSON, default=list)
    environmental_factors = Column(JSON, default=list)
    preventable = Column(Boolean)
    
    # Description
    description = Column(Text)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    verification_status = Column(String(50), default='pending')
    confidence_score = Column(Float, default=0.5)
    last_updated_evidence_date = Column(DateTime)
    
    # Relationships
    remedy_indications = relationship("RemedyIndication", back_populates="indication")
