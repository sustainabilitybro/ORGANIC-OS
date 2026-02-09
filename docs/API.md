# API Documentation

Complete reference for the Organic OS REST API.

## Base URL

```
Development: http://localhost:8000
Production:  https://api.organic-os.com
```

## Authentication

All endpoints (except health checks) require authentication via Supabase JWT token.

```bash
# Include token in Authorization header
Authorization: Bearer <supabase-jwt-token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## Health Endpoints

### Root

```http
GET /
```

Returns API status.

**Response:**
```json
{
  "status": "healthy",
  "message": "Organic OS API is running"
}
```

### Health Check

```http
GET /api/v1/health
```

Returns version and health status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## Authentication Endpoints

### Verify Token

```http
POST /api/v1/auth/verify
Content-Type: application/json

{"token": "jwt-token-string"}
```

Validates a JWT token and returns user info.

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://..."
  }
}
```

### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

Returns the currently authenticated user.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://..."
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{"refresh_token": "refresh-token-string"}
```

Refreshes an access token.

**Response:**
```json
{
  "access_token": "new-access-token",
  "refresh_token": "new-refresh-token"
}
```

---

## Wellness Endpoints

### Get Daily Prompt

```http
GET /api/v1/wellness/prompt
GET /api/v1/wellness/prompt?category=gratitude
```

Returns a daily reflection prompt.

**Response:**
```json
{
  "prompt": "What are you grateful for today?",
  "category": "gratitude"
}
```

### Create Wellness Entry

```http
POST /api/v1/wellness/entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2026-02-09",
  "sleep_hours": 7.5,
  "water_intake_ml": 2500,
  "exercise_minutes": 30,
  "meditation_minutes": 15,
  "mood_score": 8,
  "energy_level": 7,
  "nutrition_notes": "Ate healthy today"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "date": "2026-02-09",
  "sleep_hours": 7.5,
  "water_intake_ml": 2500,
  "exercise_minutes": 30,
  "meditation_minutes": 15,
  "mood_score": 8,
  "energy_level": 7,
  "nutrition_notes": "Ate healthy today",
  "created_at": "2026-02-09T03:00:00Z",
  "updated_at": "2026-02-09T03:00:00Z"
}
```

### Get Wellness Entries

```http
GET /api/v1/wellness/entries?user_id=xxx
GET /api/v1/wellness/entries?user_id=xxx&start_date=2026-01-01&end_date=2026-02-09
```

Returns wellness entries for a user.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "user-uuid",
    "date": "2026-02-09",
    "sleep_hours": 7.5,
    "mood_score": 8,
    ...
  }
]
```

### Get Wellness Statistics

```http
GET /api/v1/wellness/stats?user_id=xxx
GET /api/v1/wellness/stats?user_id=xxx&days=7
```

Returns aggregated statistics.

**Response:**
```json
{
  "avg_sleep": 7.2,
  "avg_mood": 7.5,
  "avg_energy": 6.8,
  "avg_water": 2200,
  "avg_exercise": 25,
  "avg_meditation": 12,
  "entries_count": 14
}
```

### Get Wellness Streak

```http
GET /api/v1/wellness/streak?user_id=xxx
```

Returns consecutive days of tracking.

**Response:**
```json
{
  "streak": 5,
  "last_entry": "2026-02-09",
  "total_entries": 42
}
```

---

## Progress Endpoints

### Get All Module Progress

```http
GET /api/v1/progress/modules?user_id=xxx
```

Returns progress for all modules.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "user-uuid",
    "module_name": "identity",
    "progress_percentage": 50,
    "completed_topics": ["values", "purpose"],
    "current_focus": "legacy",
    "notes": "Making good progress",
    "last_activity": "2026-02-09T03:00:00Z"
  }
]
```

### Get Module Progress

```http
GET /api/v1/progress/modules/identity?user_id=xxx
```

Returns progress for a specific module.

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "module_name": "identity",
  "progress_percentage": 50,
  "completed_topics": ["values", "purpose"],
  "current_focus": "legacy",
  "notes": "Making good progress",
  "last_activity": "2026-02-09T03:00:00Z"
}
```

