"""
SQLite Database Configuration for Local Development

This module provides SQLite support for local development
when PostgreSQL is not available.
"""

import aiosqlite
from pathlib import Path
from typing import Optional
import os

DATABASE_DIR = Path(__file__).parent
SQLITE_DB_PATH = DATABASE_DIR / "organic_os.db"

# Connection configuration
DB_TIMEOUT = 30  # seconds
JOURNAL_MODE = "WAL"  # Write-Ahead Logging for better concurrency
SYNCHRONOUS = "NORMAL"  # Balance between performance and safety


async def get_sqlite_connection() -> aiosqlite.Connection:
    """Get an async SQLite connection."""
    conn = await aiosqlite.connect(
        SQLITE_DB_PATH,
        timeout=DB_TIMEOUT
    )
    # Enable WAL mode for better concurrency
    await conn.execute(f"PRAGMA journal_mode={JOURNAL_MODE}")
    await conn.execute(f"PRAGMA synchronous={SYNCHRONOUS}")
    return conn


async def init_sqlite_schema():
    """Initialize the SQLite database schema."""
    conn = await get_sqlite_connection()
    cursor = await conn.cursor()
    
    # Create tables (simplified schema for local dev)
    await cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS user_profiles (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
            bio TEXT,
            timezone TEXT DEFAULT 'UTC',
            preferences TEXT DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS module_progress (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
            module_name TEXT NOT NULL,
            progress_percentage REAL DEFAULT 0,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_topics TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, module_name)
        );
        
        CREATE TABLE IF NOT EXISTS wellness_tracker (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
            date TEXT NOT NULL,
            sleep_hours REAL,
            water_intake_ml INTEGER,
            exercise_minutes INTEGER,
            meditation_minutes INTEGER,
            nutrition_notes TEXT,
            mood_score REAL,
            energy_level REAL,
            ai_insights TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, date)
        );
        
        CREATE TABLE IF NOT EXISTS emotions_journal (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
            emotion_name TEXT NOT NULL,
            intensity REAL,
            triggers TEXT,
            bodily_sensations TEXT,
            thoughts TEXT,
            behaviors TEXT,
            regulation_strategy_used TEXT,
            ai_suggestions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_module_progress_user ON module_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_wellness_tracker_user_date ON wellness_tracker(user_id, date);
        CREATE INDEX IF NOT EXISTS idx_emotions_journal_user_date ON emotions_journal(user_id, created_at);
    """)
    
    await conn.commit()
    await conn.close()
    print(f"✅ SQLite database initialized at {SQLITE_DB_PATH}")


async def check_sqlite_health() -> dict:
    """Check SQLite database health."""
    try:
        conn = await get_sqlite_connection()
        cursor = await conn.cursor()
        
        # Check database file exists and is writable
        db_exists = SQLITE_DB_PATH.exists()
        db_size = SQLITE_DB_PATH.stat().st_size if db_exists else 0
        
        # Test a simple query
        await cursor.execute("SELECT 1")
        
        await conn.close()
        
        return {
            "status": "healthy",
            "database": "sqlite",
            "path": str(SQLITE_DB_PATH),
            "exists": db_exists,
            "size_bytes": db_size
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


if __name__ == "__main__":
    import asyncio
    asyncio.run(init_sqlite_schema())
