"""
Seed the database with initial sample data for demonstration.
Run this script to populate the database with remedies, conditions, and evidence.
"""

import asyncio
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import AsyncSessionLocal, init_db
from app.models.organisms import Organism
from app.models.indications import Indication
from app.models.remedy_indications import RemedyIndication
from app.models.safety import SafetyProfile
from app.models.evidence import EvidenceItem
from app.models.curators import Curator
from app.api.auth import get_password_hash



async def seed_database():
    """Seed the database with sample data."""
    
    print("Initializing database...")
    await init_db()
    
    async with AsyncSessionLocal() as db:
        # No skip - let it run through
        print("Starting seeding process...")

        
        print("Seeding organisms (remedies)...")
        organisms = await seed_organisms(db)
        
        print("Seeding indications (conditions)...")
        indications = await seed_indications(db)
        
        print("Seeding remedy-indication relationships...")
        await seed_remedy_indications(db, organisms, indications)
        
        print("Seeding safety profiles...")
        await seed_safety_profiles(db, organisms)
        
        print("Seeding sample evidence items...")
        await seed_evidence(db)
        
        print("Seeding administrative accounts...")
        await seed_curators(db)

        
        await db.commit()
        print("Database seeded successfully!")


async def seed_organisms(db: AsyncSession) -> dict:
    """Create sample organism entries."""
    
    organisms_data = [
        {
            "common_name_en": "Turmeric",
            "taxonomy_family": "Zingiberaceae",
            "taxonomy_genus": "Curcuma",
            "taxonomy_species": "longa",
            "organism_type": "plant",
            "organism_subtype": "rhizome",
            "description": "Turmeric is a flowering plant in the ginger family, widely used as a spice and traditional medicine. The bright yellow rhizome contains curcumin, a polyphenol with potent anti-inflammatory and antioxidant properties. It has been used for over 4,000 years in Ayurvedic and traditional Chinese medicine.",
            "synonyms": ["Haldi", "Golden Spice", "Indian Saffron", "Curcuma domestica"],
            "traditional_systems": ["Ayurveda", "TCM", "Western Herbalism"],
            "known_compounds": [
                {"name": "Curcumin", "concentration_range": "2-8%", "source": "rhizome"},
                {"name": "Demethoxycurcumin", "concentration_range": "1-3%", "source": "rhizome"},
                {"name": "Bisdemethoxycurcumin", "concentration_range": "0.5-1%", "source": "rhizome"},
                {"name": "Turmerone", "concentration_range": "variable", "source": "essential oil"}
            ],
            "parts_used": ["rhizome", "root"],
            "iucn_conservation_status": "LC",
            "cultivation_status": "cultivated",
            "primary_source_region": "South Asia",
            "verification_status": "verified",
            "confidence_score": 0.95
        },
        {
            "common_name_en": "Ashwagandha",
            "taxonomy_family": "Solanaceae",
            "taxonomy_genus": "Withania",
            "taxonomy_species": "somnifera",
            "organism_type": "plant",
            "organism_subtype": "root",
            "description": "Ashwagandha is a powerful adaptogenic herb that has been used in Ayurvedic medicine for over 3,000 years. It is known for its ability to help the body manage stress, improve energy levels, and support cognitive function. The root contains withanolides, which are the primary bioactive compounds.",
            "synonyms": ["Indian Ginseng", "Winter Cherry", "Withania"],
            "traditional_systems": ["Ayurveda"],
            "known_compounds": [
                {"name": "Withanolide A", "concentration_range": "0.1-0.5%", "source": "root"},
                {"name": "Withaferin A", "concentration_range": "0.2-0.8%", "source": "root"},
                {"name": "Withanone", "concentration_range": "0.1-0.3%", "source": "root"}
            ],
            "parts_used": ["root", "leaf"],
            "iucn_conservation_status": "LC",
            "cultivation_status": "cultivated",
            "primary_source_region": "India",
            "verification_status": "verified",
            "confidence_score": 0.92
        },
        {
            "common_name_en": "Ginger",
            "taxonomy_family": "Zingiberaceae",
            "taxonomy_genus": "Zingiber",
            "taxonomy_species": "officinale",
            "organism_type": "plant",
            "organism_subtype": "rhizome",
            "description": "Ginger is a widely used spice and medicinal plant with a long history in traditional medicine systems worldwide. It contains gingerols and shogaols, which provide its characteristic pungent flavor and therapeutic properties including anti-nausea, anti-inflammatory, and digestive benefits.",
            "synonyms": ["Ginger Root", "Zingiber", "Adrak"],
            "traditional_systems": ["Ayurveda", "TCM", "Western Herbalism", "Unani"],
            "known_compounds": [
                {"name": "6-Gingerol", "concentration_range": "1-3%", "source": "rhizome"},
                {"name": "6-Shogaol", "concentration_range": "0.5-1%", "source": "dried rhizome"},
                {"name": "Zingerone", "concentration_range": "variable", "source": "rhizome"}
            ],
            "parts_used": ["rhizome"],
            "iucn_conservation_status": "LC",
            "cultivation_status": "cultivated",
            "primary_source_region": "Southeast Asia",
            "verification_status": "verified",
            "confidence_score": 0.94
        },
        {
            "common_name_en": "Echinacea",
            "taxonomy_family": "Asteraceae",
            "taxonomy_genus": "Echinacea",
            "taxonomy_species": "purpurea",
            "organism_type": "plant",
            "organism_subtype": "aerial parts and root",
            "description": "Echinacea is a North American coneflower traditionally used by Native Americans for various ailments. It is now one of the most popular herbal remedies for supporting immune function and reducing cold and flu symptoms. Contains alkamides, polysaccharides, and caffeic acid derivatives.",
            "synonyms": ["Purple Coneflower", "American Coneflower"],
            "traditional_systems": ["Native American Medicine", "Western Herbalism"],
            "known_compounds": [
                {"name": "Alkamides", "concentration_range": "0.01-0.5%", "source": "root"},
                {"name": "Chicoric acid", "concentration_range": "0.5-2%", "source": "aerial parts"},
                {"name": "Polysaccharides", "concentration_range": "variable", "source": "root"}
            ],
            "parts_used": ["root", "aerial parts", "flower"],
            "iucn_conservation_status": "LC",
            "cultivation_status": "cultivated",
            "primary_source_region": "North America",
            "verification_status": "verified",
            "confidence_score": 0.88
        },
        {
            "common_name_en": "Lion's Mane Mushroom",
            "taxonomy_family": "Hericiaceae",
            "taxonomy_genus": "Hericium",
            "taxonomy_species": "erinaceus",
            "organism_type": "fungus",
            "organism_subtype": "fruiting body",
            "description": "Lion's Mane is an edible and medicinal mushroom known for its unique appearance and potential cognitive benefits. It contains hericenones and erinacines, compounds that may stimulate nerve growth factor (NGF) production. Used in traditional Chinese medicine for digestive and neurological support.",
            "synonyms": ["Yamabushitake", "Hou Tou Gu", "Bearded Tooth Mushroom"],
            "traditional_systems": ["TCM", "Japanese Medicine"],
            "known_compounds": [
                {"name": "Hericenones", "concentration_range": "variable", "source": "fruiting body"},
                {"name": "Erinacines", "concentration_range": "variable", "source": "mycelium"},
                {"name": "Beta-glucans", "concentration_range": "15-30%", "source": "fruiting body"}
            ],
            "parts_used": ["fruiting body", "mycelium"],
            "iucn_conservation_status": "LC",
            "cultivation_status": "both",
            "primary_source_region": "East Asia",
            "verification_status": "verified",
            "confidence_score": 0.85
        },
        {
            "common_name_en": "Valerian",
            "taxonomy_family": "Caprifoliaceae",
            "taxonomy_genus": "Valeriana",
            "taxonomy_species": "officinalis",
            "organism_type": "plant",
            "organism_subtype": "root",
            "description": "Valerian root has been used since ancient Greek and Roman times as a natural sleep aid and anxiolytic. It contains valerenic acid and other compounds that interact with GABA receptors, promoting relaxation and sleep. Known for its distinctive strong odor.",
            "synonyms": ["All-Heal", "Garden Heliotrope", "Setwall"],
            "traditional_systems": ["Western Herbalism", "Unani", "Traditional European Medicine"],
            "known_compounds": [
                {"name": "Valerenic acid", "concentration_range": "0.1-0.8%", "source": "root"},
                {"name": "Isovaleric acid", "concentration_range": "variable", "source": "root"},
                {"name": "Valepotriates", "concentration_range": "0.5-2%", "source": "root"}
            ],
            "parts_used": ["root", "rhizome"],
            "iucn_conservation_status": "LC",
            "cultivation_status": "cultivated",
            "primary_source_region": "Europe",
            "verification_status": "verified",
            "confidence_score": 0.90
        },
        {
            "common_name_en": "Milk Thistle",
            "taxonomy_family": "Asteraceae",
            "taxonomy_genus": "Silybum",
            "taxonomy_species": "marianum",
            "organism_type": "plant",
            "organism_subtype": "seed",
            "description": "Milk Thistle has been used for over 2,000 years as a liver protectant and tonic. The seeds contain silymarin, a complex of flavonolignans with potent hepatoprotective and antioxidant properties. It is one of the most well-researched herbs for liver health.",
            "synonyms": ["Holy Thistle", "Marian Thistle", "Silybum"],
            "traditional_systems": ["Western Herbalism", "Traditional European Medicine"],
            "known_compounds": [
                {"name": "Silymarin", "concentration_range": "1.5-3%", "source": "seed"},
                {"name": "Silybin", "concentration_range": "50-70% of silymarin", "source": "seed"},
                {"name": "Silychristin", "concentration_range": "20% of silymarin", "source": "seed"}
            ],
            "parts_used": ["seed"],
            "iucn_conservation_status": "LC",
            "cultivation_status": "cultivated",
            "primary_source_region": "Mediterranean",
            "verification_status": "verified",
            "confidence_score": 0.93
        },
        {
            "common_name_en": "Reishi Mushroom",
            "taxonomy_family": "Ganodermataceae",
            "taxonomy_genus": "Ganoderma",
            "taxonomy_species": "lucidum",
            "organism_type": "fungus",
            "organism_subtype": "fruiting body",
            "description": "Reishi is known as the 'Mushroom of Immortality' in traditional Chinese medicine. It has been used for over 2,000 years to promote longevity, enhance immune function, and support overall wellness. Contains triterpenes (ganoderic acids) and polysaccharides with immunomodulating properties.",
            "synonyms": ["Lingzhi", "Ganoderma", "Mannentake"],
            "traditional_systems": ["TCM", "Japanese Medicine", "Korean Medicine"],
            "known_compounds": [
                {"name": "Ganoderic acids", "concentration_range": "1-5%", "source": "fruiting body"},
                {"name": "Beta-glucans", "concentration_range": "25-40%", "source": "fruiting body"},
                {"name": "Triterpenes", "concentration_range": "2-8%", "source": "fruiting body"}
            ],
            "parts_used": ["fruiting body", "spores", "mycelium"],
            "iucn_conservation_status": "LC",
            "cultivation_status": "cultivated",
            "primary_source_region": "East Asia",
            "verification_status": "verified",
            "confidence_score": 0.91
        }
    ]
    
    organisms = {}
    for data in organisms_data:
        org = Organism(**data)
        db.add(org)
        await db.flush()
        organisms[data["common_name_en"]] = org
    
    return organisms


