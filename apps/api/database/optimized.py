"""
Optimized Database Layer

Performance improvements:
- Connection pooling
- Eager loading
- Query optimization
- Caching layer
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, joinedload, selectinload, Session
from sqlalchemy.pool import QueuePool
from typing import Generator, Optional
import os
import time

# ============ Configuration ============

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:pass@localhost/organic_os"
)

# Connection pool settings
POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "20"))
MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "10"))
POOL_RECYCLE = int(os.getenv("DB_POOL_RECYCLE", "3600"))  # 1 hour
POOL_PRE_PING = True

# Query optimization
DEFAULT_QUERY_TIMEOUT = 30  # seconds
MAX_QUERY_TIMEOUT = 60

# ============ Engine Creation ============

def create_engine_optimized():
    """Create optimized database engine"""
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=POOL_SIZE,
        max_overflow=MAX_OVERFLOW,
        pool_pre_ping=POOL_PRE_PING,
        pool_recycle=POOL_RECYCLE,
        echo=os.getenv("DB_ECHO", "false").lower() == "true",
        execution_options={
            "timeout": DEFAULT_QUERY_TIMEOUT,
        }
    )
    
    # Set statement timeout
    @event.listens_for(engine, "connect")
    def set_session_timeout(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute(f"SET statement_timeout = '{DEFAULT_QUERY_TIMEOUT}s'")
        cursor.close()
    
    return engine

# ============ Session Factory ============

_engine = None

def get_engine():
    """Get or create database engine"""
    global _engine
    if _engine is None:
        _engine = create_engine_optimized()
    return _engine

def create_session_factory():
    """Create optimized session factory"""
    engine = get_engine()
    
    return sessionmaker(
        bind=engine,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False  # Performance: don't expire on commit
    )

SessionLocal = create_session_factory()

# ============ Context Manager ============

class DatabaseManager:
    """Context manager for database sessions"""
    
    def __init__(self):
        self.session: Optional[Session] = None
    
    def __enter__(self) -> Session:
        self.session = SessionLocal()
        return self.session
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.session.rollback()
        self.session.close()
        return False

def get_db() -> Generator[Session, None, None]:
    """Dependency for FastAPI"""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

# ============ Query Optimization ============

class QueryBuilder:
    """Optimized query builder with eager loading"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def get_module_with_relations(self, module_id: str):
        """Get module with exercises and prompts loaded"""
        return self.session.query(Module).options(
            joinedload(Module.exercises),
            joinedload(Module.prompts),
            joinedload(Module.user_progress)
        ).filter(Module.id == module_id).first()
    
    def get_all_modules_with_relations(self, user_id: str = None):
        """Get all modules with relations loaded"""
        query = self.session.query(Module).options(
            joinedload(Module.exercises),
            joinedload(Module.prompts)
        )
        
        if user_id:
            query = query.options(
                selectinload(Module.user_progress)
            ).filter(Module.user_id == user_id)
        
        return query.all()
    
    def get_wellness_with_details(self, user_id: str, date: str):
        """Get wellness entry with all details"""
        return self.session.query(WellnessEntry).options(
            joinedload(WellnessEntry.sleep_data),
            joinedload(WellnessEntry.nutrition_data),
            joinedload(WellnessEntry.exercise_data),
            joinedload(WellnessEntry.mindfulness_data)
        ).filter(
            WellnessEntry.user_id == user_id,
            WellnessEntry.date == date
        ).first()
    
    def get_user_with_relations(self, user_id: str):
        """Get user with all related data"""
        return self.session.query(User).options(
            joinedload(User.habits),
            joinedload(User.goals),
            joinedload(User.preferences),
            selectinload(User.wellness_entries).limit(30),
            selectinload(User.progress_records).limit(30)
        ).filter(User.id == user_id).first()
    
    def bulk_insert_wellness(self, entries: list):
        """Bulk insert for performance"""
        self.session.bulk_save_objects(entries)
        self.session.commit()

# ============ Caching Layer ============

class QueryCache:
    """Simple in-memory query cache"""
    
    def __init__(self, ttl: int = 300):
        self.cache = {}
        self.ttl = ttl
    
    def get(self, key: str) -> Optional[dict]:
        """Get from cache"""
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return data
            del self.cache[key]
        return None
    
    def set(self, key: str, data: dict):
        """Set in cache"""
        self.cache[key] = (data, time.time())
    
    def invalidate(self, key: str = None):
        """Invalidate cache"""
        if key:
            self.cache.pop(key, None)
        else:
            self.cache.clear()
    
    def get_stats(self) -> dict:
        """Get cache statistics"""
        return {
            "size": len(self.cache),
            "ttl_seconds": self.ttl
        }

# Global cache instance
query_cache = QueryCache(ttl=300)

# ============ Performance Monitoring ============

class QueryMetrics:
    """Track query performance"""
    
    def __init__(self):
        self.queries = []
        self.slow_queries = []
        self.slow_threshold = 1.0
    
    def record_query(self, query: str, duration: float, params: dict = None):
        """Record a query execution"""
        entry = {
            "query": query[:200],
            "duration": duration,
            "timestamp": time.time()
        }
        self.queries.append(entry)
        if duration > self.slow_threshold:
            self.slow_queries.append(entry)
        if len(self.queries) > 1000:
            self.queries = self.queries[-1000:]
    
    def get_stats(self) -> dict:
        """Get query statistics"""
        if not self.queries:
            return {"total": 0}
        durations = [q["duration"] for q in self.queries]
        return {
            "total": len(self.queries),
            "avg_duration": sum(durations) / len(durations),
            "max_duration": max(durations),
            "p95": sorted(durations)[int(len(durations) * 0.95)] if durations else 0
        }

# Global metrics instance
query_metrics = QueryMetrics()

# ============ Database Health Check ============

def check_database_health() -> dict:
    """Check database connection health"""
    engine = get_engine()
    
    try:
        pool = engine.pool
        pool_status = {
            "size": pool.size(),
            "in_use": pool.checkedin(),
            "overflow": pool.overflow(),
            "status": "healthy"
        }
        
        return {
            "status": "healthy",
            "pool": pool_status,
            "cache": query_cache.get_stats(),
            "metrics": query_metrics.get_stats()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# ============ Utility Functions ============

def get_connection_info() -> dict:
    """Get database connection information"""
    return {
        "pool_size": POOL_SIZE,
        "max_overflow": MAX_OVERFLOW,
        "pool_recycle": POOL_RECYCLE,
        "pool_pre_ping": POOL_PRE_PING
    }

def reset_connection_pool():
    """Dispose and recreate connection pool"""
    global _engine
    if _engine:
        _engine.dispose()
    _engine = None

