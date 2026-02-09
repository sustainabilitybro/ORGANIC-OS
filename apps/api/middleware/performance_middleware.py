"""
Performance Monitoring Middleware

Track request metrics, response times, and identify bottlenecks.
"""
from fastapi import Request, FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import time
import logging
from typing import Dict, Any
from collections import defaultdict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory metrics store
metrics: Dict[str, Any] = {
    "requests_total": 0,
    "requests_by_endpoint": defaultdict(int),
    "requests_by_method": defaultdict(int),
    "response_times": defaultdict(list),
    "errors": defaultdict(int),
    "start_time": time.time(),
}

class PerformanceMiddleware(BaseHTTPMiddleware):
    """Track performance metrics for all requests"""
    
    def __init__(self, app: FastAPI):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next):
        # Skip health checks for metrics
        if request.url.path in ["/", "/api/v1/health", "/api/v1/ready"]:
            return await call_next(request)
        
        # Track start time
        start_time = time.time()
        method = request.method
        endpoint = request.url.path
        
        # Process request
        try:
            response = await call_next(request)
            status_code = response.status_code
            error = None
        except Exception as e:
            status_code = 500
            error = str(e)
            raise
        finally:
            # Calculate duration
            duration = time.time() - start_time
            
            # Update metrics
            metrics["requests_total"] += 1
            metrics["requests_by_endpoint"][endpoint] += 1
            metrics["requests_by_method"][method] += 1
            metrics["response_times"][endpoint].append(duration)
            
            if status_code >= 400:
                metrics["errors"][endpoint] += 1
            
            # Log slow requests
            if duration > 1.0:
                logger.warning(
                    f"Slow request: {method} {endpoint} took {duration:.2f}s"
                )
        
        return response

def get_metrics() -> Dict[str, Any]:
    """Get all metrics"""
    uptime = time.time() - metrics["start_time"]
    
    # Calculate percentiles for response times
    percentiles = {}
    for endpoint, times in metrics["response_times"].items():
        if times:
            sorted_times = sorted(times)
            n = len(sorted_times)
            percentiles[endpoint] = {
                "avg": sum(times) / len(times),
                "p50": sorted_times[int(n * 0.50)],
                "p90": sorted_times[int(n * 0.90)],
                "p99": sorted_times[int(n * 0.99)] if n > 1 else sorted_times[0],
                "max": max(times)
            }
    
    return {
        "uptime_seconds": uptime,
        "total_requests": metrics["requests_total"],
        "requests_per_second": metrics["requests_total"] / max(uptime, 1),
        "by_endpoint": dict(metrics["requests_by_endpoint"]),
        "by_method": dict(metrics["requests_by_method"]),
        "response_times": percentiles,
        "errors": dict(metrics["errors"]),
        "error_rate": metrics["requests_total"] / max(metrics["errors_total"], 1) if "errors_total" in metrics else 0
    }

def get_health_status() -> Dict[str, Any]:
    """Get system health status"""
    current_metrics = get_metrics()
    
    # Check thresholds
    issues = []
    
    if current_metrics["error_rate"] > 0.05:
        issues.append("High error rate detected")
    
    avg_response_time = sum(
        d["avg"] for d in current_metrics["response_times"].values()
    ) / max(len(current_metrics["response_times"]), 1)
    
    if avg_response_time > 0.5:
        issues.append("Slow average response time")
    
    return {
        "healthy": len(issues) == 0,
        "issues": issues,
        "metrics": {
            "uptime_hours": round(current_metrics["uptime_seconds"] / 3600, 2),
            "total_requests": current_metrics["total_requests"],
            "error_rate": round(current_metrics["error_rate"] * 100, 2)
        }
    }

def reset_metrics():
    """Reset all metrics"""
    metrics["requests_total"] = 0
    metrics["requests_by_endpoint"].clear()
    metrics["requests_by_method"].clear()
    metrics["response_times"].clear()
    metrics["errors"].clear()
    metrics["start_time"] = time.time()
