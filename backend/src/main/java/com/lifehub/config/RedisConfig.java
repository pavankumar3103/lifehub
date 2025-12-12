package com.lifehub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.cache.Cache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.cache.support.NoOpCache;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.fasterxml.jackson.databind.JavaType;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableCaching
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    @Value("${spring.cache.type:none}")
    private String cacheType;

    private RedisConnectionFactory redisConnectionFactory() throws Exception {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(redisHost);
        config.setPort(redisPort);
        if (redisPassword != null && !redisPassword.isEmpty()) {
            config.setPassword(RedisPassword.of(redisPassword));
        }
        LettuceConnectionFactory factory = new LettuceConnectionFactory(config);
        // Set connection timeout to fail fast if Redis is not available
        factory.setValidateConnection(true);
        return factory;
    }

    @Bean
    @ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis", matchIfMissing = false)
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        
        // Configure ObjectMapper with type information for proper deserialization
        // This ensures cached collections (List<HabitResponse>, etc.) are deserialized correctly
        ObjectMapper om = objectMapper.copy();
        om.activateDefaultTyping(
            om.getPolymorphicTypeValidator(),
            ObjectMapper.DefaultTyping.NON_FINAL,
            com.fasterxml.jackson.annotation.JsonTypeInfo.As.PROPERTY
        );
        GenericJackson2JsonRedisSerializer valueSerializer = new GenericJackson2JsonRedisSerializer(om);
        
        template.setValueSerializer(valueSerializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(valueSerializer);
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    @Primary
    public CacheManager cacheManager(ObjectMapper objectMapper) {
        // If cache type is not set to redis, use NoOp cache manager
        if (cacheType == null || !cacheType.equalsIgnoreCase("redis")) {
            System.out.println("Cache type is not 'redis', using NoOp cache manager. Caching disabled.");
            return createNoOpCacheManager();
        }
        
        // Try to create Redis cache manager
        try {
            RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
            config.setHostName(redisHost);
            config.setPort(redisPort);
            if (redisPassword != null && !redisPassword.isEmpty()) {
                config.setPassword(RedisPassword.of(redisPassword));
            }
            LettuceConnectionFactory factory = new LettuceConnectionFactory(config);
            // Don't validate connection immediately - let it fail lazily
            factory.setValidateConnection(false);
            factory.afterPropertiesSet();
            
            // Use the application's primary ObjectMapper (injected) so JavaTimeModule is applied consistently
            // Create a copy to avoid modifying the shared ObjectMapper
            ObjectMapper om = objectMapper.copy();
            // Configure type information for proper deserialization of generic types (List<HabitResponse>, etc.)
            // This ensures cached lists are deserialized correctly
            om.activateDefaultTyping(
                om.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.NON_FINAL,
                com.fasterxml.jackson.annotation.JsonTypeInfo.As.PROPERTY
            );
            GenericJackson2JsonRedisSerializer valueSerializer = new GenericJackson2JsonRedisSerializer(om);

            RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(30)) // Default TTL: 30 minutes
                    .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                    .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(valueSerializer))
                    .disableCachingNullValues();

            // Define cache-specific configurations
            RedisCacheConfiguration userCacheConfig = defaultConfig.entryTtl(Duration.ofHours(1)); // User profile cache: 1 hour
            RedisCacheConfiguration habitsCacheConfig = defaultConfig.entryTtl(Duration.ofMinutes(15)); // Habits cache: 15 minutes
            RedisCacheConfiguration mealsCacheConfig = defaultConfig.entryTtl(Duration.ofMinutes(15)); // Meals cache: 15 minutes
            RedisCacheConfiguration workoutsCacheConfig = defaultConfig.entryTtl(Duration.ofMinutes(15)); // Workouts cache: 15 minutes
            RedisCacheConfiguration moodCacheConfig = defaultConfig.entryTtl(Duration.ofMinutes(10)); // Mood entries cache: 10 minutes
            RedisCacheConfiguration analyticsCacheConfig = defaultConfig.entryTtl(Duration.ofMinutes(20)); // Analytics cache: 20 minutes

            return RedisCacheManager.builder(factory)
                    .cacheDefaults(defaultConfig)
                    .withCacheConfiguration("users", userCacheConfig)
                    .withCacheConfiguration("habits", habitsCacheConfig)
                    .withCacheConfiguration("meals", mealsCacheConfig)
                    .withCacheConfiguration("workouts", workoutsCacheConfig)
                    .withCacheConfiguration("moodEntries", moodCacheConfig)
                    .withCacheConfiguration("analytics", analyticsCacheConfig)
                    .build();
        } catch (Exception e) {
            // If Redis is not available, return a NoOp cache manager
            // This allows @Cacheable annotations to work without actually caching
            System.err.println("WARNING: Redis not available, using NoOp cache manager. Caching disabled. Error: " + e.getMessage());
            e.printStackTrace();
            return createNoOpCacheManager();
        }
    }
    
    private SimpleCacheManager createNoOpCacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        List<Cache> caches = Arrays.asList(
            new NoOpCache("users"),
            new NoOpCache("habits"),
            new NoOpCache("meals"),
            new NoOpCache("workouts"),
            new NoOpCache("moodEntries"),
            new NoOpCache("analytics")
        );
        cacheManager.setCaches(caches);
        cacheManager.afterPropertiesSet();
        return cacheManager;
    }
}
