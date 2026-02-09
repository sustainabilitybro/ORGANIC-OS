# Supabase Setup Guide for Organic OS

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Get your project URL and anon key

## Quick Setup

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
cd organic-os
supabase link --project-ref your-project-id

# Push the schema
supabase db push

# Start local development
supabase start
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `apps/supabase/schema.sql`
4. Run the SQL

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Authentication Setup

### Email/Password (Enabled by Default)

The schema includes RLS policies for user data protection. Users can:
- Sign up with email/password
- Sign in with email/password
- Reset password via email

### Social Login (Optional)

To enable Google/GitHub login:

1. Go to Authentication → Providers in Supabase Dashboard
2. Enable Google and/or GitHub
3. Add your OAuth credentials
4. Update `hooks/useAuth.ts` if needed

## Row Level Security (RLS)

All tables have RLS enabled. Users can only access:
- Their own user profile
- Their own module progress
- Their own entries and data
- Their own AI conversations

## Database Schema Overview

### Core Tables
- `users` - User accounts
- `user_profiles` - Extended profile data

### Module Tables
- `module_progress` - Progress tracking per module
- `user_entries` - Journal entries, reflections, exercises
- `core_values` - Identity module values
- `life_purpose` - Identity module purpose drafts
- `emotions_journal` - Emotional tracking
- `sensory_profile` - Sensory preferences
- `wellness_tracker` - Daily wellness metrics
- `wellness_goals` - Wellness objectives
- `burnout_assessments` - Burnout risk tracking
- `stress_log` - Stress event logging
- `speaking_goals` - Communication goals
- `speech_practice` - Practice sessions

### AI Tables
- `ai_conversations` - AI chat history
- `ai_messages` - Individual messages

## Testing Locally

1. Start Supabase local:
```bash
supabase start
```

2. Access local dashboard:
```
http://localhost:54321
```

3. Test authentication and data operations

## Deployment to Production

1. Set environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Run schema in production database:
   - Use Supabase Dashboard SQL Editor, OR
   - Run `supabase db push --env-url supabase-production-url`

3. Test authentication flow

## Troubleshooting

### "RLS Policy Denied Access"
- Ensure user is logged in
- Check that user_id matches auth.uid()
- Verify RLS policies are enabled

### "Session Invalid"
- Check environment variables
- Verify Supabase URL format (https://xxx.supabase.co)
- Ensure anon key is correct

### CORS Errors
- Add localhost to Supabase allowed origins
- For production, add your domain

## Database Migrations

For production changes:

1. Create migration:
```bash
supabase migration new your_migration_name
```

2. Edit the migration file

3. Push to production:
```bash
supabase db push
```

## Backup and Restore

```bash
# Backup
supabase db dump > backup.sql

# Restore
supabase db reset
```
