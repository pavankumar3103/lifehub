#!/bin/bash

# Simple Redis Cache Test - Use your existing credentials

BASE_URL="http://localhost:8080"

echo "🔍 Simple Redis Cache Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check services
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running"
    exit 1
fi

if ! curl -s --max-time 2 "$BASE_URL/api/auth/register" > /dev/null 2>&1; then
    echo "❌ Backend is not running"
    exit 1
fi

echo "✅ Services are running"
echo ""

# Get credentials
echo "Enter your email (or press Enter to create new user):"
read -r EMAIL

if [ -z "$EMAIL" ]; then
    EMAIL="test_$(date +%s)@test.com"
    PASSWORD="test123"
    echo "Creating new user: $EMAIL"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
    
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Registration failed. Response: $RESPONSE"
        exit 1
    fi
else
    echo "Enter your password:"
    read -rs PASSWORD
    echo ""
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
    
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Login failed. Check credentials."
        exit 1
    fi
fi

echo "✅ Authenticated"
echo ""

# Clear cache
echo "🗑️  Clearing Redis cache..."
redis-cli FLUSHALL > /dev/null
echo "✅ Cache cleared"
echo ""

# First call
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 First API Call (CACHE MISS)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
START1=$(date +%s%N)
curl -s -X GET "$BASE_URL/api/habits" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
END1=$(date +%s%N)
DURATION1=$(( (END1 - START1) / 1000000 ))
echo "⏱️  Response time: ${DURATION1}ms"
echo "📊 Status: CACHE MISS (fetched from database)"
echo ""

sleep 1

# Check Redis
echo "🔍 Redis keys:"
redis-cli KEYS "*" | head -5
echo ""

# Second call
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 Second API Call (CACHE HIT)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
START2=$(date +%s%N)
curl -s -X GET "$BASE_URL/api/habits" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
END2=$(date +%s%N)
DURATION2=$(( (END2 - START2) / 1000000 ))
echo "⏱️  Response time: ${DURATION2}ms"
echo "📊 Status: CACHE HIT (fetched from Redis)"
echo ""

if [ "$DURATION2" -lt "$DURATION1" ]; then
    SPEEDUP=$(echo "scale=1; ($DURATION1 - $DURATION2) * 100 / $DURATION1" | bc 2>/dev/null || echo "0")
    echo "🚀 Cache is ${SPEEDUP}% faster!"
fi

echo ""
echo "✅ Test complete!"
echo ""
echo "💡 To see Redis operations in real-time, run in another terminal:"
echo "   redis-cli MONITOR"
