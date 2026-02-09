# Organic OS

The Operating System for Being Human. A unified personal development platform combining identity, sensory, emotional, wellness, recovery, communication, sustainability, and video modules.

## 🌿 Features

### Core Modules

| Module | Description | Status |
|--------|-------------|--------|
| **Identity** | Discover your authentic self through values clarification and purpose exploration | ✅ |
| **Sensory** | Optimize your senses through targeted exercises and awareness practices | ✅ |
| **Emotional** | Master emotional intelligence with emotion tracking and coping strategies | ✅ |
| **Wellness** | Holistic health tracking with sleep, mood, energy, and nutrition monitoring | ✅ |
| **Recovery** | Burnout prevention and stress management with assessment tools | ✅ |
| **Communication** | Public speaking and expression mastery with practice prompts | ✅ |
| **Sustainability** | Carbon footprint tracking and eco-living recommendations | ✅ |
| **Holistic Alchemy** | Evidence-based interventions for depression, anxiety, sleep, OCD, PTSD | ✅ |
| **Atom Economy** | Process optimization principles applied to personal development | ✅ |
| **Video** | On-camera practice with reflection prompts for self-expression | ✅ |

### AI Coaching

Integrated AI coach provides:
- Personalized feedback on exercises
- Context-aware suggestions based on your data
- Motivation and accountability
- Integration across all modules

### Progress Tracking

- Real-time progress across all modules
- Wellness streak counter
- 30-day statistics for sleep, mood, energy
- Module completion tracking

## 🏗️ Architecture

```
organic-os/
├── apps/
│   ├── web/                    # Next.js 14 Frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   ├── auth/             # Authentication
│   │   │   │   ├── dashboard/        # Main dashboard
│   │   │   │   ├── identity/         # Module pages
│   │   │   │   ├── wellness/
│   │   │   │   ├── holistic-alchemy/
│   │   │   │   └── ...
│   │   │   ├── components/    # Reusable components
│   │   │   │   └── ui/              # UI kit (Card, Button, etc.)
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   ├── useAuth.ts        # Authentication
│   │   │   │   └── useProgress.ts    # Progress tracking
│   │   │   └── lib/           # Utilities
│   │   │       ├── utils.ts          # Helper functions
│   │   │       └── supabase/         # Supabase client
│   │   ├── tests/             # Vitest tests
│   │   └── package.json
│   │
│   └── api/                    # FastAPI Backend
│       ├── routes/            # API endpoints
│       │   ├── auth.py              # Authentication
│       │   ├── wellness.py          # Wellness tracking
│       │   ├── progress.py          # Progress monitoring
│       │   ├── modules.py           # Module data
│       │   └── ai.py                # AI coaching
│       ├── tests/            # Pytest tests
│       ├── requirements.txt
│       └── main.py
│
├── docs/                       # Documentation
├── SUPABASE_SETUP.md           # Database setup
├── TESTING.md                  # Testing guide
├── CODE_QUALITY.md             # Code standards
├── Makefile                    # Development commands
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Supabase account
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS

# Install all dependencies
make install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# apps/api/.env (for production)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Development

```bash
# Run frontend dev server (http://localhost:3000)
make dev-web

# Run backend dev server (http://localhost:8000)
make dev-api

# Run all tests
make test

# Run linter
make lint
```

### Build for Production

```bash
# Build frontend
make build-web

# Backend (FastAPI) - run with gunicorn/uvicorn
cd apps/api
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API Documentation](API.md) | Complete API endpoint reference |
| [Database Schema](DATABASE.md) | Supabase schema and RLS policies |
| [Testing Guide](TESTING.md) | How to write and run tests |
| [Code Quality](CODE_QUALITY.md) | Coding standards and best practices |
| [Deployment](DEPLOYMENT.md) | Production deployment guide |

## 🧪 Testing

### Frontend Tests (Vitest)

```bash
cd apps/web

# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

### Backend Tests (Pytest)

```bash
cd apps/api

# Run all tests
pytest -v

