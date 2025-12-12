# Quick Start: PostgreSQL Setup for LifeHub

## 🎯 TL;DR - Get Running in 5 Minutes

### Step 1: Install PostgreSQL (if not installed)
```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Verify installation
psql --version
```

### Step 2: Create Database
```bash
# Connect to PostgreSQL
psql postgres

# Run these commands in PostgreSQL:
CREATE DATABASE lifehub_db;
CREATE USER lifehub_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE lifehub_db TO lifehub_user;
\c lifehub_db
GRANT ALL ON SCHEMA public TO lifehub_user;
\q
```

### Step 3: Configure Backend
Edit `backend/src/main/resources/application.properties`:

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/lifehub_db
spring.datasource.username=lifehub_user
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### Step 4: Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Step 5: Test It
```bash
# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

**Done!** 🎉

---

## 📚 Need More Details?

- **Full PostgreSQL Setup Guide:** See `POSTGRESQL_SETUP.md`
- **Learning Guide:** See `BACKEND_LEARNING_GUIDE.md`
- **API Documentation:** See `backend/API_DOCUMENTATION.md`

---

## ✅ Why PostgreSQL?

- ✅ Industry standard (used by Amazon, Netflix, Instagram)
- ✅ Advanced features for complex queries
- ✅ Excellent for production applications
- ✅ AWS RDS compatible
- ✅ Great for interviews!

---

## 🐛 Common Issues

**Can't connect?**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Start if not running
brew services start postgresql@15     # macOS
sudo systemctl start postgresql       # Linux
```

**Permission denied?**
```sql
GRANT ALL ON SCHEMA public TO lifehub_user;
```

**Database doesn't exist?**
```sql
CREATE DATABASE lifehub_db;
```

---

For detailed troubleshooting, see `POSTGRESQL_SETUP.md`

