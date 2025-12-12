package com.lifehub.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class WorkoutResponse {
    private Long id;
    private String exerciseName;
    private Integer durationMinutes;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate workoutDate;

    public WorkoutResponse() {
    }

    public WorkoutResponse(Long id, String exerciseName, Integer durationMinutes, LocalDate workoutDate) {
        this.id = id;
        this.exerciseName = exerciseName;
        this.durationMinutes = durationMinutes;
        this.workoutDate = workoutDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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



