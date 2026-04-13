package com.lifehub.controller;

import com.lifehub.dto.*;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.WorkoutService;
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
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

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
    public ResponseEntity<ApiResponse<WorkoutResponse>> createWorkout(
            @Valid @RequestBody WorkoutRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            WorkoutResponse response = workoutService.createWorkout(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Workout created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkoutResponse>>> getUserWorkouts(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            List<WorkoutResponse> workouts = workoutService.getUserWorkouts(userId);
            return ResponseEntity.ok(ApiResponse.success(workouts));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch workouts: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<String> exportWorkouts(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            List<WorkoutResponse> workouts = workoutService.getUserWorkouts(userId);

            StringBuilder csv = new StringBuilder();
            csv.append("Id,Exercise Name,Duration Minutes,Workout Date\n");
            for (WorkoutResponse workout : workouts) {
                csv.append(workout.getId() != null ? workout.getId() : "").append(',')
                        .append(CsvUtils.escapeCsv(workout.getExerciseName())).append(',')
                        .append(workout.getDurationMinutes() != null ? workout.getDurationMinutes() : "").append(',')
                        .append(workout.getWorkoutDate() != null ? workout.getWorkoutDate().toString() : "").append('\n');
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=workouts.csv")
                    .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                    .body(csv.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to export workouts: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkoutResponse>> getWorkoutById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            WorkoutResponse workout = workoutService.getWorkoutById(userId, id);
            return ResponseEntity.ok(ApiResponse.success(workout));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkoutResponse>> updateWorkout(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            WorkoutResponse response = workoutService.updateWorkout(userId, id, request);
            return ResponseEntity.ok(ApiResponse.success("Workout updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkout(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            workoutService.deleteWorkout(userId, id);
            return ResponseEntity.ok(ApiResponse.success("Workout deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}



