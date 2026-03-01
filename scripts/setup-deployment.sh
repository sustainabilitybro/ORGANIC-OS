#!/bin/bash
# Organic OS - Deployment Setup Script
# Run this script after obtaining credentials to complete deployment setup

set -e

echo "🚀 Organic OS Deployment Setup"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${YELLOW}Warning: $1 not found${NC}"
        return 1
    fi
    return 0
}

echo -e "\n${GREEN}Step 1: Checking prerequisites...${NC}"
check_tool node && echo "✓ Node.js"
check_tool npm && echo "✓ npm"
check_tool vercel && echo "✓ Vercel CLI"
check_tool supabase && echo "✓ Supabase CLI"

# Vercel Setup
echo -e "\n${GREEN}Step 2: Vercel Setup${NC}"
read -p "Do you have a Vercel account? (y/n): " has_vercel

if [ "$has_vercel" = "y" ]; then
    echo "Run: npx vercel login"
    echo "Then run: cd apps/web && npx vercel --prod"
    
    # Check for existing Vercel project
    if [ -d ".vercel" ]; then
        echo "✓ Vercel project already configured"
    fi
fi

# Supabase Setup
echo -e "\n${GREEN}Step 3: Supabase Setup${NC}"
read -p "Do you have a Supabase account? (y/n): " has_supabase

if [ "$has_supabase" = "y" ]; then
    echo "Run: supabase login"
    echo "Run: supabase project create organic-os"
    echo "Run: supabase db push"
fi

# Environment Variables
echo -e "\n${GREEN}Step 4: Environment Variables${NC}"
echo "Create .env.local with these variables:"
echo ""
echo "# Supabase"
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
echo ""
echo "# Vercel (after deployment)"
echo "NEXT_PUBLIC_APP_URL=https://organic-os.vercel.app"

# GitHub Secrets (for CI/CD)
echo -e "\n${GREEN}Step 5: GitHub Secrets (Optional)${NC}"
echo "Add these secrets to your GitHub repo:"
echo "- VERCEL_TOKEN"
echo "- VERCEL_ORG_ID" 
echo "- VERCEL_PROJECT_ID"

echo -e "\n${GREEN}Setup complete!${NC}"
echo "Next steps:"
echo "1. Set up Vercel: npx vercel --prod"
echo "2. Set up Supabase: supabase db push"
echo "3. Add environment variables to Vercel project settings"
