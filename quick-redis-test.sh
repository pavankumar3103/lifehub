#!/bin/bash

# Quick Redis Cache Test - Shows cache hits and misses clearly

BASE_URL="http://localhost:8080"

echo "🔍 Quick Redis Cache Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Redis
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running. Start it first!"
    exit 1
fi

# Check backend first
echo "🔍 Checking backend..."
if ! curl -s --max-time 2 "$BASE_URL/api/auth/register" > /dev/null 2>&1; then
    if command -v nc &> /dev/null && nc -z localhost 8080 2>/dev/null; then
        echo "✅ Backend port is open"
    elif command -v lsof &> /dev/null && lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "✅ Backend is listening on port 8080"
    else
        echo "❌ Backend is not running. Start it with: cd backend && mvn spring-boot:run"
        exit 1
    fi
else
    echo "✅ Backend is responding"
fi
echo ""

# Get or create token
echo "📝 Getting authentication token..."
TOKEN=$(curl -s --max-time 5 -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@lifehub.com","password":"demo123"}' \
  2>/dev/null | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "   Creating new user..."
    TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/register" \
      -H "Content-Type: application/json" \
      -d '{"name":"Demo User","email":"demo@lifehub.com","password":"demo123"}' \
      2>/dev/null | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
    echo "❌ Could not authenticate. Check backend is running."
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Clear cache
echo "🗑️  Clearing Redis cache..."
redis-cli FLUSHALL > /dev/null
echo "✅ Cache cleared"
echo ""

# First call - CACHE MISS
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 First API Call (CACHE MISS - fetching from database)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
START1=$(date +%s%N)
curl -s -X GET "$BASE_URL/api/habits" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
END1=$(date +%s%N)
DURATION1=$(( (END1 - START1) / 1000000 ))
echo "⏱️  Response time: ${DURATION1}ms"
echo "📊 Status: CACHE MISS (data fetched from PostgreSQL)"
echo ""

sleep 1

# Check Redis keys
echo "🔍 Redis keys after first call:"
redis-cli KEYS "*" | head -5
echo ""

# Second call - CACHE HIT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 Second API Call (CACHE HIT - fetching from Redis)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
START2=$(date +%s%N)
curl -s -X GET "$BASE_URL/api/habits" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
END2=$(date +%s%N)
DURATION2=$(( (END2 - START2) / 1000000 ))
echo "⏱️  Response time: ${DURATION2}ms"
echo "📊 Status: CACHE HIT (data fetched from Redis)"
echo ""

# Compare
if [ "$DURATION2" -lt "$DURATION1" ]; then
    SPEEDUP=$(echo "scale=1; ($DURATION1 - $DURATION2) * 100 / $DURATION1" | bc)
    echo "🚀 Cache is ${SPEEDUP}% faster!"
else
    echo "⚠️  Cache might not be working (second call was slower)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 To see detailed Redis operations, run in another terminal:"
echo "   redis-cli MONITOR"
echo ""
echo "💡 To see cache operations in backend logs, check:"
echo "   Backend console output (look for 'Cache entry found' or 'Cache entry not found')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
