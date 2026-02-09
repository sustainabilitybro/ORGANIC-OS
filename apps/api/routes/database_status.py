"""
Database Status and Performance Endpoints

Monitor database health and query performance.
"""
from fastapi import APIRouter, Depends
from typing import Dict, Any
import os

router = APIRouter(prefix="/api/v1/database", tags=["Database"])

# Try to import database optimization (optional)
try:
    from database.optimized import (
        get_connection_info,
        check_database_health,
        query_cache,
        query_metrics,
        reset_connection_pool
    )
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    query_cache = None
    query_metrics = None


@router.get("/status")
async def get_database_status() -> Dict[str, Any]:
    """Get database connection status"""
    if not DB_AVAILABLE:
        return {
            "status": "not_configured",
            "message": "Database not configured",
            "configuration": {
                "pool_size": os.getenv("DB_POOL_SIZE", "20"),
                "max_overflow": os.getenv("DB_MAX_OVERFLOW", "10"),
                "pool_recycle": os.getenv("DB_POOL_RECYCLE", "3600")
            }
        }
    
    return {
        "status": "configured",
        "connection": get_connection_info(),
        "health": check_database_health()
    }


@router.get("/cache/stats")
async def get_cache_stats() -> Dict[str, Any]:
    """Get query cache statistics"""
    if not DB_AVAILABLE or query_cache is None:
        return {
            "status": "unavailable",
            "message": "Cache not initialized"
        }
    
    return {
        "status": "active",
        "stats": query_cache.get_stats()
    }


@router.get("/metrics")
async def get_database_metrics() -> Dict[str, Any]:
    """Get database query metrics"""
    if not DB_AVAILABLE or query_metrics is None:
        return {
            "status": "unavailable",
            "message": "Metrics not initialized"
        }
    
    return {
        "status": "active",
        "metrics": query_metrics.get_stats(),
        "slow_queries": query_metrics.get_slow_queries(5)
    }


@router.post("/cache/clear")
async def clear_cache() -> Dict[str, Any]:
    """Clear query cache"""
    if not DB_AVAILABLE or query_cache is None:
        return {"status": "no_cache_to_clear"}
    
    query_cache.invalidate()
    return {
        "status": "cleared",
        "message": "Query cache cleared"
    }


@router.post("/pool/reset")
async def reset_pool() -> Dict[str, Any]:
    """Reset connection pool"""
    if not DB_AVAILABLE:
        return {"status": "not_available"}
    
    reset_connection_pool()
    return {
        "status": "reset",
        "message": "Connection pool reset"
    }
