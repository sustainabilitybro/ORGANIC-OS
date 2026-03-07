#!/bin/bash
# Organic OS Deployment Script
# Supports multiple deployment targets

set -e

echo "🚀 Organic OS Deployment Script"
echo "================================="

# Parse arguments
DEPLOY_TARGET=${1:-vercel}
ENVIRONMENT=${2:-production}

echo "Target: $DEPLOY_TARGET"
echo "Environment: $ENVIRONMENT"

case $DEPLOY_TARGET in
  vercel)
    echo ""
    echo "📦 Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    vercel login
    vercel --prod
    ;;
    
  docker)
    echo ""
    echo "🐳 Building Docker image..."
    
    docker build -t organic-os:latest .
    docker tag organic-os:latest sustainabilitybro/organic-os:latest
    
    echo "Pushing to registry..."
    docker push sustainabilitybro/organic-os:latest
    ;;
    
  render)
    echo ""
    echo "☁️ Deploying to Render..."
    
    # Using render-cli
    render deploy --service organic-os --env production
    ;;
    
  *)
    echo "❌ Unknown deployment target: $DEPLOY_TARGET"
    echo ""
    echo "Usage: ./scripts/deploy.sh [vercel|docker|render] [environment]"
    exit 1
    ;;
esac

echo ""
echo "=================================================="
echo "✅ Deployment complete!"
echo "=================================================="
