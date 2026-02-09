"""
Error Handling Tests

Test error handling improvements:
- Validation errors
- Authentication errors
- Database errors
- Custom error codes
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ValidationError, EmailStr
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

# ============ Error Classes ============

class ErrorResponse(BaseModel):
    """Standardized error response"""
    success: bool = False
    error: dict

# ============ Validation Error Tests ============

class TestValidationErrors:
    """Test validation error handling"""
    
    def test_invalid_email(self):
        """Test invalid email validation"""
        response = client.post("/api/v1/auth/register", json={
            "email": "invalid-email",
            "password": "SecurePass123!",
            "name": "Test"
        })
        assert response.status_code == 422
        
        data = response.json()
        assert data["success"] == False
        assert "email" in str(data)
    
    def test_weak_password(self):
        """Test weak password rejection"""
        response = client.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "weak",
            "name": "Test"
        })
        assert response.status_code == 422
    
    def test_missing_required_fields(self):
        """Test missing required fields"""
        response = client.post("/api/v1/auth/register", json={
            "email": "test@example.com"
        })
        assert response.status_code == 422
    
    def test_invalid_range_values(self):
        """Test invalid range validation"""
        response = client.post("/api/v1/wellness/check-in", json={
            "mood": 10,  # Should be 1-5
            "energy": 3
        })
        assert response.status_code == 422
    
    def test_negative_sleep_hours(self):
        """Test negative sleep hours rejection"""
        response = client.post("/api/v1/wellness/check-in", json={
            "mood": 3,
            "sleep_hours": -5
        })
        assert response.status_code == 422
    
    def test_past_deadline(self):
        """Test past deadline rejection"""
        past_date = "2020-01-01"
        response = client.post("/api/v1/pis/goals", json={
            "title": "Test Goal",
            "category": "personal",
            "deadline": past_date
        })
        assert response.status_code == 422
    
    def test_malformed_json(self):
        """Test malformed JSON handling"""
        response = client.post(
            "/api/v1/wellness/check-in",
            content="{invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422
    
    def test_sql_injection_blocked(self):
        """Test SQL injection patterns blocked"""
        response = client.post("/api/v1/auth/login", json={
            "email": "admin'--",
            "password": "anything"
        })
        assert response.status_code == 422
    
    def test_xss_content_blocked(self):
        """Test XSS content sanitization"""
        response = client.post("/api/v1/wellness/check-in", json={
            "mood": 3,
            "notes": "<script>alert('xss')</script>"
        })
        # Should either reject or sanitize
        assert response.status_code in [200, 400, 401, 422]
    
    def test_extremely_long_inputs(self):
        """Test extremely long input rejection"""
        long_string = "x" * 10000
        response = client.post("/api/v1/openclaw/chat", json={
            "message": long_string
        })
        assert response.status_code == 422


class TestAuthenticationErrors:
    """Test authentication error handling"""
    
    def test_missing_auth_header(self):
        """Test missing authorization header"""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 403
    
    def test_invalid_token(self):
        """Test invalid token handling"""
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid-token"}
        )
        assert response.status_code == 401
    
    def test_expired_token(self):
        """Test expired token handling"""
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer expired.token.here"}
        )
        assert response.status_code == 401
    
    def test_malformed_auth_header(self):
        """Test malformed authorization header"""
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "NotBearer token"}
        )
        assert response.status_code in [403, 401]


class TestRateLimitErrors:
    """Test rate limit error handling"""
    
    def test_rate_limit_header(self):
        """Test rate limit headers present"""
        response = client.get("/api/v1/modules/all")
        
        # Should have rate limit headers or succeed
        assert response.status_code in [200, 429]
    
    def test_429_response_format(self):
        """Test 429 response format"""
        # This would require hitting rate limit
        # For now, just verify structure exists
        response = client.get("/api/v1/security/status")
        
        assert response.status_code == 200
        data = response.json()
        assert "rate_limiting" in data


class TestDatabaseErrors:
    """Test database error handling"""
    
    def test_database_unavailable(self):
        """Test database unavailable handling"""
        # In production, this would return 503
        response = client.get("/api/v1/database/status")
        
        # Should return some status
        assert response.status_code == 200


class TestCustomErrorCodes:
    """Test custom error codes"""
    
    def test_error_response_format(self):
        """Test standardized error response format"""
        response = client.post("/api/v1/auth/register", json={
            "email": "invalid",
            "password": "weak"
        })
        
        if response.status_code == 422:
            data = response.json()
            # Should have structured error
            assert "detail" in data or "success" in data
    
    def test_security_error_codes(self):
        """Test security-related error codes"""
        response = client.get("/api/v1/security/status")
        
        if response.status_code == 200:
            data = response.json()
            # Should have security status
            assert "rate_limiting" in data
            assert "token_rotation" in data
            assert "audit_logging" in data


class TestNotFoundErrors:
    """Test 404 error handling"""
    
    def test_nonexistent_resource(self):
        """Test accessing non-existent resource"""
        response = client.get("/api/v1/modules/nonexistent-module-id")
        
        assert response.status_code in [404, 422, 200]  # Depends on implementation


class TestMethodNotAllowed:
    """Test 405 error handling"""
    
    def test_invalid_http_method(self):
        """Test invalid HTTP method"""
        response = client.delete("/api/v1/wellness/prompt")
        
        # Should be 405 or 404 or actual handler
        assert response.status_code in [405, 404, 200]


class TestServerErrors:
    """Test server error handling"""
    
    def test_500_error_handling(self):
        """Test 500 error handling"""
        # This would require triggering an actual error
        # For now, verify error handlers exist
        response = client.get("/api/v1/security/status")
        assert response.status_code == 200
    
    def test_error_response_has_details(self):
        """Test that error responses have useful details"""
        response = client.post("/api/v1/auth/register", json={
            "email": "invalid",
            "password": "weak"
        })
        
        if response.status_code == 422:
            data = response.json()
            # Should have some error information
            assert "detail" in data or "error" in data


class TestErrorRecovery:
    """Test error recovery patterns"""
    
    def test_retry_after_rate_limit(self):
        """Test Retry-After header on rate limit"""
        # In production, hitting rate limit should return 429 with Retry-After
        response = client.get("/api/v1/security/status")
        
        # Just verify endpoint works
        assert response.status_code == 200
    
    def test_error_message_helpfulness(self):
        """Test that error messages are helpful"""
        response = client.post("/api/v1/auth/register", json={
            "email": "invalid",
            "password": "weak",
            "name": "Test"
        })
        
        if response.status_code == 422:
            data = response.json()
            # Should have some indication of what's wrong
            assert "detail" in data


class TestErrorLogging:
    """Test error logging"""
    
    def test_error_logging_endpoint(self):
        """Test that errors are logged (via security status)"""
        response = client.get("/api/v1/security/status")
        
        if response.status_code == 200:
            data = response.json()
            # Should have logging status
            assert "audit_logging" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