### Update Module Progress

```http
POST /api/v1/progress/modules
Authorization: Bearer <token>
Content-Type: application/json

{
  "module_name": "identity",
  "progress_percentage": 75,
  "completed_topics": ["values", "purpose", "vision"],
  "current_focus": "identity"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "module_name": "identity",
  "progress_percentage": 75,
  "completed_topics": ["values", "purpose", "vision"],
  "current_focus": "identity",
  "last_activity": "2026-02-09T03:00:00Z"
}
```

### Get Overall Progress Summary

```http
GET /api/v1/progress/summary?user_id=xxx
```

Returns aggregated progress across all modules.

**Response:**
```json
{
  "total_modules": 10,
  "completed_modules": 2,
  "overall_percentage": 25.5,
  "module_summaries": [
    {
      "module_name": "wellness",
      "display_name": "Wellness",
      "icon": "🌿",
      "progress_percentage": 100,
      "is_completed": true,
      "last_activity": "2026-02-08"
    },
    {
      "module_name": "identity",
      "display_name": "Identity",
      "icon": "👤",
      "progress_percentage": 50,
      "is_completed": false,
      "last_activity": "2026-02-09"
    }
  ]
}
```

---

## Module Endpoints

### Identity - Purpose Prompt

```http
GET /api/v1/modules/identity/purpose
```

Returns purpose reflection prompts.

**Response:**
```json
{
  "prompt": "What brings you alive? When do you feel most like yourself?",
  "exercises": [
    "Values clarification exercise",
    "Legacy writing prompt",
    "Ikigai discovery questions"
  ]
}
```

### Identity - Values Assessment

```http
POST /api/v1/modules/identity/values
Content-Type: application/json

{"values": ["authenticity", "growth", "connection"]}
```

Analyzes user values.

**Response:**
```json
{
  "values": ["authenticity", "growth", "connection"],
  "insights": "You prioritize personal growth...",
  "recommendations": ["Daily reflection on authenticity"]
}
```

### Sensory - Get Exercises

```http
GET /api/v1/modules/sensory/exercises/visual
GET /api/v1/modules/sensory/exercises/auditory
GET /api/v1/modules/sensory/exercises/kinesthetic
GET /api/v1/modules/sensory/exercises/olfactory
GET /api/v1/modules/sensory/exercises/gustatory
```

Returns exercises for a specific sense.

**Response:**
```json
{
  "sense_type": "visual",
  "exercises": [
    "Peripheral vision practice",
    "Nature observation",
    "Art appreciation"
  ]
}
```

### Emotional - Analyze Emotion

```http
POST /api/v1/modules/emotional/analyze
Content-Type: application/json

{
  "emotion": "anxiety",
  "intensity": 7,
  "triggers": "work deadline",
  "thoughts": "I won't finish in time",
  "behaviors": "Procrastinating"
}
```

Returns AI analysis of an emotion.

**Response:**
```json
{
  "emotion": "anxiety",
  "category": "primary",
  "function": "Signals that something feels uncertain or threatening",
  "healthy_expression": "Channel into focused preparation",
  "coping_strategies": [
    "Deep breathing (4-7-8)",
    "Grounding exercise",
    "Reality testing"
  ]
}
```

### Emotional - Get Emotion Info

```http
GET /api/v1/modules/emotional/taxonomy/anxiety
```

Returns information about a specific emotion.

**Response:**
```json
{
  "emotion": "anxiety",
  "definition": "Anxiety is an emotion characterized by feelings of tension...",
  "intensity_range": "1-10 scale: mild worry (1-3) to panic (8-10)",
  "opposite_emotion": "calm",
  "questions_to_explore": [
    "When do you feel anxious?",
    "What triggers your anxiety?",
    "How do you typically express anxiety?"
  ]
}
```

### Wellness - Get Goals

```http
GET /api/v1/modules/wellness/goals
```

Returns suggested wellness goals.

