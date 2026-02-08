"""
Research Data Access Service.
Secure API for academic researchers and pharmaceutical companies.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
import hashlib
import secrets
import json


class AccessLevel(Enum):
    """Research access levels."""
    BASIC = "basic"           # Limited read access
    STANDARD = "standard"     # Full read access
    PREMIUM = "premium"       # Read + data export
    INSTITUTIONAL = "institutional"  # Full access for partner institutions


@dataclass
class ResearcherProfile:
    """Profile for a research API user."""
    id: int
    name: str
    email: str
    institution: str
    department: str
    research_proposal: str
    access_level: str
    api_key: str
    rate_limit_per_hour: int
    queries_used_today: int = 0
    data_exports_count: int = 0
    created_at: datetime = field(default_factory=datetime.now)
    expires_at: datetime = None
    is_active: bool = True


@dataclass
class DataExportRequest:
    """Request for data export."""
    researcher_id: int
    filters: Dict[str, Any]
    format: str  # 'csv', 'json', 'parquet'
    include: List[str]  # Which tables to include
    created_at: datetime = field(default_factory=datetime.now)
    status: str = "pending"  # 'pending', 'processing', 'completed', 'failed'
    download_url: str = None


class ResearchDataAccessService:
    """
    Secure API for researchers to query and export database data.
    """
    
    # Accredited institution domains (example)
    ACCREDITED_INSTITUTIONS = [
        "harvard.edu", "stanford.edu", "mit.edu", "ox.ac.uk", "cam.ac.uk",
        "nih.gov", "who.int", "cdc.gov", "fda.gov",
        # Add more...
    ]
    
    # Rate limits by access level
    RATE_LIMITS = {
        AccessLevel.BASIC.value: 100,
        AccessLevel.STANDARD.value: 500,
        AccessLevel.PREMIUM.value: 2000,
        AccessLevel.INSTITUTIONAL.value: 10000
    }
    
    def __init__(self, db_session):
        self.db = db_session
        self._api_keys = {}  # In production, use Redis or database
    
    async def request_access(
        self,
        researcher_name: str,
        email: str,
        institution: str,
        department: str,
        research_proposal: str,
        estimated_queries: int
    ) -> Dict[str, Any]:
        """
        Request API access for research purposes.
        
        Returns approval status and API key if approved.
        """
        # Validate institution
        is_accredited = self._is_accredited_institution(email)
        
        # Determine access level
        if is_accredited:
            access_level = AccessLevel.STANDARD.value
        else:
            access_level = AccessLevel.BASIC.value
        
        # Generate API key
        api_key = self._generate_api_key()
        
        # Set rate limit
        rate_limit = min(
            self.RATE_LIMITS.get(access_level, 100),
            estimated_queries * 2  # Allow 2x estimated usage
        )
        
        # Create researcher profile
        profile = ResearcherProfile(
            id=self._generate_id(),
            name=researcher_name,
            email=email,
            institution=institution,
            department=department,
            research_proposal=research_proposal,
            access_level=access_level,
            api_key=api_key,
            rate_limit_per_hour=rate_limit,
            expires_at=datetime.now() + timedelta(days=365)  # 1 year validity
        )
        
        # Store profile (in production, store in database)
        self._api_keys[api_key] = profile
        
        # Log the access grant
        await self._log_access_grant(profile)
        
        return {
            "approved": True,
            "api_key": api_key,
            "access_level": access_level,
            "rate_limit_per_hour": rate_limit,
            "expires_at": profile.expires_at.isoformat(),
            "terms": "By using this API, you agree to cite the database in any publications.",
            "documentation_url": "https://api.naturalhealthdb.org/docs/research"
        }
    
    async def verify_api_key(self, api_key: str) -> Optional[ResearcherProfile]:
        """Verify an API key and return the researcher profile."""
        profile = self._api_keys.get(api_key)
        
        if not profile:
            return None
        
        if not profile.is_active:
            return None
        
        if profile.expires_at and profile.expires_at < datetime.now():
            return None
        
        return profile
    
    async def query_database(
        self,
        api_key: str,
        query_type: str,  # 'remedies', 'indications', 'evidence', 'remedy_indications'
        filters: Dict[str, Any] = None,
        page: int = 1,
        limit: int = 100
    ) -> Dict[str, Any]:
        """
        Query the database for research purposes.
        
        Returns structured data based on query type and filters.
        """
        # Verify API key
        profile = await self.verify_api_key(api_key)
        if not profile:
            return {"error": "Invalid or expired API key", "code": 401}
        
        # Check rate limit
        if not self._check_rate_limit(profile):
            return {"error": "Rate limit exceeded", "code": 429}
        
        # Increment usage
        profile.queries_used_today += 1
        
        # Execute query based on type
        results = await self._execute_query(query_type, filters, page, limit)
        
        # Log query
        await self._log_query(profile, query_type, filters)
        
        return {
            "success": True,
            "query_type": query_type,
            "filters": filters,
            "page": page,
            "limit": limit,
            "total_results": results.get("total", 0),
            "data": results.get("data", []),
            "meta": {
                "queried_at": datetime.now().isoformat(),
                "queries_remaining": profile.rate_limit_per_hour - profile.queries_used_today
            }
        }
    
    async def export_dataset(
        self,
        api_key: str,
        filters: Dict[str, Any],
        format: str = "csv",
        include: List[str] = None
    ) -> Dict[str, Any]:
        """
        Export a dataset for offline research.
        
        Args:
            api_key: Researcher's API key
            filters: Query filters
            format: Export format ('csv', 'json', 'parquet')
            include: Tables to include
            
        Returns:
            Download URL for the export
        """
        # Verify API key
        profile = await self.verify_api_key(api_key)
        if not profile:
            return {"error": "Invalid or expired API key", "code": 401}
        
        # Check access level allows exports
        if profile.access_level not in [AccessLevel.PREMIUM.value, AccessLevel.INSTITUTIONAL.value]:
            return {"error": "Data export requires Premium or Institutional access", "code": 403}
        
        # Create export request
        export_request = DataExportRequest(
            researcher_id=profile.id,
            filters=filters,
            format=format,
            include=include or ["remedies", "indications", "remedy_indications"]
        )
        
        # Process export (in production, queue this as async job)
        download_url = await self._process_export(export_request, profile)
        
        profile.data_exports_count += 1
        
        return {
            "success": True,
            "export_id": self._generate_id(),
            "format": format,
            "download_url": download_url,
            "expires_at": (datetime.now() + timedelta(hours=24)).isoformat(),
            "citation_required": True,
            "citation_format": "Natural Remedies Database (2026). Global Natural Remedies Database. https://naturalhealthdb.org"
        }
    
    async def get_research_gaps(
        self,
        api_key: str,
        disease_area: str = None,
        priority: int = None
    ) -> Dict[str, Any]:
        """
        Get identified research gaps for prioritization.
        
        Useful for researchers looking for impactful study opportunities.
        """
        profile = await self.verify_api_key(api_key)
        if not profile:
            return {"error": "Invalid or expired API key", "code": 401}
        
        # Query research gaps
        gaps = await self._get_research_gaps(disease_area, priority)
        
        return {
            "success": True,
            "disease_area": disease_area,
            "priority_filter": priority,
            "gaps": gaps,
            "meta": {
                "total_gaps": len(gaps),
                "high_priority_count": sum(1 for g in gaps if g.get("priority", 5) <= 2)
            }
        }
    
    async def get_trends(
        self,
        api_key: str,
        remedy_id: int = None,
        time_period: str = "5_years"
    ) -> Dict[str, Any]:
        """
        Get publication and research trends.
        """
        profile = await self.verify_api_key(api_key)
        if not profile:
            return {"error": "Invalid or expired API key", "code": 401}
        
        trends = await self._calculate_trends(remedy_id, time_period)
        
        return {
            "success": True,
            "remedy_id": remedy_id,
            "time_period": time_period,
            "trends": trends
        }
    
    async def publish_findings(
        self,
        api_key: str,
        study_pmid: int,
        findings_summary: str,
        remedy_indication_updates: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        When researcher publishes using our data, update database with new evidence.
        
        This creates a feedback loop where new research improves the database.
        """
        profile = await self.verify_api_key(api_key)
        if not profile:
            return {"error": "Invalid or expired API key", "code": 401}
        
        # Verify PMID exists
        study_exists = await self._verify_pmid(study_pmid)
        if not study_exists:
            return {"error": f"PMID {study_pmid} not found in PubMed", "code": 404}
        
        # Create evidence item from publication
        evidence_id = await self._create_evidence_from_pmid(study_pmid)
        
        # Queue updates for curation review
        update_ids = []
        for update in remedy_indication_updates:
            update_id = await self._queue_update_for_review(
                evidence_id=evidence_id,
                remedy_indication_id=update.get("id"),
                proposed_changes=update
            )
            update_ids.append(update_id)
        
        # Attribute researcher
        await self._attribute_contribution(
            profile=profile,
            pmid=study_pmid,
            update_ids=update_ids
        )
        
        return {
            "success": True,
            "evidence_id": evidence_id,
            "updates_queued": len(update_ids),
            "status": "Pending curation review",
            "attribution": f"Contribution credited to {profile.name}, {profile.institution}",
            "next_steps": [
                "Updates will be reviewed by curators",
                "Approved updates will recalculate evidence grades",
                "Your contribution will be acknowledged in the database"
            ]
        }
    
    async def get_attribution_report(self, api_key: str) -> Dict[str, Any]:
        """
        Get report of researcher's contributions to the database.
        """
        profile = await self.verify_api_key(api_key)
        if not profile:
            return {"error": "Invalid or expired API key", "code": 401}
        
        return {
            "researcher": profile.name,
            "institution": profile.institution,
            "contributions": {
                "queries_made": profile.queries_used_today,
                "data_exports": profile.data_exports_count,
                "studies_contributed": 0,  # Would query from database
                "remedy_updates_proposed": 0
            },
            "impact": {
                "entries_improved": 0,
                "evidence_grades_updated": 0
            },
            "member_since": profile.created_at.isoformat()
        }
    
    def _is_accredited_institution(self, email: str) -> bool:
        """Check if email domain is from an accredited institution."""
        domain = email.split("@")[-1].lower()
        return any(domain.endswith(inst) for inst in self.ACCREDITED_INSTITUTIONS)
    
    def _generate_api_key(self) -> str:
        """Generate a secure API key."""
        return f"nrdb_{secrets.token_urlsafe(32)}"
    
    def _generate_id(self) -> int:
        """Generate a unique ID."""
        return abs(hash(datetime.now().isoformat() + secrets.token_hex(8))) % (10**9)
    
    def _check_rate_limit(self, profile: ResearcherProfile) -> bool:
        """Check if researcher is within rate limit."""
        return profile.queries_used_today < profile.rate_limit_per_hour
    
    async def _execute_query(
        self, 
        query_type: str, 
        filters: Dict, 
        page: int, 
        limit: int
    ) -> Dict[str, Any]:
        """Execute a database query."""
        # This would execute actual database queries
        # Simplified for structure
        return {
            "total": 0,
            "data": []
        }
    
    async def _process_export(
        self, 
        request: DataExportRequest, 
        profile: ResearcherProfile
    ) -> str:
        """Process a data export request."""
        # This would generate the actual export file
        # Simplified for structure
        export_id = self._generate_id()
        return f"https://api.naturalhealthdb.org/exports/{export_id}.{request.format}"
    
    async def _get_research_gaps(
        self, 
        disease_area: str, 
        priority: int
    ) -> List[Dict[str, Any]]:
        """Get research gaps from database."""
        # This would query the ResearchGap table
        return [
            {
                "id": 1,
                "title": "Efficacy of Ashwagandha in treatment-resistant depression",
                "priority": 2,
                "current_evidence_level": 5,
                "recommended_study_design": "RCT",
                "estimated_sample_size": 150
            }
        ]
    
    async def _calculate_trends(
        self, 
        remedy_id: int, 
        time_period: str
    ) -> Dict[str, Any]:
        """Calculate research trends."""
        return {
            "publication_count": 0,
            "growth_rate": 0,
            "trending_topics": []
        }
    
    async def _verify_pmid(self, pmid: int) -> bool:
        """Verify a PMID exists."""
        # Would check PubMed API
        return True
    
    async def _create_evidence_from_pmid(self, pmid: int) -> int:
        """Create evidence item from PMID."""
        # Would use PubMed ingester
        return self._generate_id()
    
    async def _queue_update_for_review(
        self, 
        evidence_id: int, 
        remedy_indication_id: int, 
        proposed_changes: Dict
    ) -> int:
        """Queue an update for curation review."""
        return self._generate_id()
    
    async def _attribute_contribution(
        self, 
        profile: ResearcherProfile, 
        pmid: int, 
        update_ids: List[int]
    ):
        """Record researcher's contribution."""
        pass
    
    async def _log_access_grant(self, profile: ResearcherProfile):
        """Log API access grant."""
        pass
    
    async def _log_query(
        self, 
        profile: ResearcherProfile, 
        query_type: str, 
        filters: Dict
    ):
        """Log a query for audit purposes."""
        pass
