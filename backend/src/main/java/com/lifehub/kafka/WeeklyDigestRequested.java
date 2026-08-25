package com.lifehub.kafka;

import java.time.Instant;
import java.time.LocalDate;

public class WeeklyDigestRequested {

    private Long userId;
    private LocalDate weekStart;
    private String weekKey;
    private Instant requestedAt;

    public WeeklyDigestRequested() {
    }

    public WeeklyDigestRequested(Long userId, LocalDate weekStart, String weekKey, Instant requestedAt) {
        this.userId = userId;
        this.weekStart = weekStart;
        this.weekKey = weekKey;
        this.requestedAt = requestedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getWeekStart() {
        return weekStart;
    }

    public void setWeekStart(LocalDate weekStart) {
        this.weekStart = weekStart;
    }

    public String getWeekKey() {
        return weekKey;
    }

    public void setWeekKey(String weekKey) {
        this.weekKey = weekKey;
    }

    public Instant getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(Instant requestedAt) {
        this.requestedAt = requestedAt;
    }

    @Override
    public String toString() {
        return "WeeklyDigestRequested{" +
                "userId=" + userId +
                ", weekStart=" + weekStart +
                ", weekKey='" + weekKey + '\'' +
                ", requestedAt=" + requestedAt +
                '}';
    }
}
