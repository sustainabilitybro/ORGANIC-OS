"""
Rate Limiting Middleware

Comprehensive rate limiting for API protection.
"""
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Optional
import time
import hashlib
from collections import defaultdict
from datetime import datetime, timedelta

# ============ Rate Limit Configuration ============

class RateLimitConfig:
    """Rate limit configuration for different endpoints"""
    
    # Endpoint-specific limits (requests per minute)
    LIMITS = {
        # Authentication endpoints
        "/api/v1/auth/login": {"requests": 5, "window": 60},
        "/api/v1/auth/register": {"requests": 3, "window": 60},
        "/api/v1/auth/refresh": {"requests": 10, "window": 60},
        
        # Chat/AI endpoints (expensive)
        "/api/v1/openclaw/chat": {"requests": 10, "window": 60},
        "/api/v1/openclaw/roundtable": {"requests": 3, "window": 60},
        
        # Check-ins (frequent but cheap)
        "/api/v1/wellness/check-in": {"requests": 60, "window": 60},
        "/api/v1/pis/habits/{id}/log": {"requests": 120, "window": 60},
        "/api/v1/pis/quick/log": {"requests": 120, "window": 60},
        
        # Read endpoints (more permissive)
        "/api/v1/modules": {"requests": 200, "window": 60},
        "/api/v1/modules/all": {"requests": 100, "window": 60},
        "/api/v1/wellness/prompt": {"requests": 200, "window": 60},
        "/api/v1/integrations": {"requests": 100, "window": 60},
        
        # Write endpoints (stricter)
        "/api/v1/progress": {"requests": 30, "window": 60},
        "/api/v1/pis/goals": {"requests": 20, "window": 60},
        "/api/v1/pis/calendar/events": {"requests": 30, "window": 60},
        "/api/v1/pis/habits": {"requests": 20, "window": 60},
        
        # Default limit
        "default": {"requests": 100, "window": 60}
    }
    
    # Tier-based limits (if user tier is available)
    TIERS = {
        "free": 1.0,
        "pro": 2.0,
        "enterprise": 5.0
    }

# ============ Rate Limit Storage ============

class RateLimitStore:
    """In-memory rate limit storage (use Redis in production)"""
    
    def __init__(self):
        # Structure: {key: [(timestamp, count), ...]}
        self._store: Dict[str, list] = defaultdict(list)
        self.cleanup_interval = 300  # Clean up every 5 minutes
        self.last_cleanup = time.time()
    
    def _get_key(self, identifier: str, endpoint: str) -> str:
        """Generate rate limit key"""
        return f"{identifier}:{endpoint}"
    
    def check_rate_limit(
        self,
        identifier: str,
        endpoint: str,
        max_requests: int,
        window_seconds: int
    ) -> Dict:
        """Check and update rate limit"""
        key = self._get_key(identifier, endpoint)
        now = time.time()
        window_start = now - window_seconds
        
        # Clean up old entries periodically
        if now - self.last_cleanup > self.cleanup_interval:
            self._cleanup(window_start)
            self.last_cleanup = now
        
        # Get current requests in window
        requests = self._store[key]
        recent_requests = [t for t in requests if t >= window_start]
        
        # Check if over limit
        if len(recent_requests) >= max_requests:
            # Calculate retry-after
            oldest = min(recent_requests)
            retry_after = int(oldest - window_start) + 1
            
            return {
                "allowed": False,
                "retry_after": retry_after,
                "limit": max_requests,
                "remaining": 0,
                "reset": int(now + window_seconds)
            }
        
        # Record this request
        recent_requests.append(now)
        self._store[key] = recent_requests
        
        return {
            "allowed": True,
            "limit": max_requests,
            "remaining": max(0, max_requests - len(recent_requests)),
            "reset": int(now + window_seconds)
        }
    
    def _cleanup(self, before_time: float):
        """Remove old entries"""
        for key in list(self._store.keys()):
            self._store[key] = [t for t in self._store[key] if t >= before_time]
            if not self._store[key]:
                del self._store[key]

# Global store
_rate_limit_store = RateLimitStore()
_config = RateLimitConfig()

