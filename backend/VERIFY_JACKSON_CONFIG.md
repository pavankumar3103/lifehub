# How to Verify Jackson Configuration is Working

## Step 1: Restart the Backend

**IMPORTANT**: You MUST fully stop and restart the backend for the configuration changes to take effect.

```bash
# Stop the backend (Ctrl+C in the terminal where it's running)
# Then restart:
cd backend
mvn spring-boot:run
```

## Step 2: Check Backend Startup Logs

When the backend starts, you should see these log messages:

```
=== JacksonConfig initialized - JavaTimeModule will be registered ===
=== Configuring Jackson2ObjectMapperBuilderCustomizer with JavaTimeModule ===
=== Creating primary ObjectMapper with JavaTimeModule ===
✓ JavaTimeModule successfully registered in ObjectMapper
=== Extending message converters - replacing Jackson converter with JavaTimeModule ===
Found MappingJackson2HttpMessageConverter at index X, replacing it
✓ JavaTimeModule verified in new converter
✓ Replaced MappingJackson2HttpMessageConverter with JavaTimeModule at index X
```

**If you DON'T see these logs**, the configuration isn't loading. Check:
- Is the backend actually restarted?
- Are there any compilation errors?
- Is the `JacksonConfig.java` file in the correct location?

## Step 3: Test the API

After restarting, try making API calls. The date/time serialization errors should be gone.

## Troubleshooting

If you still see errors after restarting:

1. **Check if the backend is actually using the new code:**
   - Look for the log messages above
   - If they're not there, the backend might not have restarted properly

2. **Verify the configuration file exists:**
   - `backend/src/main/java/com/lifehub/config/JacksonConfig.java`

3. **Check for compilation errors:**
   ```bash
   cd backend
   mvn clean compile
   ```

4. **Check backend logs for any errors during startup**
