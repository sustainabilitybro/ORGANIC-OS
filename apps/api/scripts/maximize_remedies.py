
import asyncio
import os
import sys
import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

# Add the backend directory to the sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database.connection import engine, Base
from app.models.organisms import Organism
from app.models.compounds import Compound
from app.models.indications import Indication
from app.models.remedy_indications import RemedyIndication

MARKDOWN_PATH = "/Users/jessehenry/Desktop/MY APPS/ORGANIC OS MARKDOWNS/List of Alternative Ingredients.md"

async def maximize_remedies():
    path = MARKDOWN_PATH
    if len(sys.argv) > 1:
        path = sys.argv[1]
    
    # Fallback to container path if host path doesn't exist
    if not os.path.exists(path) and os.path.exists("/app/markdowns/List of Alternative Ingredients.md"):
        path = "/app/markdowns/List of Alternative Ingredients.md"

    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    with open(path, 'r') as f:
        content = f.read()

    # Split content by sections to assign indications
    sections = re.split(r'### ', content)
    
    async with AsyncSession(engine) as db:
        print(f"Processing {len(sections)} sections from markdown...")
        
        for section in sections:
            lines = section.split('\n')
            if not lines:
                continue
            
            section_name = lines[0].strip()
            if not section_name:
                continue
            
            # Create or get indication for this section (e.g., 'Emollients')
            result = await db.execute(select(Indication).where(Indication.condition_name == section_name))
            indication = result.scalar_one_or_none()
            if not indication:
                indication = Indication(
                    condition_name=section_name,
                    disease_category="Ingredient Role",
                    description=f"Ingredients used as {section_name.lower()} in formulations."
                )
                db.add(indication)
                await db.flush() # Get the ID
            
            # Find ingredients in this section
            matches = re.findall(r'> [•\-*] ([^:]+): ([^\n]+)', section)
            
            for name, description in matches:
                name = name.strip()
                description = description.strip()
                
                is_derived = any(word in name for word in ['Oil', 'Extract', 'Butter', 'Wax', 'Gel', 'Flour', 'Powder'])
                
                item_id = None
                item_type = None
                
                if is_derived:
                    # Organism
                    result = await db.execute(select(Organism).where(Organism.common_name_en == name))
                    organism = result.scalar_one_or_none()
                    if not organism:
                        source_match = re.search(r'from ([^,.]+)', description)
                        source = source_match.group(1) if source_match else "Unknown"
                        organism = Organism(
                            common_name_en=name,
                            description=description,
                            organism_type="Ingredient",
                            primary_source_region=source
                        )
                        db.add(organism)
                        await db.flush()
                    item_id = organism.id
                    item_type = "organism"
                else:
                    # Compound
                    result = await db.execute(select(Compound).where(Compound.common_name == name))
                    compound = result.scalar_one_or_none()
                    if not compound:
                        compound = Compound(
                            common_name=name,
                            description=description,
                            verification_status='verified'
                        )
                        db.add(compound)
                        await db.flush()
                    item_id = compound.id
                    item_type = "compound"
                
                # Link to indication
                if item_id:
                    # Check if link exists
                    filters = [RemedyIndication.indication_id == indication.id]
                    if item_type == "organism":
                        filters.append(RemedyIndication.organism_id == item_id)
                    else:
                        filters.append(RemedyIndication.compound_id == item_id)
                    
                    link_result = await db.execute(select(RemedyIndication).where(and_(*filters)))
                    if not link_result.scalar_one_or_none():
                        ri = RemedyIndication(
                            organism_id=item_id if item_type == "organism" else None,
                            compound_id=item_id if item_type == "compound" else None,
                            indication_id=indication.id,
                            remedy_role="primary" if "Provides" in description or "Acts as" in description else "supportive",
                            evidence_level=4 # Documentary/Textual evidence
                        )
                        db.add(ri)
        
        await db.commit()
        print("Remedies, compounds, and roles maximization complete.")

if __name__ == "__main__":
    asyncio.run(maximize_remedies())
