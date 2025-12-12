package com.lifehub.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class WorkoutRequest {
    @NotBlank(message = "Exercise name is required")
    private String exerciseName;
    
    private Integer durationMinutes;
    
    private LocalDate workoutDate;

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDate getWorkoutDate() {
        return workoutDate;
    }

    public void setWorkoutDate(LocalDate workoutDate) {
        this.workoutDate = workoutDate;
    }
}



