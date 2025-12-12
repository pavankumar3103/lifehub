# 🚀 How to Run LifeHub Backend

## Quick Start Commands

### **Prerequisites Check**
First, verify you have everything installed:

```bash
# Check Java version (must be 17+)
java -version

# Check Maven version
mvn -version

# Check PostgreSQL is running
psql --version
```

---

## Step-by-Step Run Instructions

### **Step 1: Navigate to Backend Directory**
```bash
cd /Users/pavan-work/Desktop/lifehub/backend
```

### **Step 2: Verify PostgreSQL is Running**
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# If not running, start it
brew services start postgresql@15

# OR for Linux
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### **Step 3: Verify Database Connection**
```bash
# Test connection
psql -U lifehub_user -d lifehub_db

# If connection works, exit
\q
```

### **Step 4: Clean Previous Builds (Optional but Recommended)**
```bash
mvn clean
```

### **Step 5: Build the Project**
```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile Java source files
- Run tests (if any)
- Package the application

**Expected output:** `BUILD SUCCESS`

### **Step 6: Run the Backend Server**
```bash
mvn spring-boot:run
```

**OR if you prefer to run the JAR directly:**

```bash
# First package the application
mvn clean package

# Then run the JAR
java -jar target/lifehub-backend-1.0.0.jar
```

---

## 🎯 One-Line Command (All Steps Combined)

If you're already in the backend directory:

```bash
mvn clean install && mvn spring-boot:run
```

---

## ✅ What You Should See

When the server starts successfully, you'll see:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2025-01-XX INFO  --- [  restartedMain] c.lifehub.LifeHubApplication        : Starting LifeHubApplication
2025-01-XX INFO  --- [  restartedMain] c.lifehub.LifeHubApplication        : No active profile set, falling back to default
2025-01-XX INFO  --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http)
2025-01-XX INFO  --- [  restartedMain] c.lifehub.LifeHubApplication        : Started LifeHubApplication in X.XXX seconds
```

**The backend is now running at:** `http://localhost:8080`

---

## 🧪 Test the Backend

Open a **new terminal window** (keep the server running) and test:

### **1. Test Health (Should fail with 401 - no auth)**
```bash
curl http://localhost:8080/api/auth/me
```

Expected: `{"success":false,"message":"Unauthorized"}` or similar

### **2. Register a New User**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

Expected: Response with JWT token and user info

### **3. Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

Expected: Response with JWT token

### **4. Test Protected Endpoint (with token)**
```bash
# Save token from login response, then:
curl -X GET http://localhost:8080/api/habits \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: Empty array `[]` or list of habits

---

## 🛠️ Alternative Ways to Run

### **Option 1: Using IntelliJ IDEA**
1. Open IntelliJ IDEA
2. File → Open → Select `backend` folder
3. Wait for Maven to sync dependencies
4. Find `LifeHubApplication.java`
5. Right-click → Run 'LifeHubApplication'

### **Option 2: Using VS Code**
1. Install Java Extension Pack
2. Open `backend` folder
3. Open `LifeHubApplication.java`
4. Click "Run" button above `main` method

### **Option 3: Using Eclipse**
1. File → Import → Maven → Existing Maven Projects
2. Select `backend` folder
3. Find `LifeHubApplication.java`
4. Right-click → Run As → Java Application

---

## 🔧 Troubleshooting

### **Issue: Port 8080 Already in Use**

**Error:**
```
Port 8080 is already in use
```

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# OR change port in application.properties
server.port=8081
```

### **Issue: Database Connection Failed**

**Error:**
```
Connection to localhost:5432 refused
```

**Solution:**
```bash
# Start PostgreSQL
brew services start postgresql@15

# Verify database exists
psql -U lifehub_user -d lifehub_db -c "SELECT 1;"
```

### **Issue: Java Version Wrong**

**Error:**
```
Unsupported class file major version
```

**Solution:**
```bash
# Check Java version (must be 17+)
java -version

# Install Java 17 if needed
# macOS: brew install openjdk@17
# Set JAVA_HOME if needed
```

### **Issue: Maven Dependencies Download Fails**

**Error:**
```
Could not resolve dependencies
```

**Solution:**
```bash
# Clear Maven cache and retry
rm -rf ~/.m2/repository
mvn clean install -U
```

### **Issue: Compilation Errors**

**Error:**
```
[ERROR] Compilation failure
```

**Solution:**
```bash
# Clean and rebuild
mvn clean
mvn compile

# Check for syntax errors in Java files
```

---

## 📊 Verify Database Tables Created

After first run, check that tables were created:

```bash
psql -U lifehub_user -d lifehub_db

# List tables
\dt

# Should show:
# users
# habits
# meals
# workouts
# mood_entries

# View a table structure
\d users

# Exit
\q
```

---

## 🔄 Development Workflow

### **For Development:**
```bash
# Terminal 1: Run backend (keep running)
cd backend
mvn spring-boot:run

# Terminal 2: Make changes, then restart
# Spring Boot DevTools will auto-restart on file changes
```

### **For Testing:**
```bash
# Run tests
mvn test

# Run specific test
mvn test -Dtest=AuthControllerTest
```

### **For Production Build:**
```bash
# Create production JAR
mvn clean package -DskipTests

# The JAR will be in: target/lifehub-backend-1.0.0.jar
```

---

## 🎯 Quick Command Reference

```bash
# Navigate to backend
cd backend

# Clean build artifacts
mvn clean

# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Package JAR
mvn clean package

# Run JAR
java -jar target/lifehub-backend-1.0.0.jar

# Check logs
tail -f logs/application.log  # If logging to file
```

---

## 📝 Environment Variables (Optional)

For production, use environment variables:

```bash
export DB_USERNAME=lifehub_user
export DB_PASSWORD=lifehub
export JWT_SECRET=your-very-long-secret-key

mvn spring-boot:run
```

---

## ✅ Checklist Before Running

- [ ] PostgreSQL is installed and running
- [ ] Database `lifehub_db` exists
- [ ] User `lifehub_user` exists with correct password
- [ ] Java 17+ is installed
- [ ] Maven is installed
- [ ] `application.properties` is configured correctly
- [ ] Port 8080 is available

---

## 🎉 Success!

Once the server is running, you'll see:

```
Started LifeHubApplication in X.XXX seconds
```

**Your backend is now live at:** `http://localhost:8080`

**Test it:** Open browser or use curl to test endpoints!

---

## 📚 Next Steps

1. ✅ Backend is running
2. 🔄 Test all API endpoints
3. 🔄 Connect frontend to backend
4. 🔄 Start building features!

---

**Need help?** Check the troubleshooting section or application logs for errors.

