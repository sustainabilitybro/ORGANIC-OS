#!/bin/bash
# Organic OS - Local CI Pipeline
# Runs the same checks as GitHub Actions

set -e

echo "🔄 Running Local CI Pipeline"
echo "============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

FAILED=0

run_check() {
    local name=$1
    local cmd=$2
    
    echo -n "Running $name... "
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
    else
        echo -e "${RED}✗ FAILED${NC}"
        FAILED=1
    fi
}

# Change to web app directory
cd apps/web

# Lint
echo ""
echo "📋 Linting..."
run_check "ESLint" "npm run lint"

# Type check
echo ""
echo "🔎 Type Checking..."
run_check "TypeScript" "npx tsc --noEmit"

# Tests
echo ""
echo "🧪 Running Tests..."
run_check "Unit Tests" "npm run test:run"

# Build
echo ""
echo "🏗️ Building..."
run_check "Production Build" "npm run build"

# Coverage check
echo ""
echo "📊 Coverage Check..."
run_check "Coverage" "npm run test:coverage:check"

# Go back to root
cd ../..

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed${NC}"
    exit 1
fi
