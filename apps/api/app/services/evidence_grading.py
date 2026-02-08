"""
Evidence Grading Service - Automated calculation of evidence levels and certainty.
Implements the grading algorithm from the system specification.
"""

from typing import Dict, Any, Optional, Tuple, List
from dataclasses import dataclass
from enum import Enum


class EvidenceLevel(Enum):
    """Evidence level classifications (1=highest, 5=lowest)"""
    STRONG = 1      # Multiple large RCTs or meta-analyses with consistent positive findings
    GOOD = 2        # Large RCT or multiple moderate RCTs with positive findings
    MODERATE = 3    # Smaller RCTs, quasi-experimental, or observational studies
    LIMITED = 4     # Case reports, expert opinion, or limited observational data
    TRADITIONAL = 5 # Traditional use only, in vitro/animal studies, theoretical basis


class EvidenceCertainty(Enum):
    """Certainty of evidence assessment"""
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"
    VERY_LOW = "very_low"


@dataclass
class EvidenceMetrics:
    """Container for evidence metrics used in grading."""
    rct_count: int = 0
    rct_total_participants: int = 0
    rct_avg_sample_size: int = 0
    meta_analyses_count: int = 0
    systematic_reviews_count: int = 0
    observational_studies_count: int = 0
    case_reports_count: int = 0
    animal_studies_count: int = 0
    in_vitro_studies_count: int = 0
    heterogeneity_i_squared: Optional[float] = None
    average_risk_of_bias: str = "unknown"  # 'low', 'some_concerns', 'high', 'unknown'
    publication_bias_risk: str = "unknown"  # 'low', 'moderate', 'high'
    effect_size_95ci_lower: Optional[float] = None
    effect_size_95ci_upper: Optional[float] = None


