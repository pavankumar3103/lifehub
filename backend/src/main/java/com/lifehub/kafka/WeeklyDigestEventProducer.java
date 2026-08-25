package com.lifehub.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;

@Component
public class WeeklyDigestEventProducer {

    private static final Logger logger = LoggerFactory.getLogger(WeeklyDigestEventProducer.class);
    private static final String TOPIC = "weekly-digest-requested";

    @Autowired
    private KafkaTemplate<String, WeeklyDigestRequested> kafkaTemplate;

    public void publish(Long userId, LocalDate weekStart, String weekKey) {
        WeeklyDigestRequested event = new WeeklyDigestRequested(userId, weekStart, weekKey, Instant.now());
        try {
            kafkaTemplate.send(TOPIC, String.valueOf(userId), event)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            logger.warn("Failed to publish weekly digest request for user {} week {}: {}",
                                    userId, weekKey, ex.getMessage());
                        }
                    });
        } catch (Exception ex) {
            logger.warn("Failed to publish weekly digest request for user {} week {}: {}",
                    userId, weekKey, ex.getMessage());
        }
    }
}