# ============ Rate Limit Middleware ============

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app: FastAPI):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next):
        # Skip health endpoints
        path = request.url.path
        if any(path.startswith(skip) for skip in ["/api/v1/health", "/api/v1/ready", "/docs", "/redoc", "/openapi"]):
            return await call_next(request)
        
        # Get identifier (IP or user ID)
        identifier = self._get_identifier(request)
        
        # Get endpoint configuration
        endpoint = self._get_endpoint_match(path)
        config = _config.LIMITS.get(endpoint, _config.LIMITS["default"])
        
        # Check rate limit
        result = _rate_limit_store.check_rate_limit(
            identifier=identifier,
            endpoint=endpoint,
            max_requests=config["requests"],
            window_seconds=config["window"]
        )
        
        # Add rate limit headers
        headers = {}
        if not result["allowed"]:
            return JSONResponse(
                status_code=429,
                headers={
                    "Retry-After": str(result["retry_after"]),
                    "X-RateLimit-Limit": str(result["limit"]),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(result["reset"])
                },
                content={
                    "error": {
                        "code": "RATE_LIMITED",
                        "message": "Too many requests. Please slow down.",
                        "retry_after": result["retry_after"]
                    }
                }
            )
        
        # Add headers for successful requests
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(result["limit"])
        response.headers["X-RateLimit-Remaining"] = str(result["remaining"])
        response.headers["X-RateLimit-Reset"] = str(result["reset"])
        
        return response
    
    def _get_identifier(self, request: Request) -> str:
        """Get unique identifier for rate limiting"""
        # Try to get user ID from header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:37]
            return f"user:{token}"
        
        # Fall back to IP
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return f"ip:{forwarded.split(',')[0].strip()}"
        
        return f"ip:{request.client.host}"
    
    def _get_endpoint_match(self, path: str) -> str:
        """Get the matching endpoint pattern"""
        # Exact match
        if path in _config.LIMITS:
            return path
        
        # Pattern match (remove IDs)
        parts = path.split('/')
        for i, part in enumerate(parts):
            if part and self._is_id(part):
                pattern = '/'.join(parts[:i] + ['{id}'] + parts[i+1:])
                if pattern in _config.LIMITS:
                    return pattern
        
        return "default"
    
    def _is_id(self, s: str) -> bool:
        """Check if string looks like an ID"""
        return bool(
            len(s) in [8, 16, 32, 36] and
            all(c in '0123456789abcdefABCDEF-' for c in s)
        )

# ============ Dependency for Route-Level Rate Limiting ============

class RateLimiter:
    """Dependency for route-level rate limiting"""
    
    def __init__(self, endpoint: str):
        self.endpoint = endpoint
    
    async def __call__(
        self,
        request: Request = None
    ) -> Dict:
        """Check rate limit and return status"""
        if request is None:
            return {"allowed": True, "message": "No request context"}
        
        identifier = request.headers.get("X-Forwarded-For", 
                                       request.headers.get("X-Real-IP", 
                                                            request.client.host))
        config = _config.LIMITS.get(self.endpoint, _config.LIMITS["default"])
        
        result = _rate_limit_store.check_rate_limit(
            identifier=f"dep:{identifier}",
            endpoint=self.endpoint,
            max_requests=config["requests"],
            window_seconds=config["window"]
        )
        
        if not result["allowed"]:
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "retry_after": result["retry_after"]
                }
            )
        
        return result

# ============ Setup Function ============

def setup_rate_limiting(app: FastAPI):
    """Setup rate limiting for FastAPI app"""
    app.add_middleware(RateLimitMiddleware)

# ============ Utility Functions ============

def get_rate_limit_status(endpoint: str) -> Dict:
    """Get rate limit status for an endpoint"""
    config = _config.LIMITS.get(endpoint, _config.LIMITS["default"])
    return {
        "endpoint": endpoint,
        "requests_per_window": config["requests"],
        "window_seconds": config["window"],
        "requests_per_second": round(config["requests"] / config["window"], 2)
    }

def get_all_rate_limits() -> Dict:
    """Get all rate limit configurations"""
    return {
        endpoint: {
            "requests": config["requests"],
            "window_seconds": config["window"]
        }
        for endpoint, config in _config.LIMITS.items()
    }

# ============ Testing Utilities ============

def reset_rate_limits():
    """Reset all rate limits (for testing)"""
    global _rate_limit_store
    _rate_limit_store = RateLimitStore()

def simulate_requests(
    identifier: str,
    endpoint: str,
    count: int,
    max_requests: int
) -> Dict:
    """Simulate requests for testing"""
    result = _rate_limit_store.check_rate_limit(
        identifier=identifier,
        endpoint=endpoint,
        max_requests=max_requests,
        window_seconds=60
    )
    
    # Simulate the requests
    for _ in range(count - 1):
        _rate_limit_store.check_rate_limit(
            identifier=identifier,
            endpoint=endpoint,
            max_requests=max_requests,
            window_seconds=60
        )
    
    return _rate_limit_store.check_rate_limit(
        identifier=identifier,
        endpoint=endpoint,
        max_requests=max_requests,
        window_seconds=60
    )
