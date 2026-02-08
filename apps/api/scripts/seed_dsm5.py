
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import os
import sys

# Add the backend directory to the sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database.connection import get_db, engine, Base
from app.models.indications import Indication

DSM5_DATA = [
    {
        "condition_name": "Neurodevelopmental Disorders",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Neurodevelopmental",
        "dsm_5_code": "01",
        "description": "A group of conditions with onset in the developmental period.",
        "primary_symptoms": ["Developmental deficits", "Impairment in personal/social/academic functioning"]
    },
    {
        "condition_name": "Attention-Deficit/Hyperactivity Disorder (ADHD)",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Neurodevelopmental",
        "dsm_5_code": "314.0",
        "alternative_names": ["ADHD", "ADD"],
        "description": "A persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning or development.",
        "primary_symptoms": ["Inattention", "Hyperactivity", "Impulsivity"],
        "diagnostic_criteria": "6 or more symptoms of inattention or hyperactivity-impulsivity for at least 6 months."
    },
    {
        "condition_name": "Autism Spectrum Disorder",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Neurodevelopmental",
        "dsm_5_code": "299.00",
        "alternative_names": ["ASD"],
        "description": "Persistent deficits in social communication and social interaction across multiple contexts.",
        "primary_symptoms": ["Social deficits", "Repetitive behaviors", "Restricted interests"]
    },
    {
        "condition_name": "Generalized Anxiety Disorder",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Anxiety Disorders",
        "dsm_5_code": "300.02",
        "alternative_names": ["GAD"],
        "description": "Excessive anxiety and worry occurring more days than not for at least 6 months.",
        "primary_symptoms": ["Restlessness", "Fatigue", "Difficulty concentrating", "Irritability", "Muscle tension", "Sleep disturbance"]
    },
    {
        "condition_name": "Major Depressive Disorder",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Depressive Disorders",
        "dsm_5_code": "296.xx",
        "alternative_names": ["Clinical Depression"],
        "description": "A period of at least two weeks when a person has either a depressed mood or a loss of interest or pleasure in nearly all activities.",
        "primary_symptoms": ["Depressed mood", "Anhedonia", "Weight change", "Sleep disturbance", "Psychomotor agitation/retardation", "Fatigue", "Worthlessness", "Diminished ability to think", "Recurrent thoughts of death"]
    },
    {
        "condition_name": "Bipolar I Disorder",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Bipolar and Related Disorders",
        "dsm_5_code": "296.4x",
        "description": "Characterized by the occurrence of at least one manic episode.",
        "primary_symptoms": ["Mania", "Depression", "Inflated self-esteem", "Decreased need for sleep", "Pressured speech", "Flight of ideas"]
    },
    {
        "condition_name": "Posttraumatic Stress Disorder",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Trauma- and Stressor-Related Disorders",
        "dsm_5_code": "309.81",
        "alternative_names": ["PTSD"],
        "description": "Exposure to actual or threatened death, serious injury, or sexual violence followed by intrusive symptoms.",
        "primary_symptoms": ["Intrusive memories", "Dreams", "Flashbacks", "Avoidance", "Negative cognitions", "Arousal and reactivity"]
    },
    {
        "condition_name": "Obsessive-Compulsive Disorder",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Obsessive-Compulsive and Related Disorders",
        "dsm_5_code": "300.3",
        "alternative_names": ["OCD"],
        "description": "Presence of obsessions, compulsions, or both.",
        "primary_symptoms": ["Obsessions", "Compulsions", "Time-consuming rituals"]
    },
    {
        "condition_name": "Panic Disorder",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Anxiety Disorders",
        "dsm_5_code": "300.01",
        "description": "Recurrent unexpected panic attacks.",
        "primary_symptoms": ["Palpitations", "Sweating", "Trembling", "Shortness of breath", "Choking", "Chest pain", "Fear of losing control"]
    },
    {
        "condition_name": "Social Anxiety Disorder",
        "disease_category": "Mental Disorders",
        "disease_subcategory": "Anxiety Disorders",
        "dsm_5_code": "300.23",
        "alternative_names": ["Social Phobia"],
        "description": "Marked fear or anxiety about one or more social situations in which the individual is exposed to possible scrutiny by others.",
        "primary_symptoms": ["Fear of judgement", "Avoidance of social situations", "Physical symptoms of anxiety"]
    }
]

async def seed_dsm5():
    async with AsyncSession(engine) as db:
        print("Seeding DSM-5 conditions...")
        for data in DSM5_DATA:
            # Check if exists
            result = await db.execute(select(Indication).where(Indication.condition_name == data["condition_name"]))
            existing = result.scalar_one_or_none()
            
            if existing:
                print(f"Condition '{data['condition_name']}' already exists. Updating...")
                for key, value in data.items():
                    setattr(existing, key, value)
            else:
                print(f"Creating condition '{data['condition_name']}'...")
                indication = Indication(**data)
                db.add(indication)
        
        await db.commit()
        print("DSM-5 seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed_dsm5())
