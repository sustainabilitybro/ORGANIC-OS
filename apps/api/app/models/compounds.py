"""
Compound model - represents bioactive substances found in organisms.
"""

from typing import List, Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON
from sqlalchemy.sql import func

from ..database.connection import Base


class Compound(Base):
    """
    Bioactive compound entity.
    Maps to the 'compounds' table from the spec.
    """
    __tablename__ = "compounds"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identity
    iupac_name = Column(String(500))
    common_name = Column(String(255), index=True)
    synonyms = Column(JSON, default=list)
    cas_number = Column(String(50), unique=True)
    pubchem_cid = Column(Integer)
    chembl_id = Column(String(50))
    description = Column(Text)
    
    # Structure
    molecular_formula = Column(String(100))
    molecular_weight = Column(Float)
    canonical_smiles = Column(String(1000))
    inchi_key = Column(String(255))
    
    # Classification
    compound_class = Column(String(100))  # 'alkaloid', 'flavonoid', 'terpenoid', etc.
    compound_subclass = Column(String(100))
    
    # Pharmacology
    mechanism_of_action = Column(JSON)  # [{target, pathway, effect}, ...]
    known_targets = Column(JSON)  # [{protein, ic50_nm, source_pmid}, ...]
    bioavailability_percent = Column(Float)
    half_life_hours = Column(Float)
    protein_binding_percent = Column(Float)
    metabolism_pathway = Column(String(500))
    
    # Safety
    ld50_mg_kg = Column(Float)
    ld50_species = Column(String(50))
    mutagenicity = Column(Boolean)
    carcinogenicity = Column(Boolean)
    reproductive_toxicity = Column(Boolean)
    
    # Sources
    source_organisms = Column(JSON, default=list)  # Array of organism IDs
    concentration_in_organisms = Column(JSON)  # {organism_id: '2-8%', ...}
    
    # Evidence counts
    human_trials_count = Column(Integer, default=0)
    animal_studies_count = Column(Integer, default=0)
    in_vitro_studies_count = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    verification_status = Column(String(50), default='pending')
    confidence_score = Column(Float, default=0.5)
