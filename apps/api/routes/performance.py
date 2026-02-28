"""
Performance Optimization Module

Monitoring, caching, and optimization for Organic OS.
"""
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
import time
import asyncio
from functools import wraps
from typing import Callable, Any, List
import hashlib
import json

router = APIRouter(prefix="/api/v1/performance", tags=["performance"])

# ============ Performance Monitoring ============

class PerformanceMonitor:
    """Track and report performance metrics"""
    
    def __init__(self):
        self.request_times = []
        self.endpoint_times = {}
        self.error_count = 0
        self.success_count = 0
    
    def record_request(self, endpoint: str, duration: float, status: int):
        """Record a request's metrics"""
        self.request_times.append({"endpoint": endpoint, "duration": duration, "status": status})
        if endpoint not in self.endpoint_times:
            self.endpoint_times[endpoint] = []
        self.endpoint_times[endpoint].append(duration)
        
        if status < 400:
            self.success_count += 1
        else:
            self.error_count += 1
    
    def get_stats(self):
        """Get aggregate statistics"""
        if not self.request_times:
            return {"message": "No requests recorded"}
        
        durations = [r["duration"] for r in self.request_times]
        return {
            "total_requests": len(self.request_times),
            "success_rate": self.success_count / len(self.request_times) * 100,
            "error_rate": self.error_count / len(self.request_times) * 100,
            "avg_duration_ms": sum(durations) / len(durations) * 1000,
            "min_duration_ms": min(durations) * 1000,
            "max_duration_ms": max(durations) * 1000,
            "endpoints": {
                ep: {
                    "requests": len(times),
                    "avg_ms": sum(times) / len(times) * 1000
                }
                for ep, times in self.endpoint_times.items()
            }
        }

monitor = PerformanceMonitor()

# ============ Caching ============

class Cache:
    """Simple in-memory cache with TTL"""
    
    def __init__(self, default_ttl: int = 300):  # 5 minutes
        self._cache = {}
        self._timestamps = {}
        self.default_ttl = default_ttl
    
    def _make_key(self, func_name: str, *args, **kwargs) -> str:
        """Generate cache key"""
        key_data = f"{func_name}:{args}:{kwargs}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get(self, key: str) -> Any:
        """Get cached value if not expired"""
        if key in self._cache:
            timestamp = self._timestamps.get(key, 0)
            if time.time() - timestamp < self.default_ttl:
                return self._cache[key]
            # Expired - remove
            del self._cache[key]
            if key in self._timestamps:
                del self._timestamps[key]
        return None
    
    def set(self, key: str, value: Any, ttl: int = None):
        """Set cached value"""
        self._cache[key] = value
        self._timestamps[key] = time.time()
        if ttl:
            self.default_ttl = ttl
    
    def clear(self):
        """Clear all cached data"""
        self._cache.clear()
        self._timestamps.clear()

cache = Cache(default_ttl=300)

# ============ Optimization Decorators ============

def cached(ttl: int = 300, key_prefix: str = ""):
    """Decorator to cache function results"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{key_prefix}:{func.__name__}:{args}:{kwargs}"
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            result = await func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result
        return wrapper
    return decorator

def timed(threshold_ms: float = 1000):
    """Decorator to log slow function calls"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start = time.time()
            result = await func(*args, **kwargs)
            duration_ms = (time.time() - start) * 1000
            if duration_ms > threshold_ms:
                print(f"SLOW: {func.__name__} took {duration_ms:.2f}ms (threshold: {threshold_ms}ms)")
            return result
        return wrapper
    return decorator

# ============ Optimization Strategies ============

OPTIMIZATION_STRATEGIES = {
    "database": [
        {"strategy": "Connection pooling", "impact": "High", "effort": "Low"},
        {"strategy": "Query optimization", "impact": "High", "effort": "Medium"},
        {"strategy": "Index creation", "impact": "High", "effort": "Low"},
        {"strategy": "Read replicas", "impact": "Medium", "effort": "High"}
    ],
    "api": [
        {"strategy": "Response caching", "impact": "High", "effort": "Low"},
        {"strategy": "Rate limiting", "impact": "Medium", "effort": "Low"},
        {"strategy": "Compression", "impact": "Medium", "effort": "Low"},
        {"strategy": "CDN usage", "impact": "High", "effort": "Medium"}
    ],
    "frontend": [
        {"strategy": "Code splitting", "impact": "High", "effort": "Medium"},
        {"strategy": "Lazy loading", "impact": "Medium", "effort": "Low"},
        {"strategy": "Image optimization", "impact": "High", "effort": "Low"},
        {"strategy": "Bundle analysis", "impact": "Medium", "effort": "Low"}
    ]
}

