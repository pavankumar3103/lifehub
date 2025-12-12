package com.lifehub.controller;

import com.lifehub.dto.ApiResponse;
import com.lifehub.dto.HabitAnalyticsResponse;
import com.lifehub.dto.RecommendationResponse;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/habits")
    public ResponseEntity<ApiResponse<HabitAnalyticsResponse>> getHabitAnalytics(
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            HabitAnalyticsResponse analytics = analyticsService.analyzeHabitPatterns(userId);
            return ResponseEntity.ok(ApiResponse.success(analytics));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to analyze habits: " + e.getMessage()));
        }
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<RecommendationResponse>> getRecommendations(
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            RecommendationResponse recommendations = analyticsService.generateRecommendations(userId);
            return ResponseEntity.ok(ApiResponse.success(recommendations));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to generate recommendations: " + e.getMessage()));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Object>> getAnalyticsSummary(
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            HabitAnalyticsResponse analytics = analyticsService.analyzeHabitPatterns(userId);
            RecommendationResponse recommendations = analyticsService.generateRecommendations(userId);
            
            // Create a summary object
            java.util.Map<String, Object> summary = new java.util.HashMap<>();
            summary.put("totalHabits", analytics.getTotalHabits());
            summary.put("activeHabits", analytics.getActiveHabits());
            summary.put("recommendationsCount", recommendations.getRecommendations().size());
            summary.put("summary", recommendations.getSummary());
            
            return ResponseEntity.ok(ApiResponse.success(summary));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to get analytics summary: " + e.getMessage()));
        }
    }
}

