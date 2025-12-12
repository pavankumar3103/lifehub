package com.lifehub.dto;

import java.util.List;

public class HabitAnalyticsResponse {
    private Integer totalHabits;
    private Integer activeHabits;
    private Integer inactiveHabits;
    private Double activeHabitsPercentage;
    private Double averageHabitAgeDays;
    private Integer oldestHabitAgeDays;
    private Integer newestHabitAgeDays;
    private List<HabitCategoryStats> categoryStats;
    private List<String> insights;

    public HabitAnalyticsResponse() {
    }

    public HabitAnalyticsResponse(Integer totalHabits, Integer activeHabits, Integer inactiveHabits,
                                  Double activeHabitsPercentage, Double averageHabitAgeDays,
                                  Integer oldestHabitAgeDays, Integer newestHabitAgeDays,
                                  List<HabitCategoryStats> categoryStats, List<String> insights) {
        this.totalHabits = totalHabits;
        this.activeHabits = activeHabits;
        this.inactiveHabits = inactiveHabits;
        this.activeHabitsPercentage = activeHabitsPercentage;
        this.averageHabitAgeDays = averageHabitAgeDays;
        this.oldestHabitAgeDays = oldestHabitAgeDays;
        this.newestHabitAgeDays = newestHabitAgeDays;
        this.categoryStats = categoryStats;
        this.insights = insights;
    }

    // Getters and Setters
    public Integer getTotalHabits() {
        return totalHabits;
    }

    public void setTotalHabits(Integer totalHabits) {
        this.totalHabits = totalHabits;
    }

    public Integer getActiveHabits() {
        return activeHabits;
    }

    public void setActiveHabits(Integer activeHabits) {
        this.activeHabits = activeHabits;
    }

    public Integer getInactiveHabits() {
        return inactiveHabits;
    }

    public void setInactiveHabits(Integer inactiveHabits) {
        this.inactiveHabits = inactiveHabits;
    }

    public Double getActiveHabitsPercentage() {
        return activeHabitsPercentage;
    }

    public void setActiveHabitsPercentage(Double activeHabitsPercentage) {
        this.activeHabitsPercentage = activeHabitsPercentage;
    }

    public Double getAverageHabitAgeDays() {
        return averageHabitAgeDays;
    }

    public void setAverageHabitAgeDays(Double averageHabitAgeDays) {
        this.averageHabitAgeDays = averageHabitAgeDays;
    }

    public Integer getOldestHabitAgeDays() {
        return oldestHabitAgeDays;
    }

    public void setOldestHabitAgeDays(Integer oldestHabitAgeDays) {
        this.oldestHabitAgeDays = oldestHabitAgeDays;
    }

    public Integer getNewestHabitAgeDays() {
        return newestHabitAgeDays;
    }

    public void setNewestHabitAgeDays(Integer newestHabitAgeDays) {
        this.newestHabitAgeDays = newestHabitAgeDays;
    }

    public List<HabitCategoryStats> getCategoryStats() {
        return categoryStats;
    }

    public void setCategoryStats(List<HabitCategoryStats> categoryStats) {
        this.categoryStats = categoryStats;
    }

    public List<String> getInsights() {
        return insights;
    }

    public void setInsights(List<String> insights) {
        this.insights = insights;
    }

    // Inner class for category statistics
    public static class HabitCategoryStats {
        private String category;
        private Integer count;
        private Integer activeCount;

        public HabitCategoryStats() {
        }

        public HabitCategoryStats(String category, Integer count, Integer activeCount) {
            this.category = category;
            this.count = count;
            this.activeCount = activeCount;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public Integer getCount() {
            return count;
        }

        public void setCount(Integer count) {
            this.count = count;
        }

        public Integer getActiveCount() {
            return activeCount;
        }

        public void setActiveCount(Integer activeCount) {
            this.activeCount = activeCount;
        }
    }
}

