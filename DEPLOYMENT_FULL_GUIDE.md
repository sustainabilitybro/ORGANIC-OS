# Organic OS - Complete Deployment Guide

**Last Updated:** March 1st, 2026

This guide covers deploying Organic OS to production using Vercel (frontend) and Supabase (database).

---

## Prerequisites

- Node.js 20+
- npm or yarn
- GitHub account
- Vercel account
- Supabase account

---

## Quick Start

### Option 1: Vercel CLI (Recommended)

```bash
# Clone the repository
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS

# Install dependencies
npm install

# Login to Vercel
npx vercel login

# Deploy to production
cd apps/web
npx vercel --prod
```

### Option 2: GitHub Integration

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `apps/web/.next`
4. Deploy

---

## Supabase Setup

### Creating a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in details:
   - Name: `organic-os`
   - Database Password: (strong password, save it!)
   - Region: (choose closest to your users)
4. Wait for project to provision (1-2 minutes)

### Running Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
cd ORGANIC-OS
supabase link --project-ref YOUR_PROJECT_REF

# Push the schema
supabase db push
```

### Getting Credentials

1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key

---

## Environment Variables

Create `.env.local` in `apps/web/`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App
NEXT_PUBLIC_APP_URL=https://organic-os.vercel.app
```

For Vercel, add these in Project Settings → Environment Variables.

---

## GitHub Actions (CI/CD)

The repository includes GitHub Actions workflows for automated deployment.

### Required Secrets

Add these in GitHub Repo → Settings → Secrets:

| Secret | Where to Find |
|--------|--------------|
| `VERCEL_TOKEN` | Vercel Dashboard → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel Project → Settings → General |
| `VERCEL_PROJECT_ID` | Vercel Project → Settings → General |

### Workflows

- `ci.yml` - Runs tests on PR
- `vercel-deploy.yml` - Deploys to Vercel on push to main

---

## Post-Deployment

### Verify Deployment

1. Check Vercel deployment URL
2. Test authentication flow
3. Verify API endpoints work
4. Check database connections

### Custom Domain (Optional)

1. Go to Vercel Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check Node version matches 20+ |
| 500 errors | Verify Supabase credentials in .env |
| Auth not working | Check Supabase URL and anon key |
| Missing tables | Run `supabase db push` |

### Getting Help

- Check GitHub Issues
- Review Vercel deployment logs
- Check Supabase query logs

---

## Architecture

```
┌─────────────┐     ┌──────────────┐
│   Vercel    │────▶│  Next.js    │
│  (Frontend) │     │   Web App    │
└─────────────┘     └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Supabase   │
                    │  (Database   │
                    │  & Auth)     │
                    └──────────────┘
```

---

## Monitoring

- Vercel Dashboard → Deployment Status
- Supabase Dashboard → Database Metrics
- GitHub Actions → CI/CD Status
