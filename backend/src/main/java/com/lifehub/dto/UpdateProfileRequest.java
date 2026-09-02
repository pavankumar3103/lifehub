package com.lifehub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;

    @Email(message = "Invalid email format")
    private String email;

    private String currentPassword;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;
}