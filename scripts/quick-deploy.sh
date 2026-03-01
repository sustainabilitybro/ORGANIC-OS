#!/bin/bash
# Organic OS - Quick Deploy to Render/Railway
# This script prepares the app for deployment to alternative hosts

set -e

echo "🚀 Quick Deploy Script"
echo "======================"

# Check for required files
if [ ! -f "apps/web/package.json" ]; then
    echo "Error: Must run from ORGANIC-OS root"
    exit 1
fi

# Build the app
echo "Building..."
cd apps/web
npm run build

# Create deployment package
echo "Creating deployment package..."
cd ../..
mkdir -p deploy
cp -r apps/web/out deploy/ 2>/dev/null || cp -r apps/web/.next deploy/ 2>/dev/null || true

echo "✅ Build complete!"
echo ""
echo "Deploy options:"
echo "1. Vercel: npx vercel --prod"
echo "2. Railway: Connect GitHub repo"
echo "3. Render: Connect GitHub repo"
echo ""
echo "See DEPLOYMENT_FULL_GUIDE.md for details"
