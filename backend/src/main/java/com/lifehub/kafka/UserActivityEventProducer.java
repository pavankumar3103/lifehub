package com.lifehub.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class UserActivityEventProducer {

    private static final Logger logger = LoggerFactory.getLogger(UserActivityEventProducer.class);
    private static final String TOPIC = "user-activity-events";

    @Autowired
    private KafkaTemplate<String, UserActivityEvent> kafkaTemplate;

    public void publish(Long userId, ActivityEventType eventType, Object payload) {
        UserActivityEvent event = new UserActivityEvent(userId, eventType, payload, Instant.now());
        try {
            kafkaTemplate.send(TOPIC, String.valueOf(userId), event)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            logger.warn("Failed to publish {} event for user {}: {}",
                                    eventType, userId, ex.getMessage());
                        }
                    });
        } catch (Exception ex) {
            logger.warn("Failed to publish {} event for user {}: {}", eventType, userId, ex.getMessage());
        }
    }
}
