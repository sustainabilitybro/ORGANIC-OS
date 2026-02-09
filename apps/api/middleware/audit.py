"""
Audit Logging Middleware

Comprehensive audit trail for all sensitive operations.
"""
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Any, Optional
from datetime import datetime
from enum import Enum
import json
import uuid

# ============ Audit Event Types ============

class AuditEventType(Enum):
    """Types of audit events"""
    # Authentication
    AUTH_LOGIN = "auth.login"
    AUTH_LOGOUT = "auth.logout"
    AUTH_REGISTER = "auth.register"
    AUTH_TOKEN_REFRESH = "auth.token_refresh"
    AUTH_PASSWORD_CHANGE = "auth.password_change"
    
    # Data Operations
    DATA_CREATE = "data.create"
    DATA_READ = "data.read"
    DATA_UPDATE = "data.update"
    DATA_DELETE = "data.delete"
    DATA_EXPORT = "data.export"
    DATA_IMPORT = "data.import"
    
    # User Operations
    USER_PROFILE_UPDATE = "user.profile_update"
    USER_PREFERENCES_UPDATE = "user.preferences_update"
    USER_DELETE = "user.delete"
    
    # AI Operations
    AI_CHAT = "ai.chat"
    AI_AGENT_SWITCH = "ai.agent_switch"
    
    # Wellness Operations
    WELLNESS_CHECKIN = "wellness.checkin"
    WELLNESS_LOG = "wellness.log"
    
    # Personal Integrations
    PI_HABIT_CREATE = "pi.habit_create"
    PI_HABIT_UPDATE = "pi.habit_update"
    PI_HABIT_DELETE = "pi.habit_delete"
    PI_GOAL_CREATE = "pi.goal_create"
    PI_GOAL_UPDATE = "pi.goal_update"
    PI_GOAL_COMPLETE = "pi.goal_complete"
    PI_CALENDAR_EVENT = "pi.calendar_event"
    
    # System Operations
    SYSTEM_ERROR = "system.error"
    SYSTEM_CONFIG_CHANGE = "system.config_change"
    SYSTEM_BACKUP = "system.backup"

# ============ Audit Event Severity ============

