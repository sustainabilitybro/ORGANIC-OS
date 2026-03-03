# Deployment Credentials Guide

This document outlines the credentials needed to complete the deployment of Organic OS.

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| GitHub Repository | ✅ Deployed | https://github.com/sustainabilitybro/ORGANIC-OS |
| Build & Tests | ✅ Passing | 183 tests, 0 lint errors |
| Supabase | ⏳ Needs Credentials | Schema ready, needs project |
| Vercel | ⏳ Needs Credentials | Workflow ready, needs token |

## Supabase Setup

### Required Credentials
1. **SUPABASE_PROJECT_ID** - Your Supabase project ID
2. **SUPABASE_URL** - Your project URL (e.g., https://xxxxx.supabase.co)
3. **SUPABASE_ANON_KEY** - Anonymous key from Supabase dashboard

### Setup Steps

1. Create a Supabase project:
   ```bash
   supabase project create organic-os
   ```

2. Get your credentials from Supabase Dashboard → Settings → API

3. Link your local project:
   ```bash
   supabase link --project-id YOUR_PROJECT_ID
   ```

4. Push the database schema:
   ```bash
   supabase db push
   ```

5. Add credentials to `.env.local`:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Vercel Deployment

### Required Secrets (GitHub Repository Settings)

Add these secrets to your GitHub repository:

1. **VERCEL_TOKEN** - Get from https://vercel.com/account/tokens
2. **VERCEL_ORG_ID** - Found in Vercel project settings
3. **VERCEL_PROJECT_ID** - Found in Vercel project settings

### Alternative: Direct Vercel CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd apps/web
vercel --prod
```

## Already Integrated

The following repositories are already integrated into Organic OS:
- atom-economy: https://github.com/sustainabilitybro/atom-economy
- Holistic-Alchemy: https://github.com/sustainabilitybro/Holistic-Alchemy

## Quick Test Commands

```bash
# Build the project
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Start development server
npm run dev
```
