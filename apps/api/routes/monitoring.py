"""
Monitoring & Metrics API

Provides Prometheus-compatible metrics and monitoring endpoints.
"""
from fastapi import APIRouter, Response
from typing import Dict, Any
import time
import os
import sys
import platform

router = APIRouter(prefix="/api/v1/monitoring", tags=["monitoring"])


@router.get("/metrics")
async def get_metrics() -> Response:
    """Prometheus-compatible metrics endpoint"""
    metrics = []
    
    # Application metrics
    metrics.append(f'organic_os_app_info{{version="{os.getenv("APP_VERSION", "2.0.0")}"}} 1')
    metrics.append(f'organic_os_python_info{{version="{sys.version.split()[0]}"}} 1')
    metrics.append(f'organic_os_platform_info{{system="{platform.system()}"}} 1')
    
    # Uptime
    try:
        with open('/proc/uptime', 'r') as f:
            uptime_seconds = float(f.readline().split()[0])
            metrics.append(f'organic_os_uptime_seconds {uptime_seconds}')
    except Exception:
        metrics.append('organic_os_uptime_seconds 0')
    
    # Environment
    env = os.getenv('ENVIRONMENT', 'unknown')
    metrics.append(f'organic_os_environment{{env="{env}"}} 1')
    
    # Feature flags
    metrics.append(f'organic_os_feature_supabase {1 if os.getenv("SUPABASE_URL") else 0}')
    metrics.append(f'organic_os_feature_github {1 if os.getenv("GITHUB_TOKEN") else 0}')
    metrics.append(f'organic_os_feature_weather {1 if os.getenv("OPENWEATHER_API_KEY") else 0}')
    
    return Response(
        content="\n".join(metrics) + "\n",
        media_type="text/plain; version=0.0.4; charset=utf-8"
    )


@router.get("/health/detailed")
async def get_detailed_health() -> Dict[str, Any]:
    """Detailed health check with component status"""
    components = {}
    
    # Python
    components["python"] = {
        "status": "healthy",
        "version": sys.version.split()[0],
        "path": sys.executable
    }
    
    # Platform
    components["platform"] = {
        "status": "healthy",
        "system": platform.system(),
        "release": platform.release()
    }
    
    # Environment
    components["environment"] = {
        "status": "healthy",
        "env": os.getenv('ENVIRONMENT', 'unknown')
    }
    
    # Supabase
    if os.getenv("SUPABASE_URL"):
        components["supabase"] = {"status": "configured"}
    else:
        components["supabase"] = {"status": "not_configured"}
    
    # GitHub
    if os.getenv("GITHUB_TOKEN"):
        components["github"] = {"status": "configured"}
    else:
        components["github"] = {"status": "not_configured"}
    
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "components": components
    }
