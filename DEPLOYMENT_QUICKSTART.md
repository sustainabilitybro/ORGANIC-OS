# 🚀 Vercel Deployment - Quick Start

## GitHub Actions Already Configured!

Your repository has automatic Vercel deployment set up in `.github/workflows/ci-cd.yml`.

### What's Needed: Vercel Secrets

Add these secrets to your GitHub repository:

1. **Go to:** https://github.com/sustainabilitybro/ORGANIC-OS/settings/secrets/actions

2. **Add these secrets:**

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `VERCEL_TOKEN` | Your Vercel token | https://vercel.com/settings/tokens |
| `VERCEL_ORG_ID` | Your organization ID | `vercel inspect` or Vercel dashboard |
| `VERCEL_PROJECT_ID` | Your project ID | `vercel inspect` or Vercel dashboard |

---

## Quick Setup (5 minutes)

### Step 1: Get Vercel Token

1. Go to https://vercel.com/settings/tokens
2. Click "Create Token"
3. Name: "GitHub Actions"
4. Scope: Select your account
5. Copy the token

### Step 2: Get Project IDs

Run in terminal:
```bash
cd apps/web
npx vercel inspect
```

Or manually:
1. Go to Vercel Dashboard → Your Project → Settings
2. Copy "Project ID" and "Organization ID"

### Step 3: Add Secrets to GitHub

1. Go to: https://github.com/sustainabilitybro/ORGANIC-OS/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret from Step 1 & 2

---

## Alternative: Manual Deploy (Quick)

### Install Vercel CLI

```bash
npm i -g vercel
```

### Login & Deploy

```bash
cd apps/web
vercel login
vercel --prod
```

---

## After Secrets Are Added

GitHub Actions will automatically deploy:

- **Push to main** → Production deploy
- **Pull request** → Preview deploy

Watch deployments: https://github.com/sustainabilitybro/ORGANIC-OS/actions

---

## Deployment Commands

### Manual Deploy
```bash
cd apps/web
vercel --prod
```

### Preview Deploy
```bash
cd apps/web
vercel
```

### Check Status
```bash
vercel ls
```

---

## Troubleshooting

### "VERCEL_TOKEN not set"
→ Add the secret in GitHub repository settings

### Build fails
→ Check GitHub Actions logs for errors

### "Project not found"
→ Run `npx vercel link` in apps/web directory

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- GitHub Actions: https://docs.github.com/en/actions
