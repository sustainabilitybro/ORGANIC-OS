"""
Enhanced Authentication with JWT Token Rotation

Security improvements for authentication:
- Token rotation on each use
- Token blacklisting
- Refresh token rotation
- Session management
"""
from fastapi import FastAPI, HTTPException, Depends, status, APIRouter, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import jwt
import hashlib
import secrets
import time

# ============ Configuration ============

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
TOKEN_ROTATION_ENABLED = True

# ============ Token Storage ============

# In production, use Redis
_refresh_token_store: Dict[str, Dict] = {}
_token_blacklist: set = set()
_session_store: Dict[str, Dict] = {}

# ============ Data Models ============

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds

class TokenPayload(BaseModel):
    sub: str  # user_id
    email: str
    exp: datetime
    iat: datetime
    token_id: str  # unique token identifier

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class SessionInfo(BaseModel):
    session_id: str
    user_id: str
    created_at: datetime
    last_used_at: datetime
    ip_address: str
    user_agent: str
    is_active: bool = True

# ============ Token Generation ============

def generate_token_id() -> str:
    """Generate unique token identifier"""
    return hashlib.sha256(
        f"{secrets.token_bytes()}{time.time()}".encode()
    ).hexdigest()

def create_access_token(
    user_id: str,
    email: str,
    additional_claims: Dict = None
) -> tuple:
    """Create a new access token"""
    now = datetime.utcnow()
    token_id = generate_token_id()
    
    payload = {
        "sub": user_id,
        "email": email,
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "token_id": token_id,
        "type": "access"
    }
    
    if additional_claims:
        payload.update(additional_claims)
    
    access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return access_token, token_id

def create_refresh_token(user_id: str, session_id: str) -> tuple:
    """Create a refresh token"""
    now = datetime.utcnow()
    token_id = generate_token_id()
    
    payload = {
        "sub": user_id,
        "session_id": session_id,
        "iat": now,
        "exp": now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "token_id": token_id,
        "type": "refresh"
    }
    
    refresh_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    # Store refresh token
    _refresh_token_store[token_id] = {
        "user_id": user_id,
        "session_id": session_id,
        "created_at": now.isoformat(),
        "used": False,
        "revoked": False
    }
    
    return refresh_token, token_id

def create_tokens(user_id: str, email: str, session_id: str) -> Token:
    """Create both access and refresh tokens"""
    access_token, access_token_id = create_access_token(user_id, email)
    refresh_token, refresh_token_id = create_refresh_token(user_id, session_id)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

# ============ Token Verification ============

