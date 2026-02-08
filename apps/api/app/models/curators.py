"""
Curator model - represents database curators and their credentials.
Manages permissions, expertise areas, and conflict of interest tracking.
"""

from typing import List, Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database.connection import Base



class Curator(Base):
    """
    Database curator/contributor entity.
    Manages access control and tracks contributions.
    """
    __tablename__ = "curators"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identity
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(255))
    password_hash = Column(String(255))  # bcrypt hash
    
    # Professional Info
    title = Column(String(100))  # 'Dr.', 'Prof.', etc.
    credentials = Column(JSON, default=list)  # ['MD', 'PhD', 'ND', 'LAc']
    institution = Column(String(255))
    department = Column(String(255))
    country = Column(String(100))
    orcid_id = Column(String(50))
    
    # Expertise Areas
    expertise_domains = Column(JSON, default=list)  # ['herbalism', 'TCM', 'pharmacology']
    specialty_organisms = Column(JSON, default=list)  # List of organism IDs they specialize in
    specialty_conditions = Column(JSON, default=list)  # List of indication IDs
    
    # Role & Permissions
    role = Column(String(50), default='contributor')  # 'admin', 'lead_curator', 'curator', 'contributor', 'researcher'
    permissions = Column(JSON, default=list)  # ['create', 'edit', 'review', 'publish', 'delete']
    can_publish = Column(Boolean, default=False)
    can_review = Column(Boolean, default=False)
    can_approve_final = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    verification_date = Column(DateTime)
    verified_by_id = Column(Integer, ForeignKey("curators.id"))

    
    # Activity Stats
    submissions_count = Column(Integer, default=0)
    reviews_count = Column(Integer, default=0)
    approvals_count = Column(Integer, default=0)
    last_activity_date = Column(DateTime)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_suspended = Column(Boolean, default=False)
    suspension_reason = Column(Text)
    suspension_date = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    conflicts_of_interest = relationship("ConflictOfInterest", back_populates="curator")
    submissions = relationship("Submission", back_populates="submitter", foreign_keys="Submission.submitter_id")
    reviews = relationship("ReviewRecord", back_populates="curator")


class ConflictOfInterest(Base):
    """
    Tracks conflicts of interest for curators.
    Ensures transparency and prevents biased curation.
    """
    __tablename__ = "conflicts_of_interest"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Curator
    curator_id = Column(Integer, ForeignKey("curators.id"), nullable=False, index=True)

    
    # COI Details
    coi_type = Column(String(50))  # 'financial', 'professional', 'personal', 'institutional'
    description = Column(Text, nullable=False)
    
    # Related Entities (what they have conflict with)
    related_organism_ids = Column(JSON, default=list)
    related_compound_ids = Column(JSON, default=list)
    related_company_names = Column(JSON, default=list)
    
    # Severity and Status
    severity = Column(String(50))  # 'low', 'moderate', 'high'
    disclosed_date = Column(DateTime(timezone=True), server_default=func.now())
    expiration_date = Column(DateTime)
    status = Column(String(50), default='active')  # 'active', 'expired', 'resolved'
    
    # Resolution
    resolution_notes = Column(Text)
    resolved_date = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    curator = relationship("Curator", back_populates="conflicts_of_interest")


class Submission(Base):
    """
    Tracks content submissions for editorial review.
    Part of the multi-stage curation workflow.
    """
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Submitter
    submitter_id = Column(Integer, ForeignKey("curators.id"), nullable=False, index=True)

    
    # Content
    entry_type = Column(String(50), nullable=False)  # 'organism', 'indication', 'remedy_indication', 'evidence_item', 'safety_profile'
    content = Column(JSON, nullable=False)  # The actual data being submitted
    supporting_documents = Column(JSON, default=list)  # URLs or file references
    
    # Status
    status = Column(String(50), default='submitted')
    # Statuses: 'draft', 'submitted', 'curator_review', 'curator_approved', 'revisions_requested',
    # 'final_review', 'published', 'rejected', 'archived'
    
    # Validation
    validation_status = Column(String(50))  # 'passed', 'failed', 'warnings'
    validation_errors = Column(JSON, default=list)
    
    # Assignment
    curator_assigned_id = Column(Integer, ForeignKey("curators.id"))
    lead_reviewer_id = Column(Integer, ForeignKey("curators.id"))

    
    # Publication
    published_id = Column(Integer)  # ID of the published entry
    published_date = Column(DateTime)
    publication_notes = Column(Text)
    
    # Priority
    priority = Column(Integer, default=3)  # 1-5 (1=highest)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    submitter = relationship("Curator", back_populates="submissions", foreign_keys=[submitter_id])
    reviews = relationship("ReviewRecord", back_populates="submission")


class ReviewRecord(Base):
    """
    Records of reviews performed on submissions.
    Maintains audit trail for editorial decisions.
    """
    __tablename__ = "review_records"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # References
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False, index=True)
    curator_id = Column(Integer, ForeignKey("curators.id"), nullable=False, index=True)

    
    # Review Details
    review_type = Column(String(50))  # 'initial', 'domain_expert', 'final'
    decision = Column(String(50))  # 'approved', 'revisions_requested', 'rejected'
    comments = Column(Text)
    
    # Specific Issues
    issues_found = Column(JSON, default=list)  # [{field: 'dosing', issue: 'unclear range'}]
    suggested_changes = Column(JSON, default=list)
    
    # Quality Checks
    evidence_verified = Column(Boolean, default=False)
    sources_checked = Column(Boolean, default=False)
    safety_data_verified = Column(Boolean, default=False)
    
    # Metadata
    review_date = Column(DateTime(timezone=True), server_default=func.now())
    time_spent_minutes = Column(Integer)
    
    # Relationships
    submission = relationship("Submission", back_populates="reviews")
    curator = relationship("Curator", back_populates="reviews")


class ResearchGap(Base):
    """
    Tracks identified gaps in research evidence.
    Helps prioritize future research needs.
    """
    __tablename__ = "research_gaps"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Gap Description
    title = Column(String(500), nullable=False)
    description = Column(Text)
    gap_type = Column(String(50))  # 'no_rcts', 'small_sample', 'short_duration', 'no_meta_analysis', 'safety_unknown'
    
    # Related Entities
    organism_ids = Column(JSON, default=list)
    compound_ids = Column(JSON, default=list)
    indication_ids = Column(JSON, default=list)
    
    # Current State
    current_evidence_level = Column(Integer, default=5)
    current_evidence_description = Column(Text)
    
    # Research Needs
    recommended_study_design = Column(String(100))  # 'RCT', 'cohort', 'meta_analysis'
    estimated_sample_size = Column(Integer)
    estimated_duration_months = Column(Integer)
    estimated_cost_usd = Column(Integer)
    
    # Priority
    priority = Column(Integer, default=3)  # 1-5 (1=highest)
    disease_burden_score = Column(Float)  # How impactful is the condition
    feasibility_score = Column(Float)  # How feasible is the research
    combined_priority_score = Column(Float)
    
    # Status
    active_trials_count = Column(Integer, default=0)
    funding_available = Column(Boolean, default=False)
    funding_sources = Column(JSON, default=list)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by_curator_id = Column(Integer, ForeignKey("curators.id"))
    last_reviewed_date = Column(DateTime)

