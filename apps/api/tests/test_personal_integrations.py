"""
Personal Integrations Tests

Test all PI endpoints for reliability and correctness.
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, date, timedelta
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

# ============ Preference Tests ============

def test_get_preferences_empty():
    """Test getting preferences when none exist"""
    response = client.get("/api/v1/pis/preferences?user_id=test_user")
    assert response.status_code == 200
    assert response.json()["user_id"] == "test_user"
    assert "preferences" in response.json()

def test_set_preference():
    """Test setting a preference"""
    pref_data = {
        "category": "display",
        "key": "theme",
        "value": "dark"
    }
    response = client.post("/api/v1/pis/preferences", json=pref_data)
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_delete_preference():
    """Test deleting a preference"""
    response = client.delete("/api/v1/pis/preferences/display/theme?user_id=test_user")
    assert response.status_code == 200
    assert response.json()["success"] is True

# ============ Habit Tests ============

def test_get_habits_empty():
    """Test getting habits when none exist"""
    response = client.get("/api/v1/pis/habits?user_id=test_user")
    assert response.status_code == 200
    assert response.json()["user_id"] == "test_user"
    assert "habits" in response.json()

def test_create_habit():
    """Test creating a new habit"""
    habit_data = {
        "name": "Morning Meditation",
        "category": "mindfulness",
        "frequency": "daily",
        "reminder_time": "07:00"
    }
    response = client.post("/api/v1/pis/habits?user_id=test_user", json=habit_data)
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "habit" in response.json()
    assert response.json()["habit"]["name"] == "Morning Meditation"

def test_log_habit_completion():
    """Test logging habit completion"""
    # First create a habit
    habit_data = {"name": "Exercise", "category": "fitness"}
    create_response = client.post("/api/v1/pis/habits?user_id=test_user", json=habit_data)
    habit_id = create_response.json()["habit"]["id"]
    
    # Log completion
    entry_data = {
        "habit_id": habit_id,
        "date": str(date.today()),
        "completed": True,
        "notes": "30 min workout"
    }
    response = client.post(f"/api/v1/pis/habits/{habit_id}/log?user_id=test_user", json=entry_data)
    assert response.status_code == 200
    assert response.json()["success"] is True

# ============ Goal Tests ============

def test_get_goals_empty():
    """Test getting goals when none exist"""
    response = client.get("/api/v1/pis/goals?user_id=test_user")
    assert response.status_code == 200
    assert response.json()["user_id"] == "test_user"

def test_create_goal():
    """Test creating a new goal"""
    goal_data = {
        "title": "Run a marathon",
        "description": "Complete a full marathon by end of year",
        "category": "fitness",
        "deadline": "2026-12-31"
    }
    response = client.post("/api/v1/pis/goals?user_id=test_user", json=goal_data)
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["goal"]["title"] == "Run a marathon"

def test_update_goal_progress():
    """Test updating goal progress"""
    # Create a goal
    goal_data = {"title": "Read 24 books", "category": "personal"}
    create_response = client.post("/api/v1/pis/goals?user_id=test_user", json=goal_data)
    goal_id = create_response.json()["goal"]["id"]
    
    # Update progress
    response = client.put(
        f"/api/v1/pis/goals/{goal_id}/progress?user_id=test_user&progress=50",
    )
    assert response.status_code == 200
    assert response.json()["goal"]["progress"] == 50

# ============ Calendar Tests ============

def test_get_calendar_events_empty():
    """Test getting calendar events when none exist"""
    response = client.get("/api/v1/pis/calendar/events?user_id=test_user")
    assert response.status_code == 200
    assert "events" in response.json()

def test_add_calendar_event():
    """Test adding a calendar event"""
    event_data = {
        "title": "Team Meeting",
        "start": datetime.utcnow().isoformat(),
        "end": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
        "category": "work",
        "description": "Weekly sync"
    }
    response = client.post("/api/v1/pis/calendar/events?user_id=test_user", json=event_data)
    assert response.status_code == 200
    assert response.json()["success"] is True

# ============ Weather Tests ============

def test_get_weather():
    """Test getting weather"""
    response = client.get("/api/v1/pis/weather")
    assert response.status_code == 200
    assert "temperature" in response.json()
    assert "condition" in response.json()

def test_get_weather_with_location():
    """Test getting weather with location"""
    response = client.get("/api/v1/pis/weather?city=New%20York&country=US")
    assert response.status_code == 200
    assert response.json()["location"] == "New York"

# ============ Dashboard Tests ============

def test_get_dashboard():
    """Test getting daily dashboard"""
    response = client.get("/api/v1/pis/dashboard?user_id=test_user")
    assert response.status_code == 200
    assert "date" in response.json()
    assert "habits" in response.json()
    assert "goals" in response.json()
    assert "weather" in response.json()

# ============ Analytics Tests ============

def test_get_habit_analytics():
    """Test getting habit analytics"""
    response = client.get("/api/v1/pis/analytics/habits?user_id=test_user&days=30")
    assert response.status_code == 200
    assert response.json()["period_days"] == 30
    assert "habits" in response.json()

# ============ Quick Log Tests ============

def test_quick_log_mood():
    """Test quick mood logging"""
    data = {"type": "mood", "value": 4}
    response = client.post("/api/v1/pis/quick/log?user_id=test_user", json=data)
    assert response.status_code == 200
    assert response.json()["logged"] == "mood"

def test_quick_log_water():
    """Test quick water logging"""
    data = {"type": "water", "count": 3}
    response = client.post("/api/v1/pis/quick/log?user_id=test_user", json=data)
    assert response.status_code == 200
    assert response.json()["logged"] == "water"
    assert response.json()["count"] == 3

def test_quick_log_exercise():
    """Test quick exercise logging"""
    data = {"type": "exercise", "minutes": 30}
    response = client.post("/api/v1/pis/quick/log?user_id=test_user", json=data)
    assert response.status_code == 200
    assert response.json()["logged"] == "exercise"

def test_quick_log_unknown():
    """Test quick log with unknown type"""
    data = {"type": "unknown_type"}
    response = client.post("/api/v1/pis/quick/log?user_id=test_user", json=data)
    assert response.status_code == 200
    assert "error" in response.json()

# ============ Edge Cases ============

def test_nonexistent_habit():
    """Test logging to non-existent habit"""
    response = client.post(
        "/api/v1/pis/habits/fake_id/log",
        json={"habit_id": "fake_id", "date": str(date.today()), "completed": True}
    )
    assert response.status_code == 200
    assert "error" in response.json()

def test_nonexistent_goal():
    """Test updating non-existent goal"""
    response = client.put("/api/v1/pis/goals/fake_id/progress?progress=50")
    assert response.status_code == 200
    assert "error" in response.json()

def test_goal_progress_bounds():
    """Test that goal progress is bounded"""
    # Create a goal
    goal_data = {"title": "Test Goal"}
    create_response = client.post("/api/v1/pis/goals?user_id=test_user", json=goal_data)
    goal_id = create_response.json()["goal"]["id"]
    
    # Test over 100%
    response = client.put(f"/api/v1/pis/goals/{goal_id}/progress?progress=150&user_id=test_user")
    assert response.json()["goal"]["progress"] == 100
    
    # Test negative
    response = client.put(f"/api/v1/pis/goals/{goal_id}/progress?progress=-10&user_id=test_user")
    assert response.json()["goal"]["progress"] == 0

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
