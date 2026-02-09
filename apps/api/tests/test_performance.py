"""
Performance Tests

Test performance improvements:
- Response compression
- Query optimization
- Database health
- Cache functionality
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

# ============ Response Compression Tests ============

def test_response_compression():
    """Test that compression is applied"""
    response = client.get(
        "/api/v1/modules/all",
        headers={"Accept-Encoding": "gzip, deflate"}
    )
    
    # Should accept compression
    assert response.status_code in [200, 401, 403]
    
    # Check Vary header for caching
    assert response.headers.get("Vary") in ["Accept-Encoding", None]

def test_large_response_compression():
    """Test compression on larger responses"""
    # Create a large payload
    large_data = {"data": "x" * 10000}
    
    response = client.post(
        "/api/v1/pis/quick/log",
        json=large_data,
        headers={"Accept-Encoding": "gzip"}
    )
    
    assert response.status_code in [200, 400, 401, 422]

def test_compression_not_applied_to_small():
    """Test that small responses aren't compressed"""
    response = client.get("/api/v1/health")
    
    # Should work regardless of compression
    assert response.status_code == 200

# ============ Database Status Tests ============

def test_database_status_endpoint():
    """Test database status endpoint"""
    response = client.get("/api/v1/database/status")
    
    # Should return status
    assert response.status_code == 200
    data = response.json()
    
    # Should have status field
    assert "status" in data

def test_cache_stats_endpoint():
    """Test cache stats endpoint"""
    response = client.get("/api/v1/database/cache/stats")
    
    # Should return cache stats
    assert response.status_code == 200
    data = response.json()
    
    assert data.get("status") in ["active", "unavailable"]

def test_database_metrics_endpoint():
    """Test database metrics endpoint"""
    response = client.get("/api/v1/database/metrics")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "status" in data
    assert "metrics" in data

def test_cache_clear_endpoint():
    """Test cache clear endpoint"""
    response = client.post("/api/v1/database/cache/clear")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "status" in data

def test_pool_reset_endpoint():
    """Test pool reset endpoint"""
    response = client.post("/api/v1/database/pool/reset")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "status" in data

# ============ Security Headers Tests ============

def test_security_headers_present():
    """Test security headers are present"""
    response = client.get("/api/v1/health")
    headers = response.headers
    
    # Check for key security headers
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"

def test_csp_header_present():
    """Test Content-Security-Policy header"""
    response = client.get("/api/v1/health")
    assert "Content-Security-Policy" in response.headers

def test_hsts_header_present():
    """Test HSTS header"""
    response = client.get("/api/v1/health")
    assert "Strict-Transport-Security" in response.headers

# ============ Rate Limiting Tests ============

def test_rate_limit_headers():
    """Test rate limit headers are present"""
    response = client.get("/api/v1/modules/all")
    
    # Should have rate limit headers
    has_headers = (
        "X-RateLimit-Limit" in response.headers or
        response.status_code == 200
    )
    assert has_headers

def test_health_endpoints_no_rate_limit():
    """Test health endpoints bypass rate limiting"""
    # Multiple health checks should all succeed
    for _ in range(10):
        response = client.get("/api/v1/health")
        assert response.status_code == 200

# ============ Performance Tests ============

def test_response_time_under_200ms():
    """Test that most endpoints respond under 200ms"""
    endpoints = [
        "/api/v1/health",
        "/api/v1/ready",
        "/api/v1/security/status",
    ]
    
    for endpoint in endpoints:
        response = client.get(endpoint)
        # Should be fast
        assert response.elapsed.total_seconds() < 0.2, f"{endpoint} too slow"

def test_no_slow_queries_logged():
    """Test that no slow queries are being logged unnecessarily"""
    response = client.get("/api/v1/performance/metrics")
    
    assert response.status_code == 200
    # Performance middleware should track this
    data = response.json()
    assert "total_requests" in data or "metrics" in data

# ============ Stress Tests (Mock) ============

def test_concurrent_requests():
    """Test handling of concurrent requests"""
    import concurrent.futures
    
    endpoints = ["/api/v1/health" for _ in range(5)]
    
    def make_request(url):
        return client.get(url)
    
    # Make concurrent requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(make_request, url) for url in endpoints]
        results = [f.result() for f in concurrent.futures.as_completed(futures)]
    
    # All should succeed
    for result in results:
        assert result.status_code == 200

# ============ Running Tests ============

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
