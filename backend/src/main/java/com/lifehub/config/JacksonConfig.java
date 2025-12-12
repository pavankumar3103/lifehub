package com.lifehub.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@Order(1) // Ensure this configuration runs early
public class JacksonConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(JacksonConfig.class);

    @PostConstruct
    public void init() {
        logger.info("=== JacksonConfig initialized - JavaTimeModule will be registered ===");
    }

    @Bean
    @Primary
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        logger.info("=== Configuring Jackson2ObjectMapperBuilderCustomizer with JavaTimeModule ===");
        return builder -> {
            builder.modules(new JavaTimeModule());
            builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            logger.info("JavaTimeModule added to builder, WRITE_DATES_AS_TIMESTAMPS disabled");
        };
    }

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        logger.info("=== Creating primary ObjectMapper with JavaTimeModule ===");
        ObjectMapper mapper = builder
                .modules(new JavaTimeModule())
                .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();
        
        // Force register JavaTimeModule to be absolutely sure
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // Verify JavaTimeModule is registered
        boolean hasModule = mapper.getRegisteredModuleIds().stream()
                .anyMatch(id -> id.toString().contains("JavaTimeModule") || id.toString().contains("jsr310"));
        
        if (hasModule) {
            logger.info("✓ JavaTimeModule successfully registered in ObjectMapper");
        } else {
            logger.error("✗ JavaTimeModule NOT registered in ObjectMapper!");
        }
        
        return mapper;
    }

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        logger.info("=== Extending message converters - replacing Jackson converter with JavaTimeModule ===");
        // Find and replace the default Jackson converter
        for (int i = 0; i < converters.size(); i++) {
            HttpMessageConverter<?> converter = converters.get(i);
            if (converter instanceof MappingJackson2HttpMessageConverter) {
                logger.info("Found MappingJackson2HttpMessageConverter at index {}, replacing it", i);
                
                // Use the builder that Spring Boot auto-configures (which should have our customizer applied)
                Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
                builder.modules(new JavaTimeModule());
                builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
                ObjectMapper configuredMapper = builder.build();
                
                // Force register to be absolutely sure
                configuredMapper.registerModule(new JavaTimeModule());
                configuredMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
                
                // Verify it's registered
                boolean hasModule = configuredMapper.getRegisteredModuleIds().stream()
                        .anyMatch(id -> id.toString().contains("JavaTimeModule") || id.toString().contains("jsr310"));
                
                if (hasModule) {
                    logger.info("✓ JavaTimeModule verified in new converter");
                } else {
                    logger.error("✗ JavaTimeModule NOT in new converter!");
                }
                
                converters.set(i, new MappingJackson2HttpMessageConverter(configuredMapper));
                logger.info("✓ Replaced MappingJackson2HttpMessageConverter with JavaTimeModule at index {}", i);
                break;
            }
        }
    }
}

