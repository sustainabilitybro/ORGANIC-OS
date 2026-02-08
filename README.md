# Organic OS

The Operating System for Being Human.

## Vision

Organic OS is a unified personal development platform combining:
- **Identity** - Discover your authentic self
- **Sensory** - Explore and optimize your human senses  
- **Emotional** - Master emotional intelligence
- **Wellness** - Holistic health and vitality (powered by Naturopath)
- **Recovery** - Burnout prevention and stress management
- **Communication** - Master the art of expression

## Architecture

```
organic-os/
├── apps/
│   ├── web/              # Next.js 14 frontend (6 modules)
│   │   └── src/app/     # App Router pages
│   ├── api/              # FastAPI backend (from Naturopath)
│   │   └── app/         # SQLAlchemy models & routes
│   └── supabase/         # PostgreSQL schema with RLS
├── packages/
│   ├── ui/              # Shared UI components
│   ├── database/        # Database utilities
│   └── ai-core/         # MiniMax AI coaching
└── docs/
```

## Data Sources Integrated

| Source | Content | Module |
|--------|---------|--------|
| `naturopath/` | Evidence-based remedies database | Wellness |
| `github_repos/identity` | Identity Command Center HTML | Identity |
| `github_repos/emotional-mastery` | Emotion taxonomy HTML | Emotional |
| `github_repos/sensory-dictionary` | Sensory profile HTML | Sensory |
| `github_repos/speaker` | Speaking frameworks HTML | Communication |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Backend | FastAPI + SQLAlchemy |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |
| Database | PostgreSQL + PostgREST |
| AI | MiniMax (OpenAI-compatible API) |

## Quick Start

```bash
# Install dependencies
cd organic-os
npm install

# Set up environment
cp .env.example .env.local

# Start Supabase (or use cloud)
npx supabase start

# Run backend (FastAPI)
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload

# Run frontend (separate terminal)
cd apps/web
npm run dev
```

## Modules

### Wellness Module (Naturopath Integration)

The Wellness module is powered by the Naturopath evidence-based remedies database:

```typescript
// API Integration
import { useWellnessStore } from './wellness/store';

const { remedies, favorites, dailyProtocols } = useWellnessStore();
```

**Evidence Grading System:**
- Level 1: Strong Evidence (multiple large RCTs)
- Level 2: Good Evidence (large RCT)
- Level 3: Moderate Evidence
- Level 4: Limited Evidence
- Level 5: Traditional Use

### AI Coach

MiniMax-powered coaching for each module:

```typescript
import { generateCoachingResponse } from '@organic-os/ai-core';

const response = await generateCoachingResponse({
  module: 'emotional',
  context: userEntry,
  history: conversationHistory
});
```

## Autonomous Development

Organic OS supports autonomous development via Don Qui:

- **Schedule:** 3:00 AM UTC (cron configured)
- **Quota:** Priority-based task execution
- **Reporting:** Morning Telegram reports

### Cron Job

```bash
# Nightly build is active (job ID: 00f13ac9-0e77-434c-bc6b-1af6b8802b62)
oc cron list  # Verify status
```

## GitHub

**Status:** Pending PAT with `repo` scope for automatic pushes.

To push manually:
```bash
cd organic-os
git remote add origin https://github.com/sustainabilitybro/organic-os.git
git push -u origin main
```

## License

MIT

🤖 Powered by Don Qui AI
