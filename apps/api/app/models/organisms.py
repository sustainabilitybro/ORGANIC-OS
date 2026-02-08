"""
Organism model - represents natural substances (plants, fungi, minerals, etc.)
"""

from typing import List, Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database.connection import Base


class Organism(Base):
    """
    Core entity representing a natural remedy organism.
    Maps to the 'organisms' table from the spec.
    """
    __tablename__ = "organisms"

    id = Column(Integer, primary_key=True, index=True)
    
    # Taxonomy
    taxonomy_kingdom = Column(String(255))
    taxonomy_phylum = Column(String(255))
    taxonomy_class = Column(String(255))
    taxonomy_order = Column(String(255))
    taxonomy_family = Column(String(255))
    taxonomy_genus = Column(String(255))
    taxonomy_species = Column(String(255))
    taxonomy_subspecies = Column(String(255))
    botanical_author = Column(String(255))
    
    # Common Names (multi-language support)
    common_name_en = Column(String(500), index=True)
    common_name_es = Column(String(500))
    common_name_zh = Column(String(500))
    common_name_ja = Column(String(500))
    
    # Synonyms stored as JSON array
    synonyms = Column(JSON, default=list)
    
    # Classification
    organism_type = Column(String(50))  # 'plant', 'fungus', 'bacteria', 'mineral', 'animal_derived'
    organism_subtype = Column(String(100))  # 'mushroom', 'lichen', 'root', 'leaf', 'fruit', etc.
    
    # Ecological Info
    iucn_conservation_status = Column(String(50))  # 'LC', 'NT', 'VU', 'EN', 'CR', 'EX'
    habitat_primary = Column(String(500))
    geographic_distribution = Column(JSON)  # {regions: [], countries: []}
    cultivation_status = Column(String(50))  # 'wild_only', 'cultivated', 'both'
    threatened_status = Column(Boolean, default=False)
    
    # Chemical Profile
    known_compounds = Column(JSON, default=list)  # [{name, concentration_range, source}, ...]
    bioactive_compound_count = Column(Integer, default=0)
    
    # Traditional Systems
    traditional_systems = Column(JSON, default=list)  # ['TCM', 'Ayurveda', 'Western Herbalism']
    tcm_name = Column(String(255))
    tcm_meridians = Column(JSON)
    ayurvedic_name = Column(String(255))
    ayurvedic_dosha = Column(JSON)
    
    # Preparation Methods
    traditional_preparations = Column(JSON, default=list)
    modern_preparations = Column(JSON, default=list)
    
    # Sourcing & Sustainability
    primary_source_region = Column(String(255))
    wild_vs_cultivated_ratio = Column(String(50))
    sustainability_notes = Column(Text)
    
    # Description
    description = Column(Text)
    parts_used = Column(JSON, default=list)  # ['root', 'leaf', 'flower', 'rhizome']
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_verified_date = Column(DateTime)
    verification_status = Column(String(50), default='pending')  # 'pending', 'verified', 'flagged'
    confidence_score = Column(Float, default=0.5)  # 0.0 to 1.0
    
    # Audit
    is_deleted = Column(Boolean, default=False)
    deletion_reason = Column(String(500))
    
    # Relationships
    remedy_indications = relationship("RemedyIndication", back_populates="organism")
    safety_profiles = relationship("SafetyProfile", back_populates="organism")
    
    def get_scientific_name(self) -> str:
        """Returns full scientific binomial name."""
        parts = []
        if self.taxonomy_genus:
            parts.append(str(self.taxonomy_genus))
        if self.taxonomy_species:
            parts.append(str(self.taxonomy_species))
        if self.taxonomy_subspecies:
            parts.append(f"subsp. {self.taxonomy_subspecies}")
        return " ".join(parts)
    
    def get_all_names(self) -> List[str]:
        """Returns all known names for search indexing."""
        names: List[str] = []
        for name in [self.common_name_en, self.common_name_es, 
                     self.common_name_zh, self.common_name_ja]:
            if name:
                names.append(str(name))
        names.append(self.get_scientific_name())
        if isinstance(self.synonyms, list):
            names.extend(self.synonyms)
        return [n for n in names if n]
