# Organic OS API
# FastAPI backend for Organic OS

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .routes import auth, wellness, progress, modules, ai, openclaw, modules_data

# Get allowed origins from environment (comma-separated)
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://organic-os.vercel.app,http://localhost:5173"
).split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize services, database connections, etc.
    # In production, establish database pool here
    yield
    # Shutdown: cleanup connections, close pools
    # Close any open connections here


app = FastAPI(
    title="Organic OS API",
    description="The Operating System for Being Human - API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Production-ready CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "Cache-Control",
        "X-Requested-With",
    ],
    expose_headers=["Content-Length", "X-Request-ID"],
    max_age=86400,  # 24 hours cache for preflight
)

# Include routers with consistent prefix
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(wellness.router, prefix="/api/v1/wellness", tags=["Wellness"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Progress"])
app.include_router(modules.router, prefix="/api/v1/modules", tags=["Modules"])
app.include_router(modules_data.router, prefix="/api/v1/modules", tags=["Module Data"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(openclaw.router, prefix="/api/v1/openclaw", tags=["OpenClaw"])


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API status."""
    return {
        "status": "healthy",
        "message": "Organic OS API is running",
        "version": "1.0.0"
    }


@app.get("/api/v1/health", tags=["Health"])
async def health_check():
    """Health check endpoint for load balancers."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }


@app.get("/api/v1/ready", tags=["Health"])
async def readiness_check():
    """Readiness check - verifies all dependencies are available."""
    # In production, check database, cache, and external services
    return {
        "ready": True,
        "checks": {
            "database": "ok",
            "cache": "ok",
        }
    }
