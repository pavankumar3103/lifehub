package com.lifehub.controller;

import com.lifehub.dto.*;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.HabitService;
import com.lifehub.util.CsvUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
public class HabitController {

    @Autowired
    private HabitService habitService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Authentication required");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HabitResponse>> createHabit(
            @Valid @RequestBody HabitRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            HabitResponse response = habitService.createHabit(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Habit created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HabitResponse>>> getUserHabits(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            List<HabitResponse> habits = habitService.getUserHabits(userId);
            return ResponseEntity.ok(ApiResponse.success(habits));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch habits: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<String> exportHabits(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            List<HabitResponse> habits = habitService.getUserHabits(userId);

            StringBuilder csv = new StringBuilder();
            csv.append("Id,Habit Name,Active,Created At\n");
            for (HabitResponse habit : habits) {
                csv.append(habit.getId() != null ? habit.getId() : "").append(',')
                        .append(CsvUtils.escapeCsv(habit.getHabitName())).append(',')
                        .append(habit.getIsActive() != null && habit.getIsActive() ? "Yes" : "No").append(',')
                        .append(habit.getCreatedAt() != null ? habit.getCreatedAt().toString() : "").append('\n');
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=habits.csv")
                    .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                    .body(csv.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to export habits: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HabitResponse>> getHabitById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            HabitResponse habit = habitService.getHabitById(userId, id);
            return ResponseEntity.ok(ApiResponse.success(habit));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HabitResponse>> updateHabit(
            @PathVariable Long id,
            @Valid @RequestBody HabitRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            HabitResponse response = habitService.updateHabit(userId, id, request);
            return ResponseEntity.ok(ApiResponse.success("Habit updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHabit(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            habitService.deleteHabit(userId, id);
            return ResponseEntity.ok(ApiResponse.success("Habit deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}



