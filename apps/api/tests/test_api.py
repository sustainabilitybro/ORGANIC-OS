"""
API Tests for Organic OS

Comprehensive test suite for all API endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app

client = TestClient(app)

# ============ Fixtures ============

@pytest.fixture
def mock_supabase():
    """Mock Supabase client"""
    with patch('routes.auth.supabase') as mock:
        mock_user = MagicMock()
        mock_user.id = "test-user-id"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {"full_name": "Test User"}
        mock.auth.get_user.return_value = {"data": {"user": mock_user}}
        yield mock

# ============ Health Tests ============

def test_root_endpoint():
    """Test root endpoint returns healthy status"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "message" in data

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

# ============ Auth Tests ============

@patch('routes.auth.supabase.auth.sign_in_with_password')
def test_login_success(mock_sign_in, mock_supabase):
    """Test successful login"""
    mock_sign_in.return_value = {
        "user": {"id": "test-id", "email": "test@example.com"},
        "session": {"access_token": "test-token"}
    }
    
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_login_missing_credentials():
    """Test login with missing credentials"""
    response = client.post("/api/v1/auth/login", json={})
    assert response.status_code == 422  # Validation error

# ============ Wellness Tests ============

def test_get_daily_prompt():
    """Test getting daily wellness prompt"""
    response = client.get("/api/v1/wellness/prompt")
    assert response.status_code == 200
    data = response.json()
    assert "prompt" in data
    assert "category" in data

def test_get_wellness_stats():
    """Test getting wellness statistics"""
    response = client.get("/api/v1/wellness/stats")
    assert response.status_code == 200
    data = response.json()
    assert "avg_sleep" in data
    assert "avg_mood" in data

def test_get_wellness_streak():
    """Test getting wellness streak"""
    response = client.get("/api/v1/wellness/streak")
    assert response.status_code == 200
    data = response.json()
    assert "current_streak" in data
    assert "rewards" in data

def test_get_wellness_goals():
    """Test getting wellness goals"""
    response = client.get("/api/v1/wellness/goals")
    assert response.status_code == 200
    data = response.json()
    assert "daily" in data
    assert "weekly" in data

def test_wellness_check_in():
    """Test wellness check-in"""
    response = client.post(
        "/api/v1/wellness/check-in",
        json={
            "date": "2026-02-09",
            "sleep_hours": 7.5,
            "mood_score": 8,
            "energy_level": 7
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "wellness_score" in data

# ============ Progress Tests ============

def test_get_all_progress():
    """Test getting all module progress"""
    response = client.get("/api/v1/progress/modules")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_summary():
    """Test getting progress summary"""
    response = client.get("/api/v1/progress/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_modules" in data
    assert "overall_percentage" in data

# ============ Module Data Tests ============

def test_get_identity_module():
    """Test identity module data"""
    response = client.get("/api/v1/modules/identity")
    assert response.status_code == 200
    data = response.json()
    assert "values_categories" in data

def test_get_emotional_module():
    """Test emotional module data"""
    response = client.get("/api/v1/modules/emotional")
    assert response.status_code == 200
    data = response.json()
    assert "emotions" in data

def test_get_wellness_module():
    """Test wellness module data"""
    response = client.get("/api/v1/modules/wellness")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data

def test_get_all_modules():
    """Test getting all modules at once"""
    response = client.get("/api/v1/modules/all")
    assert response.status_code == 200
    data = response.json()
    assert "identity" in data
    assert "emotional" in data
    assert "wellness" in data

def test_get_module_prompts():
    """Test getting module-specific prompts"""
    response = client.get("/api/v1/modules/prompts/identity")
    assert response.status_code == 200
    data = response.json()
    assert data["module"] == "identity"
    assert "prompts" in data

# ============ OpenClaw Tests ============

def test_list_agents():
    """Test listing available agents"""
    response = client.get("/api/v1/openclaw/agents")
    assert response.status_code == 200
    data = response.json()
    assert "agents" in data
    assert len(data["agents"]) > 0

def test_get_agent():
    """Test getting specific agent details"""
    response = client.get("/api/v1/openclaw/agents/coach")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "coach"

def test_get_agent_not_found():
    """Test getting non-existent agent"""
    response = client.get("/api/v1/openclaw/agents/nonexistent")
    assert response.status_code == 404

@patch('routes.openclaw.httpx.AsyncClient')
def test_agent_chat(mock_client, mock_supabase):
    """Test agent chat functionality"""
    # Mock the API response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "response": "I'm here to help you with your wellness journey.",
        "agent_id": "coach",
        "conversation_id": "test-conv-id"
    }
    
    mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
    
    response = client.post(
        "/api/v1/openclaw/chat",
        json={
            "message": "I'm feeling stressed today",
            "agent_id": "coach"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data

def test_openclaw_health():
    """Test OpenClaw integration health check"""
    response = client.get("/api/v1/openclaw/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

# ============ Integration Tests ============

def test_daily_wellness_data():
    """Test aggregating daily wellness data from multiple sources"""
    response = client.get("/api/v1/integrations/wellness/daily")
    assert response.status_code == 200
    data = response.json()
    assert "quote" in data
    assert "fun_fact" in data
    assert "moon" in data

def test_quote_endpoint():
    """Test daily quote endpoint"""
    response = client.get("/api/v1/integrations/quote/daily")
    assert response.status_code == 200
    data = response.json()
    assert "quote" in data

def test_fact_endpoint():
    """Test random fact endpoint"""
    response = client.get("/api/v1/integrations/fact/random")
    assert response.status_code == 200
    data = response.json()
    assert "fact" in data

def test_joke_endpoint():
    """Test random joke endpoint"""
    response = client.get("/api/v1/integrations/joke/random")
    assert response.status_code == 200
    data = response.json()
    assert "setup" in data
    assert "punchline" in data

# ============ Performance Tests ============

def test_performance_metrics():
    """Test performance metrics endpoint"""
    response = client.get("/api/v1/performance/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "total_requests" in data

def test_cache_clear():
    """Test cache clearing endpoint"""
    response = client.post("/api/v1/performance/cache/clear")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "cleared"

# ============ Run Tests ============

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
