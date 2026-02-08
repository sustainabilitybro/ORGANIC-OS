"""
User profile and health tracking models for Naturopath OS.
Enables personalized health dashboards and treatment tracking.
"""

from typing import List, Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON, ForeignKey, Date, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from ..database.connection import Base


class Gender(enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class UserProfile(Base):
    """
    User profile for personalized health recommendations.
    """
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication (can integrate with external auth)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    
    # Personal Info
    display_name = Column(String(255))
    date_of_birth = Column(Date)
    gender = Column(String(50))
    height_cm = Column(Float)
    weight_kg = Column(Float)
    
    # Health Profile
    blood_type = Column(String(10))
    known_allergies = Column(JSON, default=list)  # ['penicillin', 'shellfish']
    dietary_restrictions = Column(JSON, default=list)  # ['vegetarian', 'gluten_free']
    current_medications = Column(JSON, default=list)  # [{name, dosage, frequency}]
    
    # Conditions
    diagnosed_conditions = Column(JSON, default=list)  # [{condition_id, diagnosis_date, severity}]
    family_history = Column(JSON, default=list)  # [{condition, relation}]
    
    # Lifestyle
    activity_level = Column(String(50))  # 'sedentary', 'light', 'moderate', 'active', 'very_active'
    sleep_quality = Column(String(50))  # 'poor', 'fair', 'good', 'excellent'
    stress_level = Column(String(50))  # 'low', 'moderate', 'high', 'very_high'
    smoking_status = Column(String(50))  # 'never', 'former', 'current'
    alcohol_consumption = Column(String(50))  # 'none', 'occasional', 'moderate', 'heavy'
    
    # Preferences
    preferred_remedy_types = Column(JSON, default=list)  # ['herbal', 'supplement', 'essential_oil']
    avoided_remedies = Column(JSON, default=list)
    preferred_preparation_methods = Column(JSON, default=list)  # ['tea', 'capsule', 'tincture']
    
    # Traditional Medicine Preferences
    traditional_system_preferences = Column(JSON, default=list)  # ['Ayurveda', 'TCM', 'Western Herbalism']
    
    # Settings
    evidence_level_threshold = Column(Integer, default=3)  # Only show remedies with this level or better
    show_traditional_only = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    
    # Relationships
    treatment_logs = relationship("TreatmentLog", back_populates="user")
    symptom_entries = relationship("SymptomEntry", back_populates="user")
    saved_protocols = relationship("SavedProtocol", back_populates="user")


class SymptomEntry(Base):
    """
    User-reported symptom entries for the symptom checker and tracking.
    """
    __tablename__ = "symptom_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False, index=True)
    
    # Symptom Details
    symptom_name = Column(String(255), nullable=False, index=True)
    symptom_category = Column(String(100))  # 'physical', 'mental', 'emotional', 'neurological'
    body_area = Column(String(100))  # 'head', 'chest', 'abdomen', 'limbs', 'general'
    
    # Severity and Duration
    severity = Column(Integer)  # 1-10 scale
    duration_hours = Column(Float)
    frequency = Column(String(100))  # 'constant', 'intermittent', 'occasional'
    onset_type = Column(String(50))  # 'sudden', 'gradual'
    
    # Context
    triggers = Column(JSON, default=list)  # ['after eating', 'morning', 'stress']
    relieving_factors = Column(JSON, default=list)
    associated_symptoms = Column(JSON, default=list)
    
    # Notes
    notes = Column(Text)
    
    # Timestamp
    logged_at = Column(DateTime(timezone=True), server_default=func.now())
    symptom_datetime = Column(DateTime(timezone=True))  # When symptom occurred
    
    # Relationships
    user = relationship("UserProfile", back_populates="symptom_entries")


class TreatmentLog(Base):
    """
    Track user's remedy usage and effectiveness.
    """
    __tablename__ = "treatment_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False, index=True)
    
    # Remedy Reference
    organism_id = Column(Integer, ForeignKey("organisms.id"), nullable=True)
    remedy_indication_id = Column(Integer, ForeignKey("remedy_indications.id"), nullable=True)
    
    # Custom Remedy (if not in database)
    custom_remedy_name = Column(String(255))
    
    # Dosage Details
    dose_amount = Column(Float)
    dose_unit = Column(String(50))  # 'mg', 'ml', 'drops', 'capsules', 'cups'
    preparation_method = Column(String(100))  # 'tea', 'tincture', 'capsule', 'topical'
    brand = Column(String(255))
    
    # Timing
    taken_at = Column(DateTime(timezone=True), server_default=func.now())
    frequency = Column(String(100))  # 'once', 'twice_daily', 'three_times_daily'
    duration_days = Column(Integer)
    
    # Target Condition
    target_condition = Column(String(255))
    target_symptoms = Column(JSON, default=list)
    
    # Effectiveness Tracking
    effectiveness_rating = Column(Integer)  # 1-10 scale
    symptom_improvement_percent = Column(Float)
    time_to_notice_effect_hours = Column(Float)
    
    # Side Effects
    side_effects_experienced = Column(JSON, default=list)  # [{effect, severity}]
    adverse_reaction = Column(Boolean, default=False)
    
    # Notes
    notes = Column(Text)
    would_recommend = Column(Boolean)
    will_continue_using = Column(Boolean)
    
    # Verification
    verified_purchase = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("UserProfile", back_populates="treatment_logs")


class TreatmentProtocol(Base):
    """
    Pre-defined treatment protocols for specific conditions.
    Generated from the comprehensive healing guide.
    """
    __tablename__ = "treatment_protocols"

    id = Column(Integer, primary_key=True, index=True)
    
    # Protocol Identity
    protocol_name = Column(String(500), nullable=False, index=True)
    protocol_type = Column(String(100))  # 'primary', 'adjunctive', 'preventive', 'acute', 'chronic'
    
    # Target Condition
    indication_id = Column(Integer, ForeignKey("indications.id"), nullable=True)
    target_condition_name = Column(String(500))  # Fallback if no indication_id
    condition_severity = Column(String(50))  # 'mild', 'moderate', 'severe'
    
    # Protocol Details
    description = Column(Text)
    rationale = Column(Text)
    expected_outcomes = Column(JSON, default=list)
    
    # Remedy Components
    primary_remedies = Column(JSON, default=list)  # [{organism_id, dose, frequency, duration}]
    secondary_remedies = Column(JSON, default=list)
    supportive_remedies = Column(JSON, default=list)
    
    # Timing and Duration
    protocol_duration_weeks = Column(Integer)
    phases = Column(JSON, default=list)  # [{phase_name, duration_weeks, remedies}]
    
    # Lifestyle Components
    dietary_recommendations = Column(JSON, default=list)
    lifestyle_modifications = Column(JSON, default=list)
    exercise_recommendations = Column(JSON, default=list)
    sleep_recommendations = Column(JSON, default=list)
    stress_management = Column(JSON, default=list)
    
    # Evidence and Safety
    overall_evidence_level = Column(Integer)
    safety_considerations = Column(JSON, default=list)
    contraindications = Column(JSON, default=list)
    drug_interactions_to_check = Column(JSON, default=list)
    
    # Monitoring
    monitoring_markers = Column(JSON, default=list)  # [{marker, frequency, target_range}]
    progress_milestones = Column(JSON, default=list)
    warning_signs = Column(JSON, default=list)
    
    # Population
    suitable_populations = Column(JSON, default=list)  # ['adults', 'elderly', 'pregnant']
    excluded_populations = Column(JSON, default=list)
    
    # Source
    source_document = Column(String(500))  # Reference to guide section
    traditional_basis = Column(JSON, default=list)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    verification_status = Column(String(50), default='pending')


class SavedProtocol(Base):
    """
    User's saved/customized treatment protocols.
    """
    __tablename__ = "saved_protocols"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False, index=True)
    protocol_id = Column(Integer, ForeignKey("treatment_protocols.id"), nullable=True)
    
    # Custom Details
    custom_name = Column(String(255))
    customizations = Column(JSON, default=dict)  # User modifications to base protocol
    
    # Status
    status = Column(String(50))  # 'active', 'paused', 'completed', 'discontinued'
    start_date = Column(Date)
    end_date = Column(Date)
    
    # Progress
    current_phase = Column(Integer, default=1)
    progress_percent = Column(Float, default=0)
    
    # Notes
    notes = Column(Text)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("UserProfile", back_populates="saved_protocols")


class SymptomConditionMapping(Base):
    """
    Maps symptoms to potential conditions for the symptom checker.
    """
    __tablename__ = "symptom_condition_mappings"

    id = Column(Integer, primary_key=True, index=True)
    
    # Symptom
    symptom_name = Column(String(255), nullable=False, index=True)
    symptom_description = Column(Text)
    symptom_category = Column(String(100))
    
    # Condition
    indication_id = Column(Integer, ForeignKey("indications.id"), nullable=True)
    condition_name = Column(String(500), index=True)
    
    # Relationship Strength
    association_strength = Column(String(50))  # 'strong', 'moderate', 'weak'
    is_primary_symptom = Column(Boolean, default=False)
    is_diagnostic_criterion = Column(Boolean, default=False)
    
    # Differential
    percentage_of_cases = Column(Float)  # % of condition cases showing this symptom
    red_flag = Column(Boolean, default=False)  # Indicates need for medical attention
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
