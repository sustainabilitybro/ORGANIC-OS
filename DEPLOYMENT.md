# Organic OS - Deployment Guide

## Quick Deploy (2 minutes)

### 1. Get Vercel Token
Go to: https://vercel.com/settings/tokens
- Click "Create Token"
- Name: "Organic OS"
- Copy the token

### 2. Add Secrets to GitHub
1. https://github.com/sustainabilitybro/ORGANIC-OS/settings/secrets/actions
2. Add: `VERCEL_TOKEN` = your token

### 3. Done!
GitHub Actions will auto-deploy on next push.

---

## Manual Deploy (Vercel CLI)

```bash
cd apps/web
npm i -g vercel
vercel login
vercel --prod
```

---

## Environment Variables Needed

For production, set these in Vercel:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase URL |
| `SUPABASE_KEY` | Your Supabase anon key |
| `OPENCLAW_URL` | OpenClaw URL (optional) |
| `ENVIRONMENT` | production |

---

## Deploy Backend (Render/Railway)

1. Connect GitHub repo to Render/Railway
2. Root directory: `apps/api`
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn main:app`

---

## Database Setup (Supabase)

1. Create Supabase project
2. Run: `psql -f apps/supabase/schema.sql`
3. Add credentials to environment variables
