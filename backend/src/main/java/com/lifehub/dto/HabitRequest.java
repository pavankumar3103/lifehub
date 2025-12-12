package com.lifehub.dto;

import jakarta.validation.constraints.NotBlank;

public class HabitRequest {
    @NotBlank(message = "Habit name is required")
    private String habitName;
    
    private Boolean isActive = true;

    public String getHabitName() {
        return habitName;
    }

    public void setHabitName(String habitName) {
        this.habitName = habitName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}



