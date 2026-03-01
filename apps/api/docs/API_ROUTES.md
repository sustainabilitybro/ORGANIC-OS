# Organic OS - API Routes Documentation

## Overview

Organic OS provides a comprehensive REST API built with FastAPI. This document outlines all available endpoints.

## Base URL

```
Production: https://organic-os-api.example.com
Development: http://localhost:8000
```

---

## Authentication

### POST /api/v1/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### POST /api/v1/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

### POST /api/v1/auth/logout
Logout current user.

---

## Wellness

### GET /api/v1/wellness/daily
Get daily wellness data.

**Response:**
```json
{
  "mood": 7,
  "energy": 6,
  "stress": 4,
  "sleep": 7,
  "exercise": 5
}
```

### POST /api/v1/wellness/check-in
Submit wellness check-in.

**Request:**
```json
{
  "mood": 7,
  "energy": 6,
  "stress": 4,
  "sleep": 7,
  "exercise": 5
}
```

### GET /api/v1/wellness/streak
Get current wellness streak and rewards.

### GET /api/v1/wellness/prompt
Get daily wellness prompt.

### GET /api/v1/wellness/goals
Get suggested wellness goals.

---

## Progress

### GET /api/v1/progress
Get user progress across all modules.

### GET /api/v1/progress/{module_id}
Get progress for specific module.

### POST /api/v1/progress/update
Update module progress.

---

## Modules

### GET /api/v1/modules
List all available modules.

### GET /api/v1/modules/{module_id}
Get specific module details.

### GET /api/v1/modules/{module_id}/exercises
Get exercises for a module.

---

## OpenClaw Agents

### GET /api/v1/openclaw/agents
List available AI agents.

### POST /api/v1/openclaw/chat
Send message to AI agent.

### GET /api/v1/openclaw/agents/{agent_id}/history
Get conversation history.

---

## Health & Status

### GET /api/v1/health
Health check endpoint.

### GET /api/v1/health/detailed
Detailed health status.

### GET /api/v1/version
Get API version.

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| /auth/* | 10/minute |
| /wellness/* | 60/minute |
| /openclaw/* | 30/minute |
| /health/* | 100/minute |

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```
