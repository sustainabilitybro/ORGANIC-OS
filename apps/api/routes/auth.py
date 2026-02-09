from fastapi import APIRouter, HTTPException, status, Depends, Request
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter()

# Environment configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")


# Pydantic schemas
class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None


class TokenVerify(BaseModel):
    token: str


class TokenResponse(BaseModel):
    valid: bool
    user: Optional[UserResponse] = None


class TokenRefresh(BaseModel):
    refresh_token: str


class TokenRefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int


def get_user_id(request: Request) -> str:
    """Extract user ID from authorization header."""
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header[7:43] or 'anonymous'
    return 'anonymous'


@router.post("/verify", response_model=TokenResponse)
async def verify_token(token_data: TokenVerify):
    """
    Verify a Supabase JWT token and return user info.
    """
    token = token_data.token
    
    if not token or token == "valid-token":
        # Placeholder response for development
        return TokenResponse(
            valid=True,
            user=UserResponse(
                id="dev-user",
                email="dev@example.com",
                full_name="Development User",
                avatar_url=None
            )
        )
    
    # In production, verify the JWT using Supabase's JWKS endpoint:
    # 1. Fetch JWKS from SUPABASE_URL/.well-known/jwks.json
    # 2. Verify signature using PyJWT or python-jose
    # 3. Decode and return user claims
    
    try:
        # Placeholder: In production, use:
        # from python_jose import jwt
        # claims = jwt.decode(token, key, algorithms=['HS256'], audience=SUPABASE_ANON_KEY)
        
        return TokenResponse(
            valid=True,
            user=UserResponse(
                id="verified-user",
                email="user@example.com",
                full_name="Verified User"
            )
        )
    except Exception as e:
        return TokenResponse(valid=False, user=None)


@router.get("/me", response_model=UserResponse)
async def get_current_user(request: Request):
    """
    Get the current authenticated user from the Authorization header.
    """
    user_id = get_user_id(request)
    
    if not user_id or user_id == 'anonymous':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    # In production, decode JWT and fetch from Supabase
    # user = supabase.auth.get_user(jwt)
    
    return UserResponse(
        id=user_id,
        email="user@example.com",
        full_name="Current User",
        avatar_url=None,
        created_at=None
    )


@router.post("/refresh", response_model=TokenRefreshResponse)
async def refresh_token(refresh_data: TokenRefresh):
    """
    Refresh an access token using a refresh token.
    In production, exchange refresh token with Supabase.
    """
    refresh_token = refresh_data.refresh_token
    
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required"
        )
    
    # In production, call Supabase auth.refresh_session()
    # response = supabase.auth.refresh_session(refresh_token)
    
    return TokenRefreshResponse(
        access_token="new-access-token",
        refresh_token="new-refresh-token",
        expires_in=3600  # 1 hour
    )


@router.post("/signout")
async def sign_out(request: Request):
    """
    Sign out the current user.
    In production, this would call supabase.auth.sign_out()
    """
    user_id = get_user_id(request)
    
    # In production: supabase.auth.sign_out()
    
    return {"status": "signed_out", "user_id": user_id}


@router.get("/session")
async def get_session(request: Request):
    """
    Get the current session.
    """
    user_id = get_user_id(request)
    
    if not user_id or user_id == 'anonymous':
        return {"session": None}
    
    return {
        "session": {
            "access_token": "token",
            "refresh_token": "refresh",
            "user": {
                "id": user_id,
                "email": "user@example.com"
            },
            "expires_at": None
        }
    }
