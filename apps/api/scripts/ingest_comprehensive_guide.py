
import asyncio
import os
import sys
import re
from typing import List, Dict, Optional

# Add parent dir to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.connection import AsyncSessionLocal
from app.models.organisms import Organism
from app.models.indications import Indication
from app.models.remedy_indications import RemedyIndication
from app.models.safety import SafetyProfile
from sqlalchemy import select, update

if len(sys.argv) > 1:
    INPUT_FILE = sys.argv[1]
else:
    INPUT_FILE = "/Users/jessehenry/Desktop/MY APPS/Ultra_Comprehensive_Guide_2026.txt"

# Regex Patterns
CONDITION_PATTERN = re.compile(r"^\d+(\.\d+)+\s+(.+)")
EVIDENCE_LEVEL_PATTERN = re.compile(r"^(STRONG|MODERATE|EMERGING|PRELIMINARY|CAUTION).*Evidence", re.IGNORECASE)
REMEDY_PATTERN = re.compile(r"^\s*•\s+([^(]+)(\(([^)]+)\))?(.*)")
ATTRIBUTE_PATTERN = re.compile(r"^\s*•\s+(Composition|Mechanism|Clinical efficacy|Dosage|Duration|Safety|Note|Efficacy|Caution|Contraindications|Particularly effective|Standard dosage|Forms):?\s*(.*)", re.IGNORECASE)

async def get_or_create_indication(db, name: str, description: str = None):
    # Clean name
    name = name.strip()
    result = await db.execute(select(Indication).where(Indication.condition_name == name))
    indication = result.scalar_one_or_none()
    
    if not indication:
        print(f"Creating Indication: {name}")
        indication = Indication(
            condition_name=name,
            description=description,
            verification_status="verified"
        )
        db.add(indication)
        await db.commit()
        await db.refresh(indication)
    return indication

async def get_or_create_organism(db, common_name: str, scientific_name: str = None):
    common_name = common_name.strip()
    result = await db.execute(select(Organism).where(Organism.common_name_en == common_name))
    organism = result.scalar_one_or_none()
    
    if not organism:
        # Check by scientific name if provided
        if scientific_name:
            result = await db.execute(select(Organism).where(Organism.taxonomy_species.ilike(f"%{scientific_name.split()[-1]}%"))) # Heuristic
            # This is risky, let's stick to creating if not found by common name
            pass
            
        print(f"Creating Organism: {common_name} ({scientific_name})")
        
        # Simple taxonomy parsing
        genus = None
        species = None
        if scientific_name:
            parts = scientific_name.split()
            if len(parts) >= 1:
                genus = parts[0]
            if len(parts) >= 2:
                species = parts[1]
        
        organism = Organism(
            common_name_en=common_name,
            taxonomy_genus=genus,
            taxonomy_species=species,
            verification_status="verified"
        )
        db.add(organism)
        await db.commit()
        await db.refresh(organism)
    return organism

