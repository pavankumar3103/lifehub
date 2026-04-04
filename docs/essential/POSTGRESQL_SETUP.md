# PostgreSQL Setup Guide for LifeHub

### **Advantages of PostgreSQL:**
1. ✅ **Open Source** - Free and community-driven
2. ✅ **Highly Reliable** - ACID compliant, robust transaction support
3. ✅ **Feature Rich** - Advanced features (JSON support, full-text search, etc.)
4. ✅ **Industry Standard** - Used by many major companies (Amazon, Netflix, Instagram)
5. ✅ **Excellent Performance** - Handles large datasets efficiently
6. ✅ **Strong Ecosystem** - Great tooling and community support
7. ✅ **AWS Compatible** - Works seamlessly with AWS RDS
8. ✅ **Better for Complex Queries** - More advanced SQL features than MySQL

**Comparison with MySQL:**
- PostgreSQL is more standards-compliant
- Better for complex queries and analytics
- More advanced data types (arrays, JSON, JSONB)
- Better concurrency control

**For Amazon Interviews:**
- PostgreSQL is highly valued at Amazon
- AWS RDS PostgreSQL is commonly used
- Shows you understand enterprise-grade databases

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ PostgreSQL installed on your system
- ✅ Admin access to create databases
- ✅ Basic knowledge of command line

---

## 🚀 Installation Steps

### **For macOS:**

#### Option 1: Using Homebrew (Recommended)
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

#### Option 2: Using Postgres.app (GUI)
1. Download from: https://postgresapp.com/
2. Install and open the app
3. Click "Initialize" to create a new server

### **For Linux (Ubuntu/Debian):**
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### **For Windows:**
1. Download installer from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Choose installation directory
   - Set password for `postgres` superuser
   - Choose port (default: 5432)
   - Select default locale

---

## 🗄️ Step-by-Step Database Setup

### **Step 1: Access PostgreSQL**

#### macOS/Linux:
```bash
# Switch to postgres user (Linux)
sudo -u postgres psql

# OR connect directly (macOS with Homebrew)
psql postgres
```

#### Windows:
Open "SQL Shell (psql)" from Start Menu, or:
```cmd
psql -U postgres
```

### **Step 2: Create Database and User**

Once in PostgreSQL prompt (`postgres=#`):

```sql
-- Create database for LifeHub
CREATE DATABASE lifehub_db;

-- Create a dedicated user (recommended for production)
CREATE USER lifehub_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE lifehub_db TO lifehub_user;

-- Connect to the new database
\c lifehub_db

-- Grant schema privileges (important!)
GRANT ALL ON SCHEMA public TO lifehub_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lifehub_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lifehub_user;

-- Exit PostgreSQL
\q
```

**Note:** Replace `your_secure_password_here` with a strong password!

### **Step 3: Verify Database Creation**

```bash
# List all databases
psql -U postgres -l

# OR if using postgres user
psql -l
```

You should see `lifehub_db` in the list.

---

## ⚙️ Configure LifeHub Backend

### **Step 1: Update Application Properties**

Edit `backend/src/main/resources/application.properties`:

```properties
# Database Configuration - PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/lifehub_db
spring.datasource.username=lifehub_user
spring.datasource.password=your_secure_password_here
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration for PostgreSQL
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# PostgreSQL Connection Pool Settings (Optional but recommended)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
```

### **Step 2: Remove MySQL Dependency (Optional)**

Since we're using PostgreSQL, you can remove MySQL from `pom.xml` to keep dependencies clean:

**In `backend/pom.xml`, remove or comment out:**
```xml
<!-- MySQL Driver (Optional - remove if only using PostgreSQL) -->
<!--
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
-->
```

**Keep PostgreSQL dependency:**
```xml
<!-- PostgreSQL Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### **Step 3: Test Connection**

```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

If successful, you should see:
- ✅ Application starting
- ✅ Hibernate creating tables automatically
- ✅ No database connection errors

### **Step 4: Verify Tables Created**

Connect to your database and check:

```bash
psql -U lifehub_user -d lifehub_db

# List all tables
\dt

# View table structure
\d users
\d habits
\d meals
\d workouts
\d mood_entries

# Exit
\q
```

You should see all 5 tables created automatically by Hibernate!

---

## 🔒 Security Best Practices

### **1. Use Environment Variables (Production)**

Don't hardcode passwords in `application.properties`!

**Update `application.properties`:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lifehub_db
spring.datasource.username=${DB_USERNAME:lifehub_user}
spring.datasource.password=${DB_PASSWORD}
```

**Set environment variables:**
```bash
# macOS/Linux
export DB_USERNAME=lifehub_user
export DB_PASSWORD=your_secure_password

# Windows (Command Prompt)
set DB_USERNAME=lifehub_user
set DB_PASSWORD=your_secure_password

