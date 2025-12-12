# 🧪 Redis Cache Testing Guide

This guide explains how to test the Redis caching implementation in your LifeHub backend.

## 📋 Prerequisites

1. **Redis Server** must be installed and running
2. **PostgreSQL** must be running
3. **Spring Boot application** should be running

---

## 🚀 Step 1: Install and Start Redis

### macOS (using Homebrew):
```bash
# Install Redis
brew install redis

# Start Redis server
brew services start redis

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

### Linux:
```bash
# Install Redis
sudo apt-get install redis-server  # Ubuntu/Debian
# OR
sudo yum install redis             # CentOS/RHEL

# Start Redis
sudo systemctl start redis
sudo systemctl enable redis

# Verify
redis-cli ping
```

### Docker (Alternative):
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

---

## 🔍 Step 2: Verify Redis Connection

### Check Redis is accessible:
```bash
redis-cli
# Inside Redis CLI:
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> exit
```

### Monitor Redis commands in real-time:
```bash
# Open a new terminal and run:
redis-cli MONITOR
```

---

## 🧪 Step 3: Test Caching with API Calls

### Setup: Register and Login

```bash
# 1. Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User User",
    "email": "user@example.com",
    "password": "user123"
  }'

# 2. Login and get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | jq -r '.token')

echo "Token: $TOKEN"
```

### Test 1: User Profile Caching (`AuthService.getCurrentUser`)

```bash
# First call - should hit database (cache miss)
echo "=== First Call (Cache Miss) ==="
time curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Second call - should hit cache (cache hit - faster!)
echo "=== Second Call (Cache Hit) ==="
time curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Result:**
- First call: Slower (database query)
- Second call: Faster (from cache)
- Check logs for cache hit/miss messages

### Test 2: Habits Caching (`HabitService.getUserHabits`)

```bash
# Create a habit first
curl -X POST http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitName": "Morning Exercise",
    "isActive": true
  }'

# First call - cache miss
echo "=== First Call (Cache Miss) ==="
time curl -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN"

# Second call - cache hit
echo "=== Second Call (Cache Hit) ==="
time curl -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN"

# Create a new habit - should evict cache
curl -X POST http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitName": "Read Books",
    "isActive": true
  }'

# Third call - cache miss (cache was evicted)
echo "=== Third Call (Cache Miss - After Create) ==="
time curl -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN"
```

### Test 3: Meals Caching

```bash
# Create a meal
curl -X POST http://localhost:8080/api/meals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dishName": "Grilled Chicken",
    "quantityGrams": 200,
    "mealDate": "2024-01-15"
  }'

# First call - cache miss
time curl -X GET http://localhost:8080/api/meals \
  -H "Authorization: Bearer $TOKEN"

# Second call - cache hit
time curl -X GET http://localhost:8080/api/meals \
  -H "Authorization: Bearer $TOKEN"
```

### Test 4: Workouts Caching

```bash
# Create a workout
curl -X POST http://localhost:8080/api/workouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseName": "Running",
    "durationMinutes": 30,
    "workoutDate": "2024-01-15"
  }'

# Test caching
time curl -X GET http://localhost:8080/api/workouts \
  -H "Authorization: Bearer $TOKEN"
```

### Test 5: Mood Entries Caching

```bash
# Create a mood entry
curl -X POST http://localhost:8080/api/mood \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moodValue": 5,
    "moodDate": "2024-01-15",
    "notes": "Feeling great!"
  }'

# Test caching
time curl -X GET http://localhost:8080/api/mood \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔎 Step 4: Inspect Redis Cache Directly

### View all cache keys:
```bash
redis-cli
127.0.0.1:6379> KEYS *
```

### View specific cache entries:
```bash
redis-cli
# View user cache
127.0.0.1:6379> KEYS *users*
127.0.0.1:6379> GET "users::test@example.com"

# View habits cache
127.0.0.1:6379> KEYS *habits*
127.0.0.1:6379> GET "habits::1"  # Replace 1 with your userId

# View all cache entries with TTL
127.0.0.1:6379> KEYS *
127.0.0.1:6379> TTL "users::test@example.com"  # Returns seconds until expiration
```

### Clear specific cache:
```bash
redis-cli
# Clear all habits cache
127.0.0.1:6379> KEYS habits::*
127.0.0.1:6379> DEL habits::1

