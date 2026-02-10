#!/bin/bash

# Organic OS Nightly Deployment Script
# Runs daily at 3:00 AM

set -e

echo "=== Organic OS Nightly Deployment ==="
echo "Started at: $(date)"

# Change to project directory
cd /root/.openclaw/workspaces/workflows/bug-fix/agents/triager/ORGANIC-OS

# Pull latest changes
echo "📥 Pulling latest changes..."
git fetch origin bugfix/deployment-issues
git checkout bugfix/deployment-issues
git pull origin bugfix/deployment-issues

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build project
echo "🔨 Building project..."
npm run build

# Optional: Deploy to Vercel (uncomment if using Vercel CLI)
# echo "🚀 Deploying to Vercel..."
# npx vercel --prod --token=$VERCEL_TOKEN

echo ""
echo "=== Deployment Complete ==="
echo "Finished at: $(date)"