async def seed_indications(db: AsyncSession) -> dict:
    """Create sample indication entries."""
    
    indications_data = [
        {
            "condition_name": "Rheumatoid Arthritis",
            "disease_category": "autoimmune",
            "disease_subcategory": "inflammatory arthritis",
            "description": "A chronic autoimmune disorder that primarily affects joints, causing inflammation, pain, swelling, and eventual joint destruction. It can also affect other organ systems.",
            "alternative_names": ["RA", "Rheumatoid Disease"],
            "icd_11_code": "FA20",
            "body_system": ["musculoskeletal", "immune"],
            "primary_symptoms": ["joint pain", "joint swelling", "morning stiffness", "fatigue"],
            "secondary_symptoms": ["fever", "weight loss", "nodules"],
            "prevalence_per_100k_global": 500,
            "standard_of_care_primary": "DMARDs (methotrexate, biologics)",
            "verification_status": "verified"
        },
        {
            "condition_name": "Generalized Anxiety Disorder",
            "disease_category": "psychiatric",
            "disease_subcategory": "anxiety disorders",
            "description": "A mental health condition characterized by persistent and excessive worry about various aspects of daily life, often out of proportion to the actual situation.",
            "alternative_names": ["GAD", "Chronic Anxiety"],
            "icd_11_code": "6B00",
            "body_system": ["nervous", "psychiatric"],
            "primary_symptoms": ["excessive worry", "restlessness", "difficulty concentrating", "sleep disturbance"],
            "secondary_symptoms": ["muscle tension", "irritability", "fatigue"],
            "prevalence_per_100k_global": 3500,
            "standard_of_care_primary": "SSRIs, CBT therapy",
            "verification_status": "verified"
        },
        {
            "condition_name": "Type 2 Diabetes",
            "disease_category": "metabolic",
            "disease_subcategory": "glucose metabolism disorders",
            "description": "A metabolic disorder characterized by insulin resistance and relative insulin deficiency, leading to elevated blood glucose levels. Often associated with obesity and lifestyle factors.",
            "alternative_names": ["T2DM", "Adult-onset Diabetes", "Non-insulin Dependent Diabetes"],
            "icd_11_code": "5A11",
            "body_system": ["endocrine", "metabolic"],
            "primary_symptoms": ["increased thirst", "frequent urination", "fatigue", "blurred vision"],
            "secondary_symptoms": ["slow wound healing", "recurrent infections", "weight changes"],
            "prevalence_per_100k_global": 6000,
            "standard_of_care_primary": "Metformin, lifestyle modification",
            "verification_status": "verified"
        },
        {
            "condition_name": "Insomnia",
            "disease_category": "sleep disorders",
            "disease_subcategory": "sleep-wake disorders",
            "description": "A sleep disorder characterized by difficulty falling asleep, staying asleep, or waking too early and not being able to return to sleep, despite adequate opportunity for sleep.",
            "alternative_names": ["Sleeplessness", "Sleep Onset Insomnia", "Sleep Maintenance Insomnia"],
            "icd_11_code": "7A00",
            "body_system": ["nervous"],
            "primary_symptoms": ["difficulty falling asleep", "night waking", "early morning waking", "daytime fatigue"],
            "secondary_symptoms": ["irritability", "concentration problems", "mood changes"],
            "prevalence_per_100k_global": 10000,
            "standard_of_care_primary": "CBT-I, sleep hygiene, melatonin",
            "verification_status": "verified"
        },
        {
            "condition_name": "Mild Cognitive Impairment",
            "disease_category": "neurological",
            "disease_subcategory": "cognitive disorders",
            "description": "A condition characterized by noticeable decline in cognitive abilities, including memory and thinking skills, beyond what is expected for normal aging but not severe enough to interfere significantly with daily life.",
            "alternative_names": ["MCI", "Pre-dementia", "Early Memory Loss"],
            "icd_11_code": "6D71",
            "body_system": ["nervous"],
            "primary_symptoms": ["memory loss", "difficulty concentrating", "word-finding problems"],
            "secondary_symptoms": ["misplacing items", "difficulty with complex tasks"],
            "prevalence_per_100k_global": 1500,
            "standard_of_care_primary": "Cognitive training, lifestyle modification",
            "verification_status": "verified"
        },
        {
            "condition_name": "Non-Alcoholic Fatty Liver Disease",
            "disease_category": "hepatic",
            "disease_subcategory": "metabolic liver disease",
            "description": "A condition where excess fat builds up in the liver of people who drink little or no alcohol. It is closely linked to metabolic syndrome and can progress to more serious liver disease.",
            "alternative_names": ["NAFLD", "Fatty Liver", "Hepatic Steatosis"],
            "icd_11_code": "DB92.0",
            "body_system": ["hepatic", "metabolic"],
            "primary_symptoms": ["often asymptomatic", "fatigue", "right upper abdominal discomfort"],
            "secondary_symptoms": ["elevated liver enzymes", "enlarged liver"],
            "prevalence_per_100k_global": 25000,
            "standard_of_care_primary": "Weight loss, lifestyle modification",
            "verification_status": "verified"
        },
        {
            "condition_name": "Common Cold",
            "disease_category": "infectious",
            "disease_subcategory": "viral respiratory infection",
            "description": "A viral infection of the upper respiratory tract caused most commonly by rhinoviruses. Self-limiting but can cause significant discomfort and lost productivity.",
            "alternative_names": ["Upper Respiratory Infection", "URI", "Acute Coryza"],
            "icd_11_code": "CA00",
            "body_system": ["respiratory", "immune"],
            "primary_symptoms": ["runny nose", "sore throat", "cough", "congestion"],
            "secondary_symptoms": ["mild fever", "sneezing", "headache"],
            "prevalence_per_100k_global": 50000,
            "standard_of_care_primary": "Supportive care, rest, hydration",
            "verification_status": "verified"
        },
        {
            "condition_name": "Nausea and Vomiting",
            "disease_category": "gastrointestinal",
            "disease_subcategory": "functional GI symptoms",
            "description": "Symptoms that can occur due to various causes including motion sickness, pregnancy, chemotherapy, surgery, and gastrointestinal disorders.",
            "alternative_names": ["Emesis", "Morning Sickness", "Motion Sickness"],
            "icd_11_code": "MD90",
            "body_system": ["gastrointestinal"],
            "primary_symptoms": ["nausea", "vomiting", "stomach discomfort"],
            "secondary_symptoms": ["loss of appetite", "dizziness", "sweating"],
            "prevalence_per_100k_global": 30000,
            "standard_of_care_primary": "Antiemetics, hydration",
            "verification_status": "verified"
        }
    ]
    
    indications = {}
    for data in indications_data:
        ind = Indication(**data)
        db.add(ind)
        await db.flush()
        indications[data["condition_name"]] = ind
    
    return indications


