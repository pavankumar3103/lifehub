package com.lifehub.kafka;

import java.time.Instant;

public class UserActivityEvent {

    private Long userId;
    private ActivityEventType eventType;
    private Object payload;
    private Instant timestamp;

    public UserActivityEvent() {
    }

    public UserActivityEvent(Long userId, ActivityEventType eventType, Object payload, Instant timestamp) {
        this.userId = userId;
        this.eventType = eventType;
        this.payload = payload;
        this.timestamp = timestamp;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public ActivityEventType getEventType() {
        return eventType;
    }

    public void setEventType(ActivityEventType eventType) {
        this.eventType = eventType;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "UserActivityEvent{" +
                "userId=" + userId +
                ", eventType=" + eventType +
                ", payload=" + payload +
                ", timestamp=" + timestamp +
                '}';
    }
}
