# Deployment Guide - March 2026

## Current Status
- **GitHub**: ✅ Pushed and synced
- **Vercel**: ⏳ Requires credentials
- **Supabase**: ⏳ Requires project creation

## Vercel Deployment (Recommended)

### Option 1: GitHub Integration (Easiest)
1. Go to https://vercel.com/new
2. Import from GitHub: `sustainabilitybro/ORGANIC-OS`
3. Framework Preset: Next.js
4. Build Command: `npm run build` (or `npm run build:web`)
5. Output Directory: `apps/web/.next` or `.next`
6. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` (after Supabase setup)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (after Supabase setup)
7. Deploy!

### Option 2: Vercel CLI
```bash
npm i -g vercel
cd ORGANIC-OS
vercel login
vercel --prod
```

## Supabase Setup

### Step 1: Create Project
1. Go to https://supabase.com/dashboard
2. Create new project: "organic-os"
3. Wait for provisioning (2-3 minutes)

### Step 2: Get Credentials
From project Settings > API:
- Project URL: `https://xxx.supabase.co`
- anon public key: `eyJxxx`

### Step 3: Push Schema
```bash
# Install Supabase CLI
npm i -g supabase

# Link to project
supabase link --project-ref <project-ref>

# Push schema
supabase db push

# Or use the migration directly
psql -h db.<project-ref>.supabase.co -U postgres -f supabase/migrations/001_initial_schema.sql
```

### Step 4: Add to Vercel
Add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: https://xxx.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: eyJxxx

## Environment Variables

Create `.env.local`:
```bash
# Supabase (after setup)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx

# Optional: GitHub token for higher API limits
GITHUB_TOKEN=ghp_xxx
```

## Verify Deployment

After deployment, verify:
- [ ] Homepage loads at /
- [ ] GitHub dashboard at /github works
- [ ] Atom economy page at /atom-economy works
- [ ] Holistic alchemy page at /holistic-alchemy works
- [ ] API endpoints respond correctly
