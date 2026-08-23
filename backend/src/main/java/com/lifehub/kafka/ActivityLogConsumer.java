package com.lifehub.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ActivityLogConsumer {

    private static final Logger logger = LoggerFactory.getLogger(ActivityLogConsumer.class);

    // Placeholder for a durable dedup store (e.g. DB table or Redis set) once
    // events carry a stable id. Tracks record keys already processed in this
    // instance's lifetime so the check-then-act shape is in place from day one.
    private final Set<String> processedRecordKeys = ConcurrentHashMap.newKeySet();

    @KafkaListener(topics = "user-activity-events", groupId = "${spring.kafka.consumer.group-id:activity-log-consumer}")
    public void consume(ConsumerRecord<String, UserActivityEvent> record) {
        String recordKey = record.topic() + "-" + record.partition() + "-" + record.offset();

        if (processedRecordKeys.contains(recordKey)) {
            logger.debug("Skipping already-processed record {}", recordKey);
            return;
        }

        UserActivityEvent event = record.value();
        logger.info("Received activity event: {}", event);

        processedRecordKeys.add(recordKey);
    }
}
