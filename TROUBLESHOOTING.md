# Troubleshooting Guide

## Common Issues

### Build Errors

#### "Module not found"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### "TypeScript errors"
```bash
# Check TypeScript version
npx tsc --version

# Run type check
cd apps/web
npx tsc --noEmit
```

### Runtime Errors

#### "Connection refused" to backend
- Check if backend is running on port 8000
- Verify CORS settings
- Check firewall rules

#### "Database connection failed"
- Verify Supabase credentials in .env.local
- Check network connectivity
- Verify project is active in Supabase dashboard

#### "Authentication not working"
- Check NEXT_PUBLIC_SUPABASE_URL
- Verify SUPABASE_ANON_KEY
- Check browser console for CORS errors

### Deployment Issues

#### Vercel deployment fails
- Verify VERCEL_TOKEN in GitHub secrets
- Check build logs in Vercel dashboard
- Ensure .vercel directory is committed

#### "Page not found" after deployment
- Rebuild: `npm run build`
- Check _redirects file for SPA routing
- Verify basePath in next.config.js

## Getting Help

1. Check [GitHub Issues](https://github.com/sustainabilitybro/ORGANIC-OS/issues)
2. Review deployment logs
3. Contact: don@altlaboratories.com

## Debug Mode

Enable debug logging:
```bash
# Frontend
NEXT_PUBLIC_DEBUG=true

# Backend  
DEBUG=true
```
