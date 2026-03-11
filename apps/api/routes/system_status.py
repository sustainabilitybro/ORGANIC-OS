"""
System Status & Diagnostics API

Provides system health, diagnostics, and monitoring endpoints.
"""
from fastapi import APIRouter, Response
from typing import Dict, Any
import os
import sys
import platform
import time
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v1/system", tags=["system"])


@router.get("/status")
async def get_system_status() -> Dict[str, Any]:
    """Get comprehensive system status"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "uptime": get_uptime(),
        "version": os.getenv("APP_VERSION", "2.0.0"),
        "environment": os.getenv("ENVIRONMENT", "development"),
    }


@router.get("/info")
async def get_system_info() -> Dict[str, Any]:
    """Get detailed system information"""
    return {
        "platform": {
            "system": platform.system(),
            "release": platform.release(),
            "version": platform.version(),
            "machine": platform.machine(),
            "processor": platform.processor(),
            "python_version": sys.version,
        },
        "environment": {
            "python_path": sys.path[:3],
            "cwd": os.getcwd(),
        },
        "features": {
            "supabase": bool(os.getenv("SUPABASE_URL")),
            "github": bool(os.getenv("GITHUB_TOKEN")),
            "weather": bool(os.getenv("OPENWEATHER_API_KEY")),
        }
    }


@router.get("/diagnostics")
async def get_diagnostics() -> Dict[str, Any]:
    """Run system diagnostics"""
    checks = []
    
    # Check Python version
    checks.append({
        "name": "python_version",
        "status": "ok" if sys.version_info >= (3, 11) else "warning",
        "message": f"Python {sys.version_info.major}.{sys.version_info.minor}"
    })
    
    # Check environment
    checks.append({
        "name": "environment",
        "status": "ok" if os.getenv("ENVIRONMENT") else "warning",
        "message": f"Environment: {os.getenv('ENVIRONMENT', 'not set')}"
    })
    
    # Check Supabase
    checks.append({
        "name": "supabase",
        "status": "ok" if os.getenv("SUPABASE_URL") else "warning",
        "message": "Supabase configured" if os.getenv("SUPABASE_URL") else "Supabase not configured"
    })
    
    # Check GitHub
    checks.append({
        "name": "github",
        "status": "ok" if os.getenv("GITHUB_TOKEN") else "warning",
        "message": "GitHub token configured" if os.getenv("GITHUB_TOKEN") else "GitHub token not configured"
    })
    
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "checks": checks,
        "overall": "healthy" if all(c["status"] == "ok" for c in checks) else "degraded"
    }


def get_uptime() -> str:
    """Get system uptime"""
    try:
        with open('/proc/uptime', 'r') as f:
            uptime_seconds = float(f.readline().split()[0])
            hours = int(uptime_seconds // 3600)
            minutes = int((uptime_seconds % 3600) // 60)
            return f"{hours}h {minutes}m"
    except Exception:
        return "unknown"
