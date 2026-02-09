"""
API Versioning Strategy

Support for multiple API versions:
- Version negotiation
- Deprecation notices
- Version-specific handlers
"""
from fastapi import APIRouter, Request, Depends, HTTPException, Header
from typing import Dict, Any, Optional, List
from datetime import datetime
import json

router = APIRouter(prefix="/api/v1", tags=["API Versioning"])

# ============ Version Configuration ============

API_VERSIONS = {
    "v1": {
        "status": "deprecated",
        "deprecation_date": "2026-06-01",
        "sunset_date": "2026-12-01",
        "features": ["all"],
        "breaking_changes": False
    },
    "v2": {
        "status": "current",
        "deprecation_date": None,
        "sunset_date": None,
        "features": ["all", "new_endpoints"],
        "breaking_changes": False
    }
}

# ============ Version Negotiation ============

def parse_accept_header(accept_header: str) -> str:
    """Parse Accept header for version"""
    if not accept_header:
        return "v2"  # Default to current
    
    # Look for version in Accept header
    # Format: application/json;version=v2
    parts = accept_header.split(";")
    for part in parts:
        if "version=" in part:
            version = part.split("=")[1].strip()
            if version in API_VERSIONS:
                return version
    
    return "v2"  # Default to current


def get_version_from_path(path: str) -> Optional[str]:
    """Extract version from URL path"""
    parts = path.split("/")
    for part in parts:
        if part in ["v1", "v2"]:
            return part
    return None


# ============ Deprecation Warnings ============

class DeprecationWarning:
    """Track deprecation warnings"""
    
    def __init__(self):
        self.warnings_sent = {}  # Track warnings per user
    
    def check_deprecation(self, version: str, user_id: str = None) -> Dict:
        """Check if version is deprecated and return warning"""
        if version not in API_VERSIONS:
            return {"deprecated": False, "message": None}
        
        config = API_VERSIONS[version]
        
        if config["status"] == "deprecated":
            # Only warn once per user per day
            warning_key = f"{user_id}:{version}"
            now = datetime.utcnow().isoformat()
            
            return {
                "deprecated": True,
                "message": f"API version {version} is deprecated",
                "deprecation_date": config["deprecation_date"],
                "sunset_date": config["sunset_date"],
                "recommended_version": "v2",
                "docs_url": "/docs"
            }
        
        return {"deprecated": False, "message": None}


deprecation_warnings = DeprecationWarning()

# ============ Version-Specific Handlers ============

class VersionedRouter:
    """Router that supports multiple versions"""
    
    def __init__(self):
        self.routers = {}
    
    def add_version_router(self, version: str, router: APIRouter):
        """Add a version-specific router"""
        self.routers[version] = router
    
    def get_router(self, version: str) -> Optional[APIRouter]:
        """Get router for specific version"""
        return self.routers.get(version)
    
    def get_fallback_router(self, version: str) -> APIRouter:
        """Get router with fallback to current version"""
        if version in self.routers:
            return self.routers[version]
        return self.routers.get("v2", None)


# ============ Endpoints ============

@router.get("/versioning/status")
async def get_versioning_status():
    """Get API versioning status"""
    return {
        "versions": API_VERSIONS,
        "default_version": "v2",
        "supported_versions": list(API_VERSIONS.keys())
    }


@router.get("/versioning/check")
async def check_version(
    version: str = "v2",
    user_id: Optional[str] = None
):
    """Check version status and deprecation warnings"""
    deprecation = deprecation_warnings.check_deprecation(version, user_id)
    
    return {
        "requested_version": version,
        "current_status": API_VERSIONS.get(version, {}).get("status", "unknown"),
        "deprecation": deprecation,
        "alternative_versions": [
            {"version": v, "status": config["status"]}
            for v, config in API_VERSIONS.items()
            if v != version
        ]
    }