async def seed_remedy_indications(db: AsyncSession, organisms: dict, indications: dict):
    """Create remedy-indication relationships with evidence data."""
    
    relationships = [
        # Turmeric relationships
        {
            "organism": "Turmeric",
            "indication": "Rheumatoid Arthritis",
            "evidence_level": 2,
            "evidence_certainty": "moderate",
            "preparation_method": "standardized_extract",
            "remedy_role": "adjunctive",
            "rct_count": 8,
            "rct_total_participants": 512,
            "meta_analyses_count": 2,
            "effect_size_magnitude": 0.65,
            "primary_outcome_measured": "Pain reduction (VAS score)",
            "primary_outcome_effect": "significantly_improved",
            "primary_outcome_magnitude": "30-50% pain reduction",
            "safety_profile_assessment": "well_tolerated",
            "adverse_events": [
                {"event": "GI upset", "frequency": "5-10%", "severity": "mild"},
                {"event": "Nausea", "frequency": "2-5%", "severity": "mild"}
            ],
            "typical_dose_min_mg": 500,
            "typical_dose_max_mg": 2000,
            "typical_dose_frequency": "divided doses, twice daily with meals",
            "herb_drug_interactions": [
                {"drug": "Warfarin", "mechanism": "Antiplatelet effect", "severity": "moderate", "advice": "Monitor INR"}
            ],
            "contraindications": ["bile duct obstruction", "gallstones"],
            "proposed_mechanisms": [
                {"mechanism": "NF-κB inhibition", "confidence": "high", "source_count": 45},
                {"mechanism": "COX-2 inhibition", "confidence": "high", "source_count": 38}
            ],
            "traditional_systems_using": ["Ayurveda", "TCM"],
            "years_of_traditional_use": 4000,
            "overall_recommendation": "moderately_supported",
            "recommendation_for_use": "adjunctive"
        },
        {
            "organism": "Turmeric",
            "indication": "Type 2 Diabetes",
            "evidence_level": 3,
            "evidence_certainty": "low",
            "preparation_method": "standardized_extract",
            "remedy_role": "adjunctive",
            "rct_count": 5,
            "rct_total_participants": 280,
            "effect_size_magnitude": 0.42,
            "primary_outcome_measured": "HbA1c reduction",
            "primary_outcome_effect": "moderately_improved",
            "safety_profile_assessment": "well_tolerated",
            "typical_dose_min_mg": 1000,
            "typical_dose_max_mg": 2000,
            "typical_dose_frequency": "twice daily with meals",
            "overall_recommendation": "weak_evidence",
            "recommendation_for_use": "adjunctive"
        },
        # Ashwagandha relationships
        {
            "organism": "Ashwagandha",
            "indication": "Generalized Anxiety Disorder",
            "evidence_level": 2,
            "evidence_certainty": "moderate",
            "preparation_method": "standardized_extract",
            "remedy_role": "primary",
            "rct_count": 6,
            "rct_total_participants": 420,
            "meta_analyses_count": 1,
            "effect_size_magnitude": 0.78,
            "primary_outcome_measured": "Hamilton Anxiety Scale (HAM-A)",
            "primary_outcome_effect": "significantly_improved",
            "primary_outcome_magnitude": "40-60% reduction in anxiety scores",
            "safety_profile_assessment": "well_tolerated",
            "adverse_events": [
                {"event": "Drowsiness", "frequency": "5%", "severity": "mild"},
                {"event": "GI upset", "frequency": "3%", "severity": "mild"}
            ],
            "typical_dose_min_mg": 300,
            "typical_dose_max_mg": 600,
            "typical_dose_frequency": "once or twice daily",
            "contraindications": ["pregnancy", "autoimmune thyroid conditions"],
            "proposed_mechanisms": [
                {"mechanism": "GABAergic modulation", "confidence": "moderate", "source_count": 12},
                {"mechanism": "Cortisol reduction", "confidence": "high", "source_count": 18}
            ],
            "traditional_systems_using": ["Ayurveda"],
            "years_of_traditional_use": 3000,
            "overall_recommendation": "moderately_supported",
            "recommendation_for_use": "first_line"
        },
        # Ginger relationships
        {
            "organism": "Ginger",
            "indication": "Nausea and Vomiting",
            "evidence_level": 1,
            "evidence_certainty": "high",
            "preparation_method": "dried powder or extract",
            "remedy_role": "primary",
            "rct_count": 15,
            "rct_total_participants": 1200,
            "meta_analyses_count": 4,
            "effect_size_magnitude": 0.85,
            "primary_outcome_measured": "Nausea intensity reduction",
            "primary_outcome_effect": "significantly_improved",
            "primary_outcome_magnitude": "50-70% reduction in nausea episodes",
            "safety_profile_assessment": "well_tolerated",
            "adverse_events": [
                {"event": "Heartburn", "frequency": "3%", "severity": "mild"},
                {"event": "Mild GI discomfort", "frequency": "2%", "severity": "mild"}
            ],
            "typical_dose_min_mg": 250,
            "typical_dose_max_mg": 1000,
            "typical_dose_frequency": "as needed, up to 4g daily",
            "proposed_mechanisms": [
                {"mechanism": "5-HT3 receptor antagonism", "confidence": "high", "source_count": 25}
            ],
            "traditional_systems_using": ["Ayurveda", "TCM", "Western Herbalism"],
            "years_of_traditional_use": 5000,
            "overall_recommendation": "strongly_supported",
            "recommendation_for_use": "first_line"
        },
        # Valerian relationships
        {
            "organism": "Valerian",
            "indication": "Insomnia",
            "evidence_level": 2,
            "evidence_certainty": "moderate",
            "preparation_method": "extract or dried root",
            "remedy_role": "primary",
            "rct_count": 12,
            "rct_total_participants": 680,
            "meta_analyses_count": 2,
            "effect_size_magnitude": 0.55,
            "primary_outcome_measured": "Sleep quality (PSQI)",
            "primary_outcome_effect": "moderately_improved",
            "primary_outcome_magnitude": "Improved sleep quality, reduced sleep latency",
            "safety_profile_assessment": "well_tolerated",
            "adverse_events": [
                {"event": "Morning grogginess", "frequency": "8%", "severity": "mild"},
                {"event": "Vivid dreams", "frequency": "5%", "severity": "mild"}
            ],
            "typical_dose_min_mg": 300,
            "typical_dose_max_mg": 600,
            "typical_dose_frequency": "30-60 minutes before bed",
            "herb_drug_interactions": [
                {"drug": "Benzodiazepines", "mechanism": "Additive sedation", "severity": "moderate"}
            ],
            "proposed_mechanisms": [
                {"mechanism": "GABA-A receptor modulation", "confidence": "moderate", "source_count": 15}
            ],
            "traditional_systems_using": ["Western Herbalism"],
            "years_of_traditional_use": 2000,
            "overall_recommendation": "moderately_supported",
            "recommendation_for_use": "first_line"
        },
        # Lion's Mane relationships
        {
            "organism": "Lion's Mane Mushroom",
            "indication": "Mild Cognitive Impairment",
            "evidence_level": 3,
            "evidence_certainty": "low",
            "preparation_method": "extract or powder",
            "remedy_role": "preventive",
            "rct_count": 3,
            "rct_total_participants": 150,
            "effect_size_magnitude": 0.48,
            "primary_outcome_measured": "Cognitive function scores",
            "primary_outcome_effect": "moderately_improved",
            "safety_profile_assessment": "well_tolerated",
            "typical_dose_min_mg": 500,
            "typical_dose_max_mg": 3000,
            "typical_dose_frequency": "daily",
            "proposed_mechanisms": [
                {"mechanism": "NGF stimulation", "confidence": "moderate", "source_count": 8}
            ],
            "traditional_systems_using": ["TCM"],
            "years_of_traditional_use": 1000,
            "overall_recommendation": "weak_evidence",
            "recommendation_for_use": "experimental"
        },
        # Milk Thistle relationships
        {
            "organism": "Milk Thistle",
            "indication": "Non-Alcoholic Fatty Liver Disease",
            "evidence_level": 2,
            "evidence_certainty": "moderate",
            "preparation_method": "standardized_extract",
            "remedy_role": "adjunctive",
            "rct_count": 8,
            "rct_total_participants": 450,
            "meta_analyses_count": 1,
            "effect_size_magnitude": 0.58,
            "primary_outcome_measured": "Liver enzyme reduction (ALT/AST)",
            "primary_outcome_effect": "significantly_improved",
            "primary_outcome_magnitude": "25-40% reduction in liver enzymes",
            "safety_profile_assessment": "well_tolerated",
            "typical_dose_min_mg": 140,
            "typical_dose_max_mg": 420,
            "typical_dose_frequency": "divided doses, 2-3 times daily",
            "proposed_mechanisms": [
                {"mechanism": "Antioxidant protection", "confidence": "high", "source_count": 30},
                {"mechanism": "Anti-inflammatory", "confidence": "moderate", "source_count": 20}
            ],
            "traditional_systems_using": ["Western Herbalism"],
            "years_of_traditional_use": 2000,
            "overall_recommendation": "moderately_supported",
            "recommendation_for_use": "adjunctive"
        },
        # Echinacea relationships
        {
            "organism": "Echinacea",
            "indication": "Common Cold",
            "evidence_level": 2,
            "evidence_certainty": "moderate",
            "preparation_method": "extract",
            "remedy_role": "symptomatic",
            "rct_count": 20,
            "rct_total_participants": 2500,
            "meta_analyses_count": 3,
            "effect_size_magnitude": 0.42,
            "primary_outcome_measured": "Cold duration and severity",
            "primary_outcome_effect": "moderately_improved",
            "primary_outcome_magnitude": "1-2 day reduction in cold duration",
            "safety_profile_assessment": "well_tolerated",
            "adverse_events": [
                {"event": "GI upset", "frequency": "5%", "severity": "mild"},
                {"event": "Allergic reaction", "frequency": "1%", "severity": "moderate"}
            ],
            "typical_dose_min_mg": 900,
            "typical_dose_max_mg": 2400,
            "typical_dose_frequency": "divided doses, at first sign of cold",
            "contraindications": ["autoimmune conditions", "ragweed allergy"],
            "proposed_mechanisms": [
                {"mechanism": "Immune modulation", "confidence": "moderate", "source_count": 25}
            ],
            "traditional_systems_using": ["Native American Medicine", "Western Herbalism"],
            "years_of_traditional_use": 400,
            "overall_recommendation": "moderately_supported",
            "recommendation_for_use": "first_line"
        }
    ]
    
    for data in relationships:
        org = organisms.get(data.pop("organism"))
        ind = indications.get(data.pop("indication"))
        
        if org and ind:
            ri = RemedyIndication(
                organism_id=org.id,
                indication_id=ind.id,
                is_published=True,
                verification_status="verified",
                **data
            )
            db.add(ri)