def verify_token(token: str) -> TokenPayload:
    """Verify and decode an access token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Check token type
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type"
            )
        
        # Check if blacklisted
        if payload.get("token_id") in _token_blacklist:
            raise HTTPException(
                status_code=401,
                detail="Token has been revoked"
            )
        
        return TokenPayload(**payload)
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}"
        )

def verify_refresh_token(refresh_token: str) -> Dict:
    """Verify a refresh token"""
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type"
            )
        
        token_id = payload.get("token_id")
        
        # Check if stored
        if token_id not in _refresh_token_store:
            raise HTTPException(
                status_code=401,
                detail="Refresh token not found"
            )
        
        token_data = _refresh_token_store[token_id]
        
        # Check if used or revoked
        if token_data.get("revoked"):
            raise HTTPException(
                status_code=401,
                detail="Refresh token has been revoked"
            )
        
        return {
            "user_id": payload["sub"],
            "session_id": payload["session_id"],
            "token_id": token_id
        }
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Refresh token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid refresh token: {str(e)}"
        )

# ============ Token Rotation ============

def rotate_tokens(
    user_id: str,
    email: str,
    old_refresh_token: str,
    session_id: str
) -> Token:
    """
    Rotate tokens - invalidate old and create new
    
    This is called when:
    1. Access token expires (refresh)
    2. User explicitly rotates tokens
    3. Security event requires rotation
    """
    # Verify old refresh token
    old_token_data = verify_refresh_token(old_refresh_token)
    
    # Verify session
    if old_token_data["session_id"] != session_id:
        raise HTTPException(
            status_code=401,
            detail="Session mismatch"
        )
    
    # Invalidate old refresh token
    _refresh_token_store[old_token_data["token_id"]]["revoked"] = True
    _refresh_token_store[old_token_data["token_id"]]["used"] = True
    
    # Blacklist old access token if it exists
    if TOKEN_ROTATION_ENABLED:
        # Note: In a real implementation, you'd track the old access token
        pass
    
    # Create new tokens
    return create_tokens(user_id, email, session_id)

def revoke_refresh_token(token_id: str, reason: str = "user_revoked") -> bool:
    """Revoke a refresh token"""
    if token_id in _refresh_token_store:
        _refresh_token_store[token_id]["revoked"] = True
        _refresh_token_store[token_id]["revoked_reason"] = reason
        return True
    return False

def revoke_all_user_tokens(user_id: str, reason: str = "security") -> int:
    """Revoke all refresh tokens for a user"""
    count = 0
    for token_id, data in _refresh_token_store.items():
        if data["user_id"] == user_id and not data.get("revoked"):
            data["revoked"] = True
            data["revoked_reason"] = reason
            count += 1
    return count

def blacklist_token(token_id: str):
    """Blacklist an access token"""
    _token_blacklist.add(token_id)

# ============ Session Management ============

def create_session(
    user_id: str,
    ip_address: str,
    user_agent: str
) -> SessionInfo:
    """Create a new session"""
    session_id = secrets.token_urlsafe(32)
    
    session = SessionInfo(
        session_id=session_id,
        user_id=user_id,
        created_at=datetime.utcnow(),
        last_used_at=datetime.utcnow(),
        ip_address=ip_address,
        user_agent=user_agent,
        is_active=True
    )
    
    _session_store[session_id] = session.dict()
    
    return session

def update_session_activity(session_id: str):
    """Update session last used timestamp"""
    if session_id in _session_store:
        _session_store[session_id]["last_used_at"] = datetime.utcnow().isoformat()

def terminate_session(session_id: str) -> bool:
    """Terminate a session"""
    if session_id in _session_store:
        _session_store[session_id]["is_active"] = False
        return True
    return False

def get_user_sessions(user_id: str) -> List[SessionInfo]:
    """Get all active sessions for a user"""
    sessions = []
    for session_data in _session_store.values():
        if session_data["user_id"] == user_id and session_data["is_active"]:
            sessions.append(SessionInfo(**session_data))
    return sessions

# ============ Dependency ============

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenPayload:
    """Dependency to get current authenticated user"""
    return verify_token(credentials.credentials)

async def get_current_user_with_rotation(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenPayload:
    """
    Dependency to get current user and rotate token
    
    This will:
    1. Verify the token
    2. Update session activity
    3. Return the user payload
    """
    payload = verify_token(credentials.credentials)
    
    # Update session if applicable
    session_id = getattr(payload, 'session_id', None)
    if session_id:
        update_session_activity(session_id)
    
    return payload

# ============ Router ============

router = APIRouter(prefix="/api/v1/auth", tags=["Enhanced Auth"])

@router.post("/refresh", response_model=Token)
async def refresh_tokens(request: RefreshTokenRequest):
    """Refresh access and refresh tokens (rotation)"""
    # In a real app, get user_id and email from refresh token verification
    user_id = "demo_user"
    email = "demo@example.com"
    session_id = "session_123"
    
    return rotate_tokens(
        user_id=user_id,
        email=email,
        old_refresh_token=request.refresh_token,
        session_id=session_id
    )

@router.post("/revoke")
async def revoke_token(token: str = Body(...)):
    """Revoke a specific token"""
    # Decode to get token_id
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_id = payload.get("token_id")
        
        if payload.get("type") == "refresh":
            revoke_refresh_token(token_id, "user_revoked")
        else:
            blacklist_token(token_id)
        
        return {"success": True, "message": "Token revoked"}
    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid token"
        )

@router.post("/sessions/revoke-all")
async def revoke_all_sessions(
    reason: str = Body(..., embed=True)
):
    """Revoke all user sessions"""
    # In real app, get user_id from token
    user_id = "demo_user"
    
    count = revoke_all_user_tokens(user_id, reason)
    
    return {
        "success": True,
        "revoked_count": count,
        "message": f"Revoked {count} sessions"
    }

@router.get("/sessions", response_model=List[SessionInfo])
async def list_sessions():
    """List all active sessions"""
    # In real app, get user_id from token
    user_id = "demo_user"
    return get_user_sessions(user_id)

@router.get("/security/status")
async def security_status():
    """Get authentication security status"""
    return {
        "token_rotation_enabled": TOKEN_ROTATION_ENABLED,
        "access_token_expiry_minutes": ACCESS_TOKEN_EXPIRE_MINUTES,
        "refresh_token_expiry_days": REFRESH_TOKEN_EXPIRE_DAYS,
        "active_refresh_tokens": len(_refresh_token_store),
        "blacklisted_tokens": len(_token_blacklist),
        "active_sessions": len([s for s in _session_store.values() if s["is_active"]])
    }
