# Deployment Checklist

This document outlines the steps required to deploy Organic OS to production.

## Prerequisites

- [ ] GitHub account with access to sustainabilitybro/ORGANIC-OS
- [ ] Vercel account (for frontend/API deployment)
- [ ] Supabase account (for database and authentication)
- [ ] LastPass access for API keys

## Step 1: Supabase Setup

1. Create a new Supabase project at https://supabase.com
   - Name: `organic-os`
   - Database password: Save to LastPass

2. Get credentials from Supabase dashboard:
   - Project URL (Settings → API)
   - `SUPABASE_ANON_KEY` (Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (Settings → API - be careful!)

3. Run database migrations:
   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

4. Add to GitHub Secrets:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_ANON_KEY`: Your anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (for admin operations)

## Step 2: Vercel Setup

1. Import the GitHub repository to Vercel:
   - Go to https://vercel.com/new
   - Select `sustainabilitybro/ORGANIC-OS`
   - Framework Preset: Next.js

2. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon key
   - `NEXT_PUBLIC_API_URL`: https://your-app.vercel.app (or API endpoint)
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

3. Add to GitHub Secrets:
   - `VERCEL_TOKEN`: From https://vercel.com/account/tokens
   - `VERCEL_ORG_ID`: From Vercel dashboard
   - `VERCEL_PROJECT_ID`: From Vercel project settings

## Step 3: Verify Deployment

1. Check that the web app loads at your Vercel URL
2. Test authentication flow
3. Verify API endpoints respond correctly
4. Check that database connections work

## Step 4: Post-Deployment

1. Update `NEXT_PUBLIC_API_URL` in Vercel/Settings if needed
2. Set up custom domain (optional)
3. Configure SSL certificates
4. Test all modules:
   - Identity
   - Sensory
   - Emotional
   - Wellness
   - Recovery
   - Communication

## Troubleshooting

### Build Failures
- Check that all environment variables are set
- Verify Node.js version (20+) compatibility
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify Supabase credentials are correct
- Check that migrations have run
- Ensure project URL is correct

### Authentication Problems
- Verify Supabase Auth settings
- Check redirect URLs in Supabase
- Ensure ANON_KEY is correctly configured

## Quick Deploy Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Deploy to Vercel (requires credentials)
npx vercel --prod

# Deploy via Docker
docker-compose up -d --build
```