# Windows (PowerShell)
$env:DB_USERNAME="lifehub_user"
$env:DB_PASSWORD="your_secure_password"
```

### **2. Create `.env` File (Development)**

Create `backend/.env.local` (add to `.gitignore`):

```env
DB_USERNAME=lifehub_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your-jwt-secret-key
```

**Load with Spring Boot:**
Install `dotenv-java` or use Spring Boot's native support.

---

## 🛠️ Useful PostgreSQL Commands

### **Basic Commands:**
```sql
-- Connect to database
\c database_name

-- List all databases
\l

-- List all tables
\dt

-- Describe table structure
\d table_name

-- List all users
\du

-- Exit
\q

-- Show current database
SELECT current_database();

-- Show current user
SELECT current_user;
```

### **Database Management:**
```sql
-- Create backup
pg_dump -U lifehub_user lifehub_db > backup.sql

-- Restore backup
psql -U lifehub_user lifehub_db < backup.sql

-- Drop database (careful!)
DROP DATABASE lifehub_db;

-- Drop user
DROP USER lifehub_user;
```

### **Query Examples:**
```sql
-- View all users
SELECT * FROM users;

-- Count records
SELECT COUNT(*) FROM habits;

-- View habits for a user
SELECT h.* FROM habits h
JOIN users u ON h.user_id = u.id
WHERE u.email = 'test@example.com';
```

---

## 🐛 Troubleshooting

### **Issue 1: Connection Refused**

**Error:**
```
Connection to localhost:5432 refused
```

**Solution:**
```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Start PostgreSQL
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### **Issue 2: Authentication Failed**

**Error:**
```
FATAL: password authentication failed for user "lifehub_user"
```

**Solution:**
1. Check password in `application.properties`
2. Verify user exists:
   ```sql
   \du
   ```
3. Reset password:
   ```sql
   ALTER USER lifehub_user WITH PASSWORD 'new_password';
   ```

### **Issue 3: Permission Denied**

**Error:**
```
ERROR: permission denied for schema public
```

**Solution:**
```sql
-- Grant necessary permissions
GRANT ALL ON SCHEMA public TO lifehub_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lifehub_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lifehub_user;
```

### **Issue 4: Database Doesn't Exist**

**Error:**
```
FATAL: database "lifehub_db" does not exist
```

**Solution:**
```sql
CREATE DATABASE lifehub_db;
```

### **Issue 5: Port Already in Use**

**Error:**
```
Port 5432 is already in use
```

**Solution:**
```bash
# Find process using port 5432
# macOS/Linux
lsof -i :5432

# Kill the process
kill -9 <PID>

# OR use different port in application.properties
spring.datasource.url=jdbc:postgresql://localhost:5433/lifehub_db
```

---

## 📊 PostgreSQL GUI Tools (Optional but Helpful)

### **Recommended Tools:**
1. **pgAdmin** (Official)
   - Download: https://www.pgadmin.org/
   - Full-featured GUI
   - Great for beginners

2. **DBeaver** (Universal)
   - Download: https://dbeaver.io/
   - Works with multiple databases
   - Free and open-source

3. **TablePlus** (macOS/Windows)
   - Download: https://tableplus.com/
   - Modern, fast interface
   - Paid (free tier available)

4. **DataGrip** (JetBrains)
   - Part of IntelliJ IDEA Ultimate
   - Professional IDE for databases
   - Paid

---

## 🚀 Next Steps

### **After Setup:**

1. ✅ **Test the Connection**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. ✅ **Verify Tables Created**
   ```sql
   psql -U lifehub_user -d lifehub_db
   \dt
   ```

3. ✅ **Test API Endpoints**
   ```bash
   # Register user
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

4. ✅ **Check Database**
   ```sql
   SELECT * FROM users;
   ```

### **Production Considerations:**

1. **Use Connection Pooling** (already configured with HikariCP)
2. **Enable SSL** for remote connections
3. **Set up Regular Backups**
4. **Monitor Performance**
5. **Use AWS RDS PostgreSQL** for cloud deployment

---

## 📝 Summary

✅ **PostgreSQL is installed and running**  
✅ **Database `lifehub_db` created**  
✅ **User `lifehub_user` created with privileges**  
✅ **Backend configured to use PostgreSQL**  
✅ **Tables auto-created by Hibernate**  
✅ **Ready to run the application!**

**Your LifeHub backend is now configured with PostgreSQL!** 🎉

---

## 🔗 Additional Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Spring Boot + PostgreSQL Guide](https://spring.io/guides/gs/accessing-data-postgresql/)
- [AWS RDS PostgreSQL](https://aws.amazon.com/rds/postgresql/)

---

**Need Help?** Check the troubleshooting section or PostgreSQL logs:
- macOS: `/usr/local/var/log/postgresql.log`
- Linux: `/var/log/postgresql/postgresql-*.log`
- Windows: Check PostgreSQL installation directory logs

