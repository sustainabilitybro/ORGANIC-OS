"""
Evidence model - represents individual research sources (papers, trials, etc.)
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON, BigInteger
from sqlalchemy.sql import func

from ..database.connection import Base


class EvidenceItem(Base):
    """
    Individual evidence item (publication, trial, monograph, etc.)
    Maps to the 'evidence_items' table from the spec.
    """
    __tablename__ = "evidence_items"

    id = Column(Integer, primary_key=True, index=True)
    
    # Source Identification
    source_type = Column(String(50))  # 'pubmed_article', 'clinical_trial', 'monograph', 'case_report', 'traditional_text'
    source_id = Column(String(255), unique=True)  # PMID, DOI, Trial ID, etc.
    
    # Article Metadata
    title = Column(Text)
    authors = Column(JSON, default=list)  # [{name, affiliation, country}, ...]
    publication_year = Column(Integer)
    journal_name = Column(String(500))
    doi = Column(String(100))
    pmid = Column(BigInteger, index=True)
    issn = Column(String(20))
    volume = Column(String(10))
    issue = Column(String(10))
    pages = Column(String(20))
    url_primary = Column(Text)
    url_pdf = Column(Text)
    
    # Content
    abstract = Column(Text)
    full_text = Column(Text)
    study_design = Column(String(100))  # 'RCT', 'quasi_experimental', 'observational', 'meta_analysis'
    
    # Study Details
    sample_size_total = Column(Integer)
    sample_size_intervention = Column(Integer)
    sample_size_control = Column(Integer)
    intervention_group_details = Column(JSON)
    control_group_details = Column(JSON)
    study_duration_weeks = Column(Integer)
    follow_up_weeks = Column(Integer)
    
    # Participants
    age_min = Column(Integer)
    age_max = Column(Integer)
    sex_distribution = Column(JSON)  # {male_percent, female_percent}
    ethnicity = Column(JSON)
    comorbidities = Column(JSON)
    inclusion_criteria = Column(Text)
    exclusion_criteria = Column(Text)
    
    # Results
    primary_outcome_measured = Column(String(500))
    primary_outcome_effect_size = Column(Float)
    primary_outcome_p_value = Column(Float)
    primary_outcome_confidence_interval = Column(JSON)
    secondary_outcomes = Column(JSON, default=list)
    
    # Safety
    safety_reported = Column(Boolean, default=False)
    adverse_events_count = Column(Integer)
    serious_adverse_events_count = Column(Integer)
    dropout_rate_percent = Column(Float)
    
    # Quality Assessment
    quality_score_jadad = Column(Integer)  # 0-5 for RCTs
    quality_score_rob = Column(Float)  # Risk of Bias
    risk_of_bias_category = Column(String(50))  # 'low', 'some_concerns', 'high'
    blinding_type = Column(String(100))  # 'single_blind', 'double_blind', 'open_label'
    randomization_described = Column(Boolean)
    
    # Funding
    funding_source = Column(String(500))
    funding_source_type = Column(String(50))  # 'government', 'nonprofit', 'industry', 'mixed'
    conflict_of_interest_statement = Column(Text)
    author_industry_ties = Column(Boolean)
    potential_bias_assessment = Column(String(100))
    
    # Relevance
    remedies_studied = Column(JSON, default=list)  # [{organism_id, compound_id, preparation}, ...]
    indications_studied = Column(JSON, default=list)  # [indication_ids]
    mechanisms_explored = Column(JSON, default=list)
    
    # Citation Impact
    citation_count = Column(Integer, default=0)
    highly_cited = Column(Boolean, default=False)
    
    # Fact-Checking
    fact_check_status = Column(String(50), default='not_checked')
    fact_check_notes = Column(Text)
    
    # Accessibility
    original_language = Column(String(20), default='en')
    is_translated = Column(Boolean, default=False)
    translation_language = Column(String(20))
    open_access = Column(Boolean)
    full_text_available = Column(Boolean, default=False)
    
    # NLP Extraction
    extracted_data = Column(JSON)  # Structured extraction
    extracted_by_nlp = Column(Boolean, default=False)
    extracted_by_human_date = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    added_to_db_date = Column(DateTime)
    last_updated = Column(DateTime)
    
    # Status
    is_published = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
