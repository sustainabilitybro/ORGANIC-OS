# Organic OS - Remaining Gaps

## ✅ Completed
- [x] PostgreSQL database on Contabo VPS (14 tables)
- [x] API routes for CRUD operations
- [x] Supabase auth hook (useAuth)
- [x] OAuth callback route
- [x] Nightly cron job
- [x] useProgress connected to PostgreSQL

## 🔴 Critical (Before Production)

### 1. Supabase Project Setup
**Owner: Jesse** (needs Supabase account access)
- Create project at https://supabase.com
- Run `supabase/00-auth-setup.sql` in SQL Editor
- Enable Email + Google OAuth providers
- Add redirect URLs

**Files ready:**
- `SUPABASE-SETUP.md` - Step-by-step guide
- `supabase/00-auth-setup.sql` - SQL to run

### 2. Vercel Environment Variables
**Owner: Jesse**
Add in Vercel Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://organic_user:organic_secure_2024!@209.126.1.127:5432/organic_os
```

### 3. Database Connection Test
Verify PostgreSQL is accessible:
```bash
PGPASSWORD=organic_secure_2024! psql -h 209.126.1.127 -U organic_user -d organic_os
```

## 🟡 Medium Priority

### 4. Middleware Auth Protection
**Missing:** `middleware.ts` to protect routes

Create `apps/web/src/middleware.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

### 5. User Sync to PostgreSQL
**Issue:** Supabase users aren't synced to PostgreSQL `users` table

Add trigger to Supabase or create API endpoint to sync on signup.

### 6. Module Pages Data Connection
**Modules using mock data:**
- `wellness/page.tsx` - Needs API calls
- `emotional/page.tsx` - Needs API calls
- `identity/page.tsx` - Needs API calls
- `sensory/page.tsx` - Needs API calls
- `recovery/page.tsx` - Needs API calls
- `communication/page.tsx` - Needs API calls
- `sustainability/page.tsx` - Needs API calls

## 🟢 Nice to Have

### 7. Google OAuth Setup
- Create project in Google Cloud Console
- Enable Google+ API
- Add OAuth credentials to Supabase

### 8. Email Templates
- Configure Supabase email templates
- Customize confirmation/password reset emails

### 9. Row Level Security
- Add RLS policies to PostgreSQL for user data isolation
- Currently: Public read access (dev mode)

### 10. Database Backups
- Set up pg_dump cron job
- Store backups in S3 or similar

## Testing Checklist

- [ ] Auth page loads and shows form
- [ ] Email sign up sends confirmation
- [ ] Email sign in works
- [ ] Google OAuth redirects properly
- [ ] Dashboard shows user data
- [ ] API routes return data from PostgreSQL
- [ ] Cron job runs successfully
- [ ] Vercel deployment succeeds

## Quick Wins (Can Do Now)

1. **Test PostgreSQL connection:**
   ```bash
   sshpass -p 'dPsXuPA4D7s9L^L4' psql -h 209.126.1.127 -U organic_user -d organic_os -c "SELECT COUNT(*) FROM users;"
   ```

2. **Check cron job:**
   ```bash
   crontab -l
   ```

3. **Verify API routes exist:**
   - `/api/mood_entries`
   - `/api/user_progress`
   - etc.