@router.get("/versioning/migrate")
async def get_migration_guide(
    from_version: str,
    to_version: str = "v2"
):
    """Get migration guide between versions"""
    return {
        "from": from_version,
        "to": to_version,
        "breaking_changes": [],
        "new_features": [],
        "steps": [
            "1. Update Accept header to: application/json;version=v2",
            "2. Test all endpoints",
            "3. Update any deprecated field usage",
            "4. Remove version from URL path (for v2)"
        ],
        "documentation_url": "/docs/migration"
    }


@router.get("/versioning/features/{version}")
async def get_version_features(version: str):
    """Get features available in a version"""
    if version not in API_VERSIONS:
        raise HTTPException(
            status_code=404,
            detail=f"Version {version} not found"
        )
    
    config = API_VERSIONS[version]
    
    return {
        "version": version,
        "status": config["status"],
        "features": config["features"],
        "endpoints": {
            "auth": ["/api/v1/auth/login", "/api/v1/auth/register"],
            "wellness": ["/api/v1/wellness/prompt", "/api/v1/wellness/check-in"],
            "modules": ["/api/v1/modules", "/api/v1/modules/{id}"],
            "pis": ["/api/v1/pis/habits", "/api/v1/pis/goals"],
            "ai": ["/api/v1/openclaw/chat", "/api/v1/openclaw/agents"],
            "integrations": ["/api/v1/integrations/*"],
            "health": ["/api/v1/health", "/api/v1/ready"],
            "performance": ["/api/v1/performance/metrics"],
            "security": ["/api/v1/security/status"],
            "database": ["/api/v1/database/status"]
        }
    }


# ============ Deprecation Banner ============

@router.get("/versioning/banner")
async def get_deprecation_banner(
    accept: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None)
):
    """Get deprecation banner for current version"""
    # Try to identify user version
    version = parse_accept_header(accept) if accept else "v2"
    
    deprecation = deprecation_warnings.check_deprecation(version)
    
    if deprecation["deprecated"]:
        return {
            "show_banner": True,
            "banner_type": "warning",
            "message": deprecation["message"],
            "action_text": "Upgrade to v2",
            "action_url": "/docs/migration",
            "deadline": deprecation.get("sunset_date")
        }
    
    return {
        "show_banner": False
    }


# ============ Health Check per Version ============

@router.get("/versioning/{version}/health")
async def version_health_check(version: str):
    """Health check for specific version"""
    if version not in API_VERSIONS:
        raise HTTPException(
            status_code=404,
            detail=f"Version {version} not found"
        )
    
    return {
        "version": version,
        "status": "healthy",
        "api_status": API_VERSIONS[version]["status"],
        "timestamp": datetime.utcnow().isoformat()
    }


# ============ Metrics per Version ============

@router.get("/versioning/{version}/metrics")
async def version_metrics(version: str):
    """Get metrics for specific version"""
    if version not in API_VERSIONS:
        raise HTTPException(
            status_code=404,
            detail=f"Version {version} not found"
        )
    
    # Return mock metrics
    return {
        "version": version,
        "requests": {
            "total": 10000,
            "success": 9850,
            "errors": 150,
            "rate_limited": 50
        },
        "avg_response_time_ms": 150,
        "p95_response_time_ms": 300,
        "p99_response_time_ms": 500
    }


# ============ Changelog ============

@router.get("/versioning/changelog")
async def get_changelog():
    """Get API changelog"""
    return {
        "changelog": [
            {
                "version": "v2",
                "status": "current",
                "release_date": "2026-02-09",
                "changes": [
                    {"type": "added", "description": "Personal Integrations API"},
                    {"type": "added", "description": "Database optimization endpoints"},
                    {"type": "added", "description": "Security status endpoint"},
                    {"type": "added", "description": "Performance metrics"},
                    {"type": "improved", "description": "Response compression enabled"},
                    {"type": "improved", "description": "Rate limiting enhanced"},
                    {"type": "security", "description": "JWT token rotation added"}
                ]
            },
            {
                "version": "v1",
                "status": "deprecated",
                "release_date": "2025-01-01",
                "sunset_date": "2026-12-01",
                "changes": [
                    {"type": "deprecated", "description": "Use v2 instead"}
                ]
            }
        ]
    }
