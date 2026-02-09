# API Package Initialization
# Imports all routes and middleware for the main app

# Import routes
from apps.api.routes import auth, wellness, progress, modules, ai, openclaw, integrations
from apps.api.routes import health_integrations, personal_integrations, auth_security
from apps.api.routes import api_versioning, content_versioning, database_status
from apps.api.routes import additional_integrations, resilience
from apps.api.performance import optimizer
from apps.api.docs import api_documentation

__all__ = [
    "auth",
    "wellness",
    "progress", 
    "modules",
    "ai",
    "openclaw",
    "integrations",
    "health_integrations",
    "personal_integrations",
    "auth_security",
    "api_versioning",
    "content_versioning",
    "database_status",
    "additional_integrations",
    "resilience",
    "optimizer",
    "api_documentation",
]
