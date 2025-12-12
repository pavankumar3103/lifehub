package com.lifehub.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "workouts")
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "workout_date", nullable = false)
    private LocalDate workoutDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Workout() {
    }

    public Workout(Long id, String exerciseName, Integer durationMinutes, LocalDate workoutDate, User user) {
        this.id = id;
        this.exerciseName = exerciseName;
        this.durationMinutes = durationMinutes;
        this.workoutDate = workoutDate;
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        if (workoutDate == null) {
            workoutDate = LocalDate.now();
        }
    }

    // Getters and Setters
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