async def process_remedy(db, condition_id, evidence_level_str, remedy_name, remedy_details):
    # Parse evidence level
    ev_map = {
        "STRONG": 1,
        "MODERATE": 2,
        "EMERGING": 3,
        "PRELIMINARY": 4,
        "CAUTION": 5
    }
    evidence_level = ev_map.get(evidence_level_str.split()[0].upper(), 3)
    
    # Parse remedy name and scientific name
    scientific_name = None
    if "(" in remedy_name and ")" in remedy_name:
        parts = remedy_name.split("(")
        remedy_name_clean = parts[0].strip()
        scientific_name = parts[1].split(")")[0].strip()
    else:
        remedy_name_clean = remedy_name.strip()

    organism = await get_or_create_organism(db, remedy_name_clean, scientific_name)
    
    # Check if RI exists
    result = await db.execute(select(RemedyIndication).where(
        RemedyIndication.organism_id == organism.id,
        RemedyIndication.indication_id == condition_id
    ))
    ri = result.scalar_one_or_none()
    
    # detailed parsing
    mechanism = []
    dose_min = None
    dose_max = None
    safety_notes = []
    contraindications = []
    
    for line in remedy_details:
        lower_line = line.lower()
        if "mechanism" in lower_line:
            mechanism.append(line.split(":", 1)[-1].strip() if ":" in line else line)
        if "dosage" in lower_line or "standard dosage" in lower_line:
            # Try to extract numbers
            nums = re.findall(r'(\d+)', line)
            if nums:
                try:
                    vals = [int(n) for n in nums]
                    if vals:
                        dose_min = min(vals)
                        dose_max = max(vals)
                except:
                    pass
        if "safety" in lower_line or "caution" in lower_line:
             safety_notes.append(line.split(":", 1)[-1].strip() if ":" in line else line)
        if "contraindications" in lower_line:
             contraindications.append(line.split(":", 1)[-1].strip() if ":" in line else line)

    if not ri:
        print(f"  -> linking {remedy_name_clean} to condition (Level {evidence_level})")
        ri = RemedyIndication(
            organism_id=organism.id,
            indication_id=condition_id,
            evidence_level=evidence_level,
            proposed_mechanisms=mechanism,
            typical_dose_min_mg=dose_min,
            typical_dose_max_mg=dose_max,
            contraindications=contraindications,
            precautions=safety_notes,
            remedy_role="therapeutic", 
            verification_status="verified"
        )
        db.add(ri)
    else:
        # Update existing
        ri.evidence_level = min(ri.evidence_level, evidence_level) # keep best
        if mechanism: ri.proposed_mechanisms = (ri.proposed_mechanisms or []) + mechanism
        if dose_min: ri.typical_dose_min_mg = dose_min
        if dose_max: ri.typical_dose_max_mg = dose_max
        if contraindications: ri.contraindications = (ri.contraindications or []) + contraindications
    
    await db.commit()

async def main():
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
        return

    async with AsyncSessionLocal() as db:
        print("Starting ingestion...")
        
        current_condition = None
        current_evidence_level = "EMERGING"
        current_remedy_name = None
        current_remedy_details = []
        
        with open(INPUT_FILE, "r") as f:
            lines = f.readlines()
            
        for line in lines:
            line = line.strip()
            if not line: continue
            
            # 1. Detect Condition
            cond_match = CONDITION_PATTERN.match(line)
            if cond_match:
                # Save previous remedy if exists
                if current_remedy_name and current_condition:
                    await process_remedy(db, current_condition.id, current_evidence_level, current_remedy_name, current_remedy_details)
                    current_remedy_name = None
                    current_remedy_details = []

                condition_name = cond_match.group(2)
                # Skip numeric headers that aren't conditions (like "1.1 Depressive Disorders" - acts as category or condition? treat as condition)
                current_condition = await get_or_create_indication(db, condition_name)
                # Reset evidence level default
                current_evidence_level = "EMERGING" 
                continue
                
            # 2. Detect Evidence Level
            evidence_match = EVIDENCE_LEVEL_PATTERN.match(line)
            if evidence_match:
                 # Save previous
                if current_remedy_name and current_condition:
                    await process_remedy(db, current_condition.id, current_evidence_level, current_remedy_name, current_remedy_details)
                    current_remedy_name = None
                    current_remedy_details = []
                
                current_evidence_level = evidence_match.group(1).upper()
                continue
                
            # 3. Detect Remedy
            remedy_match = REMEDY_PATTERN.match(line)
            is_attribute = ATTRIBUTE_PATTERN.match(line)
            
            if remedy_match and not is_attribute:
                # Save previous
                if current_remedy_name and current_condition:
                    await process_remedy(db, current_condition.id, current_evidence_level, current_remedy_name, current_remedy_details)
                
                current_remedy_name = remedy_match.group(1) + (remedy_match.group(2) or "")
                current_remedy_details = []
            elif current_remedy_name:
                current_remedy_details.append(line)
        
        # Save last
        if current_remedy_name and current_condition:
            await process_remedy(db, current_condition.id, current_evidence_level, current_remedy_name, current_remedy_details)

        print("Ingestion complete.")

if __name__ == "__main__":
    asyncio.run(main())
