"""
Resilience API Routes - Circuit Breaker Stats and Health
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel

from apps.api.resilience.circuit_breaker import (
    registry,
    CircuitBreaker,
    CircuitBreakerOpenError,
    CircuitState
)

router = APIRouter(prefix="/api/v1/resilience", tags=["resilience"])


# ============ Response Models ============

class CircuitBreakerStatsResponse(BaseModel):
    name: str
    state: str
    is_open: bool
    time_until_retry: float
    failure_count: int
    success_count: int
    total_calls: int
    total_failures: int
    total_successes: int
    config: dict


class CircuitBreakerListResponse(BaseModel):
    breakers: list[CircuitBreakerStatsResponse]
    total_breakers: int


class ResetCircuitRequest(BaseModel):
    breaker_name: Optional[str] = None


class ResetCircuitResponse(BaseModel):
    message: str
    reset_count: int


# ============ Routes ============

@router.get("/circuit-breakers", response_model=CircuitBreakerListResponse)
async def list_circuit_breakers():
    """Get stats for all circuit breakers"""
    breakers = registry.get_all_stats()
    return {
        "breakers": breakers,
        "total_breakers": len(breakers)
    }


@router.get("/circuit-breakers/{name}", response_model=CircuitBreakerStatsResponse)
async def get_circuit_breaker(name: str):
    """Get stats for a specific circuit breaker"""
    breaker = registry.get(name)
    if not breaker:
        raise HTTPException(status_code=404, detail=f"Circuit breaker '{name}' not found")
    return breaker.get_stats()


@router.post("/circuit-breakers/{name}/reset")
async def reset_circuit_breaker(name: str):
    """Reset a specific circuit breaker"""
    breaker = registry.get(name)
    if not breaker:
        raise HTTPException(status_code=404, detail=f"Circuit breaker '{name}' not found")
    
    breaker.state = CircuitState.CLOSED
    from apps.api.resilience.circuit_breaker import CircuitBreakerStats
    breaker.stats = CircuitBreakerStats()
    
    return {"message": f"Circuit breaker '{name}' reset"}


@router.post("/circuit-breakers/reset", response_model=ResetCircuitResponse)
async def reset_all_circuit_breakers():
    """Reset all circuit breakers"""
    registry.reset()
    return {
        "message": "All circuit breakers reset",
        "reset_count": len(registry._breakers)
    }


@router.get("/health/resilience")
async def resilience_health():
    """Overall resilience health check"""
    breakers = registry.get_all_stats()
    open_breakers = [b for b in breakers if b["is_open"]]
    
    return {
        "status": "healthy" if not open_breakers else "degraded",
        "total_breakers": len(breakers),
        "open_breakers": len(open_breakers),
        "open_breaker_names": [b["name"] for b in open_breakers],
        "checks": {
            "circuit_breakers": "pass" if not open_breakers else "fail"
        }
    }
