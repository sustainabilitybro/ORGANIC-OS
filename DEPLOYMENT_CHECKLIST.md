# Organic OS Deployment Checklist

## Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Linting passes (`npm run lint`)
- [ ] Environment variables configured

## Required Environment Variables

### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Optional
```
MINIMAX_API_KEY=your-minimax-key
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Go to https://vercel.com
2. Import repository: `sustainabilitybro/ORGANIC-OS`
3. Configure environment variables
4. Deploy

### Option 2: Docker
```bash
./scripts/deploy.sh docker
```

### Option 3: Render
```bash
./scripts/deploy.sh render
```

## Post-Deployment

- [ ] Verify health endpoint: `/api/health`
- [ ] Check stats endpoint: `/api/stats`
- [ ] Test authentication flow
- [ ] Verify all modules load
- [ ] Check GitHub dashboard: `/github`
- [ ] Verify sitemap: `/sitemap.xml`
- [ ] Test PWA functionality

## Monitoring

- Check Vercel Analytics (if enabled)
- Monitor error logs
- Check API response times

## Rollback Plan

If issues occur:
1. Vercel: Use the "Deployments" tab to rollback
2. Docker: Pull previous image tag
3. Render: Use the dashboard to rollback

## Support

- GitHub Issues: https://github.com/sustainabilitybro/ORGANIC-OS/issues
- Documentation: https://github.com/sustainabilitybro/ORGANIC-OS#readme
