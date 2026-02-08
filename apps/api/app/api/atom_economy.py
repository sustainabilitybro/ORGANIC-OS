"""
Atom Economy Module for Organic OS (FastAPI)

This module integrates the Atom Economy Master Platform
into the Organic OS platform.

Features:
- Chemical process efficiency calculations
- Green chemistry metrics
- Reaction yield analysis
- Environmental impact scoring
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict

router = APIRouter(prefix="/atom-economy", tags=["Atom Economy"])


class AtomEconomyCalculation(BaseModel):
    mw_product: float
    mw_reactants: float


class Reaction(BaseModel):
    id: str
    name: str
    type: str
    atom_economy: float
    e_factor: float
    rating: str


class GreenMetrics(BaseModel):
    atom_economy: float
    e_factor: float


@router.post("/calculate")
async def calculate_atom_economy(data: AtomEconomyCalculation) -> dict:
    """Calculate atom economy for a chemical reaction"""
    if data.mw_reactants > 0:
        atom_economy = (data.mw_product / data.mw_reactants) * 100
    else:
        atom_economy = 0
    
    if atom_economy >= 90:
        rating = 'Excellent'
        suggestions = []
    elif atom_economy >= 80:
        rating = 'Good'
        suggestions = ['Minor optimization possible']
    elif atom_economy >= 60:
        rating = 'Moderate'
        suggestions = [
            'Consider catalytic reagents to improve selectivity',
            'Explore alternative reaction pathways',
            'Minimize stoichiometric byproducts'
        ]
    else:
        rating = 'Poor'
        suggestions = [
            'Major process redesign recommended',
            'Consider different synthetic route',
            'Implement atom economical transformations'
        ]
    
    return {
        'atom_economy': round(atom_economy, 2),
        'efficiency_rating': rating,
        'suggestions': suggestions
    }


@router.get("/reactions")
async def get_reactions() -> dict:
    """Get saved reactions database"""
    return {
        'reactions': [
            {
                'id': '1',
                'name': 'SN2 Substitution',
                'type': 'substitution',
                'atom_economy': 85.4,
                'e_factor': 2.3,
                'rating': 'Good'
            },
            {
                'id': '2',
                'name': 'Diels-Alder Cycloaddition',
                'type': 'cycloaddition',
                'atom_economy': 94.2,
                'e_factor': 1.1,
                'rating': 'Excellent'
            },
            {
                'id': '3',
                'name': 'Friedel-Crafts Acylation',
                'type': 'acylation',
                'atom_economy': 68.7,
                'e_factor': 4.5,
                'rating': 'Moderate'
            },
            {
                'id': '4',
                'name': 'Suzuki Coupling',
                'type': 'cross-coupling',
                'atom_economy': 88.2,
                'e_factor': 1.8,
                'rating': 'Good'
            }
        ]
    }


@router.post("/green-metrics")
async def calculate_green_metrics(data: GreenMetrics) -> dict:
    """Calculate comprehensive green chemistry metrics"""
    atom_economy = data.atom_economy
    e_factor = data.e_factor
    
    # Calculate RME (Reaction Mass Efficiency)
    rme = max(0, 100 - e_factor * 5)
    
    # Calculate PMI (Process Mass Intensity)
    pmi = 1 + e_factor
    
    # Overall score calculation
    score = (atom_economy * 0.4 + rme * 0.3 + (100 - e_factor * 10) * 0.3)
    score = max(0, min(100, score))
    
    if score >= 85:
        grade = 'A'
        classification = 'Excellent Green Chemistry'
    elif score >= 70:
        grade = 'B'
        classification = 'Good Green Chemistry'
    elif score >= 55:
        grade = 'C'
        classification = 'Acceptable Green Chemistry'
    else:
        grade = 'D'
        classification = 'Needs Improvement'
    
    improvements = []
    if atom_economy < 80:
        improvements.append('Improve atom economy through better reaction design')
    if e_factor > 3:
        improvements.append('Reduce E-factor by minimizing waste')
    if e_factor > 5:
        improvements.append('Consider solvent-free or water-based alternatives')
    
    return {
        'metrics': {
            'atom_economy': atom_economy,
            'e_factor': e_factor,
            'reaction_mass_efficiency': round(rme, 2),
            'process_mass_intensity': round(pmi, 2),
            'environmental_factor': e_factor
        },
        'overall_score': {
            'value': round(score, 1),
            'grade': grade,
            'classification': classification
        },
        'improvements': improvements
    }


@router.get("/dashboard")
async def get_dashboard() -> dict:
    """Get atom economy dashboard data"""
    return {
        'overview': {
            'total_reactions': 47,
            'avg_atom_economy': 78.5,
            'green_reactions': 23,
            'needs_improvement': 15
        },
        'trends': {
            'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            'atom_economy_values': [72, 74, 75, 77, 78, 78.5]
        },
        'recent_analyses': [
            {'reaction': 'Suzukidate': '202 Coupling', '6-02-05', 'score': 88.2},
            {'reaction': 'Aldol Condensation', 'date': '2026-02-03', 'score': 71.4},
            {'reaction': 'Esterification', 'date': '2026-02-01', 'score': 65.8}
        ],
        'top_reactions': [
            {'name': 'Diels-Alder', 'score': 94.2, 'type': 'cycloaddition'},
            {'name': 'Click Chemistry', 'score': 91.5, 'type': 'addition'},
            {'name': 'Nucleophilic Substitution', 'score': 89.2, 'type': 'substitution'}
        ]
    }


@router.get("/chemistry/reference")
async def get_chemistry_reference() -> dict:
    """Get green chemistry reference data"""
    return {
        'principles': [
            {'id': 1, 'title': 'Prevent Waste', 'description': 'Design syntheses to prevent waste'},
            {'id': 2, 'title': 'Atom Economy', 'description': 'Maximize incorporation of all materials'},
            {'id': 3, 'title': 'Less Hazardous Synthesis', 'description': 'Use safer reagents'},
            {'id': 4, 'title': 'Safer Products', 'description': 'Design less toxic products'},
            {'id': 5, 'title': 'Safer Solvents', 'description': 'Avoid auxiliary substances']
        ],
        'target_values': {
            'atom_economy': {'excellent': 90, 'good': 80, 'acceptable': 60},
            'e_factor': {'excellent': 5, 'good': 25, 'acceptable': 100}
        }
    }
