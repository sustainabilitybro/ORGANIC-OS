"""
API Documentation - Extended OpenAPI documentation and examples
"""

from fastapi import APIRouter
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/docs", tags=["api-docs"])


# ============ Documentation Models ============

class EndpointDoc(BaseModel):
    path: str
    method: str
    summary: str
    description: str
    tags: List[str]
    parameters: List[Dict[str, str]]
    request_body: Optional[Dict[str, Any]]
    responses: Dict[str, str]


# ============ API Overview ============

@router.get("/overview")
async def get_api_overview():
    """Get API overview information"""
    return {
        "name": "Organic OS API",
        "version": "1.0.0",
        "description": "Personal Development Platform API",
        "total_endpoints": 80,
        "documentation_version": "1.0"
    }


# ============ Quick Start Guide ============

@router.get("/quickstart")
async def get_quickstart_guide():
    """Get API quick start guide"""
    return {
        "title": "Quick Start Guide",
        "steps": [
            {
                "step": 1,
                "action": "Get Token",
                "endpoint": "POST /api/v1/auth/login",
                "example": {"email": "user@example.com", "password": "password"}
            },
            {
                "step": 2,
                "action": "Use Token",
                "header": "Authorization: Bearer YOUR_TOKEN"
            },
            {
                "step": 3,
                "action": "Make Requests",
                "example": "GET /api/v1/wellness/daily"
            }
        ]
    }


# ============ Common Patterns ============

@router.get("/patterns")
async def get_common_patterns():
    """Get common API usage patterns"""
    return {
        "pagination": {
            "params": {"page": "Page number", "limit": "Items per page"},
            "example": "/api/v1/modules?page=2&limit=10"
        },
        "filtering": {
            "params": {"category": "Filter by category", "status": "Filter by status"},
            "example": "/api/v1/wellness?category=nutrition"
        },
        "sorting": {
            "params": {"sort_by": "Field", "order": "asc|desc"},
            "example": "/api/v1/progress?sort_by=date&order=desc"
        }
    }


# ============ Error Handling Guide ============

@router.get("/errors")
async def get_error_guide():
    """Get error handling guide"""
    return {
        "status_codes": {
            "200": "Success",
            "400": "Bad Request",
            "401": "Unauthorized",
            "404": "Not Found",
            "429": "Rate Limited",
            "500": "Internal Server Error"
        },
        "error_format": {
            "success": False,
            "error": {"code": "ERROR_CODE", "message": "Description"}
        }
    }


# ============ Rate Limiting Info ============

@router.get("/rate-limits")
async def get_rate_limits():
    """Get rate limiting information"""
    return {
        "default": "100 requests/minute",
        "endpoints": {
            "/api/v1/auth/*": "20/min",
            "/api/v1/ai/*": "30/min",
            "/api/v1/wellness/*": "60/min"
        },
        "headers": ["X-RateLimit-Limit", "X-RateLimit-Remaining"]
    }


# ============ Authentication Guide ============

@router.get("/authentication")
async def get_auth_guide():
    """Get authentication guide"""
    return {
        "methods": [
            {
                "name": "JWT Bearer",
                "flow": "Login → Use Token → Refresh when expired",
                "header": "Authorization: Bearer TOKEN"
            },
            {
                "name": "API Key",
                "header": "X-API-Key: KEY"
            }
        ],
        "security_practices": [
            "Use HTTPS",
            "Don't expose tokens client-side",
            "Rotate regularly"
        ]
    }


# ============ SDKs ============

@router.get("/sdks")
async def get_sdks():
    """Get available SDKs"""
    return {
        "official": [
            {"language": "Python", "install": "pip install organic-os"},
            {"language": "JavaScript", "install": "npm install @organic-os/sdk"}
        ]
    }


# ============ Changelog ============

@router.get("/changelog")
async def get_changelog():
    """Get API changelog"""
    return {
        "current_version": "1.0.0",
        "changes": [
            {"version": "1.0.0", "date": "2025-01-19", "notes": ["Initial release"]},
            {"version": "1.1.0", "date": "2025-02-01", "notes": ["Calendar integration", "Analytics"]}
        ]
    }
