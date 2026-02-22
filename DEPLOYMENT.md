# Organic OS Deployment Guide

## Quick Deploy to Vercel

### Option 1: GitHub Actions (Recommended)
1. Go to GitHub repository → Settings → Secrets
2. Add these secrets:
   - `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` - `team_WlP2I2cuDT5CvhvFwarJEA1r`
   - `VERCEL_PROJECT_ID` - `prj_0XqSq25LAG3fmwpmz5Z7ohcRPSmw`
3. Push to main → Auto-deploys

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel login
cd apps/web
vercel --prod
```

### Option 3: Manual Import
1. Go to https://vercel.com/new
2. Import from GitHub: sustainabilitybro/ORGANIC-OS
3. Set directory to: apps/web
4. Deploy

## Environment Variables

Required in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Supabase Setup

1. Create project at https://supabase.com
2. Run schema: `apps/supabase/schema.sql`
3. Add env vars to Vercel

## Current Status

- ✅ Code pushed to GitHub
- ✅ 29 API endpoints ready
- ⏳ Vercel deployment (needs token)
- ⏳ Supabase setup (needs project)
