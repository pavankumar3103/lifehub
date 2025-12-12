#!/bin/bash

# Redis Cache Testing Script for LifeHub Backend
# This script tests the Redis caching functionality

echo "🧪 LifeHub Redis Cache Testing Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Redis is running
echo "1️⃣  Checking Redis connection..."
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${RED}❌ Redis is not running!${NC}"
    echo "   Please start Redis: brew services start redis"
    exit 1
fi

# Check if Spring Boot app is running
echo ""
echo "2️⃣  Checking Spring Boot application..."
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1 || curl -s http://localhost:8080/api/auth/login > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is running${NC}"
else
    echo -e "${RED}❌ Application is not running!${NC}"
    echo "   Please start the application: mvn spring-boot:run"
    exit 1
fi

# Register a test user
echo ""
echo "3️⃣  Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cache Test User",
    "email": "cachetest@example.com",
    "password": "test123"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ User registered successfully${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
elif echo "$REGISTER_RESPONSE" | grep -q "already exists"; then
    echo -e "${YELLOW}⚠️  User already exists, logging in...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "email": "cachetest@example.com",
        "password": "test123"
      }')
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}❌ Registration failed${NC}"
    echo "$REGISTER_RESPONSE"
    exit 1
fi

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to get authentication token${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Authentication token obtained${NC}"

# Create a test habit
echo ""
echo "4️⃣  Creating a test habit..."
HABIT_RESPONSE=$(curl -s -X POST http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitName": "Test Habit for Cache",
    "isActive": true
  }')

if echo "$HABIT_RESPONSE" | grep -q "habitName"; then
    echo -e "${GREEN}✅ Habit created successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Habit may already exist${NC}"
fi

# Test caching - First call (cache miss)
echo ""
echo "5️⃣  Testing cache - First call (should be slower - cache miss)..."
START_TIME=$(date +%s%N)
FIRST_RESPONSE=$(curl -s -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN")
END_TIME=$(date +%s%N)
FIRST_DURATION=$((($END_TIME - $START_TIME) / 1000000))
echo -e "${YELLOW}   First call took: ${FIRST_DURATION}ms${NC}"

# Test caching - Second call (cache hit)
echo ""
echo "6️⃣  Testing cache - Second call (should be faster - cache hit)..."
START_TIME=$(date +%s%N)
SECOND_RESPONSE=$(curl -s -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN")
END_TIME=$(date +%s%N)
SECOND_DURATION=$((($END_TIME - $START_TIME) / 1000000))
echo -e "${YELLOW}   Second call took: ${SECOND_DURATION}ms${NC}"

# Compare results
echo ""
echo "7️⃣  Results:"
if [ $SECOND_DURATION -lt $FIRST_DURATION ]; then
    IMPROVEMENT=$((100 - (SECOND_DURATION * 100 / FIRST_DURATION)))
    echo -e "${GREEN}✅ Cache is working!${NC}"
    echo -e "   Performance improvement: ~${IMPROVEMENT}%"
else
    echo -e "${YELLOW}⚠️  Cache may not be working as expected${NC}"
    echo "   (This could be due to very fast database queries)"
fi

# Check Redis for cache entries
echo ""
echo "8️⃣  Checking Redis cache entries..."
CACHE_KEYS=$(redis-cli KEYS "habits::*" 2>/dev/null)
if [ -n "$CACHE_KEYS" ]; then
    echo -e "${GREEN}✅ Found cache entries in Redis:${NC}"
    echo "$CACHE_KEYS" | while read key; do
        TTL=$(redis-cli TTL "$key" 2>/dev/null)
        echo "   - $key (TTL: ${TTL}s)"
    done
else
    echo -e "${YELLOW}⚠️  No cache entries found (may have expired or not cached yet)${NC}"
fi

# Test cache eviction
echo ""
echo "9️⃣  Testing cache eviction (create new habit)..."
curl -s -X POST http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitName": "Another Test Habit",
    "isActive": true
  }' > /dev/null

echo "   Checking if cache was evicted..."
CACHE_KEYS_AFTER=$(redis-cli KEYS "habits::*" 2>/dev/null)
if [ -z "$CACHE_KEYS_AFTER" ]; then
    echo -e "${GREEN}✅ Cache was evicted successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Cache entries still exist (may be recreated immediately)${NC}"
fi

# Summary
echo ""
echo "======================================"
echo "📊 Test Summary"
echo "======================================"
echo "✅ Redis connection: OK"
echo "✅ Application: Running"
echo "✅ Authentication: Success"
echo "✅ Cache test: Completed"
echo ""
echo "💡 Tips:"
echo "   - Check application logs for cache hit/miss messages"
echo "   - Use 'redis-cli MONITOR' to see all Redis commands"
echo "   - Use 'redis-cli KEYS *' to see all cache entries"
echo ""
echo -e "${GREEN}🎉 Testing complete!${NC}"

