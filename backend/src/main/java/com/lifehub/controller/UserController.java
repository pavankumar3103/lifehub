package com.lifehub.controller;

import com.lifehub.dto.ApiResponse;
import com.lifehub.dto.UpdateProfileRequest;
import com.lifehub.dto.UserResponse;
import com.lifehub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        try {
            String email = authentication.getName();

            UserResponse updatedUser = authService.updateProfile(email, request);

            return ResponseEntity.ok(
                    ApiResponse.success("Profile updated successfully", updatedUser)
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}