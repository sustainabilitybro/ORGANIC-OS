# Organic OS - Deployment Guide

**Complete deployment instructions for all environments.**

---

## Table of Contents
1. [Quick Deploy](#quick-deploy)
2. [Manual Deployment](#manual-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [CI/CD Setup](#cicd-setup)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Quick Deploy

### Frontend (Vercel)

```bash
cd apps/web

# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Backend (Render/Railway)

```bash
# Connect your GitHub repo
# Set environment variables in dashboard
# Deploy automatically on push
```

---

## Manual Deployment

### Prerequisites

- Node.js 20+
- Python 3.11+
- Git
- Supabase account

### 1. Clone Repository

```bash
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS
```

### 2. Frontend Setup

```bash
cd apps/web

# Install dependencies
npm install

# Create environment file
cp ../../.env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev

# Build for production
npm run build
```

### 3. Backend Setup

```bash
cd apps/api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: .\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp ../../.env.example .env
# Edit .env with your values

# Start development server
uvicorn main:app --reload

# Production server
gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:$PORT main:app
```

---

## Docker Deployment

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

```bash
# Backend only
docker build -t organic-os-backend --target backend .
docker run -p 8000:8000 organic-os-backend

# Frontend only
docker build -t organic-os-frontend --target frontend .
docker run -p 3000:80 organic-os-frontend
```

### Production Build

```bash
# Build production image
docker build -t organic-os:latest .

# Run production
docker run -d -p 80:80 organic-os:latest
```

---

## Environment Variables

### Required

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Optional

```bash
# API Keys
OPENWEATHER_API_KEY=your-key
NEWS_API_KEY=your-key

# App Settings
ENVIRONMENT=production
SECRET_KEY=your-secret-key
```

### Environment File Example

```bash
# .env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_API_URL=http://localhost:8000
ENVIRONMENT=development
```

---

## Database Setup

### Supabase (Recommended)

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run contents of `apps/supabase/schema.sql`
4. Enable Row Level Security

### Local PostgreSQL

```bash
# Create database
psql -c "CREATE DATABASE organic_os;"

# Run migrations
psql -d organic_os -f apps/supabase/schema.sql
```

---

## CI/CD Setup

### GitHub Actions

1. Go to GitHub → Settings → Secrets
2. Add secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VERCEL_TOKEN` (for frontend deploy)
   - `RENDER_API_KEY` (for backend deploy)

3. Push to `main` branch
4. GitHub Actions will:
   - Run tests
   - Run linters
   - Deploy to staging (develop branch)
   - Deploy to production (main branch)

### Manual CI/CD

```bash
# Run tests
cd apps/api && pytest test_api.py -v
cd apps/web && npm test

# Run linters
cd apps/api && flake8 .
cd apps/web && npm run lint

# Build production
cd apps/web && npm run build
cd apps/api && docker build -t organic-os-api .
```

---

## Monitoring

### Health Checks

```bash
# Check API health
curl https://your-api.com/api/v1/health

# Check database
curl https://your-api.com/api/v1/ready

# Performance metrics
curl https://your-api.com/api/v1/performance/metrics
```

### Logging

- Backend logs: Check Render/Railway dashboard
- Frontend errors: Check Vercel Analytics
- Database: Check Supabase logs

### Performance Monitoring

```bash
# Get performance metrics
curl https://your-api.com/api/v1/performance/metrics

# Get cache stats
curl https://your-api.com/api/v1/performance/cache/stats

# Clear cache (if needed)
curl -X POST https://your-api.com/api/v1/performance/cache/clear
```

---

## Troubleshooting

### Backend Issues

| Problem | Solution |
|---------|----------|
| 500 Internal Error | Check logs: `docker-compose logs backend` |
| Database connection failed | Verify `SUPABASE_URL` and keys |
| CORS errors | Check `ALLOWED_ORIGINS` environment variable |
| Memory issues | Increase container size in Render/Railway |

### Frontend Issues

| Problem | Solution |
|---------|----------|
| Build failed | Check `npm install` completed |
| API not connecting | Verify `NEXT_PUBLIC_API_URL` |
| Auth not working | Check Supabase keys in `.env` |
| Slow load times | Enable Vercel Analytics |

### Common Solutions

```bash
# Restart containers
docker-compose down && docker-compose up -d

# Clear cache
curl -X POST http://localhost:8000/api/v1/performance/cache/clear

# Rebuild containers
docker-compose build --no-cache

# Check environment
docker-compose exec backend env | grep -E "SUPABASE|ENV"
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] API keys in environment variables
- [ ] Supabase RLS policies enabled
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Error details not exposed to users
- [ ] Regular dependency updates

---

## Scaling

### Vercel (Frontend)

- Upgrade to Pro for more bandwidth
- Add custom domain
- Enable Edge Functions for faster response

### Render/Railway (Backend)

- Scale to larger instance type
- Add read replicas for database
- Enable auto-scaling

### Supabase

- Upgrade plan for more resources
- Add connection pooling
- Enable database backups

---

## Performance Optimization

### Frontend

```bash
# Analyze bundle size
cd apps/web
npm run build && npm run analyze

# Enable compression
# Vercel does this automatically
```

### Backend

```bash
# Enable caching
curl -X POST http://localhost:8000/api/v1/performance/cache/clear

# Check performance metrics
curl http://localhost:8000/api/v1/performance/health
```

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
psql -d organic_os -f backup_YYYY-MM-DD.sql
```

---

## Support

- **Issues**: [GitHub Issues](https://github.com/sustainabilitybro/ORGANIC-OS/issues)
- **Documentation**: [docs/COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md)
- **API Docs**: `/docs` when running locally
