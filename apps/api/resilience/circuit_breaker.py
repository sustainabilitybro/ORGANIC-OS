"""
Circuit Breaker Pattern for API Resilience

Prevents cascading failures by detecting when a service is down
and temporarily stopping requests to allow recovery.

States: CLOSED → OPEN → HALF_OPEN
"""

import asyncio
import time
from enum import Enum
from typing import Callable, Any, Optional
from dataclasses import dataclass, field
from functools import wraps
import logging

logger = logging.getLogger(__name__)


class CircuitState(Enum):
    """Circuit breaker states"""
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing, reject all requests
    HALF_OPEN = "half_open"  # Testing recovery


@dataclass
class CircuitBreakerConfig:
    """Configuration for circuit breaker"""
    failure_threshold: int = 5          # Failures before opening
    success_threshold: int = 3           # Successes in half-open to close
    timeout_seconds: float = 60.0       # Time before trying again
    expected_exception: type = Exception  # Exception type to catch
    monitoring_window_seconds: float = 60  # Window for failure counting


@dataclass
class CircuitBreakerStats:
    """Statistics for circuit breaker"""
    state: CircuitState = CircuitState.CLOSED
    failure_count: int = 0
    success_count: int = 0
    last_failure_time: Optional[float] = None
    last_success_time: Optional[float] = None
    total_calls: int = 0
    total_failures: int = 0
    total_successes: int = 0
    last_state_change: float = field(default_factory=time.time)
    
    def record_failure(self):
        self.failure_count += 1
        self.total_failures += 1
        self.last_failure_time = time.time()
        
    def record_success(self):
        self.success_count += 1
        self.total_successes += 1
        self.last_success_time = time.time()


