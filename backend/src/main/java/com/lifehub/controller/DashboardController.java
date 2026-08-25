package com.lifehub.controller;

import com.lifehub.dto.ApiResponse;
import com.lifehub.dto.WeeklyInsightResponse;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.IsoFields;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private Long getUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Authentication required");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getId();
    }

    @GetMapping("/insights")
    public ResponseEntity<ApiResponse<WeeklyInsightResponse>> getInsights(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);

            LocalDate weekStart = LocalDate.now().minusWeeks(1).with(DayOfWeek.MONDAY);
            String weekKey = weekStart.get(IsoFields.WEEK_BASED_YEAR) + "-W"
                    + String.format("%02d", weekStart.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR));

            String redisKey = "insight:" + userId + ":" + weekKey;
            Object cached = redisTemplate.opsForValue().get(redisKey);

            if (cached == null) {
                return ResponseEntity.ok(ApiResponse.success(
                        "No weekly insight is available yet. Check back after the next scheduled digest.", null));
            }

            return ResponseEntity.ok(ApiResponse.success((WeeklyInsightResponse) cached));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch weekly insight: " + e.getMessage()));
        }
    }
}
