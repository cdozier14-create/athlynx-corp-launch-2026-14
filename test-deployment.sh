#!/bin/bash
# ATHLYNX Multi-Domain Deployment Test Script
# Tests all production domains for health and API availability

set -e

echo "=========================================="
echo "ATHLYNX Multi-Domain Deployment Test"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domains to test
DOMAINS=(
    "dozierholdingsgroup.com"
    "athlynx.ai"
    "athlynxapp.vip"
    "transferportal.ai"
)

# Test counter
PASSED=0
FAILED=0

# Function to test a domain
test_domain() {
    local domain=$1
    echo -e "${YELLOW}Testing: $domain${NC}"
    
    # Test health endpoint
    if curl -sf "https://$domain/api/health" -o /dev/null; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        
        # Get and display response
        response=$(curl -s "https://$domain/api/health")
        echo "   Response: $response"
        
        # Test API docs
        if curl -sf "https://$domain/api/docs" -o /dev/null; then
            echo -e "${GREEN}✅ API docs accessible${NC}"
        else
            echo -e "${RED}❌ API docs not accessible${NC}"
            ((FAILED++))
            return 1
        fi
        
        ((PASSED++))
        echo ""
        return 0
    else
        echo -e "${RED}❌ Health check failed${NC}"
        echo "   Domain may not be deployed or DNS not configured"
        ((FAILED++))
        echo ""
        return 1
    fi
}

# Test each domain
for domain in "${DOMAINS[@]}"; do
    test_domain "$domain"
done

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All domains are healthy!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some domains need attention${NC}"
    exit 1
fi
