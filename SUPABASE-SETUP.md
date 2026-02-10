# Supabase Setup Guide for Organic OS

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Select your organization
4. Fill in:
   - Name: `organic-os`
   - Database Password: (generate strong password)
5. Wait for project creation (~2 minutes)

## Step 2: Get Credentials

Go to **Settings → API** and copy:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Run SQL Setup

Go to **SQL Editor** and run the contents of:
- `supabase/00-auth-setup.sql`

## Step 4: Enable Auth Providers

Go to **Authentication → Providers**:

### Email/Password
- Provider: Email
- Enabled: ✅
- Confirm email: ✅ (or ❌ for dev)

### Google OAuth
- Provider: Google
- Enabled: ✅
- Client ID: (from Google Cloud Console)
- Client Secret: (from Google Cloud Console)

### Redirect URLs (Authentication → URL Configuration)
Add:
- `https://your-project.supabase.co/auth/v1/callback`
- `https://organic-os.vercel.app/auth/callback`

## Step 5: Add Environment Variables to Vercel

Go to https://vercel.com/sustainabilitybro/ORGANIC-OS/settings/environment-variables

Add:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Sync Database (Optional)

If using Supabase as both auth AND database:
1. Copy schema from `supabase/schema.sql` to Supabase SQL Editor
2. Or use Supabase CLI: `supabase db push`

## Testing Auth

1. Deploy to Vercel
2. Go to `/auth`
3. Try sign up with email
4. Check "Authentication → Users" in Supabase dashboard

## Troubleshooting

### "Auth session missing"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify redirect URLs in Supabase

### CORS errors
- Add Vercel domain to Supabase (Authentication → URL Configuration)

### User not created in public.profiles
- Check trigger is enabled
- Run SQL manually
