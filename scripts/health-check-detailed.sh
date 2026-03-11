#!/bin/bash
# Organic OS - Detailed Health Check Script

set -e

API_URL="${API_URL:-http://localhost:8000}"
WEB_URL="${WEB_URL:-http://localhost:3000}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧬 Organic OS - Detailed Health Check"
echo "======================================"

# Check API
echo -e "\n${YELLOW}Checking API...${NC}"
if curl -sf "${API_URL}/api/v1/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API is responding${NC}"
    curl -s "${API_URL}/api/v1/health" | head -c 200
    echo ""
else
    echo -e "${RED}✗ API is not responding${NC}"
fi

# Check API status endpoint
echo -e "\n${YELLOW}Checking API status...${NC}"
if curl -sf "${API_URL}/api/v1/system/status" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ System status endpoint working${NC}"
    curl -s "${API_URL}/api/v1/system/status" | python3 -m json.tool 2>/dev/null || echo "Response received"
else
    echo -e "${RED}✗ System status endpoint not working${NC}"
fi

# Check API diagnostics
echo -e "\n${YELLOW}Checking API diagnostics...${NC}"
if curl -sf "${API_URL}/api/v1/system/diagnostics" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Diagnostics endpoint working${NC}"
    curl -s "${API_URL}/api/v1/system/diagnostics" | python3 -m json.tool 2>/dev/null || echo "Response received"
else
    echo -e "${RED}✗ Diagnostics endpoint not working${NC}"
fi

# Check Web
echo -e "\n${YELLOW}Checking Web...${NC}"
if curl -sf "${WEB_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Web is responding${NC}"
else
    echo -e "${RED}✗ Web is not responding${NC}"
fi

# Check specific pages
echo -e "\n${YELLOW}Checking key pages...${NC}"
for page in "/" "/dashboard" "/wellness" "/identity" "/emotional"; do
    if curl -sf "${WEB_URL}${page}" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ ${page} loads${NC}"
    else
        echo -e "${RED}✗ ${page} failed${NC}"
    fi
done

echo -e "\n${GREEN}Health check complete!${NC}"
