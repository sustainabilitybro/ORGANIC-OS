"""
Load Testing with Locust

Test performance under load:
- 1000 concurrent users
- Various endpoint patterns
- Burst scenarios
"""
from locust import HttpUser, task, between, events
from locust.runners import MasterRunner
import random

HOST = os.getenv("LOCUST_HOST", "http://localhost:8000")
USERS = int(os.getenv("LOCUST_USERS", "100"))
SPAWN_RATE = int(os.getenv("LOCUST_SPAWN_RATE", "10"))

# ============ User Behaviors ============

class ReadOnlyUser(HttpUser):
    """User that only reads data (most common)"""
    wait_time = between(1, 3)
    
    @task(10)
    def get_all_modules(self):
        self.client.get("/api/v1/modules/all", name="Get All Modules")
    
    @task(5)
    def get_wellness_prompt(self):
        self.client.get("/api/v1/wellness/prompt", name="Get Wellness Prompt")
    
    @task(3)
    def get_quote(self):
        self.client.get("/api/v1/integrations/quote/daily", name="Get Daily Quote")
    
    @task(2)
    def get_fact(self):
        self.client.get("/api/v1/integrations/fact/random", name="Get Random Fact")

class ActiveUser(HttpUser):
    """User that performs actions"""
    wait_time = between(2, 5)
    
    @task(5)
    def wellness_checkin(self):
        self.client.post(
            "/api/v1/wellness/check-in",
            json={
                "mood": random.randint(1, 5),
                "energy": random.randint(1, 5),
                "sleep_hours": round(random.uniform(5, 9), 1)
            },
            name="Wellness Check-in"
        )
    
    @task(3)
    def log_habit(self):
        self.client.post(
            "/api/v1/pis/quick/log",
            json={"type": "habit", "completed": True},
            name="Log Habit"
        )
    
    @task(2)
    def get_dashboard(self):
        self.client.get("/api/v1/pis/dashboard", name="Get Dashboard")

class AIUser(HttpUser):
    """User that uses AI features"""
    wait_time = between(3, 8)
    
    @task(5)
    def chat_with_ai(self):
        messages = ["How can I improve my sleep?", "Productivity tip?", "Mindfulness exercise?"]
        self.client.post(
            "/api/v1/openclaw/chat",
            json={"message": random.choice(messages), "agent": "coach"},
            name="AI Chat",
            timeout=10
        )
    
    @task(2)
    def get_agents(self):
        self.client.get("/api/v1/openclaw/agents", name="Get Agents")

class SmokeTest(HttpUser):
    """Quick smoke test"""
    wait_time = between(1, 2)
    
    @task(1)
    def health_check(self):
        self.client.get("/api/v1/health", name="Health Check")
    
    @task(1)
    def modules_list(self):
        self.client.get("/api/v1/modules", name="Modules List")

@events.init.add_listener
def on_locust_init(environment, **kwargs):
    print(f"Load test initialized - Host: {HOST}")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    stats = environment.stats
    print(f"Total requests: {stats.total.num_requests}")
    print(f"Failures: {stats.total.num_failures}")
    print(f"Avg response time: {stats.total.avg_response_time:.2f}ms")

if __name__ == "__main__":
    import sys
    test_type = sys.argv[1] if len(sys.argv) > 1 else "load"
    print(f"Running {test_type} test...")