class CircuitBreaker:
    """
    Circuit breaker implementation for API resilience.
    
    Usage:
        breaker = CircuitBreaker(
            failure_threshold=5,
            timeout_seconds=60
        )
        
        @breaker
        async def fragile_api_call():
            ...
    """
    
    def __init__(
        self,
        name: str,
        config: Optional[CircuitBreakerConfig] = None,
        fallback: Optional[Callable] = None
    ):
        self.name = name
        self.config = config or CircuitBreakerConfig()
        self.fallback = fallback
        self.state = CircuitState.CLOSED
        self.stats = CircuitBreakerStats()
        self._lock = asyncio.Lock()
        self._opened_at: Optional[float] = None
    
    @property
    def is_closed(self) -> bool:
        return self.state == CircuitState.CLOSED
    
    @property
    def is_open(self) -> bool:
        return self.state == CircuitState.OPEN
    
    @property
    def is_half_open(self) -> bool:
        return self.state == CircuitState.HALF_OPEN
    
    @property
    def time_until_retry(self) -> float:
        """Seconds until automatic retry"""
        if self.state != CircuitState.OPEN:
            return 0
        elapsed = time.time() - (self._opened_at or 0)
        return max(0, self.config.timeout_seconds - elapsed)
    
    async def _try_close(self):
        """Attempt to close circuit and allow requests"""
        async with self._lock:
            if self.state == CircuitState.HALF_OPEN:
                if self.stats.success_count >= self.config.success_threshold:
                    self.state = CircuitState.CLOSED
                    self.stats.failure_count = 0
                    self.stats.success_count = 0
                    self.stats.last_state_change = time.time()
                    logger.info(f"Circuit {self.name}: CLOSED (recovered)")
    
    async def _try_open(self):
        """Open circuit after too many failures"""
        async with self._lock:
            if (
                self.state == CircuitState.CLOSED and
                self.stats.failure_count >= self.config.failure_threshold
            ):
                self.state = CircuitState.OPEN
                self._opened_at = time.time()
                self.stats.last_state_change = time.time()
                logger.warning(f"Circuit {self.name}: OPEN (too many failures)")
    
    async def _try_half_open(self):
        """Transition to half-open to test recovery"""
        async with self._lock:
            if (
                self.state == CircuitState.OPEN and
                self.time_until_retry <= 0
            ):
                self.state = CircuitState.HALF_OPEN
                self.stats.failure_count = 0
                self.stats.success_count = 0
                self.stats.last_state_change = time.time()
                logger.info(f"Circuit {self.name}: HALF_OPEN (testing recovery)")
    
    async def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection"""
        self.stats.total_calls += 1
        
        # Check if we should transition states
        await self._try_half_open()
        
        # If open, reject immediately
        if self.state == CircuitState.OPEN:
            if self.fallback:
                return self.fallback()
            raise CircuitBreakerOpenError(
                f"Circuit {self.name} is OPEN. Retry in {self.time_until_retry:.1f}s"
            )
        
        # Execute function
        try:
            if asyncio.iscoroutinefunction(func):
                result = await func(*args, **kwargs)
            else:
                result = func(*args, **kwargs)
            
            self.stats.record_success()
            
            # If half-open and enough successes, close
            await self._try_close()
            
            return result
            
        except self.config.expected_exception as e:
            self.stats.record_failure()
            await self._try_open()
            raise CircuitBreakerError(f"Circuit {self.name} failed: {e}") from e
    
    def __call__(self, func: Callable) -> Callable:
        """Decorator support"""
        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await self.call(func, *args, **kwargs)
        return wrapper
    
    def get_stats(self) -> dict:
        """Get circuit breaker statistics"""
        return {
            "name": self.name,
            "state": self.state.value,
            "is_open": self.is_open,
            "time_until_retry": self.time_until_retry,
            "failure_count": self.stats.failure_count,
            "success_count": self.stats.success_count,
            "total_calls": self.stats.total_calls,
            "total_failures": self.stats.total_failures,
            "total_successes": self.stats.total_successes,
            "config": {
                "failure_threshold": self.config.failure_threshold,
                "timeout_seconds": self.config.timeout_seconds,
                "success_threshold": self.config.success_threshold,
            }
        }


class CircuitBreakerError(Exception):
    """Base circuit breaker error"""
    pass


class CircuitBreakerOpenError(CircuitBreakerError):
    """Raised when circuit is open"""
    pass


class CircuitBreakerRegistry:
    """Registry for managing multiple circuit breakers"""
    
    _instance: Optional['CircuitBreakerRegistry'] = None
    _breakers: dict[str, CircuitBreaker] = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def register(self, name: str, breaker: CircuitBreaker):
        """Register a circuit breaker"""
        self._breakers[name] = breaker
    
    def get(self, name: str) -> Optional[CircuitBreaker]:
        """Get circuit breaker by name"""
        return self._breakers.get(name)
    
    def get_all_stats(self) -> list[dict]:
        """Get stats for all breakers"""
        return [breaker.get_stats() for breaker in self._breakers.values()]
    
    def reset(self, name: Optional[str] = None):
        """Reset specific or all breakers"""
        if name:
            breaker = self._breakers.get(name)
            if breaker:
                breaker.state = CircuitState.CLOSED
                breaker.stats = CircuitBreakerStats()
        else:
            for breaker in self._breakers.values():
                breaker.state = CircuitState.CLOSED
                breaker.stats = CircuitBreakerStats()


# Global registry
registry = CircuitBreakerRegistry()


def create_breaker(
    name: str,
    failure_threshold: int = 5,
    timeout_seconds: float = 60,
    success_threshold: int = 3,
    fallback: Optional[Callable] = None
) -> CircuitBreaker:
    """Create and register a circuit breaker"""
    config = CircuitBreakerConfig(
        failure_threshold=failure_threshold,
        timeout_seconds=timeout_seconds,
        success_threshold=success_threshold
    )
    breaker = CircuitBreaker(name=name, config=config, fallback=fallback)
    registry.register(name, breaker)
    return breaker


# Pre-configured breakers for common services
EXTERNAL_API_BREAKER = create_breaker(
    name="external_api",
    failure_threshold=3,
    timeout_seconds=30,
    success_threshold=2
)

DATABASE_BREAKER = create_breaker(
    name="database",
    failure_threshold=5,
    timeout_seconds=60,
    success_threshold=3
)

CACHE_BREAKER = create_breaker(
    name="cache",
    failure_threshold=10,
    timeout_seconds=30,
    success_threshold=5
)
