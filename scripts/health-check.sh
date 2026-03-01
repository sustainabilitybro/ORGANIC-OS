#!/bin/bash
# Organic OS - Health Check Script
# Run this to verify all systems are operational

set -e

echo "🔍 Organic OS Health Check"
echo "=========================="

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo "Error: Run this from the ORGANIC-OS root directory"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_service() {
    local name=$1
    local url=$2
    
    echo -n "Checking $name... "
    if curl -s -f -o /dev/null "$url" 2>/dev/null; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Check Node modules
echo -n "Checking node_modules... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ MISSING - Run npm install${NC}"
fi

# Check build output
echo -n "Checking build output... "
if [ -d "apps/web/.next" ]; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${YELLOW}⚠ NOT BUILT - Run npm run build${NC}"
fi

# Check environment file
echo -n "Checking .env.local... "
if [ -f "apps/web/.env.local" ]; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${YELLOW}⚠ MISSING - Copy from .env.example${NC}"
fi

# Check TypeScript
echo -n "Checking TypeScript... "
if npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${YELLOW}⚠ WARNINGS${NC}"
fi

# Check tests
echo -n "Checking tests... "
if npm run test:run --workspace=apps/web --silent 2>/dev/null; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

echo ""
echo "Health check complete!"
