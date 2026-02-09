# Organic OS - The Operating System for Being Human

🌿 **Evidence-based personal development platform**

[![CI/CD](https://github.com/sustainabilitybro/ORGANIC-OS/actions/workflows/ci.yml/badge.svg)](https://github.com/sustainabilitybro/ORGANIC-OS/actions)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/sustainabilitybro/ORGANIC-OS)](https://github.com/sustainabilitybro/ORGANIC-OS/commits/main)

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Quick Start](#quick-start)
4. [Architecture](#architecture)
5. [API Reference](#api-reference)
6. [Data Modules](#data-modules)
7. [Development](#development)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

---

## Overview

Organic OS is a comprehensive personal development platform combining identity, wellness, emotional intelligence, and growth modules into a unified system. Built with privacy-first principles and evidence-based interventions.

### Core Values
- **Privacy First** - All data stays with the user
- **Evidence-Based** - All interventions rooted in research
- **Personalized** - Adapts to individual needs
- **Accessible** - Free and open source

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

### 10 Complete Modules

| Module | Status | Description |
|--------|--------|-------------|
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

### Personal Integrations

- **Habits**: Track daily habits with streaks and analytics
- **Goals**: Set and track personal/professional goals
- **Calendar**: Integrated calendar events and reminders
- **Preferences**: Customizable user settings
- **Weather**: Local weather for wellness planning

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
| Wger | Exercise database | Unlimited |
| USDA | Nutrition database | Unlimited |
| Scripture | Meditation/calming | Unlimited |
| Open-Meteo | Weather | Unlimited |

---

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Git
- Supabase account (free tier works)

### Installation

```bash
# Clone repository
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../api
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Configure environment
cp ../../.env.example .env
# Edit .env with your Supabase credentials
```

### Running Development Servers

```bash
# Terminal 1: Frontend
cd apps/web
npm run dev

# Terminal 2: Backend
cd apps/api
uvicorn main:app --reload

# Access:
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
# API: http://localhost:8000
```

### Docker Deployment

```bash
# Start all services
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

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
- `GET /api/v1/metrics` - Performance metrics

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

#### Personal Integrations
- `GET /api/v1/pis/preferences` - User preferences
- `GET /api/v1/pis/habits` - Habit tracking
- `GET /api/v1/pis/goals` - Goal tracking
- `GET /api/v1/pis/dashboard` - Daily dashboard
- `GET /api/v1/pis/weather` - Weather
- `GET /api/v1/pis/calendar/events` - Calendar

#### Integrations (Free APIs)
- `GET /api/v1/integrations/quote/daily` - Daily quote
- `GET /api/v1/integrations/fact/random` - Random fact
- `GET /api/v1/integrations/joke/random` - Joke
- `GET /api/v1/integrations/trivia/random` - Trivia

#### Health APIs
- `GET /api/v1/health/exercise/search` - Exercise search
- `GET /api/v1/health/nutrition/food` - Nutrition search
- `GET /api/v1/health/sleep/tip` - Sleep tips
- `GET /api/v1/health/mindfulness/prompt` - Mindfulness

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
- **Coping Strategies**: 50+ evidence-based strategies
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

## Development

### Code Style

- **TypeScript**: Strict mode enabled
- **Python**: Black formatting, flake8 linting
- **Commits**: Conventional commits (feat!, refactor!, docs!)

### Testing

```bash
# Backend tests
cd apps/api
pytest test_api.py -v

# Frontend tests
cd apps/web
npm test

# Run all tests with coverage
pytest test_api.py -v --cov=.
npm test -- --coverage
```

### Adding a New Module

1. Create data file: `apps/web/src/data/modules/newmodule.ts`
2. Add API routes: `apps/api/routes/newmodule.py`
3. Create UI component: `apps/web/src/components/newmodule/`
4. Update exports: `apps/web/src/data/modules/index.ts`
5. Add tests: `apps/web/tests/newmodule.test.ts`
6. Document: Update README.md

### Performance

```bash
# Run performance benchmarks
pytest test_api.py::test_performance -v

# Check response times
curl http://localhost:8000/api/v1/performance/metrics
```

---

## Deployment

### Frontend (Vercel)

```bash
cd apps/web
npm run build
vercel deploy --prod
```

### Backend (Render/Railway)

```bash
cd apps/api
pip install -r requirements.txt
gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:$PORT main:app
```

### Database (Supabase)

```bash
# Apply schema
psql -f apps/supabase/schema.sql
```

### Environment Variables

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
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

## Support

- **Documentation**: See above
- **Issues**: [GitHub Issues](https://github.com/sustainabilitybro/ORGANIC-OS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sustainabilitybro/ORGANIC-OS/discussions)

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Acknowledgments

- Research-based frameworks from positive psychology
- Open source community for inspiration
- All contributors and users
