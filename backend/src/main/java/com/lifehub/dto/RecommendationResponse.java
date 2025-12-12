package com.lifehub.dto;

import java.util.List;

public class RecommendationResponse {
    private List<Recommendation> recommendations;
    private String summary;

    public RecommendationResponse() {
    }

    public RecommendationResponse(List<Recommendation> recommendations, String summary) {
        this.recommendations = recommendations;
        this.summary = summary;
    }

    public List<Recommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<Recommendation> recommendations) {
        this.recommendations = recommendations;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    // Inner class for individual recommendations
    public static class Recommendation {
        private String type;
        private String title;
        private String description;
        private String priority; // HIGH, MEDIUM, LOW
        private String suggestedAction;

        public Recommendation() {
        }

        public Recommendation(String type, String title, String description, String priority, String suggestedAction) {
            this.type = type;
            this.title = title;
            this.description = description;
            this.priority = priority;
            this.suggestedAction = suggestedAction;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        public String getSuggestedAction() {
            return suggestedAction;
        }

        public void setSuggestedAction(String suggestedAction) {
            this.suggestedAction = suggestedAction;
        }
    }
}