# Clear all cache
127.0.0.1:6379> FLUSHALL
```

### Monitor cache operations:
```bash
# In a separate terminal, monitor all Redis commands
redis-cli MONITOR
```

---

## 📊 Step 5: Check Application Logs

Enable cache logging in `application.properties` (already enabled):
```properties
logging.level.org.springframework.cache=DEBUG
```

### What to look for in logs:

**Cache Miss (First Call):**
```
DEBUG o.s.cache.interceptor.CacheInterceptor - Computable cache entry 'habits::1' could not be found
```

**Cache Hit (Subsequent Calls):**
```
DEBUG o.s.cache.interceptor.CacheInterceptor - Cache entry 'habits::1' found in cache 'habits'
```

**Cache Evict (After Create/Update/Delete):**
```
DEBUG o.s.cache.interceptor.CacheInterceptor - Evicting cache entry 'habits::1'
```

---

## 🧪 Step 6: Automated Testing Script

Create a test script to verify caching:

```bash
#!/bin/bash
# save as test-cache.sh

echo "🧪 Testing Redis Cache..."

# Register and login
echo "1. Registering user..."
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Cache Test","email":"cache@test.com","password":"test123"}' > /dev/null

echo "2. Logging in..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cache@test.com","password":"test123"}' | jq -r '.token')

echo "3. Creating a habit..."
curl -s -X POST http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"habitName":"Test Habit","isActive":true}' > /dev/null

echo "4. First GET (should be slow - cache miss)..."
time curl -s -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN" > /dev/null

echo "5. Second GET (should be fast - cache hit)..."
time curl -s -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer $TOKEN" > /dev/null

echo "✅ Cache test complete!"
```

Make it executable and run:
```bash
chmod +x test-cache.sh
./test-cache.sh
```

---

## 🔍 Step 7: Verify Cache TTL (Time To Live)

Check that cache entries expire correctly:

```bash
redis-cli
# Check TTL for a cache entry
127.0.0.1:6379> TTL "habits::1"
# Should return a number (seconds until expiration)
# -1 means no expiration
# -2 means key doesn't exist

# Wait for expiration and check again
# After TTL expires, key should be gone
```

---

## 🐛 Troubleshooting

### Issue: Cache not working

**Check:**
1. Redis is running: `redis-cli ping`
2. Application logs show cache operations
3. Redis connection in application.properties is correct

**Solution:**
```bash
# Check Redis connection
redis-cli ping

# Check application logs for errors
tail -f logs/application.log
```

### Issue: Cache not evicting

**Check:**
- Verify `@CacheEvict` annotations are on create/update/delete methods
- Check logs for eviction messages

### Issue: Redis connection refused

**Error:**
```
Unable to connect to Redis
```

**Solution:**
```bash
# Start Redis
brew services start redis  # macOS
# OR
sudo systemctl start redis  # Linux

# Verify
redis-cli ping
```

---

## 📈 Performance Comparison

### Without Cache:
```bash
# Multiple calls - each hits database
for i in {1..10}; do
  time curl -s -X GET http://localhost:8080/api/habits \
    -H "Authorization: Bearer $TOKEN" > /dev/null
done
```

### With Cache:
```bash
# First call hits DB, rest hit cache
for i in {1..10}; do
  time curl -s -X GET http://localhost:8080/api/habits \
    -H "Authorization: Bearer $TOKEN" > /dev/null
done
```

**Expected:** First call slower, subsequent calls much faster!

---

## ✅ Verification Checklist

- [ ] Redis server is running (`redis-cli ping` returns PONG)
- [ ] Application starts without Redis connection errors
- [ ] First API call is slower (cache miss)
- [ ] Second API call is faster (cache hit)
- [ ] Cache evicts after create/update/delete operations
- [ ] Redis CLI shows cache keys (`KEYS *`)
- [ ] Application logs show cache operations
- [ ] Cache entries expire after TTL

---

## 🎯 Quick Test Commands Summary

```bash
# 1. Start Redis
brew services start redis

# 2. Verify Redis
redis-cli ping

# 3. Monitor Redis
redis-cli MONITOR

# 4. Test API with timing
time curl -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Check cache in Redis
redis-cli
KEYS *
GET "habits::1"
TTL "habits::1"
```

---

**That's it!** Your Redis caching is now tested and verified! 🎉

