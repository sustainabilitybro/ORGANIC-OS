# Organic OS

The Operating System for Being Human.

## Vision

Organic OS is a unified personal development platform combining:
- **Identity** - Discover your authentic self
- **Sensory** - Explore and optimize your human senses  
- **Emotional** - Master emotional intelligence
- **Wellness** - Holistic health and vitality
- **Recovery** - Burnout prevention and stress management
- **Communication** - Master the art of expression

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |
| Database | PostgreSQL + PostgREST |
| Storage | Supabase Storage |
| AI | MiniMax (OpenAI-compatible API) |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

## Project Structure

```
organic-os/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/   # React components
│   │   │   ├── lib/         # Utilities
│   │   │   └── styles/      # Global styles
│   │   └── package.json
│   │
│   └── supabase/            # Supabase backend
│       ├── schema.sql       # Database schema
│       └── config.toml
│
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── database/            # Database utilities
│   └── ai-core/            # AI coaching logic
│
├── docs/                    # Documentation
├── .github/workflows/       # CI/CD
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sustainabilitybro/organic-os.git
cd organic-os
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. Set up Supabase:
```bash
# Create a new Supabase project
# Run the migration
supabase link --project-ref your-project-ref
npm run db:migrate

# Generate TypeScript types
npm run db:generate
```

5. Start development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate TypeScript types
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database

# Linting
npm run lint            # Run ESLint
```

## Modules

### 1. Identity Module
- Core values assessment
- Life purpose discovery
- Strengths & growth areas
- Boundaries & vision

### 2. Sensory Module
- 5 senses exploration
- Sensory diet planning
- Perception exercises

### 3. Emotional Module
- Emotion taxonomy
- Feeling identification
- Regulation strategies
- Emotional intelligence training

### 4. Wellness Module
- Holistic health tracking
- Nutrition & movement
- Stress management
- Sustainability habits

### 5. Recovery Module
- Burnout assessment
- Stress tracking
- Recovery protocols
- Habit sustainability

### 6. Communication Module
- Public speaking frameworks
- Speech writing
- Presentation skills
- Video practice + AI feedback

## AI Coach

Organic OS includes an AI-powered coach powered by MiniMax. The coach provides:
- Personalized guidance
- Module-specific advice
- Progress insights
- Motivation and support

### MiniMax API Integration

Organic OS uses MiniMax's OpenAI-compatible API for AI features:

```typescript
// AI Core Configuration
const minimax = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.io/v1',
})
```

**API Constraints:**
- **5-hour rolling window** for usage tracking
- 1 "prompt" ≈ 15 model calls (bundled for billing)
- Separate Coding Plan API Key required for autonomous development

## Autonomous Development

Organic OS supports autonomous development via Don Qui AI:

- **Schedule:** 3:00 AM UTC (configurable)
- **Quota Management:** Priority-based task execution
- **Reporting:** Morning reports via Telegram/Google Chat

### Nightly Build Protocol

See [NIGHTLY_BUILD.md](./NIGHTLY_BUILD.md) for full documentation.

```bash
# Check API quota
curl -X POST "https://www.minimax.io/v1/api/openplatform/coding_plan/remains" \
  -H "Authorization: Bearer $MINIMAX_CODING_KEY"

# Run nightly build
npm run nightly:build
```

### Priority System

| Priority | Task Type | Max Prompts |
|----------|-----------|-------------|
| P0 | Critical bugs | Unlimited |
| P1 | Core features | 40 |
| P2 | Enhancements | 25 |
| P3 | Nice-to-have | 15 |

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy!

```bash
vercel --prod
```

### Supabase

Set up Supabase for auth and database:
- Enable Authentication (Email/Password, Social providers)
- Set up Row Level Security policies
- Configure Storage buckets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Credits

Built by humans, for humans.

🤖 Powered by Don Qui AI
