package com.lifehub.controller;

import com.lifehub.dto.*;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.MoodEntryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mood-entries")
@CrossOrigin(origins = "*")
public class MoodEntryController {

    @Autowired
    private MoodEntryService moodEntryService;

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
    public ResponseEntity<ApiResponse<MoodEntryResponse>> createMoodEntry(
            @Valid @RequestBody MoodEntryRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            MoodEntryResponse response = moodEntryService.createMoodEntry(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Mood entry created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MoodEntryResponse>>> getUserMoodEntries(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            List<MoodEntryResponse> entries = moodEntryService.getUserMoodEntries(userId);
            return ResponseEntity.ok(ApiResponse.success(entries));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch mood entries: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MoodEntryResponse>> getMoodEntryById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            MoodEntryResponse entry = moodEntryService.getMoodEntryById(userId, id);
            return ResponseEntity.ok(ApiResponse.success(entry));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MoodEntryResponse>> updateMoodEntry(
            @PathVariable Long id,
            @Valid @RequestBody MoodEntryRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            MoodEntryResponse response = moodEntryService.updateMoodEntry(userId, id, request);
            return ResponseEntity.ok(ApiResponse.success("Mood entry updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMoodEntry(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            moodEntryService.deleteMoodEntry(userId, id);
            return ResponseEntity.ok(ApiResponse.success("Mood entry deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}



