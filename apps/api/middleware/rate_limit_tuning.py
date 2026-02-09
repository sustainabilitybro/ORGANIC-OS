"""
Rate Limit Tuning - Per-endpoint fine-tuning based on usage
"""

from fastapi import APIRouter
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/v1/rate-limits", tags=["rate-limits"])


# ============ Rate Limit Models ============

class RateLimitConfig(BaseModel):
    endpoint: str
    method: str
    requests_per_minute: int
    requests_per_hour: int
    burst_limit: int
    current_usage: float
    recommendation: str


class RateLimitRecommendation(BaseModel):
    endpoint: str
    current_limit: int
    recommended_limit: int
    reason: str
    impact: str


# ============ Current Configuration ============

RATE_LIMITS = {
    # Authentication - Strict limits
    "/api/v1/auth/login": {"rpm": 20, "rph": 100, "burst": 5},
    "/api/v1/auth/register": {"rpm": 10, "rph": 50, "burst": 3},
    "/api/v1/auth/refresh": {"rpm": 30, "rph": 500, "burst": 10},
    
    # AI Endpoints - Moderate limits
    "/api/v1/ai/chat": {"rpm": 30, "rph": 500, "burst": 10},
    "/api/v1/ai/analyze": {"rpm": 20, "rph": 200, "burst": 5},
    
    # Wellness - Higher limits for tracking
    "/api/v1/wellness/daily": {"rpm": 60, "rph": 2000, "burst": 20},
    "/api/v1/wellness/entry": {"rpm": 120, "rph": 5000, "burst": 30},
    
    # Data Endpoints - Higher limits
    "/api/v1/modules": {"rpm": 100, "rph": 5000, "burst": 50},
    "/api/v1/progress": {"rpm": 100, "rph": 5000, "burst": 50},
    
    # Integration Endpoints
    "/api/v1/integrations/*": {"rpm": 100, "rph": 5000, "burst": 30},
    
    # Personal Integrations
    "/api/v1/pis/habits": {"rpm": 60, "rph": 2000, "burst": 20},
    "/api/v1/pis/goals": {"rpm": 60, "rph": 2000, "burst": 20},
    "/api/v1/pis/calendar": {"rpm": 60, "rph": 2000, "burst": 20},
    
    # WebSocket
    "/api/v1/ws/*": {"connections": 10, "messages_per_minute": 100},
}


# ============ Usage Tracking ============

USAGE_DATA = {
    "/api/v1/auth/login": {"avg_rpm": 5, "peak_rpm": 15, "usage_percentage": 75},
    "/api/v1/auth/register": {"avg_rpm": 2, "peak_rpm": 8, "usage_percentage": 80},
    "/api/v1/ai/chat": {"avg_rpm": 10, "peak_rpm": 25, "usage_percentage": 83},
    "/api/v1/wellness/daily": {"avg_rpm": 15, "peak_rpm": 40, "usage_percentage": 67},
    "/api/v1/modules": {"avg_rpm": 20, "peak_rpm": 50, "usage_percentage": 50},
}


# ============ Endpoints ============

@router.get("/config")
async def get_rate_limit_config():
    """Get current rate limit configuration"""
    return {
        "config": RATE_LIMITS,
        "updated": datetime.now().isoformat()
    }


@router.get("/usage")
async def get_rate_limit_usage():
    """Get rate limit usage statistics"""
    usage = []
    for endpoint, data in USAGE_DATA.items():
        limit = RATE_LIMITS.get(endpoint, {}).get("rpm", 100)
        usage.append({
            "endpoint": endpoint,
            "limit": limit,
            "avg_rpm": data["avg_rpm"],
            "peak_rpm": data["peak_rpm"],
            "usage_percentage": data["usage_percentage"],
            "status": "high" if data["usage_percentage"] > 90 else "medium" if data["usage_percentage"] > 70 else "low"
        })
    return {"usage": usage, "timestamp": datetime.now().isoformat()}


@router.get("/recommendations")
async def get_rate_limit_recommendations():
    """Get recommendations for rate limit tuning"""
    recommendations = []
    
    for endpoint, data in USAGE_DATA.items():
        limit = RATE_LIMITS.get(endpoint, {}).get("rpm", 100)
        usage_pct = data["usage_percentage"]
        
        if usage_pct > 90:
            recommendations.append({
                "endpoint": endpoint,
                "current_limit": limit,
                "recommended_limit": int(limit * 1.5),
                "reason": f"Usage at {usage_pct}% - approaching limit",
                "impact": "Prevent rate limit errors during peak usage"
            })
        elif usage_pct < 30:
            recommendations.append({
                "endpoint": endpoint,
                "current_limit": limit,
                "recommended_limit": int(limit * 0.7),
                "reason": f"Low usage at {usage_pct}% - can reduce limit",
                "impact": "Better resource allocation"
            })
    
    return {
        "recommendations": recommendations,
        "count": len(recommendations),
        "timestamp": datetime.now().isoformat()
    }


@router.post("/adjust")
async def adjust_rate_limit(endpoint: str, new_rpm: int):
    """Adjust rate limit for an endpoint (admin only in production)"""
    if endpoint not in RATE_LIMITS:
        return {"error": f"Endpoint '{endpoint}' not found"}
    
    old_rpm = RATE_LIMITS[endpoint]["rpm"]
    RATE_LIMITS[endpoint]["rpm"] = new_rpm
    
    return {
        "endpoint": endpoint,
        "old_rpm": old_rpm,
        "new_rpm": new_rpm,
        "updated": datetime.now().isoformat()
    }


@router.get("/health")
async def rate_limit_health():
    """Rate limiting health check"""
    high_usage = [e for e, d in USAGE_DATA.items() if d["usage_percentage"] > 90]
    
    return {
        "status": "healthy" if not high_usage else "attention_needed",
        "total_endpoints": len(RATE_LIMITS),
        "high_usage_endpoints": len(high_usage),
        "high_usage_names": high_usage
    }
