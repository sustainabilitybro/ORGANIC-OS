# Organic OS - Deployment Setup Guide

## Prerequisites
- Node.js 20+
- npm or yarn
- GitHub account
- Supabase account
- Vercel account (optional)

## Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### 3. Set up Supabase

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Apply Schema
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push schema
supabase db push
```

Or manually run the SQL in `supabase/migrations/001_initial_schema.sql`

#### Get Credentials
From Supabase dashboard:
- Project URL: Settings → API → Project URL
- Anon Key: Settings → API → Project API keys → anon public

### 4. Set up Vercel (Optional)

#### Option A: GitHub Integration
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

#### Option B: CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | For admin operations |
| `VERCEL` | Auto | Set by Vercel |
| `VERCEL_URL` | Auto | Set by Vercel |

## Features

### Current Features
- GitHub integration (repos, issues, commits, actions, events)
- Wellness tracking
- Identity module
- Emotional tracking
- Sensory profiles
- Recovery (burnout) module
- Communication module
- Analytics dashboard
- Data export/import

### Coming Soon
- AI-powered insights
- More integrations
- Mobile app

## Development

```bash
# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## License
MIT