# ============ Routes ============

@router.get("/metrics")
async def get_metrics():
    """Get performance metrics"""
    return monitor.get_stats()

@router.get("/cache/stats")
async def cache_stats():
    """Get cache statistics"""
    return {
        "cached_items": len(cache._cache),
        "cache_keys": list(cache._cache.keys())[:10],  # First 10
        "default_ttl_seconds": cache.default_ttl
    }

@router.post("/cache/clear")
async def clear_cache():
    """Clear all cached data"""
    cache.clear()
    return {"status": "cleared", "message": "All cached data has been cleared"}

@router.get("/strategies")
async def get_optimization_strategies():
    """Get optimization strategies by category"""
    return {"strategies": OPTIMIZATION_STRATEGIES}

@router.get("/health")
async def health_check():
    """Performance health check"""
    stats = monitor.get_stats()
    
    # Determine health status
    if stats.get("avg_duration_ms", 0) < 100 and stats.get("error_rate", 100) < 5:
        status = "healthy"
    elif stats.get("avg_duration_ms", 0) < 500 and stats.get("error_rate", 100) < 10:
        status = "degraded"
    else:
        status = "unhealthy"
    
    return {
        "status": status,
        "metrics": stats,
        "recommendations": _get_recommendations(stats)
    }

def _get_recommendations(stats: dict) -> List[str]:
    """Generate optimization recommendations"""
    recommendations = []
    
    avg_ms = stats.get("avg_duration_ms", 0)
    error_rate = stats.get("error_rate", 0)
    
    if avg_ms > 200:
        recommendations.append("Consider adding response caching for slow endpoints")
        recommendations.append("Review database queries for optimization opportunities")
    
    if error_rate > 5:
        recommendations.append("Error rate is elevated - review error logs")
        recommendations.append("Consider adding retry logic for failed requests")
    
    if len(stats.get("request_times", [])) > 1000:
        recommendations.append("Consider implementing request batching")
    
    if not recommendations:
        recommendations.append("Performance looks good! Continue monitoring.")
    
    return recommendations

# ============ Performance Middleware ============

# @router.middleware("http")  # NOTE: Middleware must be added at app level, not router
async def performance_middleware(request: Request, call_next):
    """Middleware to track request performance"""
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    
    # Record metrics
    endpoint = request.url.path
    status = response.status_code
    monitor.record_request(endpoint, duration, status)
    
    # Add performance header
    response.headers["X-Response-Time"] = f"{duration * 1000:.2f}ms"
    
    return response

# ============ Database Optimization Queries ============

QUERY_OPTIMIZATIONS = {
    "wellness_entries": {
        "indexes": [
            "CREATE INDEX idx_wellness_user_date ON wellness_entries(user_id, date)",
            "CREATE INDEX idx_wellness_date ON wellness_entries(date)"
        ],
        "query_tips": [
            "Select only needed columns instead of SELECT *",
            "Use pagination for large result sets",
            "Cache frequently accessed data"
        ]
    },
    "module_progress": {
        "indexes": [
            "CREATE INDEX idx_progress_user_module ON module_progress(user_id, module_name)"
        ],
        "query_tips": [
            "Aggregate on the server when possible",
            "Use EXISTS instead of IN for better performance"
        ]
    },
    "conversations": {
        "indexes": [
            "CREATE INDEX idx_conversations_user ON conversations(user_id)"
        ],
        "query_tips": [
            "Limit message history retrieval",
            "Archive old conversations"
        ]
    }
}

@router.get("/database/optimizations")
async def get_db_optimizations():
    """Get database optimization suggestions"""
    return {"optimizations": QUERY_OPTIMIZATIONS}
