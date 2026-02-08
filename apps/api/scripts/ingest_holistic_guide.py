
import asyncio
import os
import re
import sys
from sqlalchemy import select, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

# Add the parent directory to sys.path so we can import 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.connection import Base
from app.models.organisms import Organism
from app.models.indications import Indication
from app.models.remedy_indications import RemedyIndication
from app.models.compounds import Compound

# Database URL from env (assuming running in container)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://remedies_user:changeme_in_production@postgres:5432/remedies_db")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

EVIDENCE_MAP = {
    "STRONG": 1,
    "MODERATE": 2,
    "EMERGING": 3,
    "PRELIMINARY": 4,
    "CAUTION": 5
}

def clean_text(text):
    if not text:
        return ""
    return text.replace("•", "").strip()

async def get_or_create_indication(session, name, description=None):
    if not name:
        return None
    # Try exact match first
    result = await session.execute(select(Indication).where(Indication.condition_name == name))
    indication = result.scalars().first()
    if not indication:
        print(f"Creating Condition: {name}")
        indication = Indication(condition_name=name, description=description)
        session.add(indication)
        await session.flush()
    return indication

async def get_or_create_organism(session, common_name, scientific_name=None):
    if not common_name:
        return None
    
    # Try to match by common_name_en
    result = await session.execute(select(Organism).where(Organism.common_name_en == common_name))
    organism = result.scalars().first()
    
    # If not found, try to match by part of the name if it's long? No, safer to create.
    if not organism:
        print(f"Creating Organism: {common_name}")
        organism = Organism(
            common_name_en=common_name,
            taxonomy_genus=scientific_name, # Storing full scientific name in genus for now if simple
            description=f"Imported from Holistic Guide. Scientific Name: {scientific_name}" if scientific_name else "Imported from Holistic Guide"
        )
        session.add(organism)
        await session.flush()
    return organism

async def create_link(session, organism, indication, evidence_level, buffer):
    if not organism or not indication:
        return

    # Check if link exists
    stmt = select(RemedyIndication).where(
        RemedyIndication.organism_id == organism.id,
        RemedyIndication.indication_id == indication.id
    )
    result = await session.execute(stmt)
    existing = result.scalars().first()

    mechanism = buffer.get('Mechanism', '') or buffer.get('Composition and mechanism', '')
    efficacy = buffer.get('Efficacy', '') or buffer.get('Clinical efficacy', '')
    dosage = buffer.get('Dosage', '') or buffer.get('Dosing and administration', '')
    safety = buffer.get('Safety', '') or buffer.get('Important safety considerations', '')

    proposed_mechanisms = [{"mechanism": mechanism}] if mechanism else []

    if not existing:
        print(f"  -> Linking {organism.common_name_en} to {indication.condition_name} (Level {evidence_level})")
        link = RemedyIndication(
            organism_id=organism.id,
            indication_id=indication.id,
            evidence_level=evidence_level,
            proposed_mechanisms=proposed_mechanisms,
            typical_dose_frequency=dosage[:100] if dosage else None,
            clinical_context=efficacy[:500] if efficacy else None,
            safety_profile_assessment=safety[:100] if safety else None,
            traditional_application_context=f"Dosage: {dosage}. Safety: {safety}"
        )
        session.add(link)
    else:
        # Update existing?
        # print(f"  -> Link already exists for {organism.common_name_en}")
        pass

async def ingest_file(file_path):
    async with AsyncSessionLocal() as session:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        current_condition = None
        current_evidence_level = 5
        current_remedy_name = None
        current_remedy_buffer = {}
        
        # Regex Patterns
        # 1.1.1 Name
        pat_condition = re.compile(r'^(\d+(\.\d+)+)\s+(.*)') 
        # STRONG Evidence
        pat_evidence = re.compile(r'^(STRONG|MODERATE|EMERGING|PRELIMINARY|CAUTION).*')
        # Remedy Line: Usually starts with bullet OR is just text that looks like a name
        # Heuristic: If we are in an evidence block, and line is not a property (Dosage:), it's likely a remedy name.
        pat_property = re.compile(r'^(Dosage|Mechanism|Efficacy|Safety|Composition|Clinical efficacy|Dosing|Important safety).*[:](.*)', re.IGNORECASE)

        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue

            # 1. Check Condition
            m_cond = pat_condition.match(line)
            if m_cond:
                # Save previous
                if current_remedy_name:
                    org = await get_or_create_organism(session, current_remedy_name, current_remedy_buffer.get('sci_name'))
                    await create_link(session, org, current_condition, current_evidence_level, current_remedy_buffer)
                    current_remedy_name = None
                    current_remedy_buffer = {}

                condition_raw = m_cond.group(3)
                # Cleanup: "Major Depressive Disorder (MDD)"
                current_condition = await get_or_create_indication(session, condition_raw)
                continue

            # 2. Check Evidence Level
            m_ev = pat_evidence.match(line)
            if m_ev:
                current_evidence_level = EVIDENCE_MAP.get(m_ev.group(1), 3)
                continue

            # 3. Check Property
            m_prop = pat_property.match(clean_text(line))
            if m_prop and current_remedy_name:
                key = m_prop.group(1).title()
                val = m_prop.group(2).strip()
                current_remedy_buffer[key] = val
                continue
            
            # 4. Check potential Remedy Name
            # If line is short-ish, and we have a condition, and it's not a property
            # This is the "fuzzy" part. 
            # Example: "St. John's Wort (Hypericum perforatum) - Standardized Extract"
            clean = clean_text(line)
            
            # Heuristics for a Remedy Name line:
            # - Starts with bullet OR is text
            # - Contains '(' often for scientific name
            # - Doesn't contain ':' (property)
            # - Under 100 chars
            if ':' not in clean and len(clean) < 100 and current_condition:
                 # It might be a remedy.
                 # Save previous
                 if current_remedy_name:
                     org = await get_or_create_organism(session, current_remedy_name, current_remedy_buffer.get('sci_name'))
                     await create_link(session, org, current_condition, current_evidence_level, current_remedy_buffer)
                     current_remedy_name = None
                     current_remedy_buffer = {}

                 # Parse Name and Scientific Name
                 # "Name (Sci Name) - Notes"
                 # Remove text after ' - '
                 base = clean.split(' - ')[0]
                 
                 # Extract sci name
                 sci_name = None
                 m_sci = re.search(r'\((.*?)\)', base)
                 if m_sci:
                     sci_name = m_sci.group(1)
                     base = base.replace(f"({sci_name})", "").strip()
                 
                 current_remedy_name = base
                 current_remedy_buffer = {'sci_name': sci_name}
                 # print(f"Found Potential Remedy: {base}")
                 continue

            # 5. Fallback: Append content to last property or description
            if current_remedy_name:
                # Add to a general 'description' or append to last known property?
                # For now just ignore extra lines or append to 'notes'
                pass

        # Final save
        if current_remedy_name and current_condition:
             org = await get_or_create_organism(session, current_remedy_name, current_remedy_buffer.get('sci_name'))
             await create_link(session, org, current_condition, current_evidence_level, current_remedy_buffer)

        await session.commit()
        print("Ingestion Complete.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_guide.py <path_to_txt>")
        sys.exit(1)
    
    asyncio.run(ingest_file(sys.argv[1]))
