package com.lifehub.controller;

import com.lifehub.dto.*;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.MealService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "*")
public class MealController {

    @Autowired
    private MealService mealService;

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
    public ResponseEntity<ApiResponse<MealResponse>> createMeal(
            @Valid @RequestBody MealRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            MealResponse response = mealService.createMeal(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Meal created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MealResponse>>> getUserMeals(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            List<MealResponse> meals = mealService.getUserMeals(userId);
            return ResponseEntity.ok(ApiResponse.success(meals));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch meals: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MealResponse>> getMealById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            MealResponse meal = mealService.getMealById(userId, id);
            return ResponseEntity.ok(ApiResponse.success(meal));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MealResponse>> updateMeal(
            @PathVariable Long id,
            @Valid @RequestBody MealRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            MealResponse response = mealService.updateMeal(userId, id, request);
            return ResponseEntity.ok(ApiResponse.success("Meal updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMeal(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            mealService.deleteMeal(userId, id);
            return ResponseEntity.ok(ApiResponse.success("Meal deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}



