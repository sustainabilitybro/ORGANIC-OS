# Deployment Guide

This guide covers deploying Organic OS to production.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Production Stack                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│   │   Vercel     │    │   Render/    │    │   Supabase   │ │
│   │  (Frontend)  │───▶│  Railway     │    │  (Database)  │ │
│   │  Next.js 14  │    │  (Backend)   │    │  PostgreSQL  │ │
│   └──────────────┘    │  FastAPI     │    └──────────────┘ │
│                       └──────────────┘                     │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐ │
│   │              Cloudflare CDN (Static Assets)          │ │
│   └──────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- GitHub account
- Vercel account
- Supabase account
- Domain name (optional)

---

## Step 1: Database Setup (Supabase)

### Create Project

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Configure:
   - **Name**: `organic-os`
   - **Database Password**: Generate secure password
   - **Region**: Choose closest to your users

### Apply Schema

```bash
# Using Supabase CLI
supabase link --project-ref your-project-ref
supabase db push

# Or via Dashboard
# 1. Go to SQL Editor
# 2. Copy contents of apps/supabase/schema.sql
# 3. Run the SQL
```

### Get Credentials

From Supabase Dashboard → Settings → API:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
```

---

## Step 2: Frontend Deployment (Vercel)

### Connect Repository

1. Go to [Vercel](https://vercel.com)
2. Click "Add New..." → Project
3. Select `sustainabilitybro/ORGANIC-OS`
4. Configure:

**Framework Preset**: Next.js

**Build Command**:
```bash
npm run build --workspace=apps/web
```

**Install Command**:
```bash
npm install --workspace=apps/web
```

**Output Directory**: `.next`

### Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Deploy

Vercel automatically deploys on push to main.

Manual deploy:
```bash
vercel --prod
```

### Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

## Step 3: Backend Deployment (Render/Railway)

### Option A: Render

1. Create [Render](https://render.com) account
2. New Web Service
3. Connect GitHub repository
4. Configure:

**Build Command**:
```bash
pip install -r apps/api/requirements.txt
```

**Start Command**:
```bash
gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:$PORT apps/api.main:app
```

**Environment Variables**:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PYTHON_VERSION=3.11
```

### Option B: Railway

1. Create [Railway](https://railway.app) account
2. New Project → Deploy from GitHub repo
3. Configure start command in `railway.json`:

```json
{
  "$schema": "https://railway.app/schema.json",
  "build": {
    "nixpacks": "pip_requirements"
  },
  "deploy": {
    "startCommand": "gunicorn -w 4 -b 0.0.0.0:$PORT apps/api.main:app"
  }
}
```

### Environment Variables

Set in Railway Dashboard → Variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Health Check

Render/Railway will check `/api/v1/health` endpoint.

---

## Step 4: API Documentation (Swagger UI)

FastAPI provides auto-generated documentation.

**Development**: http://localhost:8000/docs

**Production**: https://api.your-domain.com/docs

---

## Step 5: Update Frontend API URL

In Vercel environment variables, add:

```bash
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

Update API client to use this URL:

```typescript
// apps/web/src/lib/supabase/client.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

---

## Security Checklist

### Environment Variables

- [ ] Never commit `.env` files
- [ ] Use different keys for dev/prod
- [ ] Rotate service role keys periodically

### Database

- [ ] RLS enabled on all tables
- [ ] No public read access
- [ ] Regular backups enabled

### API

- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] HTTPS enforced

### Monitoring

- [ ] Error logging configured
- [ ] Uptime monitoring set up
- [ ] Alerting enabled

---

## Troubleshooting

### Build Fails

```bash
# Check build locally
cd apps/web
npm run build

# Common issues:
# - Missing dependencies → npm install
# - TypeScript errors → npm run lint
# - Memory limits → Use CI with more RAM
```

### 502 Bad Gateway

- Backend not running → Check service status
- Wrong port → Ensure `$PORT` is used
- Timeout → Increase timeout in platform settings

### CORS Errors

Update CORS in FastAPI:

```python
# apps/api/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Connection Failed

- Verify credentials in environment variables
- Check Supabase project status
- Ensure IP allowlist includes deployment region

---

## Scaling

### Vercel (Frontend)

- **Pro Plan**: More bandwidth, analytics
- **Team Plan**: Collaboration features

### Render (Backend)

- **Instance Type**: Increase for more CPU/RAM
- **Scale**: Auto-scale based on traffic

### Supabase (Database)

- **Project Tier**: Upgrade for more resources
- **Connection Pooling**: Enable for high concurrency

---

## Monitoring

### Health Checks

```bash
# Frontend
curl -I https://your-domain.com

# Backend
curl https://api.your-domain.com/api/v1/health
```

### Uptime Monitoring

Use:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

---

## Rollback Procedure

### Frontend (Vercel)

1. Vercel Dashboard → Deployments
2. Select previous deployment
3. Click "Deploy"

### Backend (Render/Railway)

1. Dashboard → Deployments
2. Select previous version
3. Redeploy

### Database

```bash
# Restore from backup
psql -d organic_os -f backup_2026-02-09.sql
```

---

## Cost Estimation

| Service | Free Tier | Paid (Approx) |
|---------|-----------|---------------|
| Vercel | 100GB bandwidth | $20+/month |
| Supabase | 500MB DB, 2GB bandwidth | $25+/month |
| Render | 750 hours | $7+/month |
| Domain | $12/year | $12/year |

**Total**: ~$50-100/month for moderate usage
