# API endpoint tests
import pytest
from fastapi.testclient import TestClient
from datetime import date
from apps.api.main import create_app


@pytest.fixture
def app():
    """Create test application."""
    return create_app()


@pytest.fixture
def client(app):
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def sample_user_id():
    """Sample user ID for tests."""
    return "test-user-123"


class TestHealthEndpoints:
    """Test health check endpoints."""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns healthy status."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "message" in data
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["version"] == "1.0.0"


class TestAuthEndpoints:
    """Test authentication endpoints."""
    
    def test_verify_token_valid(self, client):
        """Test token verification with valid token."""
        response = client.post("/api/v1/auth/verify", json={"token": "valid-token"})
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] is True
    
    def test_verify_token_missing(self, client):
        """Test token verification with missing token."""
        response = client.post("/api/v1/auth/verify", json={"token": ""})
        # Should still return valid=True for placeholder
        assert response.status_code == 200


class TestWellnessEndpoints:
    """Test wellness tracking endpoints."""
    
    def test_get_daily_prompt(self, client):
        """Test getting a daily prompt."""
        response = client.get("/api/v1/wellness/prompt")
        assert response.status_code == 200
        data = response.json()
        assert "prompt" in data
        assert "category" in data
    
    def test_get_daily_prompt_with_category(self, client):
        """Test getting a prompt filtered by category."""
        response = client.get("/api/v1/wellness/prompt?category=gratitude")
        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "gratitude"
    
    def test_get_streak_empty(self, client, sample_user_id):
        """Test getting streak for user with no entries."""
        response = client.get(f"/api/v1/wellness/streak?user_id={sample_user_id}")
        assert response.status_code == 200
        data = response.json()
        assert "streak" in data
        assert data["streak"] == 0


class TestProgressEndpoints:
    """Test progress tracking endpoints."""
    
    def test_get_all_progress_empty(self, client, sample_user_id):
        """Test getting all progress when empty."""
        response = client.get(f"/api/v1/progress/modules?user_id={sample_user_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_module_progress_default(self, client, sample_user_id):
        """Test getting progress for non-existent module returns defaults."""
        response = client.get(f"/api/v1/progress/modules/nonexistent?user_id={sample_user_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["module_name"] == "nonexistent"
        assert data["progress_percentage"] == 0
    
    def test_get_overall_progress(self, client, sample_user_id):
        """Test getting overall progress summary."""
        response = client.get(f"/api/v1/progress/summary?user_id={sample_user_id}")
        assert response.status_code == 200
        data = response.json()
        assert "total_modules" in data
        assert "completed_modules" in data
        assert "overall_percentage" in data
        assert "module_summaries" in data


class TestModuleEndpoints:
    """Test module-specific endpoints."""
    
    def test_get_sensory_exercises(self, client):
        """Test getting sensory exercises."""
        response = client.get("/api/v1/modules/sensory/exercises/visual")
        assert response.status_code == 200
        data = response.json()
        assert data["sense_type"] == "visual"
        assert "exercises" in data
        assert len(data["exercises"]) > 0
    
    def test_get_purpose_prompt(self, client):
        """Test getting identity purpose prompt."""
        response = client.get("/api/v1/modules/identity/purpose")
        assert response.status_code == 200
        data = response.json()
        assert "prompt" in data
        assert "exercises" in data
    
    def test_get_default_goals(self, client):
        """Test getting default wellness goals."""
        response = client.get("/api/v1/modules/wellness/goals")
        assert response.status_code == 200
        data = response.json()
        assert "nutrition" in data
        assert "movement" in data
        assert "sleep" in data
    
    def test_assess_burnout(self, client):
        """Test burnout assessment."""
        response = client.post(
            "/api/v1/modules/recovery/assess-burnout",
            json={"exhaustion": 5, "cynicism": 4, "inefficacy": 3}
        )
        assert response.status_code == 200
        data = response.json()
        assert "score" in data
        assert "level" in data
        assert "recommendations" in data
    
    def test_burnout_severe(self, client):
        """Test severe burnout detection."""
        response = client.post(
            "/api/v1/modules/recovery/assess-burnout",
            json={"exhaustion": 9, "cynicism": 9, "inefficacy": 9}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["level"] == "severe"
    
    def test_burnout_low(self, client):
        """Test low burnout detection."""
        response = client.post(
            "/api/v1/modules/recovery/assess-burnout",
            json={"exhaustion": 1, "cynicism": 1, "inefficacy": 1}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["level"] == "low"
    
    def test_get_video_prompts(self, client):
        """Test getting video module prompts."""
        response = client.get("/api/v1/modules/video/prompts")
        assert response.status_code == 200
        data = response.json()
        assert "impromptu" in data
        assert "prepared" in data
        assert "reflection" in data


class TestAIEndpoints:
    """Test AI coaching endpoints."""
    
    def test_get_ai_prompts(self, client):
        """Test getting AI coaching prompts for a module."""
        response = client.get("/api/v1/ai/prompts/identity")
        assert response.status_code == 200
        data = response.json()
        assert data["module"] == "identity"
        assert "prompts" in data
        assert len(data["prompts"]) > 0
    
    def test_get_ai_prompts_unknown_module(self, client):
        """Test getting prompts for unknown module returns defaults."""
        response = client.get("/api/v1/ai/prompts/unknown")
        assert response.status_code == 200
        data = response.json()
        assert data["module"] == "unknown"
    
    def test_chat_endpoint(self, client):
        """Test chat with AI coach."""
        response = client.post(
            "/api/v1/ai/chat",
            json={
                "message": "I'm feeling stressed",
                "module_name": "wellness"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "conversation_id" in data
        assert "suggestions" in data
