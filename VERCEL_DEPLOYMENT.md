# Vercel Deployment - Blocker Documentation

**Date:** February 8th, 2026
**Status:** BLOCKED - Requires Vercel Authentication

## What Needs to Happen

### Option 1: Vercel CLI Login
```bash
cd /root/.openclaw/workspace/organic-os

# Login to Vercel (opens browser)
npx vercel login

# Deploy to production
npx vercel --prod
```

### Option 2: Manual via Vercel Dashboard
1. Go to https://vercel.com
2. Sign in / Create account (GitHub recommended)
3. Import repository: `sustainabilitybro/ORGANIC-OS`
4. Configure project settings (Next.js preset)
5. Deploy to production

## Project Configuration
Already configured in `.vercel/`:
- **Project ID:** `prj_0XqSq25LAG3fmwpmz5Z7ohcRPSmw`
- **Organization ID:** `team_WlP2I2cuDT5CvhvFwarJEA1r`
- **Project Name:** `organic-os`

## After Deployment
Update `.env.local` with:
```
NEXT_PUBLIC_APP_URL=https://organic-os.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment URLs (after completion)
- Production: https://organic-os.vercel.app
- Preview: https://organic-os-git-*.vercel.app