async def seed_safety_profiles(db: AsyncSession, organisms: dict):
    """Create safety profiles for organisms."""
    
    safety_data = [
        {
            "organism": "Turmeric",
            "adverse_events": [
                {"event": "GI upset", "frequency": "5-10%", "severity": "mild", "onset_hours": 1},
                {"event": "Nausea", "frequency": "2-5%", "severity": "mild", "onset_hours": 1},
                {"event": "Diarrhea", "frequency": "1-3%", "severity": "mild", "onset_hours": 2}
            ],
            "hepatotoxicity": False,
            "nephrotoxicity": False,
            "pregnancy_safety": "Avoid high doses during pregnancy; culinary amounts considered safe",
            "pregnancy_category": "C",
            "lactation_safety": "Likely safe in culinary amounts; high dose extracts not recommended",
            "absolute_contraindications": ["bile duct obstruction", "gallstones"],
            "relative_contraindications": ["upcoming surgery (stop 2 weeks before)"],
            "herb_drug_interactions": [
                {"drug_name": "Warfarin", "mechanism": "Antiplatelet effect", "severity": "moderate", "evidence": "clinical"},
                {"drug_name": "Antiplatelet drugs", "mechanism": "Additive bleeding risk", "severity": "moderate", "evidence": "theoretical"}
            ],
            "allergenic_potential": "low",
            "data_confidence_score": 0.9
        },
        {
            "organism": "Ashwagandha",
            "adverse_events": [
                {"event": "Drowsiness", "frequency": "5%", "severity": "mild", "onset_hours": 2},
                {"event": "GI upset", "frequency": "3%", "severity": "mild", "onset_hours": 1}
            ],
            "hepatotoxicity": False,
            "nephrotoxicity": False,
            "pregnancy_safety": "Contraindicated - may have abortifacient properties",
            "pregnancy_category": "X",
            "lactation_safety": "Insufficient data - avoid",
            "absolute_contraindications": ["pregnancy", "hyperthyroidism"],
            "relative_contraindications": ["autoimmune conditions"],
            "herb_drug_interactions": [
                {"drug_name": "Thyroid medications", "mechanism": "May increase thyroid hormone", "severity": "moderate"},
                {"drug_name": "Immunosuppressants", "mechanism": "May counteract effects", "severity": "moderate"}
            ],
            "allergenic_potential": "low",
            "data_confidence_score": 0.85
        },
        {
            "organism": "Ginger",
            "adverse_events": [
                {"event": "Heartburn", "frequency": "3%", "severity": "mild", "onset_hours": 0.5},
                {"event": "Mouth irritation", "frequency": "2%", "severity": "mild"}
            ],
            "hepatotoxicity": False,
            "nephrotoxicity": False,
            "pregnancy_safety": "Generally considered safe for pregnancy-related nausea (up to 1g/day)",
            "pregnancy_category": "B",
            "lactation_safety": "Likely safe in culinary amounts",
            "absolute_contraindications": [],
            "relative_contraindications": ["gallstones"],
            "herb_drug_interactions": [
                {"drug_name": "Anticoagulants", "mechanism": "Mild antiplatelet effect", "severity": "low"}
            ],
            "allergenic_potential": "low",
            "data_confidence_score": 0.92
        }
    ]
    
    for data in safety_data:
        org = organisms.get(data.pop("organism"))
        if org:
            sp = SafetyProfile(
                organism_id=org.id,
                is_published=True,
                verification_status="verified",
                **data
            )
            db.add(sp)


