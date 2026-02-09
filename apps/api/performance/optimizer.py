"""
Performance Optimizer - Query analysis and optimization
"""

from fastapi import APIRouter
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
import time
from functools import wraps

router = APIRouter(prefix="/api/v1/performance", tags=["performance"])


# ============ Performance Models ============

class QueryMetrics(BaseModel):
    query_type: str
    execution_time_ms: float
    rows_affected: int
    cached: bool


class PerformanceReport(BaseModel):
    total_queries: int
    total_time_ms: float
    average_time_ms: float
    cached_queries: int
    slow_queries: List[QueryMetrics]
    recommendations: List[str]


# ============ Query Tracking ============

_query_metrics: List[QueryMetrics] = []


def track_query(query_type: str, rows_affected: int = 0, cached: bool = False):
    """Decorator to track query performance"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                elapsed = (time.perf_counter() - start) * 1000
                _query_metrics.append(QueryMetrics(
                    query_type=query_type,
                    execution_time_ms=elapsed,
                    rows_affected=rows_affected,
                    cached=cached
                ))
                if len(_query_metrics) > 1000:
                    _query_metrics.pop(0)
        return wrapper
    return decorator


def get_query_stats() -> PerformanceReport:
    """Get performance report"""
    if not _query_metrics:
        return PerformanceReport(
            total_queries=0,
            total_time_ms=0,
            average_time_ms=0,
            cached_queries=0,
            slow_queries=[],
            recommendations=["No queries tracked yet"]
        )
    
    total = len(_query_metrics)
    total_time = sum(m.execution_time_ms for m in _query_metrics)
    cached = sum(1 for m in _query_metrics if m.cached)
    slow = [m for m in _query_metrics if m.execution_time_ms > 100]
    
    recommendations = []
    if cached / total < 0.3:
        recommendations.append("Consider increasing cache coverage")
    if len(slow) > total * 0.1:
        recommendations.append("More than 10% of queries are slow.")
    if total_time / total > 50:
        recommendations.append("Average query time is high. Review indexes.")
    
    return PerformanceReport(
        total_queries=total,
        total_time_ms=total_time,
        average_time_ms=total_time / total,
        cached_queries=cached,
        slow_queries=sorted(slow, key=lambda x: x.execution_time_ms, reverse=True)[:10],
        recommendations=recommendations
    )


def clear_query_stats():
    """Clear query statistics"""
    _query_metrics.clear()


# ============ Routes ============

@router.get("/queries")
async def get_query_performance():
    """Get query performance report"""
    return get_query_stats()


@router.get("/queries/clear")
async def clear_performance_stats():
    """Clear performance statistics"""
    clear_query_stats()
    return {"message": "Performance stats cleared"}


@router.get("/health")
async def performance_health():
    """Overall performance health check"""
    stats = get_query_stats()
    
    issues = []
    if stats.average_time_ms > 100:
        issues.append("Slow average query time")
    
    return {
        "status": "healthy" if not issues else "degraded",
        "issues": issues,
        "metrics": {
            "total_queries": stats.total_queries,
            "avg_time_ms": round(stats.average_time_ms, 2),
            "cached": stats.cached_queries,
        }
    }


@router.get("/suggestions")
async def get_optimization_suggestions():
    """Get performance optimization suggestions"""
    suggestions = []
    stats = get_query_stats()
    
    if stats.average_time_ms > 50:
        suggestions.append({
            "area": "queries",
            "priority": "medium",
            "suggestion": "Review slow queries and add appropriate indexes"
        })
    
    if stats.cached_queries / max(1, stats.total_queries) < 0.3:
        suggestions.append({
            "area": "cache",
            "priority": "high",
            "suggestion": "Consider adding more query caching"
        })
    
    return {"suggestions": suggestions}
