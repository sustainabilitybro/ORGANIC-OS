"""
Tests for Circuit Breaker Pattern
"""

import pytest
import asyncio
from apps.api.resilience.circuit_breaker import (
    CircuitBreaker,
    CircuitBreakerConfig,
    CircuitBreakerStats,
    CircuitState,
    CircuitBreakerError,
    CircuitBreakerOpenError,
    CircuitBreakerRegistry,
    create_breaker
)


class TestCircuitBreakerStats:
    """Test CircuitBreakerStats"""
    
    def test_default_state(self):
        stats = CircuitBreakerStats()
        assert stats.state == CircuitState.CLOSED
        assert stats.failure_count == 0
        assert stats.success_count == 0
        assert stats.total_calls == 0
    
    def test_record_failure(self):
        stats = CircuitBreakerStats()
        stats.record_failure()
        assert stats.failure_count == 1
        assert stats.total_failures == 1
        assert stats.last_failure_time is not None
    
    def test_record_success(self):
        stats = CircuitBreakerStats()
        stats.record_success()
        assert stats.success_count == 1
        assert stats.total_successes == 1
        assert stats.last_success_time is not None


class TestCircuitBreakerConfig:
    """Test CircuitBreakerConfig"""
    
    def test_default_values(self):
        config = CircuitBreakerConfig()
        assert config.failure_threshold == 5
        assert config.success_threshold == 3
        assert config.timeout_seconds == 60.0
        assert config.expected_exception == Exception
    
    def test_custom_values(self):
        config = CircuitBreakerConfig(
            failure_threshold=3,
            timeout_seconds=30,
            success_threshold=2
        )
        assert config.failure_threshold == 3
        assert config.timeout_seconds == 30
        assert config.success_threshold == 2


class TestCircuitBreaker:
    """Test CircuitBreaker"""
    
    @pytest.fixture
    def breaker(self):
        """Create a test circuit breaker"""
        config = CircuitBreakerConfig(
            failure_threshold=3,
            timeout_seconds=60,
            success_threshold=2
        )
        return CircuitBreaker(name="test", config=config)
    
    def test_initial_state_closed(self, breaker):
        assert breaker.state == CircuitState.CLOSED
        assert breaker.is_closed
        assert not breaker.is_open
        assert not breaker.is_half_open
    
    def test_time_until_retry_when_closed(self, breaker):
        assert breaker.time_until_retry == 0
    
    @pytest.mark.asyncio
    async def test_successful_call(self, breaker):
        async def success_func():
            return "success"
        
        result = await breaker.call(success_func)
        assert result == "success"
        assert breaker.stats.success_count == 1
        assert breaker.stats.total_calls == 1
    
    @pytest.mark.asyncio
    async def test_failed_call(self, breaker):
        async def fail_func():
            raise ValueError("test error")
        
        with pytest.raises(CircuitBreakerError):
            await breaker.call(fail_func)
        
        assert breaker.stats.failure_count == 1
        assert breaker.stats.total_failures == 1
    
    @pytest.mark.asyncio
    async def test_opens_after_failures(self, breaker):
        """Test circuit opens after failure threshold"""
        async def fail_func():
            raise ValueError("test error")
        
        # Trigger failures to open circuit
        for _ in range(3):
            with pytest.raises(CircuitBreakerError):
                await breaker.call(fail_func)
        
        assert breaker.is_open
    
    @pytest.mark.asyncio
    async def test_rejects_when_open(self, breaker):
        """Test requests are rejected when circuit is open"""
        # Force open
        breaker.state = CircuitState.OPEN
        breaker._opened_at = 0  # Past timeout
        
        async def success_func():
            return "success"
        
        with pytest.raises(CircuitBreakerOpenError):
            await breaker.call(success_func)
    
    @pytest.mark.asyncio
    async def test_fallback_executed_when_open(self, breaker):
        """Test fallback is called when circuit is open"""
        breaker.state = CircuitState.OPEN
        breaker._opened_at = 0
        
        fallback_called = False
        def fallback():
            nonlocal fallback_called
            fallback_called = True
            return "fallback"
        
        breaker.fallback = fallback
        
        async def success_func():
            return "success"
        
        result = await breaker.call(success_func)
        assert result == "fallback"
        assert fallback_called
    
    @pytest.mark.asyncio
    async def test_half_open_transition(self, breaker):
        """Test transition from open to half-open"""
        breaker.state = CircuitState.OPEN
        breaker._opened_at = 0  # Past timeout
        
        # Should transition on next call attempt
        async def success_func():
            return "success"
        
        await breaker.call(success_func)
        
        assert breaker.state == CircuitState.HALF_OPEN
    
    @pytest.mark.asyncio
    async def test_closes_after_successes(self, breaker):
        """Test circuit closes after success threshold in half-open"""
        breaker.state = CircuitState.HALF_OPEN
        
        async def success_func():
            return "success"
        
        # Success threshold = 2
        await breaker.call(success_func)
        assert breaker.stats.success_count == 1
        assert breaker.state == CircuitState.HALF_OPEN
        
        await breaker.call(success_func)
        assert breaker.state == CircuitState.CLOSED
    
    def test_get_stats(self, breaker):
        stats = breaker.get_stats()
        
        assert stats["name"] == "test"
        assert stats["state"] == "closed"
        assert stats["is_open"] == False
        assert stats["failure_count"] == 0
        assert stats["success_count"] == 0
        assert stats["total_calls"] == 0
    
    @pytest.mark.asyncio
    async def test_sync_function(self, breaker):
        """Test sync function support"""
        def sync_func():
            return "sync result"
        
        result = await breaker.call(sync_func)
        assert result == "sync result"


