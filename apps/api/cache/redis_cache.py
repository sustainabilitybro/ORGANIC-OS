"""
Redis Cache Layer

Production-ready caching with Redis:
- Connection management
- Cache patterns
- TTL management
- Cache invalidation
"""
from fastapi import FastAPI
from typing import Dict, Any, Optional, List
from datetime import datetime
import json
import hashlib
import os

# Try to import Redis (optional dependency)
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    redis = None

# ============ Configuration ============

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
DEFAULT_TTL = int(os.getenv("CACHE_TTL", "300"))  # 5 minutes

# ============ Cache Client ============

class RedisCache:
    """Redis cache client with patterns"""
    
    def __init__(
        self,
        url: str = REDIS_URL,
        db: int = REDIS_DB,
        decode_responses: bool = True
    ):
        self.url = url
        self.db = db
        self._client = None
        self._connected = False
    
    def connect(self):
        """Establish Redis connection"""
        if not REDIS_AVAILABLE:
            self._connected = False
            return False
        
        try:
            self._client = redis.Redis(
                host=self.url.split("://")[1].split(":")[0],
                port=int(self.url.split(":")[-1]),
                db=self.db,
                decode_responses=decode_responses
            )
            self._client.ping()
            self._connected = True
            return True
        except Exception as e:
            print(f"Redis connection failed: {e}")
            self._connected = False
            return False
    
    def is_connected(self) -> bool:
        """Check if Redis is connected"""
        return self._connected and self._client is not None
    
    def _ensure_connected(self):
        """Ensure connection, try to reconnect if needed"""
        if not self._connected:
            self.connect()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        self._ensure_connected()
        if not self.is_connected():
            return None
        
        try:
            value = self._client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception:
            return None
    
    def set(
        self,
        key: str,
        value: Any,
        ttl: int = DEFAULT_TTL
    ) -> bool:
        """Set value in cache"""
        self._ensure_connected()
        if not self.is_connected():
            return False
        
        try:
            serialized = json.dumps(value)
            self._client.setex(key, ttl, serialized)
            return True
        except Exception:
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        self._ensure_connected()
        if not self.is_connected():
            return False
        
        try:
            self._client.delete(key)
            return True
        except Exception:
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        self._ensure_connected()
        if not self.is_connected():
            return False
        
        try:
            return bool(self._client.exists(key))
        except Exception:
            return False
    
    def get_pattern(self, pattern: str) -> Dict[str, Any]:
        """Get all values matching pattern"""
        self._ensure_connected()
        if not self.is_connected():
            return {}
        
        try:
            keys = self._client.keys(pattern)
            result = {}
            for key in keys:
                value = self._client.get(key)
                if value:
                    result[key] = json.loads(value)
            return result
        except Exception:
            return {}
    
    def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern"""
        self._ensure_connected()
        if not self.is_connected():
            return 0
        
        try:
            keys = self._client.keys(pattern)
            if keys:
                return self._client.delete(*keys)
            return 0
        except Exception:
            return 0
    
    def delete_prefix(self, prefix: str) -> int:
        """Delete all keys with prefix"""
        return self.delete_pattern(f"{prefix}*")
    
    def hget(self, key: str, field: str) -> Optional[Any]:
        """Get field from hash"""
        self._ensure_connected()
        if not self.is_connected():
            return None
        
        try:
            value = self._client.hget(key, field)
            if value:
                return json.loads(value)
            return None
        except Exception:
            return None
    
    def hset(
        self,
        key: str,
        field: str,
        value: Any,
        ttl: int = DEFAULT_TTL
    ) -> bool:
        """Set field in hash"""
        self._ensure_connected()
        if not self.is_connected():
            return False
        
        try:
            serialized = json.dumps(value)
            self._client.hset(key, field, serialized)
            self._client.expire(key, ttl)
            return True
        except Exception:
            return False
    
    def stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        self._ensure_connected()
        
        if not self.is_connected():
            return {
                "connected": False,
                "message": "Redis not available"
            }
        
        try:
            info = self._client.info("stats")
            return {
                "connected": True,
                "keys": self._client.dbsize(),
                "hits": info.get("keyspace_hits", 0),
                "misses": info.get("keyspace_misses", 0),
                "uptime_seconds": info.get("uptime_in_seconds", 0)
            }
        except Exception as e:
            return {
                "connected": True,
                "error": str(e)
            }
    
    def clear_all(self) -> bool:
        """Clear all cache"""
        self._ensure_connected()
        if not self.is_connected():
            return False
        
        try:
            self._client.flushdb()
            return True
        except Exception:
            return False


# ============ Fallback In-Memory Cache ============

class MemoryCache:
    """In-memory fallback when Redis is unavailable"""
    
    def __init__(self):
        self._store: Dict[str, Any] = {}
        self._timestamps: Dict[str, float] = {}
        self._ttl: int = DEFAULT_TTL
    
    def set_ttl(self, ttl: int):
        """Set default TTL"""
        self._ttl = ttl
    
    def get(self, key: str) -> Optional[Any]:
        """Get value"""
        self._clean_expired()
        return self._store.get(key)
    
    def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set value"""
        self._store[key] = value
        self._timestamps[key] = self._ttl if ttl is None else ttl
        return True
    
    def delete(self, key: str) -> bool:
        """Delete key"""
        self._store.pop(key, None)
        self._timestamps.pop(key, None)
        return True
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        self._clean_expired()
        return key in self._store
    
    def delete_pattern(self, pattern: str) -> int:
        """Delete by pattern"""
        self._clean_expired()
        to_delete = [k for k in self._store.keys() if pattern.replace("*", "") in k]
        for k in to_delete:
            self.delete(k)
        return len(to_delete)
    
    def delete_prefix(self, prefix: str) -> int:
        """Delete by prefix"""
        return self.delete_pattern(f"{prefix}*")
    
    def stats(self) -> Dict[str, Any]:
        """Get statistics"""
        self._clean_expired()
        return {
            "connected": True,
            "type": "memory",
            "keys": len(self._store),
            "ttl_default": self._ttl
        }
    
    def clear_all(self) -> bool:
        """Clear all"""
        self._store.clear()
        self._timestamps.clear()
        return True
    
    def _clean_expired(self):
        """Remove expired entries"""
        now = datetime.utcnow().timestamp()
        expired = [k for k, v in self._timestamps.items() if v <= 0 or now > v]
        for k in expired:
            self._store.pop(k, None)
            self._timestamps.pop(k, None)


