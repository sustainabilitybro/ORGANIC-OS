# Organic OS API Documentation

## Overview

Organic OS provides a comprehensive RESTful API for personal development and wellness tracking. The API is built with FastAPI and provides both REST and WebSocket endpoints.

## Base URL

- **Development:** `http://localhost:8000`
- **Production:** `https://api.organic-os.com` (TBD)

## API Version

Current version: `v1`

## Authentication

### Supabase Auth

The API uses Supabase for authentication. Include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/v1/auth/user
```

### Public Endpoints

Some endpoints are public and don't require authentication:
- `/api/v1/health/*` - Health check endpoints
- `/api/v1/wellness/quote` - Random quotes
- `/api/v1/wellness/fact` - Interesting facts
- `/api/v1/integrations/*` - Public integration data

## Rate Limiting

- **Authenticated:** 100 requests/minute
- **Unauthenticated:** 20 requests/minute

## Response Format

All responses follow this structure:

```json
{
  "data": { ... },
  "meta": {
    "version": "1.0",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Error Handling

Errors return standard HTTP status codes:

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

Error response:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": []
  }
}
```

## Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/user` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Wellness
- `GET /api/v1/wellness/tracker` - Get wellness entries
- `POST /api/v1/wellness/tracker` - Create wellness entry
- `GET /api/v1/wellness/quote` - Random quote
- `GET /api/v1/wellness/fact` - Interesting fact

### Progress
- `GET /api/v1/progress/modules` - Get module progress
- `POST /api/v1/progress/modules` - Update progress

### Modules
- `GET /api/v1/modules` - List all modules
- `GET /api/v1/modules/{id}` - Get module details
- `GET /api/v1/modules/{id}/topics` - Get module topics

### AI
- `POST /api/v1/ai/chat` - Chat with AI
- `POST /api/v1/ai/analyze` - Analyze user data

### Integrations
- `GET /api/v1/integrations/github` - GitHub stats
- `GET /api/v1/integrations/weather` - Weather data
- `GET /api/v1/integrations/news` - News feed

### Health
- `GET /api/v1/health` - Health status
- `GET /api/v1/health/exercise` - Exercise database
- `GET /api/v1/health/nutrition` - Nutrition data

### System
- `GET /api/v1/system/status` - System status
- `GET /api/v1/system/info` - System info
- `GET /api/v1/system/diagnostics` - Run diagnostics

## WebSocket

Real-time updates via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};
```

## SDK

Official SDKs available:
- **JavaScript/TypeScript:** `@organic-os/sdk`
- **Python:** `organic-os` (TBD)

## Examples

### Python

```python
import httpx

async def get_wellness():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://localhost:8000/api/v1/wellness/quote"
        )
        return response.json()
```

### JavaScript

```javascript
const response = await fetch('http://localhost:8000/api/v1/wellness/quote');
const data = await response.json();
```

### cURL

```bash
# Get random quote
curl http://localhost:8000/api/v1/wellness/quote

# Get user profile (requires auth)
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/v1/auth/user
```

## Pagination

List endpoints support pagination:

```
GET /api/v1/wellness/tracker?page=1&limit=20
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Filtering

Filter results using query parameters:

```
GET /api/v1/wellness/tracker?date=2024-01-01&mood_gt=7
```

## Sorting

Sort results:

```
GET /api/v1/wellness/tracker?sort=date:desc
```

## Caching

Public endpoints are cached for 5 minutes. Use `Cache-Control` header:

```
GET /api/v1/wellness/quote
Cache-Control: public, max-age=300
```

## SDK Examples

### Authentication

```python
from organic_os import OrganicOS

client = OrganicOS(api_key="your-key")
user = await client.auth.login(email, password)
```

### Wellness Tracking

```python
entries = await client.wellness.get_entries(
    start_date="2024-01-01",
    end_date="2024-01-31"
)
```

## Rate Limit Headers

Every response includes rate limit info:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Versioning

The API uses URL-based versioning:

- `/api/v1/*` - Current stable version
- `/api/v2/*` - Beta (when available)

## Deprecation

When endpoints are deprecated:
1. Headers include `Deprecation` and `Link`
2. Response includes deprecation notice
3. 12 months before removal

## Support

- **GitHub Issues:** https://github.com/sustainabilitybro/ORGANIC-OS/issues
- **Discord:** https://discord.gg/organic-os
- **Email:** support@altlaboratories.com