async def seed_evidence(db: AsyncSession):
    """Create sample evidence items."""
    
    evidence_data = [
        {
            "source_type": "pubmed_article",
            "source_id": "PMID:28236605",
            "title": "Efficacy and Safety of Curcumin in Major Depressive Disorder: A Randomized Controlled Trial",
            "pmid": 28236605,
            "publication_year": 2017,
            "journal_name": "Journal of Affective Disorders",
            "study_design": "RCT",
            "sample_size_total": 123,
            "quality_score_jadad": 4,
            "risk_of_bias_category": "low",
            "abstract": "This double-blind, placebo-controlled study examined the efficacy of curcumin in patients with major depressive disorder...",
            "authors": [{"name": "Lopresti AL", "affiliation": "Murdoch University"}],
            "url_primary": "https://pubmed.ncbi.nlm.nih.gov/28236605/"
        },
        {
            "source_type": "pubmed_article",
            "source_id": "PMID:31046033",
            "title": "Ashwagandha (Withania somnifera) for Generalized Anxiety Disorder: A Systematic Review and Meta-Analysis",
            "pmid": 31046033,
            "publication_year": 2019,
            "journal_name": "Cureus",
            "study_design": "meta_analysis",
            "quality_score_jadad": None,
            "risk_of_bias_category": "low",
            "abstract": "This systematic review and meta-analysis evaluated the anxiolytic effects of ashwagandha...",
            "url_primary": "https://pubmed.ncbi.nlm.nih.gov/31046033/"
        },
        {
            "source_type": "pubmed_article",
            "source_id": "PMID:10793599",
            "title": "Ginger (Zingiber officinale) in Rheumatism and Musculoskeletal Disorders",
            "pmid": 10793599,
            "publication_year": 2001,
            "journal_name": "Medical Hypotheses",
            "study_design": "review",
            "abstract": "This review discusses the anti-inflammatory properties of ginger and its potential use in rheumatic conditions...",
            "url_primary": "https://pubmed.ncbi.nlm.nih.gov/10793599/"
        }
    ]
    
    for data in evidence_data:
        ev = EvidenceItem(
            is_published=True,
            **data
        )
        db.add(ev)


async def seed_curators(db: AsyncSession):
    """Create initial curator accounts if they don't exist."""
    from sqlalchemy import select
    
    # Check for admin
    result = await db.execute(select(Curator).where(Curator.username == "admin"))
    if not result.scalar_one_or_none():
        admin = Curator(
            username="admin",
            email="admin@globalremedies.org",
            full_name="System Administrator",
            password_hash=get_password_hash("admin123"),
            role="admin",
            expertise_domains=["Systems Architecture", "Medical Standards"],
            is_verified=True,
            can_review=True,
            can_approve_final=True
        )
        db.add(admin)
    
    # Check for lead_curator
    result = await db.execute(select(Curator).where(Curator.username == "lead_curator"))
    if not result.scalar_one_or_none():
        lead_curator = Curator(
            username="lead_curator",
            email="lead@globalremedies.org",
            full_name="Dr. Elena Vance",
            password_hash=get_password_hash("curator123"),
            role="lead_curator",
            expertise_domains=["Ethnobotany", "Pharmacology"],
            is_verified=True,
            can_review=True,
            can_approve_final=True
        )
        db.add(lead_curator)
    
    await db.flush()


if __name__ == "__main__":
    asyncio.run(seed_database())