class AuditSeverity(Enum):
    """Audit event severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

# ============ Audit Event ============

class AuditEvent:
    """Represents a single audit event"""
    
    def __init__(
        self,
        event_type: AuditEventType,
        user_id: Optional[str] = None,
        severity: AuditSeverity = AuditSeverity.INFO,
        description: str = "",
        details: Optional[Dict] = None,
        request: Optional[Request] = None,
        outcome: str = "success",
        error_message: Optional[str] = None
    ):
        self.event_id = str(uuid.uuid4())
        self.timestamp = datetime.utcnow().isoformat()
        self.event_type = event_type.value
        self.user_id = user_id
        self.severity = severity.value
        self.description = description
        self.details = details or {}
        self.outcome = outcome
        self.error_message = error_message
        
        # Extract request metadata
        if request:
            self.ip_address = self._get_client_ip(request)
            self.user_agent = request.headers.get("User-Agent", "unknown")
            self.endpoint = request.url.path
            self.method = request.method
        else:
            self.ip_address = None
            self.user_agent = None
            self.endpoint = None
            self.method = None
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        return request.client.host if request.client else "unknown"
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "event_id": self.event_id,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "user_id": self.user_id,
            "severity": self.severity,
            "description": self.description,
            "details": self.details,
            "outcome": self.outcome,
            "error_message": self.error_message,
            "request": {
                "ip_address": self.ip_address,
                "user_agent": self.user_agent,
                "endpoint": self.endpoint,
                "method": self.method
            } if self.endpoint else None
        }
    
    def to_json(self) -> str:
        """Convert to JSON string"""
        return json.dumps(self.to_dict())

# ============ Audit Log Storage ============

class AuditLogStore:
    """In-memory audit log storage (use external system in production)"""
    
    def __init__(self, max_events: int = 10000):
        self._events: list = []
        self._max_events = max_events
    
    def add_event(self, event: AuditEvent):
        """Add an audit event"""
        self._events.append(event)
        
        # Trim old events if over limit
        if len(self._events) > self._max_events:
            self._events = self._events[-self._max_events:]
    
    def get_events(
        self,
        user_id: Optional[str] = None,
        event_type: Optional[AuditEventType] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100
    ) -> list:
        """Query audit events"""
        results = self._events
        
        if user_id:
            results = [e for e in results if e.user_id == user_id]
        
        if event_type:
            results = [e for e in results if e.event_type == event_type.value]
        
        if start_time:
            results = [e for e in results if e.timestamp >= start_time.isoformat()]
        
        if end_time:
            results = [e for e in results if e.timestamp <= end_time.isoformat()]
        
        return [e.to_dict() for e in results[-limit:]]
    
    def get_events_by_severity(self, severity: AuditSeverity) -> list:
        """Get events by severity level"""
        return [e.to_dict() for e in self._events if e.severity == severity.value]
    
    def get_error_events(self) -> list:
        """Get all error and critical events"""
        return self.get_events_by_severity(AuditSeverity.ERROR) + \
               self.get_events_by_severity(AuditSeverity.CRITICAL)
    
    def export(self, format: str = "json") -> str:
        """Export all events"""
        events = [e.to_dict() for e in self._events]
        if format == "json":
            return json.dumps({"audit_events": events}, indent=2)
        elif format == "csv":
            lines = ["event_id,timestamp,event_type,user_id,severity,outcome"]
            for e in events:
                lines.append(f"{e['event_id']},{e['timestamp']},{e['event_type']},{e['user_id']},{e['severity']},{e['outcome']}")
            return "\n".join(lines)
        return str(events)
    
    def clear(self):
        """Clear all events"""
        self._events = []
    
    def count(self) -> int:
        """Get event count"""
        return len(self._events)

# Global audit log store
_audit_log = AuditLogStore()

# ============ Audit Middleware ============

class AuditMiddleware(BaseHTTPMiddleware):
    """Audit logging middleware for all requests"""
    
    # Events that trigger detailed logging
    AUDITED_PATHS = {
        "/api/v1/auth/login": AuditEventType.AUTH_LOGIN,
        "/api/v1/auth/register": AuditEventType.AUTH_REGISTER,
        "/api/v1/auth/refresh": AuditEventType.AUTH_TOKEN_REFRESH,
        "/api/v1/wellness/check-in": AuditEventType.WELLNESS_CHECKIN,
        "/api/v1/wellness/log": AuditEventType.WELLNESS_LOG,
        "/api/v1/progress": AuditEventType.DATA_UPDATE,
        "/api/v1/pis/habits": AuditEventType.PI_HABIT_UPDATE,
        "/api/v1/pis/goals": AuditEventType.PI_GOAL_UPDATE,
        "/api/v1/openclaw/chat": AuditEventType.AI_CHAT,
    }
    
    def __init__(self, app: FastAPI):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next):
        # Skip non-audited endpoints
        path = request.url.path
        if not any(path.startswith(skip) for skip in ["/api/v1/"]):
            return await call_next(request)
        
        # Check if this path should be audited
        event_type = None
        for audited_path, audit_event in self.AUDITED_PATHS.items():
            if path.startswith(audited_path):
                event_type = audit_event
                break
        
        # Get user ID if available
        user_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header:
            # Extract user ID from token (simplified)
            user_id = f"user:{auth_header[7:20]}..."
        
        # Process request
        try:
            response = await call_next(request)
            outcome = "success" if response.status_code < 400 else "failure"
        except Exception as e:
            outcome = "error"
            raise
        finally:
            # Log event if audited
            if event_type:
                event = AuditEvent(
                    event_type=event_type,
                    user_id=user_id,
                    severity=AuditSeverity.INFO if outcome == "success" else AuditSeverity.ERROR,
                    description=f"{request.method} {path}",
                    request=request,
                    outcome=outcome
                )
                _audit_log.add_event(event)
        
        return response

# ============ Logging Functions ============

def log_auth_event(
    event_type: AuditEventType,
    user_id: str,
    request: Request = None,
    success: bool = True,
    details: Dict = None
):
    """Log an authentication event"""
    event = AuditEvent(
        event_type=event_type,
        user_id=user_id,
        severity=AuditSeverity.INFO if success else AuditSeverity.ERROR,
        description=f"Authentication: {event_type.value}",
        request=request,
        outcome="success" if success else "failure",
        details=details
    )
    _audit_log.add_event(event)

def log_data_event(
    event_type: AuditEventType,
    user_id: str,
    resource: str,
    action: str,
    request: Request = None,
    success: bool = True,
    details: Dict = None
):
    """Log a data operation event"""
    event = AuditEvent(
        event_type=event_type,
        user_id=user_id,
        severity=AuditSeverity.INFO if success else AuditSeverity.ERROR,
        description=f"Data: {action} {resource}",
        request=request,
        outcome="success" if success else "failure",
        details=details
    )
    _audit_log.add_event(event)

def log_security_event(
    event_type: AuditEventType,
    user_id: str,
    description: str,
    request: Request = None,
    success: bool = True,
    details: Dict = None
):
    """Log a security-relevant event"""
    severity = AuditSeverity.WARNING if success else AuditSeverity.CRITICAL
    event = AuditEvent(
        event_type=event_type,
        user_id=user_id,
        severity=severity,
        description=description,
        request=request,
        outcome="success" if success else "failure",
        details=details
    )
    _audit_log.add_event(event)

# ============ Setup Function ============

def setup_audit_logging(app: FastAPI):
    """Setup audit logging middleware"""
    app.add_middleware(AuditMiddleware)

# ============ Query Functions ============

def get_audit_logs(
    user_id: Optional[str] = None,
    event_type: Optional[str] = None,
    limit: int = 100
) -> list:
    """Get audit logs"""
    et = AuditEventType(event_type) if event_type else None
    return _audit_log.get_events(user_id=user_id, event_type=et, limit=limit)

def get_security_logs() -> list:
    """Get all security-related logs"""
    return _audit_log.get_events_by_severity(AuditSeverity.WARNING) + \
           _audit_log.get_events_by_severity(AuditSeverity.ERROR) + \
           _audit_log.get_events_by_severity(AuditSeverity.CRITICAL)

def get_recent_errors() -> list:
    """Get recent error events"""
    return _audit_log.get_error_events()

def get_audit_stats() -> Dict:
    """Get audit log statistics"""
    events = _audit_log._events
    return {
        "total_events": len(events),
        "by_type": {},
        "by_severity": {},
        "by_outcome": {}
    }
