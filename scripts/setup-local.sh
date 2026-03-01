#!/bin/bash
# Organic OS - Local Development Setup
# Run this script to set up a local development environment

set -e

echo "🧬 Organic OS - Local Setup"
echo "============================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is required but not installed.${NC}"
        exit 1
    fi
}

echo -e "${GREEN}Checking prerequisites...${NC}"
check_command node
check_command npm
check_command python3

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}Error: Node.js 20+ is required. Current: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"

# Install dependencies
echo -e "\n${GREEN}Installing dependencies...${NC}"
npm install

# Check for Supabase CLI
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✓ Supabase CLI installed${NC}"
else
    echo -e "${YELLOW}⚠ Supabase CLI not installed (optional)${NC}"
fi

# Copy environment file
if [ ! -f "apps/web/.env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example apps/web/.env.local
        echo -e "${GREEN}✓ Created .env.local from template${NC}"
    fi
fi

# Install pre-commit hooks
echo -e "\n${GREEN}Setting up pre-commit hooks...${NC}"
if command -v pre-commit &> /dev/null; then
    pre-commit install || true
fi

# Run initial build
echo -e "\n${GREEN}Building project...${NC}"
npm run build

# Run tests
echo -e "\n${GREEN}Running tests...${NC}"
cd apps/web
npm run test:run --silent 2>/dev/null || true
cd ../..

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure .env.local with your Supabase credentials"
echo "2. Start development: npm run dev"
echo "3. Open http://localhost:3000"
