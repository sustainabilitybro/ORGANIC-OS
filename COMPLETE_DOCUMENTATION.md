# Organic OS - Complete Documentation

**Last Updated:** 2026-02-09

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [API Reference](#api-reference)
5. [Data Modules](#data-modules)
6. [Integration Guide](#integration-guide)
7. [Performance](#performance)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Development Guide](#development-guide)

---

## Overview

Organic OS is a comprehensive personal development platform combining identity, wellness, emotional intelligence, and growth modules into a unified system.

### Mission
To provide evidence-based tools for holistic personal development, leveraging AI to deliver personalized coaching and tracking.

### Core Values
- **User Privacy First** - All data stays with the user
- **Evidence-Based** - All interventions rooted in research
- **Personalized** - Adapts to individual needs
- **Accessible** - Free and open source

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Organic OS Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐         ┌──────────────┐                │
│   │   Next.js   │         │   FastAPI   │                │
│   │  Frontend   │◄───────►│   Backend   │                │
│   │   (React)   │         │  (Python)   │                │
│   └──────────────┘         └──────────────┘                │
│          │                        │                         │
│          ▼                        ▼                         │
│   ┌──────────────┐         ┌──────────────┐                │
│   │    Vercel   │         │  Supabase    │                │
│   │  Deployment │         │  Database    │                │
│   └──────────────┘         └──────────────┘                │
│                                                              │
│   ┌──────────────────────────────────────────────────┐      │
│   │              OpenClaw Integration                 │      │
│   │        Multi-Agent Coaching System              │      │
│   └──────────────────────────────────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 + React 18 | UI Components |
| Styling | Tailwind CSS | Styling |
| Backend | FastAPI | API Server |
| Database | Supabase (PostgreSQL) | Data Storage |
| Auth | Supabase Auth | Authentication |
| AI | OpenClaw + MiniMax | Agent Coaching |
| Deployment | Vercel + Render | Hosting |

---

## Features

### Core Modules (10 Total)

| Module | Status | Features |
|--------|--------|----------|
| **Identity** | ✅ Complete | Values assessment, Purpose discovery, Legacy work |
| **Emotional** | ✅ Complete | Emotion taxonomy, EQ skills, Coping strategies |
| **Wellness** | ✅ Complete | Sleep, Nutrition, Exercise, Mindfulness tracking |
| **Recovery** | ✅ Complete | Burnout assessment, Stress management |
| **Communication** | ✅ Complete | Public speaking, Active listening, NVC |
| **Sensory** | ✅ Complete | All 5 senses exercises, Mindfulness |
| **Sustainability** | ✅ Complete | Carbon footprint, Eco-living tips |
| **Holistic Alchemy** | ✅ Complete | Depression, Anxiety, Sleep, OCD, PTSD |
| **Atom Economy** | ✅ Complete | Productivity systems, Focus optimization |
| **Video** | ✅ Complete | On-camera skills, Presentation practice |

### AI Features

- **Multi-Agent Coaching**: Coach, Socratic, Wellness, Identity agents
- **Personalized Feedback**: Based on user data and progress
- **Roundtable Discussions**: Multiple agents discuss topics
- **Memory System**: Agents remember user preferences

### User Features

- **Dashboard**: Overview of all modules and progress
- **Analytics**: Trends, streaks, insights
- **Quick Check-In**: 5-step wellness logging
- **Data Export/Import**: JSON format, privacy-first
- **Push Notifications**: Browser notifications for reminders
- **Global Search**: Find any module, exercise, or prompt
- **Mobile App**: React Native companion app

---

## API Reference

### Base URLs

| Environment | Frontend | Backend |
|------------|----------|---------|
| Development | http://localhost:3000 | http://localhost:8000 |
| Production | https://organic-os.vercel.app | https://api.organic-os.com |

### Authentication

All endpoints (except health checks) require Supabase JWT token.

```bash
Authorization: Bearer <supabase-jwt-token>
```

### Endpoints

#### Health
- `GET /` - Root status
- `GET /api/v1/health` - Health check
- `GET /api/v1/ready` - Readiness check

#### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/auth/me` - Current user
- `POST /api/v1/auth/refresh` - Refresh token

#### Wellness
- `GET /api/v1/wellness/prompt` - Daily prompt
- `GET /api/v1/wellness/stats` - Statistics
- `GET /api/v1/wellness/streak` - Streak & rewards
- `POST /api/v1/wellness/check-in` - Quick logging

#### Progress
- `GET /api/v1/progress/modules` - All progress
- `GET /api/v1/progress/summary` - Summary
- `POST /api/v1/progress/modules` - Update progress

#### Modules Data
- `GET /api/v1/modules/{name}` - Specific module
- `GET /api/v1/modules/all` - All modules
- `GET /api/v1/modules/prompts/{module}` - Prompts
- `GET /api/v1/modules/exercises/{module}` - Exercises

#### OpenClaw
- `GET /api/v1/openclaw/agents` - List agents
- `POST /api/v1/openclaw/chat` - Agent chat
- `POST /api/v1/openclaw/memory` - Store memory
- `POST /api/v1/openclaw/roundtable` - Multi-agent discussion

#### Integrations (Free APIs)
- `GET /api/v1/integrations/quote/daily` - Daily quote
- `GET /api/v1/integrations/fact/random` - Random fact
- `GET /api/v1/integrations/joke/random` - Joke
- `GET /api/v1/integrations/wellness/daily` - Aggregated data

#### Performance
- `GET /api/v1/performance/metrics` - Metrics
- `GET /api/v1/performance/health` - Health check
- `POST /api/v1/performance/cache/clear` - Clear cache

---

## Data Modules

### Identity Module
- **Values**: Schwartz's 10 basic values
- **Purpose**: Ikigai, Legacy, Eulogy exercises
- **Self-Discovery**: Future self visualization, Archetypes

### Emotional Module
- **Emotions**: 13 emotions with taxonomy
- **Coping Strategies**: 40+ evidence-based strategies
- **EQ Assessment**: Self-awareness, Regulation, Motivation, Empathy

### Wellness Module
- **Sleep**: Tracking, hygiene tips, 7-9 hours optimal
- **Nutrition**: Macronutrients, hydration goals
- **Exercise**: 150-300 min/week recommendations
- **Mindfulness**: Breath work, body scan, meditation

### Recovery Module
- **Burnout Assessment**: Maslach's 3 dimensions
- **Stress Management**: Acute, episodic, chronic strategies
- **Relaxation**: Box breathing, PMR, visualization

### Communication Module
- **Public Speaking**: Fear management, structure, storytelling
- **Active Listening**: Components and barriers
- **NVC**: Observation, Feeling, Need, Request
- **Conflict Resolution**: 5 styles with strategies

### Sensory Module
- **Visual**: Peripheral vision, nature observation
- **Auditory**: Active listening, sound meditation
- **Olfactory**: Scent journaling, aromatherapy
- **Gustatory**: Mindful eating, flavor exploration
- **Kinesthetic**: Body scan, grounding, movement

### Sustainability Module
- **Carbon Footprint**: Transportation, energy, food, waste
- **Targets**: Excellent (3kg/day) to High (16kg/day)
- **Climate Anxiety**: Coping strategies

### Holistic Alchemy Module
- **Depression**: Behavioral activation, cognitive restructuring
- **Anxiety**: Exposure, relaxation, cognitive therapy
- **Sleep (CBT-I)**: Sleep restriction, stimulus control
- **OCD**: ERP (Exposure and Response Prevention)
- **PTSD**: EMDR, Prolonged Exposure, CPT

### Atom Economy Module
- **Productivity Systems**: GTD, Time Blocking, Pomodoro
- **Focus Optimization**: Single-tasking, batching
- **Energy Management**: Physical, Emotional, Mental, Spiritual

### Video Module
- **Eye Contact**: Camera-as-person, triangle method
- **Facial Expression**: Authentic smiles, micro-expressions
- **Voice**: Pacing, clarity, vocal variety
- **Practice Exercises**: Self-intro, storytelling, impromptu

---

## Integration Guide

### Free API Integrations

| API | Purpose | Rate Limit |
|-----|---------|------------|
| ZenQuotes | Daily quotes | Unlimited |
| UselessFacts | Fun facts | Unlimited |
| Moon Phase | Sleep correlation | Unlimited |
| Sunrise-Sunset | Sleep tracking | Unlimited |
| Official Joke | Mood improvement | Unlimited |
| Open Trivia | Cognitive exercises | Unlimited |
| Nager.Date | Awareness days | Unlimited |

### Adding New Integrations

1. Add API info to `integrations.py`:
```python
FREE_APIS = {
    "api_name": {
        "name": "API Name",
        "url": "https://api.example.com",
        "free_tier": "1000/day",
        "requires_key": True,
        "use_cases": ["Use case 1", "Use case 2"]
    }
}
```

2. Create integration function:
```python
async def get_api_data() -> Dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(API_URL, timeout=10.0)
        return response.json()
```

3. Add route:
```python
@router.get("/api_name/data")
async def api_data():
    return await get_api_data()
```

---

## Performance

### Optimization Strategies

| Category | Strategy | Impact | Effort |
|----------|----------|--------|--------|
| Database | Connection pooling | High | Low |
| Database | Query optimization | High | Medium |
| API | Response caching | High | Low |
| API | Compression | Medium | Low |
| Frontend | Code splitting | High | Medium |
| Frontend | Lazy loading | Medium | Low |

### Caching

- **Default TTL**: 5 minutes (300 seconds)
- **Cache Keys**: Generated from function name + args
- **Manual Clear**: `POST /api/v1/performance/cache/clear`

### Monitoring

- **Metrics**: Track request times, success/error rates
- **Alerts**: Trigger at >200ms avg response or >5% errors
- **Recommendations**: Automatic suggestions based on metrics

---

## Testing

### Backend Tests (`apps/api/tests/test_api.py`)

```bash
cd apps/api
pip install pytest pytest-asyncio httpx
pytest test_api.py -v
```

**Coverage:**
- Health endpoints
- Authentication
- Wellness tracking
- Progress tracking
- Module data
- OpenClaw integration
- Free API integrations
- Performance endpoints

### Frontend Tests (`apps/web/tests/`)

```bash
cd apps/web
npm install vitest @testing-library/react
npm test
```

**Coverage:**
- Components (DataExport, SearchBar, AgentChat, etc.)
- Hooks (useAuth, useProgress)
- Utilities (cn, formatRelativeTime)
- Integration flows

---

## Deployment

### Frontend (Vercel)

```bash
cd apps/web
npm run build
vercel deploy --prod
```

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`

### Backend (Render/Railway)

```bash
cd apps/api
pip install -r requirements.txt
gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:$PORT main:app
```

**Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PYTHON_VERSION=3.11`

### Database (Supabase)

```bash
# Apply schema
supabase db push

# Or via SQL Editor
psql -f apps/supabase/schema.sql
```

---

## Development Guide

### Quick Start

```bash
# Clone repository
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS

# Install dependencies
cd apps/web && npm install
cd ../api && pip install -r requirements.txt

# Start development servers
cd apps/web && npm run dev
cd apps/api && uvicorn main:app --reload
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Python**: Black formatting, flake8 linting
- **Commits**: Conventional commits (feat!, refactor!, docs!, etc.)

### Proactive Development

Per the [PROACTIVE_MANIFESTO.md](PROACTIVE_MANIFESTO.md):

1. **Never ask for work** - Find things to do
2. **Always improving** - Data, performance, testing, docs
3. **Quality first** - Test before commit
4. **Document everything** - Code, APIs, guides

### Adding a New Module

1. Create data file: `apps/web/src/data/modules/newmodule.ts`
2. Add API routes: `apps/api/routes/newmodule.py`
3. Create UI component: `apps/web/src/components/newmodule/`
4. Update exports: `apps/web/src/data/modules/index.ts`
5. Add tests: `apps/web/tests/newmodule.test.ts`
6. Document: Update this file

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: Description of changes"

# Push to review
git push origin feature/new-feature

# After review, merge to main
```

---

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Ensure all tests pass
5. Update documentation
6. Submit pull request

### Areas Needing Contribution

- [ ] Mobile app (iOS/Android)
- [ ] More API integrations
- [ ] Advanced analytics
- [ ] Social features
- [ ] Accessibility improvements

---

## Resources

### Research & Evidence

All interventions are evidence-based. See [docs/RESEARCH.md](docs/RESEARCH.md) for:
- Psychological frameworks
- Assessment tools
- Outcome studies
- Best practices

### Community

- **Issues**: GitHub Issues for bugs/feature requests
- **Discussions**: GitHub Discussions for ideas
- **Wiki**: Community-contributed guides

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Support

- **Documentation**: See above
- **Issues**: GitHub Issues
- **Email**: support@organic-os.com
