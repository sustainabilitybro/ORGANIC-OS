#!/bin/bash
# Organic OS - Full Development Environment Setup
# Sets up both web frontend and API backend

set -e

echo "🧬 Organic OS - Full Setup"
echo "========================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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
check_command pip

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}Error: Node.js 20+ is required. Current: $(node -v)${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(sys.version_info.major)')
if [ "$PYTHON_VERSION" -lt 3 ]; then
    echo -e "${RED}Error: Python 3+ is required. Current: $(python3 --version)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"

# Install root dependencies
echo -e "\n${BLUE}Installing root dependencies...${NC}"
npm install

# Install web dependencies
echo -e "\n${BLUE}Installing web dependencies...${NC}"
cd apps/web
npm install
cd ../..

# Install API dependencies
echo -e "\n${BLUE}Installing API dependencies...${NC}"
cd apps/api
pip install -r requirements.txt
cd ../..

# Copy environment files
echo -e "\n${GREEN}Setting up environment files...${NC}"

if [ ! -f "apps/web/.env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example apps/web/.env.local
        echo -e "${GREEN}✓ Created web .env.local${NC}"
    fi
fi

if [ ! -f "apps/api/.env" ]; then
    if [ -f "apps/api/.env.example" ]; then
        cp apps/api/.env.example apps/api/.env
        echo -e "${GREEN}✓ Created API .env${NC}"
    fi
fi

# Install pre-commit hooks
echo -e "\n${GREEN}Setting up pre-commit hooks...${NC}"
if command -v pre-commit &> /dev/null; then
    pre-commit install || true
    pre-commit install --hook-type commit-msg || true
fi

# Build project
echo -e "\n${BLUE}Building project...${NC}"
npm run build

# Run tests
echo -e "\n${BLUE}Running tests...${NC}"
cd apps/web
npm run test:run --silent 2>/dev/null || true
cd ../..

echo -e "\n${GREEN}✅ Full setup complete!${NC}"
echo ""
echo "To start development:"
echo "  Web:    npm run dev (in apps/web)"
echo "  API:    python -m uvicorn main:app --reload (in apps/api)"
echo ""
echo "Or use Docker:"
echo "  docker-compose up -d"
