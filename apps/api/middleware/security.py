"""
Security Headers Middleware

Add comprehensive security headers to all responses.
"""
from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, List, Optional

# ============ Security Headers ============

class SecurityHeadersConfig:
    """Security headers configuration"""
    
    # Default security headers
    HEADERS = {
        # Prevent content type sniffing
        "X-Content-Type-Options": "nosniff",
        
        # Prevent clickjacking
        "X-Frame-Options": "DENY",
        
        # XSS Protection (legacy but still useful)
        "X-XSS-Protection": "1; mode=block",
        
        # Referrer policy
        "Referrer-Policy": "strict-origin-when-cross-origin",
        
        # Permissions policy
        "Permissions-Policy": (
            "accelerometer=(), "
            "camera=(), "
            "geolocation=(), "
            "gyroscope=(), "
            "magnetometer=(), "
            "microphone=(), "
            "payment=(), "
            "usb=()"
        ),
        
        # CSP - Content Security Policy
        "Content-Security-Policy": (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self' https://api.openclaw.ai; "
            "frame-ancestors 'none'; "
            "form-action 'self'"
        ),
        
        # HSTS - HTTP Strict Transport Security
        "Strict-Transport-Security": (
            "max-age=31536000; "
            "includeSubDomains; "
            "preload"
        ),
    }
    
    # Headers to remove (information disclosure)
    REMOVE_HEADERS = [
        "Server",
        "X-Powered-By",
        "X-AspNet-Version",
        "X-AspNetMvc-Version",
    ]

# ============ Security Middleware ============

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    def __init__(self, app: FastAPI, config: SecurityHeadersConfig = None):
        super().__init__(app)
        self.config = config or SecurityHeadersConfig()
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add security headers
        for header, value in self.config.HEADERS.items():
            if header not in response.headers:
                response.headers[header] = value
        
        # Remove information disclosure headers
        for header in self.config.REMOVE_HEADERS:
            if header in response.headers:
                del response.headers[header]
        
        return response

# ============ CORS Security ============

class CORSSecurityConfig:
    """CORS security configuration"""
    
    # Allowed origins (production should be specific)
    ALLOWED_ORIGINS = [
        "https://organic-os.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ]
    
    # Allowed methods
    ALLOWED_METHODS = [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ]
    
    # Allowed headers
    ALLOWED_HEADERS = [
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "Cache-Control",
        "X-Requested-With",
        "X-Request-ID",
    ]
    
    # Expose headers
    EXPOSE_HEADERS = [
        "Content-Length",
        "X-Request-ID",
    ]
    
    # Max age for preflight
    MAX_AGE = 86400  # 24 hours

# ============ Setup Functions ============

def setup_security_headers(app: FastAPI, config: SecurityHeadersConfig = None):
    """Setup security headers middleware"""
    app.add_middleware(
        SecurityHeadersMiddleware,
        config=config
    )

def get_security_report() -> Dict:
    """Get security headers status"""
    return {
        "headers_added": list(SecurityHeadersConfig.HEADERS.keys()),
        "headers_removed": SecurityHeadersConfig.REMOVE_HEADERS,
        "cors_config": {
            "allowed_origins": CORSSecurityConfig.ALLOWED_ORIGINS,
            "allowed_methods": CORSSecurityConfig.ALLOWED_METHODS,
            "allowed_headers": CORSSecurityConfig.ALLOWED_HEADERS,
            "max_age": CORSSecurityConfig.MAX_AGE
        },
        "recommendations": [
            "Review CSP for your production domain",
            "Update allowed origins for production",
            "Consider adding HPKP (HTTP Public Key Pinning)",
            "Add SRI (Subresource Integrity) for scripts"
        ]
    }

# ============ Security Audit ============

def audit_security_headers(headers: Dict) -> Dict:
    """Audit security headers in a response"""
    required = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Content-Security-Policy": None,  # Just check existence
        "Strict-Transport-Security": None,  # Just check existence
    }
    
    issues = []
    warnings = []
    
    for header, expected in required.items():
        if header not in headers:
            if expected is not None:
                issues.append(f"Missing: {header} (expected: {expected})")
            else:
                warnings.append(f"Missing: {header}")
    
    dangerous = []
    for header in headers:
        if header.startswith("X-Powered-By") or "Server" in header:
            dangerous.append(f"Information disclosure: {header}")
    
    return {
        "score": max(0, 100 - len(issues) * 20 - len(warnings) * 10),
        "issues": issues,
        "warnings": warnings,
        "dangerous": dangerous,
        "passed": len(issues) == 0 and len(dangerous) == 0
    }
