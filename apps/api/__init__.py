from fastapi import FastAPI
from .routes import auth, wellness, progress, modules, ai

def create_app() -> FastAPI:
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI(
        title="Organic OS API",
        description="The Operating System for Being Human - API",
        version="1.0.0",
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "https://organic-os.vercel.app"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
    app.include_router(wellness.router, prefix="/api/v1/wellness", tags=["Wellness"])
    app.include_router(progress.router, prefix="/api/v1/progress", tags=["Progress"])
    app.include_router(modules.router, prefix="/api/v1/modules", tags=["Modules"])
    app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])
    
    @app.get("/")
    async def root():
        return {"status": "healthy", "message": "Organic OS API is running"}
    
    @app.get("/api/v1/health")
    async def health_check():
        return {"status": "healthy", "version": "1.0.0"}
    
    return app