# ============ Cache Manager ============

class CacheManager:
    """Unified cache interface with fallback"""
    
    def __init__(self):
        self.redis = RedisCache()
        self.memory = MemoryCache()
        self._connected = False
        self._connect()
    
    def _connect(self):
        """Try to connect to Redis"""
        self._connected = self.redis.connect()
        if self._connected:
            print("Redis connected")
        else:
            print("Using in-memory cache fallback")
    
    @property
    def is_connected(self) -> bool:
        """Check if Redis is connected"""
        return self._connected
    
    def get(self, key: str) -> Optional[Any]:
        """Get value"""
        if self._connected:
            value = self.redis.get(key)
            if value is not None:
                return value
        return self.memory.get(key)
    
    def set(
        self,
        key: str,
        value: Any,
        ttl: int = DEFAULT_TTL,
        use_memory_fallback: bool = True
    ) -> bool:
        """Set value"""
        success = False
        if self._connected:
            success = self.redis.set(key, value, ttl)
        if not success and use_memory_fallback:
            success = self.memory.set(key, value, ttl)
        return success
    
    def delete(self, key: str) -> bool:
        """Delete from both"""
        self.redis.delete(key)
        self.memory.delete(key)
        return True
    
    def invalidate_pattern(self, pattern: str) -> int:
        """Invalidate by pattern"""
        return self.redis.delete_pattern(pattern) + self.memory.delete_pattern(pattern)
    
    def invalidate_prefix(self, prefix: str) -> int:
        """Invalidate by prefix"""
        return self.invalidate_pattern(f"{prefix}*")
    
    def stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return {
            "redis": self.redis.stats(),
            "memory": self.memory.stats()
        }
    
    def clear_all(self) -> bool:
        """Clear all cache"""
        self.redis.clear_all()
        self.memory.clear_all()
        return True


# Global cache manager
cache_manager = CacheManager()


# ============ Utility Functions ============

def cache_key(*args) -> str:
    """Generate cache key from arguments"""
    key_parts = [str(arg) for arg in args if arg]
    return ":".join(key_parts)


def cache_key_hash(data: Dict[str, Any]) -> str:
    """Generate hash-based cache key"""
    content = json.dumps(data, sort_keys=True)
    return hashlib.sha256(content.encode()).hexdigest()[:16]


# ============ FastAPI Setup ============

def setup_cache(app: FastAPI):
    """Setup cache for FastAPI app"""
    
    @app.get("/api/v1/cache/stats")
    async def get_cache_stats():
        """Get cache statistics"""
        return cache_manager.stats()
    
    @app.post("/api/v1/cache/clear")
    async def clear_cache():
        """Clear all cache"""
        cache_manager.clear_all()
        return {"success": True, "message": "Cache cleared"}
    
    @app.post("/api/v1/cache/invalidate/{prefix}")
    async def invalidate_prefix(prefix: str):
        """Invalidate cache by prefix"""
        count = cache_manager.invalidate_prefix(prefix)
        return {"success": True, "invalidated": count}


# ============ Decorators ============

def cached(ttl: int = DEFAULT_TTL, key_prefix: str = ""):
    """Decorator for caching function results"""
    def decorator(func):
        cache_key_prefix = key_prefix or func.__module__ + "." + func.__name__
        
        def wrapper(*args, **kwargs):
            key = cache_key(cache_key_prefix, args, kwargs)
            cached_value = cache_manager.get(key)
            
            if cached_value is not None:
                return cached_value
            
            result = func(*args, **kwargs)
            cache_manager.set(key, result, ttl)
            return result
        
        return wrapper
    return decorator