**Response:**
```json
{
  "nutrition": [
    "Eat 5 servings of vegetables daily",
    "Reduce sugar intake by 50%"
  ],
  "movement": [
    "Walk 10,000 steps daily",
    "Stretch for 10 minutes each morning"
  ],
  "sleep": [
    "Maintain consistent sleep schedule",
    "No screens 1 hour before bed"
  ],
  "stress": [
    "Daily meditation practice",
    "Journaling 3x per week"
  ],
  "mindfulness": [
    "5-minute breathing exercises",
    "Body scan meditation"
  ]
}
```

### Recovery - Assess Burnout

```http
POST /api/v1/modules/recovery/assess-burnout
Content-Type: application/json

{
  "exhaustion": 7,
  "cynicism": 6,
  "inefficacy": 5
}
```

Returns burnout risk assessment.

**Response:**
```json
{
  "score": 6,
  "level": "moderate",
  "recommendations": [
    "Implement recovery practices",
    "Set boundaries",
    "Prioritize self-care"
  ]
}
```

**Burnout Levels:**
- **Severe** (7.5-10): Immediate rest recommended
- **Moderate** (5-7.4): Recovery practices needed
- **Low** (0-4.9): Continue healthy practices

### Communication - Get Goals

```http
GET /api/v1/modules/communication/goals
```

Returns communication improvement goals.

**Response:**
```json
{
  "public_speaking": [
    "Practice 5-minute speeches weekly",
    "Join a speaking club"
  ],
  "active_listening": [
    "100% attention during conversations",
    "Summarize before responding"
  ],
  "conflict_resolution": [
    "Use 'I' statements",
    "Seek to understand first"
  ],
  "written_communication": [
    "Review emails before sending",
    "Practice clarity and brevity"
  ]
}
```

### Sustainability - Get Footprint Metrics

```http
GET /api/v1/modules/sustainability/footprint
```

Returns sustainability tracking metrics.

**Response:**
```json
{
  "energy": ["Electricity usage (kWh)", "Renewable energy %"],
  "transportation": ["Miles driven", "Public transit usage"],
  "waste": ["Recycling rate", "Single-use plastic usage"],
  "consumption": ["Purchasing habits", "Local vs imported"],
  "carbon_footprint": "Calculate based on above metrics"
}
```

### Video - Get Prompts

```http
GET /api/v1/modules/video/prompts
```

Returns video practice prompts.

**Response:**
```json
{
  "impromptu": [
    "30-second self-introduction",
    "Explain your work in 60 seconds"
  ],
  "prepared": [
    "5-minute presentation on favorite topic",
    "How-to tutorial video"
  ],
  "reflection": [
    "What did I learn today?",
    "My goals for the week"
  ]
}
```

---

## AI Coaching Endpoints

### Chat with AI Coach

```http
POST /api/v1/ai/chat
Content-Type: application/json

{
  "message": "I'm feeling stressed about my presentation tomorrow",
  "module_name": "communication",
  "conversation_id": null
}
```

**Response:**
```json
{
  "response": "Feeling nervous before a presentation is completely normal...",
  "conversation_id": "uuid",
  "suggestions": [
    "What are you most worried about?",
    "Would you like some breathing exercises?",
    "Let's practice a quick power pose"
  ]
}
```

**Parameters:**
- `message`: User's message
- `module_name`: Module context (identity, sensory, emotional, etc.)
- `conversation_id`: Optional existing conversation

### Get Module Prompts

```http
GET /api/v1/ai/prompts/identity
GET /api/v1/ai/prompts/emotional
GET /api/v1/ai/prompts/wellness
```

Returns coaching prompts for a module.

**Response:**
```json
{
  "module": "identity",
  "prompts": [
    "What values guide your decisions?",
    "How do you define your authentic self?",
    "What would your ideal future self say?"
  ]
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Not allowed to access resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid input data |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

Currently, no rate limiting is enforced. Future versions will include:
- 100 requests/minute for authenticated users
- 20 requests/minute for unauthenticated requests

---

## Changelog

### v1.0.0 (2026-02-09)

- Initial release
- Authentication endpoints
- Wellness tracking
- Progress monitoring
- Module-specific endpoints
- AI coaching chat
