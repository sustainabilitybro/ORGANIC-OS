"""
Data Validation Pipeline Service.
Ensures data integrity and flags suspicious entries.
"""

from typing import Dict, Any, List, Tuple, Optional
from dataclasses import dataclass, field
from enum import Enum


class ValidationSeverity(Enum):
    """Severity levels for validation issues."""
    ERROR = "error"          # Must be fixed before submission
    WARNING = "warning"      # Should be reviewed
    INFO = "info"            # Informational notice


@dataclass
class ValidationResult:
    """Result of a validation check."""
    is_valid: bool
    errors: List[Dict[str, Any]] = field(default_factory=list)
    warnings: List[Dict[str, Any]] = field(default_factory=list)
    info: List[Dict[str, Any]] = field(default_factory=list)
    
    def add_error(self, field: str, message: str, code: str = None):
        self.errors.append({"field": field, "message": message, "code": code})
        self.is_valid = False
    
    def add_warning(self, field: str, message: str, code: str = None):
        self.warnings.append({"field": field, "message": message, "code": code})
    
    def add_info(self, field: str, message: str, code: str = None):
        self.info.append({"field": field, "message": message, "code": code})


class DataValidationService:
    """
    Comprehensive validation for all database entries.
    """
    
    # Required fields for each entity type
    REQUIRED_FIELDS = {
        "organism": ["common_name_en", "taxonomy_genus", "taxonomy_species", "organism_type"],
        "indication": ["condition_name", "disease_category"],
        "remedy_indication": ["organism_id", "indication_id", "evidence_level", "safety_evidence_level"],
        "evidence_item": ["source_type", "source_id", "title"],
        "safety_profile": ["organism_id"]
    }
    
    # Valid enum values
    VALID_ORGANISM_TYPES = ["plant", "fungus", "bacteria", "mineral", "animal_derived"]
    VALID_CONSERVATION_STATUS = ["LC", "NT", "VU", "EN", "CR", "EX", "NE", "DD"]
    VALID_EVIDENCE_LEVELS = [1, 2, 3, 4, 5]
    VALID_CERTAINTIES = ["high", "moderate", "low", "very_low"]
    VALID_SAFETY_PROFILES = ["well_tolerated", "minor_side_effects", "significant_concerns", "contraindicated"]
    VALID_ROLES = ["preventive", "symptomatic", "adjunctive", "potential_disease_modifying", "primary"]
    VALID_STUDY_DESIGNS = ["RCT", "meta_analysis", "systematic_review", "observational", "case_report", 
                          "in_vitro", "animal_study", "review", "clinical_trial", "unknown"]
    
    @classmethod
    def validate_organism(cls, data: Dict[str, Any]) -> ValidationResult:
        """Validate an organism (remedy) entry."""
        result = ValidationResult(is_valid=True)
        
        # Check required fields
        cls._check_required_fields(data, "organism", result)
        
        # Validate organism_type enum
        if data.get("organism_type") and data["organism_type"] not in cls.VALID_ORGANISM_TYPES:
            result.add_error("organism_type", 
                           f"Invalid organism type. Must be one of: {cls.VALID_ORGANISM_TYPES}",
                           "INVALID_ENUM")
        
        # Validate conservation status if provided
        if data.get("iucn_conservation_status"):
            if data["iucn_conservation_status"] not in cls.VALID_CONSERVATION_STATUS:
                result.add_warning("iucn_conservation_status",
                                 f"Unknown conservation status. Valid values: {cls.VALID_CONSERVATION_STATUS}",
                                 "UNKNOWN_STATUS")
        
        # Validate confidence score range
        if data.get("confidence_score") is not None:
            score = data["confidence_score"]
            if not 0.0 <= score <= 1.0:
                result.add_error("confidence_score", 
                               "Confidence score must be between 0.0 and 1.0",
                               "OUT_OF_RANGE")
        
        # Check for suspicious patterns
        if data.get("known_compounds"):
            compounds = data["known_compounds"]
            if len(compounds) > 50:
                result.add_warning("known_compounds",
                                 "Unusually high number of compounds listed (>50). Please verify.",
                                 "SUSPICIOUS_COUNT")
        
        # Validate taxonomy completeness
        if data.get("taxonomy_species") and not data.get("taxonomy_genus"):
            result.add_error("taxonomy_genus",
                           "Species cannot be specified without genus",
                           "MISSING_DEPENDENCY")
        
        return result
    
    @classmethod
    def validate_indication(cls, data: Dict[str, Any]) -> ValidationResult:
        """Validate an indication (condition) entry."""
        result = ValidationResult(is_valid=True)
        
        # Check required fields
        cls._check_required_fields(data, "indication", result)
        
        # Validate prevalence values
        if data.get("prevalence_per_100k_global") is not None:
            prev = data["prevalence_per_100k_global"]
            if prev < 0:
                result.add_error("prevalence_per_100k_global",
                               "Prevalence cannot be negative",
                               "NEGATIVE_VALUE")
            if prev > 100000:
                result.add_warning("prevalence_per_100k_global",
                                 "Prevalence >100,000 per 100k seems unusually high",
                                 "SUSPICIOUS_VALUE")
        
        # Validate mortality rate
        if data.get("mortality_rate_percent") is not None:
            rate = data["mortality_rate_percent"]
            if not 0 <= rate <= 100:
                result.add_error("mortality_rate_percent",
                               "Mortality rate must be between 0 and 100 percent",
                               "OUT_OF_RANGE")
        
        return result
    
    @classmethod
    def validate_remedy_indication(cls, data: Dict[str, Any]) -> ValidationResult:
        """Validate a remedy-indication relationship entry."""
        result = ValidationResult(is_valid=True)
        
        # Check required fields
        cls._check_required_fields(data, "remedy_indication", result)
        
        # Validate evidence level
        if data.get("evidence_level") is not None:
            level = data["evidence_level"]
            if level not in cls.VALID_EVIDENCE_LEVELS:
                result.add_error("evidence_level",
                               f"Evidence level must be 1-5. Got: {level}",
                               "INVALID_RANGE")
        
        # Validate safety evidence level
        if data.get("safety_evidence_level") is not None:
            level = data["safety_evidence_level"]
            if level not in cls.VALID_EVIDENCE_LEVELS:
                result.add_error("safety_evidence_level",
                               f"Safety evidence level must be 1-5. Got: {level}",
                               "INVALID_RANGE")
        
        # Validate evidence certainty
        if data.get("evidence_certainty"):
            if data["evidence_certainty"] not in cls.VALID_CERTAINTIES:
                result.add_warning("evidence_certainty",
                                 f"Unknown certainty value. Expected: {cls.VALID_CERTAINTIES}",
                                 "UNKNOWN_VALUE")
        
        # Validate dosing
        dose_min = data.get("typical_dose_min_mg")
        dose_max = data.get("typical_dose_max_mg")
        if dose_min is not None and dose_max is not None:
            if dose_min > dose_max:
                result.add_error("typical_dose_min_mg",
                               "Minimum dose cannot be greater than maximum dose",
                               "LOGIC_ERROR")
            if dose_min < 0 or dose_max < 0:
                result.add_error("typical_dose_min_mg",
                               "Dose values cannot be negative",
                               "NEGATIVE_VALUE")
        
        # Check for suspicious patterns
        cls._check_evidence_consistency(data, result)
        
        # Validate effect size
        if data.get("effect_size_magnitude") is not None:
            effect = data["effect_size_magnitude"]
            if not -3.0 <= effect <= 5.0:
                result.add_warning("effect_size_magnitude",
                                 f"Effect size {effect} is outside typical range (-1 to +3)",
                                 "UNUSUAL_VALUE")
        
        # Validate adverse event frequency
        if data.get("adverse_event_frequency_percent") is not None:
            freq = data["adverse_event_frequency_percent"]
            if not 0 <= freq <= 100:
                result.add_error("adverse_event_frequency_percent",
                               "Adverse event frequency must be 0-100%",
                               "OUT_OF_RANGE")
        
        return result
    
    @classmethod
    def validate_evidence_item(cls, data: Dict[str, Any]) -> ValidationResult:
        """Validate an evidence item entry."""
        result = ValidationResult(is_valid=True)
        
        # Check required fields
        cls._check_required_fields(data, "evidence_item", result)
        
        # Validate PMID format if provided
        if data.get("pmid"):
            pmid = data["pmid"]
            if not isinstance(pmid, int) or pmid <= 0:
                result.add_error("pmid", "PMID must be a positive integer", "INVALID_FORMAT")
        
        # Validate study design
        if data.get("study_design"):
            if data["study_design"] not in cls.VALID_STUDY_DESIGNS:
                result.add_warning("study_design",
                                 f"Unknown study design. Expected: {cls.VALID_STUDY_DESIGNS}",
                                 "UNKNOWN_VALUE")
        
        # Validate Jadad score for RCTs
        if data.get("quality_score_jadad") is not None:
            score = data["quality_score_jadad"]
            if not 0 <= score <= 5:
                result.add_error("quality_score_jadad",
                               "Jadad score must be 0-5",
                               "OUT_OF_RANGE")
        
        # Validate sample sizes
        total = data.get("sample_size_total", 0) or 0
        intervention = data.get("sample_size_intervention", 0) or 0
        control = data.get("sample_size_control", 0) or 0
        
        if intervention + control > 0 and total > 0:
            if intervention + control != total:
                result.add_warning("sample_size_total",
                                 "Intervention + control doesn't equal total sample size",
                                 "INCONSISTENCY")
        
        # Validate publication year
        if data.get("publication_year"):
            year = data["publication_year"]
            if year < 1800 or year > 2030:
                result.add_warning("publication_year",
                                 f"Publication year {year} seems unusual",
                                 "UNUSUAL_VALUE")
        
        # Validate p-value
        if data.get("primary_outcome_p_value") is not None:
            p = data["primary_outcome_p_value"]
            if not 0 <= p <= 1:
                result.add_error("primary_outcome_p_value",
                               "P-value must be between 0 and 1",
                               "OUT_OF_RANGE")
        
        return result
    
    @classmethod
    def validate_safety_profile(cls, data: Dict[str, Any]) -> ValidationResult:
        """Validate a safety profile entry."""
        result = ValidationResult(is_valid=True)
        
        # Check required fields
        cls._check_required_fields(data, "safety_profile", result)
        
        # Validate LD50 values
        if data.get("acute_toxicity_ld50") is not None:
            ld50 = data["acute_toxicity_ld50"]
            if ld50 <= 0:
                result.add_error("acute_toxicity_ld50",
                               "LD50 must be a positive value",
                               "INVALID_VALUE")
        
        # Validate allergenic potential
        valid_allergenic = ["none", "low", "moderate", "high"]
        if data.get("allergenic_potential"):
            if data["allergenic_potential"] not in valid_allergenic:
                result.add_warning("allergenic_potential",
                                 f"Unknown allergenic potential. Expected: {valid_allergenic}",
                                 "UNKNOWN_VALUE")
        
        # Check for orphan safety data
        if not data.get("adverse_events") and not data.get("absolute_contraindications"):
            result.add_info("adverse_events",
                          "No adverse events or contraindications listed. Consider adding safety data.",
                          "MISSING_DATA")
        
        return result
    
    @classmethod
    def _check_required_fields(cls, data: Dict[str, Any], entity_type: str, result: ValidationResult):
        """Check that all required fields are present."""
        required = cls.REQUIRED_FIELDS.get(entity_type, [])
        for field in required:
            if field not in data or data[field] is None:
                result.add_error(field, f"Required field '{field}' is missing", "REQUIRED_FIELD")
    
    @classmethod
    def _check_evidence_consistency(cls, data: Dict[str, Any], result: ValidationResult):
        """Check for internal consistency in evidence claims."""
        evidence_level = data.get("evidence_level", 5)
        rct_count = data.get("rct_count", 0) or 0
        rct_total = data.get("rct_total_participants", 0) or 0
        meta_count = data.get("meta_analyses_count", 0) or 0
        
        # High evidence level but few studies
        if evidence_level == 1:
            if rct_count < 2 and meta_count < 1:
                result.add_warning("evidence_level",
                                 "Level 1 evidence claimed but <2 RCTs and no meta-analyses",
                                 "SUSPICIOUS_CLAIM")
            if rct_total < 200 and meta_count < 1:
                result.add_warning("evidence_level",
                                 "Level 1 evidence claimed but total participants <200",
                                 "SUSPICIOUS_CLAIM")
        
        # Level 2 consistency
        if evidence_level == 2:
            if rct_count < 1:
                result.add_warning("evidence_level",
                                 "Level 2 evidence claimed but no RCTs documented",
                                 "SUSPICIOUS_CLAIM")
        
        # Low evidence level but many studies
        if evidence_level >= 4 and (rct_count >= 3 or meta_count >= 1):
            result.add_warning("evidence_level",
                             "Low evidence level claimed but multiple RCTs/meta-analyses exist",
                             "POSSIBLE_UNDERRATING")
    
    @classmethod
    def check_for_duplicates(cls, data: Dict[str, Any], entity_type: str, 
                            existing_entries: List[Dict]) -> List[Dict[str, Any]]:
        """
        Check for potential duplicate entries.
        
        Returns list of potential duplicates with similarity scores.
        """
        duplicates = []
        
        if entity_type == "organism":
            for existing in existing_entries:
                similarity = cls._calculate_organism_similarity(data, existing)
                if similarity > 0.8:
                    duplicates.append({
                        "existing_id": existing.get("id"),
                        "similarity_score": similarity,
                        "matching_fields": cls._get_matching_fields(data, existing),
                        "suggestion": "Consider merging or updating existing entry"
                    })
        
        elif entity_type == "remedy_indication":
            for existing in existing_entries:
                if (data.get("organism_id") == existing.get("organism_id") and
                    data.get("indication_id") == existing.get("indication_id") and
                    data.get("preparation_method") == existing.get("preparation_method")):
                    duplicates.append({
                        "existing_id": existing.get("id"),
                        "similarity_score": 0.95,
                        "suggestion": "Exact match found. Update existing entry instead."
                    })
        
        return duplicates
    
    @classmethod
    def _calculate_organism_similarity(cls, new: Dict, existing: Dict) -> float:
        """Calculate similarity score between two organism entries."""
        score = 0.0
        checks = 0
        
        # Scientific name match (high weight)
        if (new.get("taxonomy_genus") == existing.get("taxonomy_genus") and
            new.get("taxonomy_species") == existing.get("taxonomy_species")):
            score += 0.5
        checks += 1
        
        # Common name match
        if new.get("common_name_en", "").lower() == existing.get("common_name_en", "").lower():
            score += 0.3
        checks += 1
        
        # Type match
        if new.get("organism_type") == existing.get("organism_type"):
            score += 0.1
        checks += 1
        
        # Family match  
        if new.get("taxonomy_family") == existing.get("taxonomy_family"):
            score += 0.1
        checks += 1
        
        return score
    
    @classmethod
    def _get_matching_fields(cls, new: Dict, existing: Dict) -> List[str]:
        """Get list of fields that match between two entries."""
        matching = []
        for key in new:
            if key in existing and new[key] == existing[key]:
                matching.append(key)
        return matching


# Convenience function
def validate_entry(data: Dict[str, Any], entity_type: str) -> ValidationResult:
    """
    Validate any database entry.
    
    Args:
        data: The entry data to validate
        entity_type: Type of entry ('organism', 'indication', 'remedy_indication', etc.)
    
    Returns:
        ValidationResult with errors, warnings, and info
    """
    validators = {
        "organism": DataValidationService.validate_organism,
        "indication": DataValidationService.validate_indication,
        "remedy_indication": DataValidationService.validate_remedy_indication,
        "evidence_item": DataValidationService.validate_evidence_item,
        "safety_profile": DataValidationService.validate_safety_profile
    }
    
    validator = validators.get(entity_type)
    if not validator:
        result = ValidationResult(is_valid=False)
        result.add_error("entity_type", f"Unknown entity type: {entity_type}", "UNKNOWN_TYPE")
        return result
    
    return validator(data)
