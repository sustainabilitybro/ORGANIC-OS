"""
Clinical Protocol Generator Service.
Generates personalized treatment protocols for healthcare professionals.
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class PatientProfile:
    """Patient information for protocol generation."""
    age: int
    sex: str  # 'M', 'F', 'Other'
    conditions: List[int]  # Indication IDs
    current_medications: List[str]
    allergies: List[str] = field(default_factory=list)
    liver_function: str = "normal"  # 'normal', 'mild_impairment', 'moderate_impairment', 'severe_impairment'
    kidney_function: str = "normal"
    is_pregnant: bool = False
    is_lactating: bool = False
    comorbidities: List[str] = field(default_factory=list)


@dataclass
class ProtocolPhase:
    """A single phase of a treatment protocol."""
    phase_number: int
    duration: str  # e.g., "weeks 1-4"
    goals: List[str]
    interventions: List[Dict[str, Any]]
    monitoring: List[str]
    adjustments: List[str] = field(default_factory=list)


@dataclass
class RemedyRecommendation:
    """A remedy recommendation within a protocol."""
    remedy_id: int
    remedy_name: str
    preparation: str
    dose: str
    frequency: str
    duration: str
    rationale: str
    evidence_level: int
    monitoring: List[str]
    drug_interactions: List[Dict[str, Any]]
    adverse_events_to_watch: List[str]
    contraindication_check: str  # 'safe', 'caution', 'contraindicated'


@dataclass 
class IntegratedProtocol:
    """Complete integrated treatment protocol."""
    patient_profile: Dict[str, Any]
    phases: List[ProtocolPhase]
    remedy_recommendations: List[RemedyRecommendation]
    dietary_recommendations: List[str]
    lifestyle_recommendations: List[str]
    monitoring_plan: Dict[str, Any]
    red_flags: List[str]
    expected_outcomes: Dict[str, Any]
    references: List[Dict[str, Any]]
    generated_at: datetime = field(default_factory=datetime.now)
    disclaimer: str = "This protocol is for educational purposes only. Consult with a qualified healthcare provider before making any treatment decisions."


class ClinicalProtocolGenerator:
    """
    Generates personalized clinical protocols based on patient profile and available evidence.
    """
    
    # Medication classes that commonly interact with herbs
    HIGH_RISK_MEDICATIONS = {
        "warfarin": ["anticoagulant", "blood_thinner"],
        "coumadin": ["anticoagulant", "blood_thinner"],
        "heparin": ["anticoagulant"],
        "methotrexate": ["immunosuppressant", "DMARD"],
        "cyclosporine": ["immunosuppressant"],
        "lithium": ["psychiatric"],
        "digoxin": ["cardiac"],
        "theophylline": ["respiratory"],
        "phenytoin": ["anticonvulsant"],
        "carbamazepine": ["anticonvulsant"],
    }
    
    # Conditions requiring special caution
    HIGH_RISK_CONDITIONS = [
        "liver_disease", "kidney_disease", "bleeding_disorder",
        "organ_transplant", "autoimmune_on_biologics"
    ]
    
    def __init__(self, db_session):
        """Initialize with database session for remedy lookups."""
        self.db = db_session
    
    async def generate_protocol(self, patient: PatientProfile) -> IntegratedProtocol:
        """
        Generate a personalized integrated protocol for a patient.
        
        Args:
            patient: PatientProfile with conditions, medications, etc.
            
        Returns:
            IntegratedProtocol with phased recommendations
        """
        # 1. Get remedy options for patient's conditions
        remedy_options = await self._get_remedy_options(patient.conditions)
        
        # 2. Filter based on safety profile
        safe_remedies = self._filter_for_safety(remedy_options, patient)
        
        # 3. Check drug interactions
        interaction_checked = self._check_all_interactions(safe_remedies, patient.current_medications)
        
        # 4. Rank and select best options
        selected_remedies = self._rank_and_select(interaction_checked, max_remedies=5)
        
        # 5. Build phased protocol
        phases = self._build_phases(selected_remedies, patient)
        
        # 6. Generate recommendations
        recommendations = self._generate_recommendations(selected_remedies, patient)
        
        # 7. Create monitoring plan
        monitoring = self._create_monitoring_plan(selected_remedies, patient)
        
        # 8. Compile dietary and lifestyle recommendations
        dietary = self._get_dietary_recommendations(patient.conditions)
        lifestyle = self._get_lifestyle_recommendations(patient.conditions)
        
        # 9. Define red flags
        red_flags = self._identify_red_flags(selected_remedies, patient)
        
        # 10. Set expected outcomes
        outcomes = self._define_expected_outcomes(selected_remedies, patient)
        
        # 11. Gather references
        references = self._gather_references(selected_remedies)
        
        return IntegratedProtocol(
            patient_profile={
                "age": patient.age,
                "conditions": patient.conditions,
                "medications": patient.current_medications
            },
            phases=phases,
            remedy_recommendations=recommendations,
            dietary_recommendations=dietary,
            lifestyle_recommendations=lifestyle,
            monitoring_plan=monitoring,
            red_flags=red_flags,
            expected_outcomes=outcomes,
            references=references
        )
    
    async def _get_remedy_options(self, condition_ids: List[int]) -> List[Dict[str, Any]]:
        """Fetch all remedy options for given conditions."""
        # This would query the database
        # For now, return structure
        return []
    
    def _filter_for_safety(self, remedies: List[Dict], patient: PatientProfile) -> List[Dict]:
        """Filter remedies based on patient safety profile."""
        safe_remedies = []
        
        for remedy in remedies:
            # Check pregnancy/lactation
            if patient.is_pregnant:
                if remedy.get("pregnancy_safe") == False:
                    continue
            
            if patient.is_lactating:
                if remedy.get("lactation_safe") == False:
                    continue
            
            # Check organ function
            if patient.liver_function != "normal":
                if remedy.get("hepatotoxicity") == True:
                    continue
            
            if patient.kidney_function != "normal":
                if remedy.get("nephrotoxicity") == True:
                    continue
            
            # Check contraindications
            contraindications = remedy.get("absolute_contraindications", [])
            if any(c in patient.comorbidities for c in contraindications):
                continue
            
            safe_remedies.append(remedy)
        
        return safe_remedies
    
    def _check_all_interactions(self, remedies: List[Dict], medications: List[str]) -> List[Dict]:
        """Check all remedies against current medications."""
        checked = []
        
        for remedy in remedies:
            interactions = []
            remedy_interactions = remedy.get("herb_drug_interactions", [])
            
            for med in medications:
                med_lower = med.lower()
                for interaction in remedy_interactions:
                    drug_name = interaction.get("drug", "").lower()
                    if med_lower in drug_name or drug_name in med_lower:
                        interactions.append({
                            "medication": med,
                            "severity": interaction.get("severity", "unknown"),
                            "mechanism": interaction.get("mechanism"),
                            "advice": interaction.get("advice")
                        })
            
            remedy["detected_interactions"] = interactions
            remedy["interaction_severity"] = self._max_interaction_severity(interactions)
            checked.append(remedy)
        
        return checked
    
    def _max_interaction_severity(self, interactions: List[Dict]) -> str:
        """Get the maximum severity from a list of interactions."""
        severities = {"critical": 4, "high": 3, "moderate": 2, "low": 1, "unknown": 0}
        max_sev = 0
        max_label = "none"
        
        for interaction in interactions:
            sev = severities.get(interaction.get("severity", "unknown"), 0)
            if sev > max_sev:
                max_sev = sev
                max_label = interaction.get("severity")
        
        return max_label
    
    def _rank_and_select(self, remedies: List[Dict], max_remedies: int = 5) -> List[Dict]:
        """Rank remedies by evidence and safety, select top options."""
        def score_remedy(r):
            # Lower evidence level = better (1 is best)
            evidence_score = 6 - r.get("evidence_level", 5)
            
            # Safety adjustment
            safety_score = 0
            if r.get("interaction_severity") == "none":
                safety_score = 2
            elif r.get("interaction_severity") == "low":
                safety_score = 1
            elif r.get("interaction_severity") in ["high", "critical"]:
                safety_score = -3
            
            # Effect size bonus
            effect_bonus = min(r.get("effect_size_magnitude", 0), 1)
            
            return evidence_score + safety_score + effect_bonus
        
        sorted_remedies = sorted(remedies, key=score_remedy, reverse=True)
        return sorted_remedies[:max_remedies]
    
    def _build_phases(self, remedies: List[Dict], patient: PatientProfile) -> List[ProtocolPhase]:
        """Build phased treatment protocol."""
        phases = []
        
        # Phase 1: Foundation (weeks 1-4)
        phases.append(ProtocolPhase(
            phase_number=1,
            duration="weeks 1-4",
            goals=["Establish dietary foundation", "Begin lifestyle modifications", "Baseline testing"],
            interventions=[
                {"type": "dietary", "recommendation": "Implement anti-inflammatory diet pattern"},
                {"type": "lifestyle", "recommendation": "Establish regular sleep schedule"},
                {"type": "assessment", "recommendation": "Complete baseline labs and symptom tracking"}
            ],
            monitoring=["Track symptoms daily", "Record sleep quality", "Note energy levels"]
        ))
        
        # Phase 2: Intervention (weeks 4-12)
        remedy_interventions = []
        for remedy in remedies[:3]:  # Top 3 remedies
            remedy_interventions.append({
                "type": "herbal",
                "remedy": remedy.get("remedy_name"),
                "dose": f"{remedy.get('typical_dose_min_mg', 0)}-{remedy.get('typical_dose_max_mg', 0)}mg",
                "frequency": remedy.get("typical_dose_frequency", "as directed"),
                "rationale": f"Evidence level {remedy.get('evidence_level', 5)} for this condition"
            })
        
        phases.append(ProtocolPhase(
            phase_number=2,
            duration="weeks 4-12",
            goals=["Initiate herbal interventions", "Monitor for response", "Assess tolerability"],
            interventions=remedy_interventions,
            monitoring=[
                "Symptom reassessment at weeks 4 and 8",
                "Monitor for adverse events",
                "Check relevant labs if indicated"
            ],
            adjustments=[
                "If improvement: Continue current regimen",
                "If no improvement: Evaluate adherence; consider dose adjustment",
                "If adverse events: Reduce dose or discontinue"
            ]
        ))
        
        # Phase 3: Optimization (weeks 12+)
        phases.append(ProtocolPhase(
            phase_number=3,
            duration="weeks 12+",
            goals=["Optimize responders", "Long-term management", "Preventive focus"],
            interventions=[
                {"type": "assessment", "recommendation": "Comprehensive reassessment of all symptoms"},
                {"type": "optimization", "recommendation": "Adjust dosing for maintenance"},
                {"type": "prevention", "recommendation": "Focus on preventive measures"}
            ],
            monitoring=["Quarterly symptom assessment", "Annual comprehensive review"],
            adjustments=[
                "Consider cycling or rotating herbs to prevent tolerance",
                "Reassess need for each intervention",
                "Plan for tapering if appropriate"
            ]
        ))
        
        return phases
    
    def _generate_recommendations(self, remedies: List[Dict], patient: PatientProfile) -> List[RemedyRecommendation]:
        """Generate detailed recommendations for each remedy."""
        recommendations = []
        
        for remedy in remedies:
            # Determine contraindication status
            if remedy.get("interaction_severity") in ["high", "critical"]:
                contraindication_check = "caution"
            elif remedy.get("interaction_severity") == "moderate":
                contraindication_check = "caution"
            else:
                contraindication_check = "safe"
            
            recommendations.append(RemedyRecommendation(
                remedy_id=remedy.get("id", 0),
                remedy_name=remedy.get("remedy_name", "Unknown"),
                preparation=remedy.get("preparation_method", "standardized extract"),
                dose=f"{remedy.get('typical_dose_min_mg', 0)}-{remedy.get('typical_dose_max_mg', 0)}mg daily",
                frequency=remedy.get("typical_dose_frequency", "divided doses"),
                duration=f"{remedy.get('dose_duration_weeks_min', 4)}-{remedy.get('dose_duration_weeks_max', 12)} weeks",
                rationale=f"Evidence level {remedy.get('evidence_level', 5)}; {remedy.get('primary_outcome_magnitude', 'moderate improvement expected')}",
                evidence_level=remedy.get("evidence_level", 5),
                monitoring=remedy.get("monitoring_recommendations", []),
                drug_interactions=remedy.get("detected_interactions", []),
                adverse_events_to_watch=remedy.get("adverse_events", []),
                contraindication_check=contraindication_check
            ))
        
        return recommendations
    
    def _create_monitoring_plan(self, remedies: List[Dict], patient: PatientProfile) -> Dict[str, Any]:
        """Create comprehensive monitoring plan."""
        baseline_tests = set()
        periodic_tests = set()
        
        for remedy in remedies:
            baseline = remedy.get("baseline_testing_recommended", [])
            periodic = remedy.get("periodic_monitoring_recommended", [])
            baseline_tests.update(baseline)
            periodic_tests.update(periodic)
        
        # Add standard monitoring based on patient profile
        if patient.liver_function != "normal":
            baseline_tests.add("liver_function_panel")
            periodic_tests.add("liver_function_panel")
        
        if any(med.lower() in self.HIGH_RISK_MEDICATIONS for med in patient.current_medications):
            baseline_tests.add("drug_levels_if_applicable")
        
        return {
            "baseline_testing": list(baseline_tests) or ["symptom_baseline", "quality_of_life_assessment"],
            "periodic_monitoring": list(periodic_tests) or ["symptom_tracking"],
            "monitoring_frequency": "every 4 weeks during initial phase, then every 8-12 weeks",
            "patient_self_monitoring": [
                "Daily symptom diary",
                "Note any new symptoms or side effects",
                "Track energy, sleep, and mood"
            ],
            "when_to_seek_care": [
                "Severe or unexpected side effects",
                "Symptoms worsening despite treatment",
                "New symptoms develop"
            ]
        }
    
    def _get_dietary_recommendations(self, condition_ids: List[int]) -> List[str]:
        """Get dietary recommendations based on conditions."""
        # Generic anti-inflammatory diet recommendations
        return [
            "Emphasize whole foods: vegetables, fruits, lean proteins, healthy fats",
            "Reduce inflammatory foods: refined carbohydrates, added sugars, processed foods",
            "Include omega-3 rich foods: fatty fish, walnuts, flaxseed",
            "Consider Mediterranean-style dietary pattern",
            "Stay well hydrated with water and herbal teas",
            "Limit alcohol consumption"
        ]
    
    def _get_lifestyle_recommendations(self, condition_ids: List[int]) -> List[str]:
        """Get lifestyle recommendations based on conditions."""
        return [
            "Regular physical activity: 150 minutes moderate activity per week",
            "Stress management: meditation, deep breathing, or yoga",
            "Sleep optimization: 7-9 hours, consistent schedule",
            "Social connection and support",
            "Mindful practices for emotional well-being",
            "Nature exposure when possible"
        ]
    
    def _identify_red_flags(self, remedies: List[Dict], patient: PatientProfile) -> List[str]:
        """Identify red flags that warrant immediate medical attention."""
        flags = [
            "Worsening symptoms despite protocol",
            "New or severe symptoms develop",
            "Signs of allergic reaction (rash, swelling, difficulty breathing)",
        ]
        
        # Add remedy-specific red flags
        for remedy in remedies:
            if remedy.get("hepatotoxicity"):
                flags.append("Signs of liver problems: yellowing skin/eyes, dark urine, severe fatigue")
            
            if remedy.get("detected_interactions"):
                for interaction in remedy["detected_interactions"]:
                    if interaction.get("severity") in ["high", "critical"]:
                        flags.append(f"Watch for {interaction.get('mechanism', 'interaction effects')} with {interaction.get('medication')}")
        
        return list(set(flags))
    
    def _define_expected_outcomes(self, remedies: List[Dict], patient: PatientProfile) -> Dict[str, Any]:
        """Define expected outcomes and timeline."""
        # Get average onset time
        onset_weeks = [r.get("typical_onset_weeks", 4) for r in remedies if r.get("typical_onset_weeks")]
        avg_onset = sum(onset_weeks) / len(onset_weeks) if onset_weeks else 4
        
        return {
            "timeline": f"{int(avg_onset)}-{int(avg_onset * 2)} weeks for initial response",
            "best_case": "Significant symptom improvement (40-60%)",
            "realistic_case": "Moderate improvement in primary symptoms (20-40%)",
            "minimal_response": "Minor improvements or stabilization",
            "factors_affecting_outcomes": [
                "Adherence to protocol",
                "Individual variation in response",
                "Severity and duration of condition",
                "Other treatments and lifestyle factors"
            ]
        }
    
    def _gather_references(self, remedies: List[Dict]) -> List[Dict[str, Any]]:
        """Gather primary references for recommendations."""
        references = []
        
        for remedy in remedies:
            sources = remedy.get("primary_evidence_sources", [])
            for source in sources[:3]:  # Top 3 per remedy
                references.append({
                    "pmid": source.get("pmid"),
                    "title": source.get("title"),
                    "year": source.get("year"),
                    "url": f"https://pubmed.ncbi.nlm.nih.gov/{source.get('pmid')}/" if source.get("pmid") else None
                })
        
        return references


# Utility function for generating protocols
async def generate_patient_protocol(
    db_session,
    age: int,
    sex: str,
    conditions: List[int],
    medications: List[str],
    allergies: List[str] = None,
    liver_function: str = "normal",
    kidney_function: str = "normal",
    is_pregnant: bool = False,
    is_lactating: bool = False
) -> IntegratedProtocol:
    """
    Convenience function to generate a protocol.
    
    Args:
        db_session: Database session for lookups
        age: Patient age
        sex: 'M', 'F', or 'Other'
        conditions: List of indication IDs
        medications: List of current medication names
        allergies: Known allergies
        liver_function: Liver function status
        kidney_function: Kidney function status
        is_pregnant: Pregnancy status
        is_lactating: Lactation status
        
    Returns:
        IntegratedProtocol with complete recommendations
    """
    patient = PatientProfile(
        age=age,
        sex=sex,
        conditions=conditions,
        current_medications=medications,
        allergies=allergies or [],
        liver_function=liver_function,
        kidney_function=kidney_function,
        is_pregnant=is_pregnant,
        is_lactating=is_lactating
    )
    
    generator = ClinicalProtocolGenerator(db_session)
    return await generator.generate_protocol(patient)
