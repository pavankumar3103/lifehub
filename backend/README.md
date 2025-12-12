# LifeHub Backend API

Spring Boot REST API backend for the LifeHub lifestyle management platform.

> **📚 Documentation**: For detailed setup and run instructions, see `../docs/essential/` folder.
> - `../docs/essential/RUN_BACKEND.md` - Detailed run instructions
> - `../docs/essential/API_DOCUMENTATION.md` - Complete API reference
> - `../docs/essential/POSTGRESQL_SETUP.md` - Database setup

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **MySQL/PostgreSQL**
- **Maven**

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ or PostgreSQL 12+
- (Optional) IDE with Spring Boot support (IntelliJ IDEA, Eclipse, VS Code)

## Setup Instructions

### 1. Database Setup

#### MySQL
```sql
CREATE DATABASE lifehub_db;
```

#### PostgreSQL
```sql
CREATE DATABASE lifehub_db;
```

### 2. Configure Database

Edit `src/main/resources/application.properties`:

```properties
# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/lifehub_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password

# OR PostgreSQL
# spring.datasource.url=jdbc:postgresql://localhost:5432/lifehub_db
# spring.datasource.username=postgres
# spring.datasource.password=your_password
```

### 3. Configure JWT Secret

Update the JWT secret in `application.properties`:

```properties
jwt.secret=your-secret-key-change-this-in-production-to-a-very-long-random-string
```

**Important:** Use a strong random string in production (minimum 256 bits).

### 4. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Or run directly in your IDE by executing `LifeHubApplication.java`.

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires authentication)

### Habits

- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create a new habit
- `GET /api/habits/{id}` - Get habit by ID
- `PUT /api/habits/{id}` - Update habit
- `DELETE /api/habits/{id}` - Delete habit

### Meals

- `GET /api/meals` - Get all user meals
- `POST /api/meals` - Create a new meal
- `GET /api/meals/{id}` - Get meal by ID
- `PUT /api/meals/{id}` - Update meal
- `DELETE /api/meals/{id}` - Delete meal

### Workouts

- `GET /api/workouts` - Get all user workouts
- `POST /api/workouts` - Create a new workout
- `GET /api/workouts/{id}` - Get workout by ID
- `PUT /api/workouts/{id}` - Update workout
- `DELETE /api/workouts/{id}` - Delete workout

### Mood Entries

- `GET /api/mood-entries` - Get all user mood entries
- `POST /api/mood-entries` - Create a new mood entry
- `GET /api/mood-entries/{id}` - Get mood entry by ID
- `PUT /api/mood-entries/{id}` - Update mood entry
- `DELETE /api/mood-entries/{id}` - Delete mood entry

## Authentication

All endpoints except `/api/auth/*` require JWT authentication.

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Example API Requests

### Register User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Habit (Authenticated)

```bash
curl -X POST http://localhost:8080/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "habitName": "Drink 2L water daily",
    "isActive": true
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/lifehub/
│   │   │   ├── controller/     # REST controllers
│   │   │   ├── service/        # Business logic
│   │   │   ├── repository/     # Data access layer
│   │   │   ├── model/          # JPA entities
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── security/       # Security configuration
│   │   │   ├── exception/      # Exception handlers
│   │   │   └── LifeHubApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                   # Test files
├── pom.xml
└── README.md
```

## Development Profile

To use development profile, set:

```bash
export SPRING_PROFILES_ACTIVE=dev
```

Or add to `application.properties`:

```properties
spring.profiles.active=dev
```

## Production Configuration

1. Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`)
2. Use environment variables for sensitive data
3. Use a strong JWT secret
4. Enable SSL/TLS
5. Configure proper CORS origins

## Next Steps

- [ ] Add unit and integration tests
- [ ] Implement Redis caching
- [ ] Add request rate limiting
- [ ] Implement refresh token rotation
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Set up CI/CD pipeline
- [ ] Deploy to AWS

## License

MIT



