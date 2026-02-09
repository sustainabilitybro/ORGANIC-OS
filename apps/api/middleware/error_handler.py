"""
Comprehensive Error Handling Middleware

Centralized error handling for Organic OS API.
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.exceptions import ExceptionMiddleware
from typing import Dict, Any, Optional
import traceback
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============ Error Codes ============

class ErrorCode:
    """Standardized error codes for Organic OS"""
    
    # Authentication (10xxx)
    AUTH_REQUIRED = "AUTH_REQUIRED"
    AUTH_INVALID = "AUTH_INVALID"
    AUTH_EXPIRED = "AUTH_EXPIRED"
    AUTH_FORBIDDEN = "AUTH_FORBIDDEN"
    
    # Validation (20xxx)
    VALIDATION_ERROR = "VALIDATION_ERROR"
    INVALID_INPUT = "INVALID_INPUT"
    MISSING_FIELD = "MISSING_FIELD"
    INVALID_FORMAT = "INVALID_FORMAT"
    
    # Resource (30xxx)
    NOT_FOUND = "NOT_FOUND"
    DUPLICATE = "DUPLICATE"
    CONFLICT = "CONFLICT"
    
    # Server (50xxx)
    INTERNAL_ERROR = "INTERNAL_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR"
    TIMEOUT = "TIMEOUT"
    
    # Rate Limiting (40xxx)
    RATE_LIMITED = "RATE_LIMITED"
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED"

# ============ Custom Exceptions ============

class OrganicOSException(Exception):
    """Base exception for Organic OS"""
    
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        details: Optional[Dict] = None
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)

class AuthenticationError(OrganicOSException):
    """Authentication-related errors"""
    
    def __init__(self, message: str = "Authentication required", details: Dict = None):
        super().__init__(
            code=ErrorCode.AUTH_REQUIRED,
            message=message,
            status_code=401,
            details=details
        )

class AuthorizationError(OrganicOSException):
    """Authorization-related errors"""
    
    def __init__(self, message: str = "Access denied", details: Dict = None):
        super().__init__(
            code=ErrorCode.AUTH_FORBIDDEN,
            message=message,
            status_code=403,
            details=details
        )

class ValidationError(OrganicOSException):
    """Validation errors"""
    
    def __init__(self, message: str = "Invalid input", details: Dict = None):
        super().__init__(
            code=ErrorCode.VALIDATION_ERROR,
            message=message,
            status_code=422,
            details=details
        )

class NotFoundError(OrganicOSException):
    """Resource not found"""
    
    def __init__(self, resource: str = "Resource", details: Dict = None):
        super().__init__(
            code=ErrorCode.NOT_FOUND,
            message=f"{resource} not found",
            status_code=404,
            details=details
        )

class ConflictError(OrganicOSException):
    """Resource conflict"""
    
    def __init__(self, message: str = "Resource conflict", details: Dict = None):
        super().__init__(
            code=ErrorCode.CONFLICT,
            message=message,
            status_code=409,
            details=details
        )

class ServerError(OrganicOSException):
    """Server errors"""
    
    def __init__(self, message: str = "Internal server error", details: Dict = None):
        super().__init__(
            code=ErrorCode.INTERNAL_ERROR,
            message=message,
            status_code=500,
            details=details
        )

# ============ Error Response Builder ============

def build_error_response(
    code: str,
    message: str,
    status_code: int = 400,
    details: Dict = None,
    request_id: str = None,
    path: str = None
) -> Dict:
    """Build standardized error response"""
    
    response = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "status": status_code
        }
    }
    
    if details:
        response["error"]["details"] = details
    
    if request_id:
        response["error"]["request_id"] = request_id
    
    if path:
        response["error"]["path"] = path
    
    return response

# ============ Error Handler Middleware ============

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Centralized error handling middleware"""
    
    def __init__(self, app: FastAPI):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next):
        """Handle errors and log them"""
        
        # Generate request ID
        request_id = request.headers.get("x-request-id", str(time.time()))
        
        try:
            response = await call_next(request)
            return response
            
        except OrganicOSException as e:
            # Log organic OS exceptions
            logger.warning(
                f"OrganicOSException: {e.code} - {e.message}",
                extra={
                    "code": e.code,
                    "message": e.message,
                    "path": request.url.path,
                    "method": request.method
                }
            )
            
            return JSONResponse(
                status_code=e.status_code,
                content=build_error_response(
                    code=e.code,
                    message=e.message,
                    status_code=e.status_code,
                    details=e.details,
                    request_id=request_id,
                    path=request.url.path
                )
            )
            
        except HTTPException as e:
            # Handle FastAPI HTTP exceptions
            return JSONResponse(
                status_code=e.status_code,
                content=build_error_response(
                    code=ErrorCode.AUTH_REQUIRED if e.status_code == 401 else ErrorCode.INVALID_INPUT,
                    message=e.detail,
                    status_code=e.status_code,
                    request_id=request_id,
                    path=request.url.path
                )
            )
            
        except Exception as e:
            # Log unexpected exceptions
            error_id = str(time.time())
            logger.error(
                f"Unhandled exception: {str(e)}",
                extra={
                    "error_id": error_id,
                    "path": request.url.path,
                    "method": request.method,
                    "traceback": traceback.format_exc()
                }
            )
            
            # Return user-friendly error
            return JSONResponse(
                status_code=500,
                content=build_error_response(
                    code=ErrorCode.INTERNAL_ERROR,
                    message="An unexpected error occurred",
                    status_code=500,
                    details={
                        "error_id": error_id,
                        "suggestion": "Please try again later or contact support if the problem persists"
                    },
                    request_id=request_id,
                    path=request.url.path
                )
            )

# ============ Error Handlers ============

def setup_error_handlers(app: FastAPI):
    """Setup error handlers for FastAPI app"""
    
    app.add_middleware(ErrorHandlingMiddleware)
    
    @app.exception_handler(OrganicOSException)
    async def organic_os_exception_handler(request: Request, exc: OrganicOSException):
        return JSONResponse(
            status_code=exc.status_code,
            content=build_error_response(
                code=exc.code,
                message=exc.message,
                status_code=exc.status_code,
                details=exc.details
            )
        )
    
    @app.exception_handler(ValidationError)
    async def validation_exception_handler(request: Request, exc: ValidationError):
        return JSONResponse(
            status_code=422,
            content=build_error_response(
                code=ErrorCode.VALIDATION_ERROR,
                message=exc.message,
                status_code=422,
                details=exc.details
            )
        )

# ============ Utility Functions ============

def require_auth(request: Request) -> str:
    """Require authentication and return user ID"""
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise AuthenticationError("Authentication required")
    
    # In production, verify token with Supabase
    token = auth_header.split(" ")[1]
    
    if not token:
        raise AuthenticationError("Invalid token")
    
    return token

def log_error(code: str, message: str, context: Dict = None):
    """Log error with context"""
    logger.error(
        f"Error: {code} - {message}",
        extra={"code": code, "message": message, "context": context}
    )

def handle_database_error(error: Exception) -> ServerError:
    """Convert database error to Organic OS error"""
    error_str = str(error).lower()
    
    if "duplicate" in error_str:
        return ConflictError("Resource already exists")
    elif "not found" in error_str:
        return NotFoundError("Resource")
    elif "foreign key" in error_str:
        return ValidationError("Referenced resource does not exist")
    else:
        return ServerError("Database operation failed", details={"original": str(error)})
