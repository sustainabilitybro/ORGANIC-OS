# Deployment Credentials Guide

This document outlines the credentials needed for deploying Organic OS to production.

## Required Credentials

### 1. Supabase (Database & Auth)

**Create a Supabase project:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note the following from Settings > API:
   - Project URL
   - `service_role` key (keep secret!)
   - `anon` public key

**Environment variables:**
```bash
# Production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Keep secret!

# Frontend
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**CLI commands:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 2. Vercel (Frontend Hosting)

**Deploy via GitHub:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

**Environment variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**CLI commands:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. GitHub (CI/CD)

**Create a Personal Access Token:**
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic) with:
   - `repo` (full control)
   - `workflow` (update workflows)

**Add to GitHub Secrets:**
- Go to Repository Settings > Secrets
- Add `VERCEL_TOKEN`
- Add `VERCEL_ORG_ID`
- Add `VERCEL_PROJECT_ID`

### 4. Optional: Weather API

**OpenWeatherMap:**
1. Sign up at [openweathermap.org](https://openweathermap.org)
2. Get free API key

**Environment variable:**
```bash
OPENWEATHER_API_KEY=your-key
```

## Quick Setup Checklist

- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Get Supabase credentials
- [ ] Configure Vercel environment
- [ ] Deploy frontend
- [ ] Test authentication
- [ ] Set up custom domain (optional)

## Security Notes

1. **Never commit credentials to Git**
2. Use environment variables, not hardcoded values
3. Rotate secrets regularly
4. Use separate credentials for dev/staging/prod
5. Enable 2FA on all accounts

## Troubleshooting

### "No valid credentials"
- Ensure `.env.local` is properly configured
- Check that Supabase project is active

### "Database connection failed"
- Verify `DATABASE_URL` format
- Check Supabase project status

### "Authentication not working"
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check that site URL is configured in Supabase

## Support

- **Supabase:** https://supabase.com/docs
- **Vercel:** https://vercel.com/docs
- **GitHub Actions:** https://docs.github.com/en/actions
