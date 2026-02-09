"""
Logging Enhancement - Structured logging and log aggregation
"""

import logging
import json
from datetime import datetime
from typing import Any, Dict
from contextlib import contextmanager
from functools import wraps
import threading

# ============ Structured Logging ============

class StructuredLogger:
    """Structured logger for consistent log format"""
    
    def __init__(self, name: str = "organic-os"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Console handler
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(message)s'))
        self.logger.addHandler(handler)
    
    def log(self, level: str, message: str, **kwargs):
        """Log with structured data"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": level,
            "message": message,
            "service": "organic-os-api",
            **kwargs
        }
        
        getattr(self.logger, level.lower())(json.dumps(log_entry))
    
    def info(self, message: str, **kwargs):
        self.log("INFO", message, **kwargs)
    
    def warning(self, message: str, **kwargs):
        self.log("WARNING", message, **kwargs)
    
    def error(self, message: str, **kwargs):
        self.log("ERROR", message, **kwargs)
    
    def debug(self, message: str, **kwargs):
        self.log("DEBUG", message, **kwargs)


# Global logger instance
logger = StructuredLogger()


# ============ Request Logging ============

class RequestLogger:
    """Logs HTTP requests with timing and context"""
    
    def __init__(self):
        self.request_counts: Dict[str, int] = {}
        self.error_counts: Dict[str, int] = {}
        self.timing_stats: Dict[str, list] = {}
        self._lock = threading.Lock()
    
    def log_request(self, method: str, path: str, status_code: int, duration_ms: float):
        """Log request details"""
        with self._lock:
            key = f"{method} {path}"
            
            # Count requests
            self.request_counts[key] = self.request_counts.get(key, 0) + 1
            
            # Count errors
            if status_code >= 400:
                self.error_counts[key] = self.error_counts.get(key, 0) + 1
            
            # Track timing
            if key not in self.timing_stats:
                self.timing_stats[key] = []
            self.timing_stats[key].append(duration_ms)
            
            # Keep only last 1000 entries
            for k in self.timing_stats:
                self.timing_stats[k] = self.timing_stats[k][-1000:]
    
    def get_stats(self) -> Dict[str, Any]:
        """Get request statistics"""
        with self._lock:
            stats = {
                "total_requests": sum(self.request_counts.values()),
                "total_errors": sum(self.error_counts.values()),
                "endpoints": {}
            }
            
            for key, count in self.request_counts.items():
                errors = self.error_counts.get(key, 0)
                timings = self.timing_stats.get(key, [])
                
                stats["endpoints"][key] = {
                    "requests": count,
                    "errors": errors,
                    "error_rate": round(errors / count * 100, 2) if count > 0 else 0,
                    "avg_duration_ms": round(sum(timings) / len(timings), 2) if timings else 0,
                    "min_duration_ms": round(min(timings), 2) if timings else 0,
                    "max_duration_ms": round(max(timings), 2) if timings else 0
                }
            
            return stats
    
    def reset(self):
        """Reset statistics"""
        with self._lock:
            self.request_counts.clear()
            self.error_counts.clear()
            self.timing_stats.clear()


request_logger = RequestLogger()


# ============ Context Logging ============

class RequestContext:
    """Context manager for request-scoped logging"""
    
    _context_data: Dict[str, Any] = {}
    _lock = threading.Lock()
    
    @classmethod
    def set(cls, **kwargs):
        with cls._lock:
            cls._context_data.update(kwargs)
    
    @classmethod
    def get(cls) -> Dict[str, Any]:
        with cls._lock:
            return cls._context_data.copy()
    
    @classmethod
    def clear(cls):
        with cls._lock:
            cls._context_data.clear()
    
    @classmethod
    @contextmanager
    def context(cls, **kwargs):
        """Create a context for logging"""
        previous = cls._context_data.copy()
        cls.set(**kwargs)
        try:
            yield
        finally:
            cls._context_data.clear()
            cls._context_data.update(previous)


def log_with_context(func):
    """Decorator to add context to function logs"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        context = RequestContext.get()
        logger.info(f"Calling {func.__name__}", function=func.__name__, **context)
        return func(*args, **kwargs)
    return wrapper


# ============ Log Aggregation Endpoints ============

from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/logs", tags=["logging"])


@router.get("/stats")
async def get_log_stats():
    """Get request logging statistics"""
    return request_logger.get_stats()


@router.get("/stats/reset")
async def reset_log_stats():
    """Reset logging statistics"""
    request_logger.reset()
    return {"message": "Statistics reset"}


@router.get("/health")
async def logging_health():
    """Logging health check"""
    stats = request_logger.get_stats()
    
    issues = []
    if stats["total_errors"] > 100:
        issues.append("High error count")
    
    return {
        "status": "healthy" if not issues else "attention_needed",
        "total_requests": stats["total_requests"],
        "total_errors": stats["total_errors"],
        "error_rate": round(stats["total_errors"] / max(1, stats["total_requests"]) * 100, 2)
    }


@router.get("/sample")
async def get_sample_logs():
    """Get sample of recent log entries"""
    # In production, this would query log aggregation system
    return {
        "logs": [
            {"timestamp": datetime.utcnow().isoformat(), "level": "INFO", "message": "Request completed"},
            {"timestamp": datetime.utcnow().isoformat(), "level": "INFO", "message": "Health check passed"},
        ],
        "total": 2
    }
