# LifeHub

A personal productivity and lifestyle management web app built with React and Spring Boot.

## Features

- Modern, responsive UI with Tailwind CSS
- Full-stack application with React frontend and Spring Boot backend
- JWT authentication and security
- Track habits, meals, workouts, and mood
- Analytics and intelligent recommendations
- Redis caching for performance

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript (ES6+)

### Backend
- Spring Boot 3.2.0
- Java 17
- PostgreSQL/MySQL
- JWT Authentication
- Redis Caching (optional)
- Spring Data JPA

## Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.6+
- PostgreSQL 12+ (or MySQL 8.0+)
- Redis (optional, for caching)

### 1. Database Setup
See `docs/essential/POSTGRESQL_SETUP.md` for database setup instructions.

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

For detailed instructions, see `docs/essential/backend-README.md` or `docs/essential/RUN_BACKEND.md`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:8080`

## Documentation

### Essential Documentation (Required to Run)
All essential documentation is in the `docs/essential/` folder:
- **README.md** - This file
- **backend-README.md** - Backend setup and API documentation
- **RUN_BACKEND.md** - Detailed backend run instructions
- **POSTGRESQL_SETUP.md** - Database setup guide
- **QUICK_START_POSTGRESQL.md** - Quick database setup
- **API_DOCUMENTATION.md** - Complete API reference
- **REDIS_CACHE_TESTING.md** - Redis setup (optional)

### Reference Documentation
Additional documentation, learning guides, and reports are in `docs/reference/` folder.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `GET /api/habits/{id}` - Get habit by ID
- `PUT /api/habits/{id}` - Update habit
- `DELETE /api/habits/{id}` - Delete habit

### Analytics
- `GET /api/analytics/habits` - Get habit analytics
- `GET /api/analytics/recommendations` - Get recommendations
- `GET /api/analytics/summary` - Get analytics summary

See `docs/essential/API_DOCUMENTATION.md` for complete API reference.

## Project Structure

```
lifehub/
├── backend/              # Spring Boot backend
│   ├── src/main/java/    # Java source code
│   └── pom.xml           # Maven dependencies
├── frontend/             # React frontend
│   ├── src/              # React source code
│   ├── public/           # Public assets
│   └── package.json      # NPM dependencies
├── docs/
│   ├── essential/       # Essential documentation
│   └── reference/        # Reference documentation
└── README.md            # This file
```

## License

MIT
