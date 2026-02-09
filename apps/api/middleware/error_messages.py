"""
Error Message Improvements - User-friendly error messages
"""

from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/api/v1/errors", tags=["error-messages"])


# ============ User-Friendly Error Map ============

ERROR_MESSAGES = {
    # Authentication Errors
    "auth/invalid_credentials": {
        "user_message": "Invalid email or password. Please try again.",
        "technical_message": "Authentication failed - invalid credentials",
        "action": "Check your email and password, or reset your password if needed."
    },
    "auth/token_expired": {
        "user_message": "Your session has expired. Please log in again.",
        "technical_message": "JWT token expired",
        "action": "Use refresh token to get new access token, or log in again."
    },
    "auth/invalid_token": {
        "user_message": "Invalid session. Please log in again.",
        "technical_message": "JWT token validation failed",
        "action": "Clear cookies and log in again."
    },
    "auth/account_locked": {
        "user_message": "Account temporarily locked due to too many failed attempts. Try again in 15 minutes.",
        "technical_message": "Account locked due to rate limiting",
        "action": "Wait 15 minutes or contact support if issue persists."
    },
    
    # Validation Errors
    "validation/required_field": {
        "user_message": "Please fill in all required fields.",
        "technical_message": "Missing required field in request",
        "action": "Check your input and provide all required information."
    },
    "validation/invalid_email": {
        "user_message": "Please enter a valid email address.",
        "technical_message": "Email format validation failed",
        "action": "Enter email as user@example.com"
    },
    "validation/date_format": {
        "user_message": "Please enter a valid date (YYYY-MM-DD).",
        "technical_message": "Date parsing failed",
        "action": "Use format: 2025-01-19"
    },
    "validation/number_range": {
        "user_message": "Please enter a value between {min} and {max}.",
        "technical_message": "Number out of allowed range",
        "action": "Adjust your input to be within the valid range."
    },
    
    # Resource Errors
    "resource/not_found": {
        "user_message": "The requested item was not found.",
        "technical_message": "Resource not found in database",
        "action": "Check that the item exists or create a new one."
    },
    "resource/already_exists": {
        "user_message": "This item already exists.",
        "technical_message": "Duplicate resource creation attempted",
        "action": "Use the existing item or create a different one."
    },
    "resource/delete_conflict": {
        "user_message": "Cannot delete this item because it's being used elsewhere.",
        "technical_message": "Foreign key constraint violation",
        "action": "Remove dependencies before deleting."
    },
    
    # Wellness Errors
    "wellness/invalid_mood": {
        "user_message": "Please rate your mood between 1 and 5.",
        "technical_message": "Mood value outside valid range",
        "action": "Use values 1 (very bad) to 5 (excellent)."
    },
    "wellness/invalid_sleep": {
        "user_message": "Please enter sleep hours between 0 and 24.",
        "technical_message": "Sleep hours outside valid range",
        "action": "Enter a realistic sleep duration."
    },
    
    # Rate Limiting
    "rate_limit/exceeded": {
        "user_message": "You're doing that too often. Please wait a moment and try again.",
        "technical_message": "Rate limit exceeded",
        "action": "Wait 1 minute before retrying, or reduce request frequency."
    },
    "rate_limit/auth_exceeded": {
        "user_message": "Too many login attempts. Please wait 15 minutes before trying again.",
        "technical_message": "Auth rate limit exceeded",
        "action": "Wait 15 minutes before next login attempt."
    },
    
    # Server Errors
    "server/internal_error": {
        "user_message": "Something went wrong on our end. Please try again in a moment.",
        "technical_message": "Unhandled exception in application",
        "action": "If this persists, contact support with the error timestamp."
    },
    "server/database_error": {
        "user_message": "We're having trouble saving your data. Please try again.",
        "technical_message": "Database operation failed",
        "action": "Retry the operation. If issue persists, report it."
    },
    "server/timeout": {
        "user_message": "This is taking longer than usual. Please try again.",
        "technical_message": "Request timeout",
        "action": "Retry the request. Consider breaking large requests into smaller ones."
    },
}


# ============ Helper Functions ============

def get_user_error(error_code: str, **kwargs) -> Dict[str, str]:
    """Get user-friendly error message"""
    error = ERROR_MESSAGES.get(error_code, {
        "user_message": "An error occurred. Please try again.",
        "technical_message": f"Unknown error: {error_code}",
        "action": "If the problem persists, contact support."
    })
    
    message = error["user_message"]
    if kwargs:
        message = message.format(**kwargs)
    
    return {
        "success": False,
        "error": {
            "code": error_code,
            "user_message": message,
            "technical": error["technical_message"],
            "action": error["action"],
            "help_url": f"/help/errors#{error_code.replace('/', '_')}"
        }
    }


def suggest_action(error_code: str) -> str:
    """Suggest user action for error"""
    return ERROR_MESSAGES.get(error_code, {}).get("action", "Try again or contact support.")


# ============ Endpoints ============

@router.get("/codes")
async def list_error_codes():
    """List all available error codes"""
    return {
        "errors": [
            {
                "code": code,
                "user_message": e["user_message"],
                "category": code.split("/")[0]
            }
            for code, e in ERROR_MESSAGES.items()
        ],
        "total": len(ERROR_MESSAGES)
    }


@router.get("/explain/{error_code}")
async def explain_error(error_code: str):
    """Explain an error code to users"""
    error = ERROR_MESSAGES.get(error_code)
    if not error:
        return {"error": f"Unknown error code: {error_code}"}
    
    return {
        "code": error_code,
        **error,
        "help_url": f"/help/errors#{error_code.replace('/', '_')}"
    }


@router.get("/suggest/{error_code}")
async def suggest_action_endpoint(error_code: str):
    """Get suggested action for error"""
    return {
        "code": error_code,
        "suggestion": suggest_action(error_code)
    }


@router.get("/health")
async def error_health():
    """Error handling health check"""
    return {
        "status": "healthy",
        "total_error_codes": len(ERROR_MESSAGES),
        "categories": list(set(e.split("/")[0] for e in ERROR_MESSAGES.keys()))
    }
