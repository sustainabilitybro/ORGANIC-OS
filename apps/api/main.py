"""
Naturopath OS - Comprehensive Natural Medicine Platform
FastAPI Application - Main entry point for the API server.
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.database.connection import init_db
from app.api.routes import router
from app.api.admin import router as admin_router
from app.api.health_routes import router as health_router
from app.api.holistic_alchemy import router as holistic_router
from app.api.atom_economy import router as atom_economy_router

# Configure logging
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO").upper())
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management."""
    # Startup: Initialize database
    logger.info("Initializing database...")
    try:
        await init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization skipped or failed: {e}")
    yield
    # Shutdown: cleanup if needed
    logger.info("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Naturopath OS",
    description="""
    Comprehensive Natural Medicine Platform
    
    ## Features
    - 🧠 **Symptom Checker** - AI-powered symptom analysis with natural remedy recommendations
    - 📋 **Health Dashboard** - Personal health tracking and progress monitoring
    - 💊 **Protocol Generator** - Personalized treatment protocols based on conditions
    - 📚 **Condition Encyclopedia** - Comprehensive guide to health conditions with evidence-based natural interventions
    - 🔬 **Evidence Explorer** - Interactive visualization of research evidence
    - ⏰ **Dosage Calculator** - Personalized dosing based on age, weight, and condition
    - 📈 **Treatment Tracker** - Log and track remedy usage and effectiveness
    - 🚨 **Safety Alerts** - Real-time drug interaction warnings
    
    ## Evidence Grading
    All remedies are graded on a 1-5 evidence scale:
    - **Level 1**: Strong evidence (multiple large RCTs, meta-analyses)
    - **Level 2**: Good evidence (large RCT or multiple moderate RCTs)
    - **Level 3**: Moderate evidence (smaller RCTs, observational studies)
    - **Level 4**: Limited evidence (case reports, expert opinion)
    - **Level 5**: Traditional use (historical use, in vitro studies)
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Instrument Prometheus metrics
Instrumentator().instrument(app).expose(app)

# CORS configuration - Load from ENV
origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,*")
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Audit Log Middleware (Simplified for now)
@app.middleware("http")
async def audit_log_middleware(request: Request, call_next):
    if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
        # Log write operations
        logger.info(f"AUDIT: {request.method} {request.url.path} - Client: {request.client.host if request.client else 'unknown'}")
    
    response = await call_next(request)
    return response

# Include API routes
app.include_router(router, prefix="/api/v1", tags=["Core API"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(health_router, tags=["Health Features"])
app.include_router(holistic_router, prefix="/api/v1/sustainability", tags=["Holistic Alchemy"])
app.include_router(atom_economy_router, prefix="/api/v1/chemistry", tags=["Atom Economy"])


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Naturopath OS",
        "version": "2.0.0",
        "description": "Comprehensive Natural Medicine Platform",
        "documentation": "/docs",
        "api_base": "/api/v1",
        "features": {
            "symptom_checker": "/api/v1/symptom-checker",
            "protocols": "/api/v1/protocols",
            "encyclopedia": "/api/v1/encyclopedia/conditions",
            "dosage_calculator": "/api/v1/dosage-calculator/{remedy_id}",
            "user_dashboard": "/api/v1/users/{user_id}/dashboard",
            "treatment_tracking": "/api/v1/users/{user_id}/treatments",
            "symptom_tracking": "/api/v1/users/{user_id}/symptoms"
        },
        "core_endpoints": {
            "search": "/api/v1/search",
            "remedies": "/api/v1/remedies",
            "conditions": "/api/v1/conditions",
            "interactions": "/api/v1/interactions/check",
            "evidence": "/api/v1/evidence"
        }
    }


if __name__ == "__main__":
    import uvicorn
    # Use environment variable validation for dev ease, but Gunicorn is used in prod
    reload = os.getenv("ENV", "development") == "development"
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=reload
    )
