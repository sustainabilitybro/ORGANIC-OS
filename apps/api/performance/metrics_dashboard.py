"""
Metrics Dashboard - Visual performance metrics API
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/v1/metrics", tags=["metrics"])


# ============ Metric Models ============

class MetricDataPoint(BaseModel):
    timestamp: str
    value: float


class MetricSummary(BaseModel):
    metric: str
    current: float
    min: float
    max: float
    avg: float
    change_percent: float


class DashboardWidget(BaseModel):
    id: str
    type: str  # line, bar, gauge, number
    title: str
    metric: str
    value: float
    unit: str
    trend: str  # up, down, stable
    status: str  # healthy, warning, critical


# ============ Generate Mock Data ============

def generate_timeseries(metric: str, hours: int = 24) -> List[MetricDataPoint]:
    """Generate mock time series data"""
    points = []
    base_value = random.uniform(50, 100)
    
    for i in range(hours):
        value = base_value + random.uniform(-10, 10)
        points.append(MetricDataPoint(
            timestamp=(datetime.now() - timedelta(hours=hours-i)).isoformat(),
            value=round(value, 2)
        ))
    
    return points


# ============ Endpoints ============

@router.get("/dashboard")
async def get_dashboard_widgets() -> List[DashboardWidget]:
    """Get all dashboard widgets"""
    widgets = [
        DashboardWidget(
            id="requests",
            type="number",
            title="Requests/min",
            metric="requests_per_minute",
            value=random.randint(50, 200),
            unit="req/min",
            trend="up",
            status="healthy"
        ),
        DashboardWidget(
            id="latency",
            type="gauge",
            title="Avg Latency",
            metric="avg_latency_ms",
            value=random.uniform(50, 150),
            unit="ms",
            trend="stable",
            status="healthy"
        ),
        DashboardWidget(
            id="error_rate",
            type="gauge",
            title="Error Rate",
            metric="error_rate_percent",
            value=random.uniform(0.1, 2.0),
            unit="%",
            trend="down",
            status="healthy"
        ),
        DashboardWidget(
            id="cache_hit",
            type="gauge",
            title="Cache Hit Rate",
            metric="cache_hit_rate",
            value=random.uniform(75, 95),
            unit="%",
            trend="up",
            status="healthy"
        ),
        DashboardWidget(
            id="active_users",
            type="number",
            title="Active Users",
            metric="active_users",
            value=random.randint(10, 100),
            unit="users",
            trend="up",
            status="healthy"
        ),
        DashboardWidget(
            id="db_connections",
            type="gauge",
            title="DB Connections",
            metric="db_connections",
            value=random.uniform(5, 20),
            unit="conn",
            trend="stable",
            status="healthy"
        )
    ]
    return widgets


@router.get("/timeseries/{metric}")
async def get_metric_timeseries(metric: str, hours: int = 24):
    """Get time series data for a metric"""
    data = generate_timeseries(metric, hours)
    return {
        "metric": metric,
        "hours": hours,
        "data": data,
        "generated_at": datetime.now().isoformat()
    }


@router.get("/summary")
async def get_metrics_summary() -> List[MetricSummary]:
    """Get summary of all metrics"""
    metrics = [
        "requests_per_minute",
        "avg_latency_ms",
        "error_rate_percent",
        "cache_hit_rate",
        "active_users",
        "db_connections",
        "memory_usage_mb",
        "cpu_usage_percent"
    ]
    
    summaries = []
    for metric in metrics:
        values = [float(d.value) for d in generate_timeseries(metric, 24)]
        
        summaries.append(MetricSummary(
            metric=metric,
            current=values[-1],
            min=min(values),
            max=max(values),
            avg=sum(values) / len(values),
            change_percent=random.uniform(-5, 5)
        ))
    
    return summaries


@router.get("/health")
async def metrics_health():
    """Overall metrics health"""
    widgets = await get_dashboard_widgets()
    
    issues = []
    for widget in widgets:
        if widget.status == "critical":
            issues.append(f"{widget.title}: critical")
        elif widget.status == "warning":
            issues.append(f"{widget.title}: warning")
    
    return {
        "status": "healthy" if not issues else "degraded",
        "total_widgets": len(widgets),
        "healthy_count": sum(1 for w in widgets if w.status == "healthy"),
        "issues": issues
    }


@router.get("/realtime")
async def get_realtime_metrics():
    """Get real-time metrics snapshot"""
    return {
        "timestamp": datetime.now().isoformat(),
        "metrics": {
            "requests_per_minute": random.randint(50, 200),
            "avg_latency_ms": random.uniform(50, 150),
            "error_rate_percent": random.uniform(0.1, 2.0),
            "cache_hit_rate": random.uniform(75, 95),
            "active_users": random.randint(10, 100),
            "db_connections": random.randint(5, 20),
            "memory_usage_mb": random.uniform(100, 500),
            "cpu_usage_percent": random.uniform(10, 50)
        }
    }
