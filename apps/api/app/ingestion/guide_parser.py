"""
Comprehensive Guide Parser for Naturopath OS.
Parses the Ultra-Comprehensive Holistic Healing Guide 2026 and ingests
all conditions, remedies, evidence levels, dosages, and protocols into the database.
"""

import re
import json
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from pathlib import Path
from datetime import datetime

from sqlalchemy.orm import Session

from ..models import (
    Organism, Indication, RemedyIndication, TreatmentProtocol, SymptomConditionMapping
)


@dataclass
class ParsedRemedy:
    """Represents a parsed natural remedy from the guide."""
    name: str
    scientific_name: str = ""
    active_compounds: List[str] = field(default_factory=list)
    mechanisms: List[str] = field(default_factory=list)
    dosage_min_mg: Optional[float] = None
    dosage_max_mg: Optional[float] = None
    dosage_frequency: str = ""
    dosage_notes: str = ""
    evidence_level: str = ""  # 'STRONG', 'MODERATE', 'EMERGING', 'PRELIMINARY'
    evidence_level_int: int = 5
    clinical_trials_count: int = 0
    efficacy_notes: str = ""
    safety_notes: str = ""
    contraindications: List[str] = field(default_factory=list)
    drug_interactions: List[str] = field(default_factory=list)
    onset_weeks: Optional[int] = None
    duration_notes: str = ""
    forms: List[str] = field(default_factory=list)


@dataclass
class ParsedCondition:
    """Represents a parsed health condition from the guide."""
    name: str
    category: str = ""  # 'psychiatric', 'chronic_disease', etc.
    subcategory: str = ""
    dsm5_code: str = ""
    icd_code: str = ""
    diagnostic_criteria: str = ""
    key_symptoms: List[str] = field(default_factory=list)
    remedies: List[ParsedRemedy] = field(default_factory=list)
    protocol_notes: str = ""
    integration_protocol: str = ""