class EvidenceGradingService:
    """
    Automatically calculates evidence level (1-5) and certainty based on available research data.
    
    Grading Logic:
    Level 1: Multiple large RCTs OR meta-analysis with consistent results
    Level 2: Large RCT OR multiple moderate RCTs
    Level 3: Smaller RCTs OR quasi-experimental OR good observational
    Level 4: Case reports OR weak observational OR limited animal data
    Level 5: Traditional use only OR theoretical/preclinical
    """
    
    # Thresholds for evidence grading
    LARGE_RCT_THRESHOLD = 200  # Total participants for "large" RCT
    MODERATE_RCT_THRESHOLD = 100  # Total participants for "moderate" RCT
    MULTIPLE_RCT_COUNT = 3  # Minimum for "multiple" RCTs
    LOW_HETEROGENEITY = 50  # I² threshold for low heterogeneity
    HIGH_HETEROGENEITY = 75  # I² threshold for high heterogeneity
    
    @classmethod
    def calculate_evidence_level(cls, metrics: EvidenceMetrics) -> Tuple[int, str]:
        """
        Calculate evidence level and certainty from metrics.
        
        Args:
            metrics: EvidenceMetrics object with study counts and quality data
            
        Returns:
            Tuple of (evidence_level: int 1-5, certainty: str)
        """
        scores = []
        
        # Check meta-analyses (strongest evidence when well-done)
        if metrics.meta_analyses_count >= 1:
            if metrics.heterogeneity_i_squared is not None:
                if metrics.heterogeneity_i_squared < cls.LOW_HETEROGENEITY:
                    scores.append(1)  # Low heterogeneity = strong
                else:
                    scores.append(2)  # Higher heterogeneity = good but not strong
            else:
                scores.append(2)  # No heterogeneity data = assume some uncertainty
        
        # Check RCT evidence
        if metrics.rct_count >= cls.MULTIPLE_RCT_COUNT and metrics.rct_total_participants >= 300:
            scores.append(1)  # Multiple large RCTs
        elif metrics.rct_count >= 1 and metrics.rct_total_participants >= cls.LARGE_RCT_THRESHOLD:
            scores.append(2)  # Large RCT(s)
        elif metrics.rct_count >= 2 and metrics.rct_total_participants >= cls.MODERATE_RCT_THRESHOLD:
            scores.append(2)  # Multiple moderate RCTs
        elif metrics.rct_count >= 1:
            scores.append(3)  # Small RCT(s)
        
        # Check systematic reviews
        if metrics.systematic_reviews_count >= 1:
            if not scores:
                scores.append(2)
            else:
                # SR adds credibility but doesn't override RCT evidence
                pass
        
        # Check observational studies
        if metrics.observational_studies_count >= 5:
            scores.append(3)  # Multiple observational
        elif metrics.observational_studies_count > 0:
            scores.append(4)  # Limited observational
        
        # Check case reports
        if metrics.case_reports_count >= 10:
            scores.append(4)  # Multiple case reports
        elif metrics.case_reports_count > 0:
            scores.append(5)  # Limited case reports
        
        # Check animal/in vitro studies (lowest level)
        if not scores:
            if metrics.animal_studies_count > 0 or metrics.in_vitro_studies_count > 0:
                scores.append(5)
        
        # Default if no evidence found
        if not scores:
            scores.append(5)
        
        # Take the best (lowest) score
        evidence_level = min(scores)
        
        # Calculate certainty
        certainty = cls._calculate_certainty(metrics, evidence_level)
        
        return evidence_level, certainty
    
    @classmethod
    def _calculate_certainty(cls, metrics: EvidenceMetrics, evidence_level: int) -> str:
        """
        Calculate certainty based on level and additional quality factors.
        Uses GRADE-like approach.
        """
        # Base score from evidence level
        level_scores = {
            1: 0.85,
            2: 0.70,
            3: 0.50,
            4: 0.30,
            5: 0.15
        }
        certainty_score = level_scores.get(evidence_level, 0.15)
        
        # Upgrade/downgrade factors
        
        # Risk of bias adjustment
        if metrics.average_risk_of_bias == 'low':
            certainty_score += 0.10
        elif metrics.average_risk_of_bias == 'high':
            certainty_score -= 0.15
        
        # Publication bias adjustment
        if metrics.publication_bias_risk == 'high':
            certainty_score -= 0.10
        
        # Effect size precision (narrower CI = more precise)
        if metrics.effect_size_95ci_lower is not None and metrics.effect_size_95ci_upper is not None:
            ci_width = metrics.effect_size_95ci_upper - metrics.effect_size_95ci_lower
            if ci_width < 0.2:
                certainty_score += 0.05  # Narrow CI
            elif ci_width > 1.0:
                certainty_score -= 0.10  # Wide CI
        
        # Heterogeneity adjustment (for meta-analyses)
        if metrics.heterogeneity_i_squared is not None:
            if metrics.heterogeneity_i_squared > cls.HIGH_HETEROGENEITY:
                certainty_score -= 0.15  # Very high heterogeneity
            elif metrics.heterogeneity_i_squared > cls.LOW_HETEROGENEITY:
                certainty_score -= 0.05  # Moderate heterogeneity
        
        # Large effect size could upgrade
        # (would need effect size data to implement)
        
        # Clamp to valid range
        certainty_score = max(0.0, min(1.0, certainty_score))
        
        # Convert score to category
        if certainty_score >= 0.75:
            return EvidenceCertainty.HIGH.value
        elif certainty_score >= 0.50:
            return EvidenceCertainty.MODERATE.value
        elif certainty_score >= 0.25:
            return EvidenceCertainty.LOW.value
        else:
            return EvidenceCertainty.VERY_LOW.value
    
    @classmethod
    def get_evidence_level_description(cls, level: int) -> str:
        """Get human-readable description of evidence level."""
        descriptions = {
            1: "Strong Evidence: Multiple large RCTs or meta-analyses with consistent positive findings",
            2: "Good Evidence: Large RCT or multiple moderate RCTs with positive findings",
            3: "Moderate Evidence: Smaller RCTs, quasi-experimental, or observational studies",
            4: "Limited Evidence: Case reports, expert opinion, or limited observational data",
            5: "Traditional Use: Traditional use only, in vitro/animal studies, theoretical basis"
        }
        return descriptions.get(level, "Unknown")
    
    @classmethod
    def calculate_safety_evidence_level(cls, 
                                        adverse_event_data_sources: int = 0,
                                        long_term_studies_count: int = 0,
                                        post_marketing_data: bool = False,
                                        toxicology_studies: int = 0) -> int:
        """
        Calculate safety evidence level (1-5 scale).
        
        Level 1: Extensive safety data from multiple large trials + post-marketing
        Level 2: Good safety data from trials + toxicology
        Level 3: Moderate safety data from smaller trials
        Level 4: Limited safety data, mostly from case reports
        Level 5: Minimal/no safety data beyond traditional use
        """
        if adverse_event_data_sources >= 10 and long_term_studies_count >= 2 and post_marketing_data:
            return 1
        elif adverse_event_data_sources >= 5 and toxicology_studies >= 2:
            return 2
        elif adverse_event_data_sources >= 3:
            return 3
        elif adverse_event_data_sources >= 1:
            return 4
        else:
            return 5
    
    @classmethod
    def suggest_research_priority(cls, 
                                  current_evidence_level: int,
                                  disease_prevalence: float,
                                  treatment_gap: bool,
                                  traditional_use_years: int,
                                  safety_profile: str) -> Dict[str, Any]:
        """
        Suggest research priority based on evidence gaps and potential impact.
        
        Returns:
            Dictionary with priority (1-5), rationale, and recommended study design
        """
        priority_score = 0
        rationale = []
        
        # Higher evidence gaps = higher priority
        if current_evidence_level >= 4:
            priority_score += 2
            rationale.append("Evidence gap: only case reports/traditional use available")
        elif current_evidence_level == 3:
            priority_score += 1
            rationale.append("Moderate evidence: larger trials needed")
        
        # Higher disease prevalence = higher priority
        if disease_prevalence >= 5000:  # per 100k
            priority_score += 2
            rationale.append("High disease burden justifies research investment")
        elif disease_prevalence >= 1000:
            priority_score += 1
            rationale.append("Moderate disease prevalence")
        
        # Treatment gap = higher priority
        if treatment_gap:
            priority_score += 2
            rationale.append("Limited treatment alternatives available")
        
        # Long traditional use = higher priority (proven track record)
        if traditional_use_years >= 1000:
            priority_score += 1
            rationale.append("Extensive traditional use history supports feasibility")
        
        # Good safety profile = higher priority (feasible to study)
        if safety_profile == "well_tolerated":
            priority_score += 1
            rationale.append("Good safety profile reduces trial risk")
        
        # Convert to 1-5 scale (inverted, 1=highest)
        if priority_score >= 7:
            priority = 1
        elif priority_score >= 5:
            priority = 2
        elif priority_score >= 3:
            priority = 3
        elif priority_score >= 1:
            priority = 4
        else:
            priority = 5
        
        # Recommend study design
        if current_evidence_level >= 4:
            recommended_design = "Pilot RCT (n=50-100)"
        elif current_evidence_level == 3:
            recommended_design = "Definitive RCT (n=150-300)"
        elif current_evidence_level == 2:
            recommended_design = "Meta-analysis of existing RCTs"
        else:
            recommended_design = "Long-term follow-up study"
        
        return {
            "priority": priority,
            "priority_score_raw": priority_score,
            "rationale": rationale,
            "recommended_study_design": recommended_design
        }


