# LifeHub Backend API Documentation

## Base URL
```
http://localhost:8080
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-20T10:00:00"
    }
  }
}
```

### Login
**POST** `/api/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: Same as register response

### Get Current User
**GET** `/api/auth/me`

**Requires Authentication**

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-20T10:00:00"
  }
}
```

---

## Habits Endpoints

### Get All Habits
**GET** `/api/habits`

**Requires Authentication**

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "habitName": "Drink 2L water daily",
      "isActive": true,
      "createdAt": "2025-01-20T10:00:00"
    }
  ]
}
```

### Create Habit
**POST** `/api/habits`

**Requires Authentication**

Request Body:
```json
{
  "habitName": "Read for 30 minutes",
  "isActive": true
}
```

Response:
```json
{
  "success": true,
  "message": "Habit created successfully",
  "data": {
    "id": 2,
    "habitName": "Read for 30 minutes",
    "isActive": true,
    "createdAt": "2025-01-20T11:00:00"
  }
}
```

### Get Habit by ID
**GET** `/api/habits/{id}`

**Requires Authentication**

### Update Habit
**PUT** `/api/habits/{id}`

**Requires Authentication**

Request Body:
```json
{
  "habitName": "Read for 1 hour",
  "isActive": false
}
```

### Delete Habit
**DELETE** `/api/habits/{id}`

**Requires Authentication**

---

## Meals Endpoints

### Get All Meals
**GET** `/api/meals`

**Requires Authentication**

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "dishName": "Grilled Chicken Salad",
      "quantityGrams": 350,
      "mealDate": "2025-01-20"
    }
  ]
}
```

### Create Meal
**POST** `/api/meals`

**Requires Authentication**

Request Body:
```json
{
  "dishName": "Oatmeal with fruits",
  "quantityGrams": 250,
  "mealDate": "2025-01-20"
}
```

Note: `mealDate` is optional, defaults to today's date.

### Get Meal by ID
**GET** `/api/meals/{id}`

**Requires Authentication**

### Update Meal
**PUT** `/api/meals/{id}`

**Requires Authentication**

### Delete Meal
**DELETE** `/api/meals/{id}`

**Requires Authentication**

---

## Workouts Endpoints

### Get All Workouts
**GET** `/api/workouts`

**Requires Authentication**

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "exerciseName": "5km run",
      "durationMinutes": 30,
      "workoutDate": "2025-01-20"
    }
  ]
}
```

### Create Workout
**POST** `/api/workouts`

**Requires Authentication**

Request Body:
```json
{
  "exerciseName": "Push-ups",
  "durationMinutes": 15,
  "workoutDate": "2025-01-20"
}
```

Note: `workoutDate` is optional, defaults to today's date.

### Get Workout by ID
**GET** `/api/workouts/{id}`

**Requires Authentication**

### Update Workout
**PUT** `/api/workouts/{id}`

**Requires Authentication**

### Delete Workout
**DELETE** `/api/workouts/{id}`

**Requires Authentication**

---

## Mood Entries Endpoints

### Get All Mood Entries
**GET** `/api/mood-entries`

**Requires Authentication**

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "moodValue": "😊",
      "moodDate": "2025-01-20",
      "notes": "Feeling great today!"
    }
  ]
}
```

### Create Mood Entry
**POST** `/api/mood-entries`

**Requires Authentication**

Request Body:
```json
{
  "moodValue": "😌",
  "moodDate": "2025-01-20",
  "notes": "Feeling calm and relaxed"
}
```

Note: 
- `moodDate` is optional, defaults to today's date
- If a mood entry already exists for the date, it will be updated instead

### Get Mood Entry by ID
**GET** `/api/mood-entries/{id}`

**Requires Authentication**

### Update Mood Entry
**PUT** `/api/mood-entries/{id}`

**Requires Authentication**

### Delete Mood Entry
**DELETE** `/api/mood-entries/{id}`

**Requires Authentication**

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example cURL Commands

### Register and Login
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login (save token)
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.data.token')

# Use token
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Create Habit
```bash
curl -X POST http://localhost:8080/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "habitName": "Drink 2L water",
    "isActive": true
  }'
```



