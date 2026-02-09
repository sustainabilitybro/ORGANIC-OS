"""
Redis Cache Optimization - TTL tuning, cache warming, and monitoring
"""

from fastapi import APIRouter
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/v1/cache", tags=["cache"])


# ============ Cache Models ============

class CacheStats(BaseModel):
    hits: int
    misses: int
    hit_rate: float
    memory_used_mb: float
    keys_count: int
    expired_keys: int
    avg_ttl_seconds: float


class CacheKeyInfo(BaseModel):
    key: str
    pattern: str
    ttl_seconds: int
    size_bytes: int
    access_count: int
    last_access: str


class CacheRecommendation(BaseModel):
    area: str
    recommendation: str
    impact: str
    priority: str


# ============ TTL Configuration ============

TTL_CONFIG = {
    # Short TTL (5 minutes) - Frequently changing data
    "user_session": 300,
    "rate_limit": 300,
    
    # Medium TTL (1 hour) - User-specific data
    "user_profile": 3600,
    "user_preferences": 3600,
    
    # Long TTL (24 hours) - Relatively static data
    "module_data": 86400,
    "wellness_tips": 86400,
    
    # Very Long TTL (7 days) - Static reference data
    "emotion_taxonomy": 604800,
    "coping_strategies": 604800,
}

# ============ Cache Warming ============

WARMING_SCHEDULE = {
    "daily": [
        ("daily_quote", 86400),
        ("wellness_tip", 86400),
        ("holiday", 86400),
    ],
    "hourly": [
        ("trending_habits", 3600),
        ("productivity_technique", 3600),
    ],
    "on_startup": [
        ("all_modules", 86400),
        ("emotion_taxonomy", 604800),
    ]
}


async def warm_cache(key: str, ttl: int):
    """Warm a specific cache key"""
    # In production, this would populate the cache
    return {"key": key, "warmed": True, "ttl": ttl}


async def warm_all_daily():
    """Warm all daily cache entries"""
    results = []
    for key, ttl in WARMING_SCHEDULE["daily"]:
        result = await warm_cache(key, ttl)
        results.append(result)
    return {"warmed": len(results), "entries": results}


async def warm_all_hourly():
    """Warm all hourly cache entries"""
    results = []
    for key, ttl in WARMING_SCHEDULE["hourly"]:
        result = await warm_cache(key, ttl)
        results.append(result)
    return {"warmed": len(results), "entries": results}


# ============ Cache Stats ============

async def get_cache_stats() -> CacheStats:
    """Get cache statistics"""
    # In production, these would come from Redis
    return CacheStats(
        hits=12500,
        misses=3200,
        hit_rate=12500 / (12500 + 3200) * 100,
        memory_used_mb=45.2,
        keys_count=450,
        expired_keys=120,
        avg_ttl_seconds=43200
    )


async def get_cache_keys(limit: int = 50) -> List[CacheKeyInfo]:
    """Get cache key information"""
    # In production, this would scan Redis keys
    keys = []
    patterns = list(TTL_CONFIG.keys())[:5]
    for pattern in patterns:
        keys.append(CacheKeyInfo(
            key=pattern,
            pattern=pattern,
            ttl_seconds=TTL_CONFIG.get(pattern, 3600),
            size_bytes=random.randint(100, 10000),
            access_count=random.randint(10, 1000),
            last_access=datetime.now().isoformat()
        ))
    return keys


async def get_recommendations() -> List[CacheRecommendation]:
    """Get cache optimization recommendations"""
    recommendations = []
    
    # Get current stats
    stats = await get_cache_stats()
    
    if stats.hit_rate < 80:
        recommendations.append(CacheRecommendation(
            area="hit_rate",
            recommendation="Consider increasing TTL for frequently accessed keys",
            impact="Could improve hit rate by 15-25%",
            priority="high"
        ))
    
    if stats.avg_ttl_seconds > 86400:
        recommendations.append(CacheRecommendation(
            area="ttl",
            recommendation="Some keys have TTL > 24h. Consider refreshing daily.",
            impact="Reduce stale data risk",
            priority="medium"
        ))
    
    recommendations.append(CacheRecommendation(
        area="warming",
        recommendation="Implement cache warming on startup",
        impact="Reduce cold-start latency by 30-50%",
        priority="medium"
    ))
    
    return recommendations


# ============ Routes ============

@router.get("/stats", response_model=CacheStats)
async def get_cache_statistics():
    """Get cache performance statistics"""
    return await get_cache_stats()


@router.get("/keys")
async def list_cache_keys(limit: int = 50):
    """List cache keys with metadata"""
    keys = await get_cache_keys(limit)
    return {"keys": keys, "total": len(keys)}


@router.get("/ttl")
async def get_ttl_config():
    """Get TTL configuration"""
    return {
        "config": TTL_CONFIG,
        "updated": datetime.now().isoformat()
    }


@router.post("/warm/daily")
async def warm_daily_cache():
    """Warm daily cache entries"""
    return await warm_all_daily()


@router.post("/warm/hourly")
async def warm_hourly_cache():
    """Warm hourly cache entries"""
    return await warm_all_hourly()


@router.post("/warm/all")
async def warm_all_cache():
    """Warm all cache entries"""
    daily = await warm_all_daily()
    hourly = await warm_all_hourly()
    return {
        "daily": daily["warmed"],
        "hourly": hourly["warmed"],
        "total": daily["warmed"] + hourly["warmed"]
    }


@router.get("/recommendations", response_model=List[CacheRecommendation])
async def get_cache_recommendations():
    """Get cache optimization recommendations"""
    return await get_recommendations()


@router.get("/health")
async def cache_health():
    """Cache health check"""
    stats = await get_cache_stats()
    issues = []
    
    if stats.hit_rate < 70:
        issues.append("Low cache hit rate")
    
    if stats.memory_used_mb > 100:
        issues.append("High memory usage")
    
    return {
        "status": "healthy" if not issues else "degraded",
        "hit_rate": round(stats.hit_rate, 1),
        "issues": issues
    }