# Utility function for easy access
def grade_evidence(
    rct_count: int = 0,
    rct_total_participants: int = 0,
    meta_analyses_count: int = 0,
    systematic_reviews_count: int = 0,
    observational_studies_count: int = 0,
    case_reports_count: int = 0,
    animal_studies_count: int = 0,
    in_vitro_studies_count: int = 0,
    heterogeneity_i_squared: Optional[float] = None,
    average_risk_of_bias: str = "unknown",
    publication_bias_risk: str = "unknown"
) -> Tuple[int, str]:
    """
    Convenience function to grade evidence from raw metrics.
    
    Returns:
        Tuple of (evidence_level: int 1-5, certainty: str)
    """
    metrics = EvidenceMetrics(
        rct_count=rct_count,
        rct_total_participants=rct_total_participants,
        meta_analyses_count=meta_analyses_count,
        systematic_reviews_count=systematic_reviews_count,
        observational_studies_count=observational_studies_count,
        case_reports_count=case_reports_count,
        animal_studies_count=animal_studies_count,
        in_vitro_studies_count=in_vitro_studies_count,
        heterogeneity_i_squared=heterogeneity_i_squared,
        average_risk_of_bias=average_risk_of_bias,
        publication_bias_risk=publication_bias_risk
    )
    
    return EvidenceGradingService.calculate_evidence_level(metrics)