class HolisticGuideParser:
    """
    Parses the Ultra-Comprehensive Holistic Healing Guide 2026.
    """
    
    # Evidence level mapping
    EVIDENCE_MAP = {
        'STRONG': 1,
        'MODERATE': 2,
        'EMERGING': 3,
        'PRELIMINARY': 4,
        'TRADITIONAL': 5,
        'CAUTION': 5
    }
    
    # Section patterns
    CONDITION_SECTION_PATTERN = re.compile(
        r'^(\d+\.\d+(?:\.\d+)?)\s+(.+?)$',
        re.MULTILINE
    )
    
    EVIDENCE_LEVEL_PATTERN = re.compile(
        r'(STRONG|MODERATE|EMERGING|PRELIMINARY|CAUTION)\s+Evidence',
        re.IGNORECASE
    )
    
    REMEDY_PATTERN = re.compile(
        r'([A-Z][a-zA-Z\s\-\']+?)\s*\(([^)]+)\)',
        re.MULTILINE
    )
    
    DOSAGE_PATTERN = re.compile(
        r'(?:Dosage|Standard dosage|Dose):\s*(\d+(?:\.\d+)?)\s*-?\s*(\d+(?:\.\d+)?)?\s*(mg|g|ml|mcg|IU|capsule|cup|drops)',
        re.IGNORECASE
    )
    
    FREQUENCY_PATTERN = re.compile(
        r'(daily|twice daily|TID|BID|QID|three times daily|once daily|at bedtime)',
        re.IGNORECASE
    )
    
    def __init__(self, guide_path: str):
        self.guide_path = Path(guide_path)
        self.raw_content = ""
        self.conditions: List[ParsedCondition] = []
        self.remedies_db: Dict[str, ParsedRemedy] = {}
        
    def load_guide(self) -> str:
        """Load the guide content from file."""
        with open(self.guide_path, 'r', encoding='utf-8') as f:
            self.raw_content = f.read()
        return self.raw_content
    
    def parse(self) -> List[ParsedCondition]:
        """Main parsing method. Returns all parsed conditions with their remedies."""
        if not self.raw_content:
            self.load_guide()
        
        # Split into major sections
        sections = self._split_into_sections()
        
        # Parse each section
        for section_num, section_title, section_content in sections:
            condition = self._parse_condition_section(section_num, section_title, section_content)
            if condition:
                self.conditions.append(condition)
        
        return self.conditions
    
    def _split_into_sections(self) -> List[Tuple[str, str, str]]:
        """Split the guide into numbered sections."""
        sections = []
        
        # Find all section headers like "1.1.1 Major Depressive Disorder (MDD)"
        pattern = re.compile(
            r'^(\d+\.\d+(?:\.\d+)?)\s+(.+)$',
            re.MULTILINE
        )
        
        matches = list(pattern.finditer(self.raw_content))
        
        for i, match in enumerate(matches):
            section_num = match.group(1)
            section_title = match.group(2).strip()
            
            # Get content until next section
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(self.raw_content)
            content = self.raw_content[start:end].strip()
            
            sections.append((section_num, section_title, content))
        
        return sections
    
    def _parse_condition_section(self, section_num: str, title: str, content: str) -> Optional[ParsedCondition]:
        """Parse a single condition section."""
        # Determine category from section number
        category = self._determine_category(section_num)
        if not category:
            return None
        
        # Clean up title - remove parenthetical abbreviations
        clean_title = re.sub(r'\s*\([A-Z]+\)\s*$', '', title)
        
        condition = ParsedCondition(
            name=clean_title,
            category=category,
            subcategory=self._determine_subcategory(section_num)
        )
        
        # Parse diagnostic criteria
        criteria_match = re.search(
            r'(?:Diagnostic Criteria|Clinical Overview)[:\s]*(.+?)(?=\n(?:Key Symptoms|Evidence|Natural|STRONG|MODERATE|$))',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if criteria_match:
            condition.diagnostic_criteria = criteria_match.group(1).strip()
        
        # Parse key symptoms
        symptoms_match = re.search(
            r'Key Symptoms[:\s]*\n(.+?)(?=\n(?:Evidence|Natural|STRONG|MODERATE|$))',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if symptoms_match:
            symptoms_text = symptoms_match.group(1)
            # Extract bullet points
            condition.key_symptoms = [
                s.strip().lstrip('•\t-') 
                for s in symptoms_text.split('\n') 
                if s.strip() and not s.strip().startswith('#')
            ]
        
        # Parse remedies by evidence level
        condition.remedies = self._parse_remedies_from_content(content)
        
        # Parse integration protocol
        protocol_match = re.search(
            r'(?:Integration Protocol|Comprehensive.*?Protocol|Protocol)[:\s]*\n(.+?)(?=\n\d+\.|$)',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if protocol_match:
            condition.integration_protocol = protocol_match.group(1).strip()
        
        return condition
    
    def _determine_category(self, section_num: str) -> str:
        """Determine condition category from section number."""
        major = section_num.split('.')[0] if '.' in section_num else section_num
        
        categories = {
            '1': 'psychiatric',
            '2': 'chronic_disease',
            '3': 'metabolic',
            '4': 'autoimmune',
            '5': 'neurological',
            '6': 'cardiovascular',
            '7': 'respiratory',
            '8': 'digestive',
            '9': 'musculoskeletal',
            '10': 'dermatological'
        }
        
        return categories.get(major, 'other')
    
    def _determine_subcategory(self, section_num: str) -> str:
        """Determine subcategory from section number."""
        parts = section_num.split('.')
        if len(parts) < 2:
            return ""
        
        # Psychiatric subcategories (from Part 1)
        if parts[0] == '1':
            subcats = {
                '1': 'depressive_disorders',
                '2': 'bipolar_disorders',
                '3': 'anxiety_disorders',
                '4': 'ocd_related',
                '5': 'trauma_stress',
                '6': 'substance_use',
                '7': 'neurocognitive',
                '8': 'psychotic_disorders',
                '9': 'sleep_disorders'
            }
            return subcats.get(parts[1], '')
        
        return ""
    
    def _parse_remedies_from_content(self, content: str) -> List[ParsedRemedy]:
        """Parse all remedies from a condition's content."""
        remedies = []
        
        # Find evidence level sections
        evidence_sections = re.split(
            r'(STRONG|MODERATE|EMERGING|PRELIMINARY)\s+Evidence[:\s]*',
            content,
            flags=re.IGNORECASE
        )
        
        current_evidence = "PRELIMINARY"
        
        for i, section in enumerate(evidence_sections):
            # Check if this is an evidence level marker
            upper_section = section.upper().strip()
            if upper_section in self.EVIDENCE_MAP:
                current_evidence = upper_section
                continue
            
            # Parse remedies in this section
            section_remedies = self._parse_remedy_entries(section, current_evidence)
            remedies.extend(section_remedies)
        
        return remedies
    
    def _parse_remedy_entries(self, text: str, evidence_level: str) -> List[ParsedRemedy]:
        """Parse individual remedy entries from text."""
        remedies = []
        
        # Pattern for remedy headers like "St. John's Wort (Hypericum perforatum)"
        remedy_header = re.compile(
            r'([A-Z][a-zA-Z\s\-\'\.]+?)\s*\(([A-Z][a-z]+\s+[a-z]+(?:\s+[a-z]+)?)\)',
            re.MULTILINE
        )
        
        matches = list(remedy_header.finditer(text))
        
        for i, match in enumerate(matches):
            common_name = match.group(1).strip()
            scientific_name = match.group(2).strip()
            
            # Get the content for this remedy (until next remedy or section)
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            remedy_content = text[start:end]
            
            remedy = self._parse_single_remedy(
                common_name, 
                scientific_name, 
                remedy_content, 
                evidence_level
            )
            
            if remedy:
                remedies.append(remedy)
        
        # Also look for simpler remedy mentions without scientific names
        simple_remedies = self._parse_simple_remedy_entries(text, evidence_level, exclude=[r.name for r in remedies])
        remedies.extend(simple_remedies)
        
        return remedies
    
    def _parse_simple_remedy_entries(self, text: str, evidence_level: str, exclude: List[str]) -> List[ParsedRemedy]:
        """Parse simpler remedy entries without full scientific notation."""
        remedies = []
        
        # Pattern for bullet-point style remedies
        bullet_pattern = re.compile(
            r'[•\t-]\s*([A-Z][a-zA-Z\s\-\']+?)\s*(?:\(|:|\n)',
            re.MULTILINE
        )
        
        for match in bullet_pattern.finditer(text):
            name = match.group(1).strip()
            
            # Skip if already parsed or too short
            if name in exclude or len(name) < 4:
                continue
            
            # Skip common non-remedy words
            skip_words = ['Dosage', 'Mechanism', 'Efficacy', 'Safety', 'Duration', 'Note', 'Caution', 'Clinical']
            if any(skip in name for skip in skip_words):
                continue
            
            # Get some following content for dosage info
            start = match.end()
            content = text[start:start+500]
            
            remedy = ParsedRemedy(
                name=name,
                evidence_level=evidence_level,
                evidence_level_int=self.EVIDENCE_MAP.get(evidence_level, 5)
            )
            
            # Try to parse dosage
            dosage_match = self.DOSAGE_PATTERN.search(content)
            if dosage_match:
                try:
                    remedy.dosage_min_mg = float(dosage_match.group(1))
                    if dosage_match.group(2):
                        remedy.dosage_max_mg = float(dosage_match.group(2))
                except (ValueError, TypeError):
                    pass
            
            remedies.append(remedy)
        
        return remedies
    
    def _parse_single_remedy(self, common_name: str, scientific_name: str, 
                             content: str, evidence_level: str) -> Optional[ParsedRemedy]:
        """Parse a single remedy entry with full details."""
        remedy = ParsedRemedy(
            name=common_name,
            scientific_name=scientific_name,
            evidence_level=evidence_level,
            evidence_level_int=self.EVIDENCE_MAP.get(evidence_level, 5)
        )
        
        # Parse active compounds
        compounds_match = re.search(
            r'(?:Active compounds|Composition)[:\s]*(.+?)(?=\n(?:Mechanism|Clinical|Dosing|$))',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if compounds_match:
            compounds_text = compounds_match.group(1)
            remedy.active_compounds = [
                c.strip().lstrip('•\t-')
                for c in compounds_text.split(',')
                if c.strip()
            ]
        
        # Parse mechanisms
        mech_match = re.search(
            r'(?:Mechanism|Mechanisms)[:\s]*(.+?)(?=\n(?:Clinical|Efficacy|Dosing|$))',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if mech_match:
            remedy.mechanisms = [
                m.strip().lstrip('•\t-')
                for m in mech_match.group(1).split('\n')
                if m.strip() and not m.strip().startswith('#')
            ]
        
        # Parse dosage
        dosing_match = re.search(
            r'(?:Dosing|Dosage|Standard dosage)[:\s]*(.+?)(?=\n(?:Important|Safety|Onset|$))',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if dosing_match:
            dosing_text = dosing_match.group(1)
            remedy.dosage_notes = dosing_text.strip()
            
            # Extract numeric dosage
            dose_num = self.DOSAGE_PATTERN.search(dosing_text)
            if dose_num:
                try:
                    remedy.dosage_min_mg = float(dose_num.group(1))
                    if dose_num.group(2):
                        remedy.dosage_max_mg = float(dose_num.group(2))
                except (ValueError, TypeError):
                    pass
            
            # Extract frequency
            freq_match = self.FREQUENCY_PATTERN.search(dosing_text)
            if freq_match:
                remedy.dosage_frequency = freq_match.group(1)
        
        # Parse efficacy notes
        efficacy_match = re.search(
            r'(?:Clinical efficacy|Efficacy)[:\s]*(.+?)(?=\n(?:Dosing|Safety|Important|$))',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if efficacy_match:
            remedy.efficacy_notes = efficacy_match.group(1).strip()
            
            # Try to extract trial count
            trials_match = re.search(r'(\d+)\+?\s*(?:clinical )?trials', efficacy_match.group(1))
            if trials_match:
                remedy.clinical_trials_count = int(trials_match.group(1))
        
        # Parse safety considerations
        safety_match = re.search(
            r'(?:Safety|Important safety)[:\s]*(.+?)(?=\n(?:Clinical notes|Practical|$))',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if safety_match:
            remedy.safety_notes = safety_match.group(1).strip()
            
            # Extract contraindications
            contra_match = re.search(
                r'(?:Contra|Pregnancy|Avoid)[:\s]*(.+)',
                safety_match.group(1),
                re.IGNORECASE
            )
            if contra_match:
                remedy.contraindications = [contra_match.group(1).strip()]
            
            # Extract drug interactions
            interact_match = re.search(
                r'(?:Drug interactions|Medication interactions)[:\s]*(.+)',
                safety_match.group(1),
                re.IGNORECASE
            )
            if interact_match:
                remedy.drug_interactions = [interact_match.group(1).strip()]
        
        # Parse onset time
        onset_match = re.search(r'(?:Onset|Effect):\s*(\d+)\s*-?\s*(\d+)?\s*weeks', content, re.IGNORECASE)
        if onset_match:
            remedy.onset_weeks = int(onset_match.group(1))
        
        # Parse forms
        forms_match = re.search(r'Forms?:\s*(.+)', content, re.IGNORECASE)
        if forms_match:
            remedy.forms = [f.strip() for f in forms_match.group(1).split(',')]
        
        return remedy
    
    def get_all_unique_remedies(self) -> Dict[str, ParsedRemedy]:
        """Return all unique remedies across all conditions."""
        for condition in self.conditions:
            for remedy in condition.remedies:
                key = remedy.name.lower()
                if key not in self.remedies_db:
                    self.remedies_db[key] = remedy
                else:
                    # Merge data if we have more info
                    existing = self.remedies_db[key]
                    if remedy.evidence_level_int < existing.evidence_level_int:
                        existing.evidence_level = remedy.evidence_level
                        existing.evidence_level_int = remedy.evidence_level_int
                    if remedy.clinical_trials_count > existing.clinical_trials_count:
                        existing.clinical_trials_count = remedy.clinical_trials_count
        
        return self.remedies_db
    
    def to_json(self) -> str:
        """Export parsed data to JSON."""
        data = {
            'parse_date': datetime.now().isoformat(),
            'source_file': str(self.guide_path),
            'conditions': []
        }
        
        for condition in self.conditions:
            cond_data = {
                'name': condition.name,
                'category': condition.category,
                'subcategory': condition.subcategory,
                'diagnostic_criteria': condition.diagnostic_criteria,
                'key_symptoms': condition.key_symptoms,
                'integration_protocol': condition.integration_protocol,
                'remedies': []
            }
            
            for remedy in condition.remedies:
                remedy_data = {
                    'name': remedy.name,
                    'scientific_name': remedy.scientific_name,
                    'active_compounds': remedy.active_compounds,
                    'mechanisms': remedy.mechanisms,
                    'dosage_min_mg': remedy.dosage_min_mg,
                    'dosage_max_mg': remedy.dosage_max_mg,
                    'dosage_frequency': remedy.dosage_frequency,
                    'dosage_notes': remedy.dosage_notes,
                    'evidence_level': remedy.evidence_level,
                    'evidence_level_int': remedy.evidence_level_int,
                    'clinical_trials_count': remedy.clinical_trials_count,
                    'efficacy_notes': remedy.efficacy_notes,
                    'safety_notes': remedy.safety_notes,
                    'contraindications': remedy.contraindications,
                    'drug_interactions': remedy.drug_interactions,
                    'onset_weeks': remedy.onset_weeks,
                    'forms': remedy.forms
                }
                cond_data['remedies'].append(remedy_data)
            
            data['conditions'].append(cond_data)
        
        return json.dumps(data, indent=2)


async def ingest_guide_to_database(
    db: Session,
    guide_path: str,
    clear_existing: bool = False
) -> Dict[str, Any]:
    """
    Parse the comprehensive guide and ingest all data into the database.
    
    Args:
        db: SQLAlchemy session
        guide_path: Path to the guide text file
        clear_existing: If True, clear existing data first
        
    Returns:
        Summary of ingested data
    """
    parser = HolisticGuideParser(guide_path)
    conditions = parser.parse()
    
    stats = {
        'conditions_created': 0,
        'conditions_updated': 0,
        'organisms_created': 0,
        'organisms_updated': 0,
        'remedy_indications_created': 0,
        'protocols_created': 0,
        'symptom_mappings_created': 0,
        'errors': []
    }
    
    # Process each condition
    for parsed_condition in conditions:
        try:
            # Find or create Indication
            indication = db.query(Indication).filter(
                Indication.condition_name.ilike(f"%{parsed_condition.name}%")
            ).first()
            
            if not indication:
                indication = Indication(
                    condition_name=parsed_condition.name,
                    disease_category=parsed_condition.category,
                    disease_subcategory=parsed_condition.subcategory,
                    dsm_5_code=parsed_condition.dsm5_code or None,
                    diagnostic_criteria=parsed_condition.diagnostic_criteria,
                    primary_symptoms=parsed_condition.key_symptoms,
                    verification_status='verified'
                )
                db.add(indication)
                db.flush()  # Get ID
                stats['conditions_created'] += 1
            else:
                # Update existing
                if parsed_condition.diagnostic_criteria:
                    indication.diagnostic_criteria = parsed_condition.diagnostic_criteria
                if parsed_condition.key_symptoms:
                    indication.primary_symptoms = parsed_condition.key_symptoms
                stats['conditions_updated'] += 1
            
            # Process remedies for this condition
            for parsed_remedy in parsed_condition.remedies:
                try:
                    # Find or create Organism
                    organism = db.query(Organism).filter(
                        Organism.common_name_en.ilike(f"%{parsed_remedy.name}%")
                    ).first()
                    
                    if not organism:
                        # Parse genus/species from scientific name
                        genus, species = "", ""
                        if parsed_remedy.scientific_name:
                            parts = parsed_remedy.scientific_name.split()
                            genus = parts[0] if len(parts) > 0 else ""
                            species = parts[1] if len(parts) > 1 else ""
                        
                        organism = Organism(
                            common_name_en=parsed_remedy.name,
                            taxonomy_genus=genus,
                            taxonomy_species=species,
                            organism_type='plant',
                            known_compounds=[{'name': c} for c in parsed_remedy.active_compounds],
                            modern_preparations=parsed_remedy.forms,
                            verification_status='verified'
                        )
                        db.add(organism)
                        db.flush()
                        stats['organisms_created'] += 1
                    else:
                        stats['organisms_updated'] += 1
                    
                    # Create RemedyIndication relationship
                    existing_ri = db.query(RemedyIndication).filter(
                        RemedyIndication.organism_id == organism.id,
                        RemedyIndication.indication_id == indication.id
                    ).first()
                    
                    if not existing_ri:
                        remedy_indication = RemedyIndication(
                            organism_id=organism.id,
                            indication_id=indication.id,
                            evidence_level=parsed_remedy.evidence_level_int,
                            rct_count=parsed_remedy.clinical_trials_count,
                            typical_dose_min_mg=parsed_remedy.dosage_min_mg,
                            typical_dose_max_mg=parsed_remedy.dosage_max_mg,
                            typical_dose_frequency=parsed_remedy.dosage_frequency,
                            typical_onset_weeks=parsed_remedy.onset_weeks,
                            proposed_mechanisms=[{'mechanism': m} for m in parsed_remedy.mechanisms],
                            contraindications=parsed_remedy.contraindications,
                            herb_drug_interactions=[{'interaction': i} for i in parsed_remedy.drug_interactions],
                            safety_profile_assessment='well_tolerated' if parsed_remedy.evidence_level_int <= 2 else 'requires_review',
                            verification_status='verified',
                            is_published=True
                        )
                        db.add(remedy_indication)
                        stats['remedy_indications_created'] += 1
                        
                except Exception as e:
                    stats['errors'].append(f"Error processing remedy {parsed_remedy.name}: {str(e)}")
            
            # Create symptom-condition mappings
            for i, symptom in enumerate(parsed_condition.key_symptoms[:10]):  # Limit to 10 symptoms
                existing_mapping = db.query(SymptomConditionMapping).filter(
                    SymptomConditionMapping.symptom_name.ilike(f"%{symptom[:50]}%"),
                    SymptomConditionMapping.indication_id == indication.id
                ).first()
                
                if not existing_mapping:
                    mapping = SymptomConditionMapping(
                        symptom_name=symptom[:255],
                        symptom_category=parsed_condition.category,
                        indication_id=indication.id,
                        condition_name=parsed_condition.name,
                        association_strength='strong' if i < 3 else 'moderate',
                        is_primary_symptom=i < 3
                    )
                    db.add(mapping)
                    stats['symptom_mappings_created'] += 1
            
            # Create treatment protocol if there's integration info
            if parsed_condition.integration_protocol:
                existing_protocol = db.query(TreatmentProtocol).filter(
                    TreatmentProtocol.indication_id == indication.id
                ).first()
                
                if not existing_protocol:
                    protocol = TreatmentProtocol(
                        protocol_name=f"{parsed_condition.name} Integration Protocol",
                        protocol_type='integrative',
                        indication_id=indication.id,
                        target_condition_name=parsed_condition.name,
                        description=parsed_condition.integration_protocol,
                        primary_remedies=[
                            {'name': r.name, 'evidence_level': r.evidence_level_int}
                            for r in parsed_condition.remedies[:5]
                            if r.evidence_level_int <= 2
                        ],
                        secondary_remedies=[
                            {'name': r.name, 'evidence_level': r.evidence_level_int}
                            for r in parsed_condition.remedies
                            if r.evidence_level_int == 3
                        ][:5],
                        overall_evidence_level=min(
                            [r.evidence_level_int for r in parsed_condition.remedies] or [5]
                        ),
                        source_document='Ultra-Comprehensive Holistic Healing Guide 2026',
                        verification_status='verified',
                        is_active=True
                    )
                    db.add(protocol)
                    stats['protocols_created'] += 1
                    
        except Exception as e:
            stats['errors'].append(f"Error processing condition {parsed_condition.name}: {str(e)}")
    
    # Commit all changes
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        stats['errors'].append(f"Database commit error: {str(e)}")
    
    return stats
