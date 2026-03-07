# Organic OS API Documentation

## Base URL

```
Production: https://organic-os.vercel.app
Development: http://localhost:3000
```

## Public Endpoints

### Health Check
```
GET /api/health
```
Returns system health status, uptime, and memory usage.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-07T23:00:00.000Z",
  "uptime": { "seconds": 3600, "hours": "1.00", "formatted": "1h 0m" },
  "environment": "production",
  "memory": { "rss": "45.00 MB", "heapTotal": "25.00 MB", "heapUsed": "20.00 MB" },
  "version": "1.0.0"
}
```

### Stats
```
GET /api/stats
```
Returns system statistics, module status, and feature flags.

### Configuration
```
GET /api/config
```
Returns app configuration and available modules.

### GitHub Integration
```
GET /api/github
```
Returns GitHub user profile and repository statistics.

```
GET /api/github/repos
```
Returns all repositories with details and recent commits.

```
GET /api/github/issues
```
Returns open issues across all repositories.

```
GET /api/github/actions
```
Returns recent GitHub Actions workflow runs.

```
GET /api/github/contributors
```
Returns top contributors across all repositories.

### Weather
```
GET /api/weather?city=Berlin
```
Returns current weather for the specified city.

### Quotes
```
GET /api/quote
```
Returns random inspirational quote.

### Moon Phase
```
GET /api/moon
```
Returns current moon phase information.

### RSS Feed
```
GET /api/feed
```
Returns RSS feed of recent GitHub activity.

## Module Endpoints

### Progress
```
GET /api/progress
```
Returns user progress across all modules.

### Modules
```
GET /api/modules
```
Returns available modules and their status.

### Wellness
```
GET /api/wellness
```
Returns wellness data and trends.

## Webhooks

### OpenClaw Integration
```
POST /api/openclaw
```
Receives commands from OpenClaw agent.

## Error Responses

All endpoints may return error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "timestamp": "2026-03-07T23:00:00.000Z"
  }
}
```

Common status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limits

Public endpoints are rate-limited to 100 requests per minute per IP.

## Authentication

Protected endpoints require Supabase authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```
