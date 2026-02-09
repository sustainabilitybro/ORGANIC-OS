"""
Circuit Breaker Dashboard - Visual monitoring API
"""

from fastapi import APIRouter
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime
import random

router = APIRouter(prefix="/api/v1/resilience/dashboard", tags=["resilience-dashboard"])


# ============ Dashboard Models ============

class BreakerStatus(BaseModel):
    name: str
    state: str  # closed, open, half_open
    failure_count: int
    success_count: int
    total_calls: int
    last_failure: Optional[str]
    last_success: Optional[str]
    uptime_percentage: float
    avg_response_time_ms: float


class DashboardSummary(BaseModel):
    total_breakers: int
    healthy_count: int
    degraded_count: int
    total_calls: int
    total_failures: int
    overall_health_score: float
    last_updated: str


class TimelinePoint(BaseModel):
    timestamp: str
    state: str
    failures: int
    successes: int


# ============ Mock Data ============

BREAKERS = {
    "external_api": {"state": "closed", "failures": 2, "successes": 150},
    "database": {"state": "closed", "failures": 0, "successes": 500},
    "cache": {"state": "closed", "failures": 5, "successes": 1000},
    "auth_service": {"state": "closed", "failures": 1, "successes": 200},
    "integrations": {"state": "half_open", "failures": 8, "successes": 2},
}


# ============ Endpoints ============

@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary():
    """Get overall resilience dashboard summary"""
    total = len(BREAKERS)
    healthy = sum(1 for b in BREAKERS.values() if b["state"] == "closed")
    degraded = total - healthy
    total_calls = sum(b["successes"] + b["failures"] for b in BREAKERS.values())
    total_failures = sum(b["failures"] for b in BREAKERS.values())
    
    return DashboardSummary(
        total_breakers=total,
        healthy_count=healthy,
        degraded_count=degraded,
        total_calls=total_calls,
        total_failures=total_failures,
        overall_health_score=healthy / total * 100 if total > 0 else 100,
        last_updated=datetime.now().isoformat()
    )


@router.get("/breakers", response_model=List[BreakerStatus])
async def list_breaker_status():
    """Get status of all circuit breakers"""
    results = []
    for name, data in BREAKERS.items():
        total = data["successes"] + data["failures"]
        uptime = data["successes"] / total * 100 if total > 0 else 100
        
        results.append(BreakerStatus(
            name=name,
            state=data["state"],
            failure_count=data["failures"],
            success_count=data["successes"],
            total_calls=total,
            last_failure=datetime.now().isoformat() if data["failures"] > 0 else None,
            last_success=datetime.now().isoformat(),
            uptime_percentage=round(uptime, 1),
            avg_response_time_ms=random.uniform(10, 200)
        ))
    return results


@router.get("/breakers/{name}", response_model=BreakerStatus)
async def get_breaker_status(name: str):
    """Get detailed status of a specific breaker"""
    if name not in BREAKERS:
        return {"error": f"Breaker '{name}' not found"}
    
    data = BREAKERS[name]
    total = data["successes"] + data["failures"]
    
    return BreakerStatus(
        name=name,
        state=data["state"],
        failure_count=data["failures"],
        success_count=data["successes"],
        total_calls=total,
        last_failure=datetime.now().isoformat() if data["failures"] > 0 else None,
        last_success=datetime.now().isoformat(),
        uptime_percentage=round(data["successes"] / total * 100, 1) if total > 0 else 100,
        avg_response_time_ms=random.uniform(10, 200)
    )


@router.get("/timeline/{name}")
async def get_breaker_timeline(name: str, hours: int = 24):
    """Get timeline data for a specific breaker"""
    if name not in BREAKERS:
        return {"error": f"Breaker '{name}' not found"}
    
    # Generate mock timeline data
    points = []
    for i in range(hours):
        points.append(TimelinePoint(
            timestamp=(datetime.now() - timedelta(hours=hours-i)).isoformat(),
            state=random.choice(["closed", "closed", "closed", "open"]),
            failures=random.randint(0, 3),
            successes=random.randint(5, 20)
        ))
    
    return {"breaker": name, "timeline": points}


@router.get("/health")
async def resilience_health():
    """Overall resilience health check"""
    summary = await get_dashboard_summary()
    
    issues = []
    if summary.degraded_count > 0:
        issues.append(f"{summary.degraded_count} circuit breaker(s) in degraded state")
    
    if summary.overall_health_score < 80:
        issues.append("Health score below 80%")
    
    return {
        "status": "healthy" if summary.degraded_count == 0 else "degraded",
        "health_score": round(summary.overall_health_score, 1),
        "issues": issues,
        "summary": summary.model_dump()
    }


@router.get("/metrics")
async def get_resilience_metrics():
    """Get resilience metrics for monitoring"""
    summary = await get_dashboard_summary()
    
    return {
        "total_breakers": summary.total_breakers,
        "healthy_breakers": summary.healthy_count,
        "degraded_breakers": summary.degraded_count,
        "total_calls": summary.total_calls,
        "total_failures": summary.total_failures,
        "failure_rate": round(summary.total_failures / max(1, summary.total_calls) * 100, 2),
        "health_score": round(summary.overall_health_score, 1),
        "timestamp": datetime.now().isoformat()
    }