# Run with coverage
pytest --cov=. --cov-report=term-missing
```

### CI/CD Pipeline

GitHub Actions runs on every push:
1. **Lint** - ESLint + flake8
2. **Frontend Test** - Vitest with coverage
3. **Backend Test** - Pytest with coverage
4. **Build** - Next.js production build
5. **Security** - npm audit + pip audit

## 📡 API Reference

### Base URL

```
Development: http://localhost:8000
Production:  https://api.organic-os.com
```

### Authentication

```bash
# Verify token
POST /api/v1/auth/verify
Content-Type: application/json
{"token": "jwt-token"}

# Get current user
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Wellness

```bash
# Get daily prompt
GET /api/v1/wellness/prompt

# Create wellness entry
POST /api/v1/wellness/entries
{"date": "2026-02-09", "sleep_hours": 7.5, "mood_score": 8}

# Get statistics
GET /api/v1/wellness/stats?user_id=xxx&days=30

# Get streak
GET /api/v1/wellness/streak?user_id=xxx
```

### Progress

```bash
# Get all progress
GET /api/v1/progress/modules?user_id=xxx

# Get module progress
GET /api/v1/progress/modules/identity?user_id=xxx

# Update progress
POST /api/v1/progress/modules
{"module_name": "identity", "progress_percentage": 50}

# Get overall summary
GET /api/v1/progress/summary?user_id=xxx
```

### Modules

```bash
# Get sensory exercises
GET /api/v1/modules/sensory/exercises/visual

# Assess burnout
POST /api/v1/modules/recovery/assess-burnout
{"exhaustion": 5, "cynicism": 4, "inefficacy": 3}

# Get video prompts
GET /api/v1/modules/video/prompts
```

### AI Coaching

```bash
# Chat with AI coach
POST /api/v1/ai/chat
{"message": "I'm feeling stressed", "module_name": "wellness"}

# Get module prompts
GET /api/v1/ai/prompts/identity
```

See [API.md](API.md) for complete documentation.

## 🗄️ Database

### Schema

Organic OS uses Supabase (PostgreSQL) with the following tables:

- `users` - User accounts
- `wellness_entries` - Daily wellness data
- `module_progress` - Progress per module
- `conversation_messages` - AI chat history

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only access their own data
- Admin service role bypasses RLS

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed schema.

## 🎨 UI Components

Available in `@/components/ui`:

| Component | Props | Usage |
|-----------|-------|-------|
| `Card` | variant, hover | Container with styling |
| `Button` | variant, size | Interactive button |
| `ProgressBar` | value, max, color | Progress indicator |
| `StatCard` | label, value, icon, trend | Statistics display |
| `Badge` | variant | Status label |
| `ModuleCard` | name, description, progress | Module navigation |
| `PromptCard` | prompt, category | Daily reflection |

```tsx
import { Card, Button, ProgressBar } from '@/components/ui'

export function MyComponent() {
  return (
    <Card>
      <ProgressBar value={75} />
      <Button variant="primary">Click me</Button>
    </Card>
  )
}
```

## 🔐 Security

- **Authentication**: Supabase Auth (email/password)
- **Authorization**: RLS policies on all tables
- **API Security**: CORS configured for allowed origins
- **Secrets**: Environment variables for sensitive data

### Security Checklist

- [ ] Never commit `.env` files
- [ ] Use RLS on all database tables
- [ ] Validate all inputs on API endpoints
- [ ] Use HTTPS in production
- [ ] Rotate service role keys periodically

## 📦 Deployment

### Vercel (Frontend)

1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Render/Railway (Backend)

1. Create Python service
2. Set environment variables
3. Deploy with gunicorn

### Supabase (Database)

1. Create new Supabase project
2. Run migrations from `apps/supabase/schema.sql`
3. Configure RLS policies

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes following [CODE_QUALITY.md](CODE_QUALITY.md)
4. Add tests for your changes
5. Run tests: `make test`
6. Commit: `git commit -m "feat(scope): description"`
7. Push: `git push origin feature/my-feature`
8. Create Pull Request

## 📄 License

MIT License - see LICENSE file.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icons

---

Built with ❤️ by Don Qui