class TestCircuitBreakerRegistry:
    """Test CircuitBreakerRegistry"""
    
    def setup_method(self):
        # Reset registry for each test
        CircuitBreakerRegistry._instance = None
        CircuitBreakerRegistry._breakers = {}
    
    def teardown_method(self):
        # Reset after each test
        CircuitBreakerRegistry._instance = None
        CircuitBreakerRegistry._breakers = {}
    
    def test_singleton(self):
        registry1 = CircuitBreakerRegistry()
        registry2 = CircuitBreakerRegistry()
        assert registry1 is registry2
    
    def test_register_and_get(self):
        registry = CircuitBreakerRegistry()
        breaker = create_breaker(name="test1", failure_threshold=2)
        
        assert registry.get("test1") is breaker
        assert registry.get("nonexistent") is None
    
    def test_get_all_stats(self):
        registry = CircuitBreakerRegistry()
        create_breaker(name="breaker1", failure_threshold=2)
        create_breaker(name="breaker2", failure_threshold=3)
        
        stats = registry.get_all_stats()
        
        assert len(stats) == 2
        names = [s["name"] for s in stats]
        assert "breaker1" in names
        assert "breaker2" in names
    
    def test_reset_specific(self):
        registry = CircuitBreakerRegistry()
        breaker = create_breaker(name="test1", failure_threshold=2)
        
        breaker.state = CircuitState.OPEN
        
        registry.reset("test1")
        
        assert breaker.state == CircuitState.CLOSED
    
    def test_reset_all(self):
        registry = CircuitBreakerRegistry()
        breaker1 = create_breaker(name="test1", failure_threshold=2)
        breaker2 = create_breaker(name="test2", failure_threshold=2)
        
        breaker1.state = CircuitState.OPEN
        breaker2.state = CircuitState.HALF_OPEN
        
        registry.reset()
        
        assert breaker1.state == CircuitState.CLOSED
        assert breaker2.state == CircuitState.CLOSED


class TestCreateBreaker:
    """Test create_breaker factory"""
    
    def setup_method(self):
        CircuitBreakerRegistry._instance = None
        CircuitBreakerRegistry._breakers = {}
    
    def teardown_method(self):
        CircuitBreakerRegistry._instance = None
        CircuitBreakerRegistry._breakers = {}
    
    def test_create_with_defaults(self):
        breaker = create_breaker(name="test")
        
        assert breaker.name == "test"
        assert breaker.config.failure_threshold == 5
        assert breaker.config.timeout_seconds == 60
    
    def test_create_with_custom_config(self):
        breaker = create_breaker(
            name="test",
            failure_threshold=3,
            timeout_seconds=30,
            success_threshold=2
        )
        
        assert breaker.config.failure_threshold == 3
        assert breaker.config.timeout_seconds == 30
        assert breaker.config.success_threshold == 2
    
    def test_registered_in_registry(self):
        breaker = create_breaker(name="registered")
        
        assert CircuitBreakerRegistry().get("registered") is breaker


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
