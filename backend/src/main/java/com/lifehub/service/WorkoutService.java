package com.lifehub.service;

import com.lifehub.dto.WorkoutRequest;
import com.lifehub.dto.WorkoutResponse;
import com.lifehub.model.User;
import com.lifehub.model.Workout;
import com.lifehub.repository.UserRepository;
import com.lifehub.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    @CacheEvict(value = "workouts", key = "#userId", allEntries = true)
    public WorkoutResponse createWorkout(Long userId, WorkoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Workout workout = new Workout();
        workout.setExerciseName(request.getExerciseName());
        workout.setDurationMinutes(request.getDurationMinutes());
        workout.setWorkoutDate(request.getWorkoutDate() != null ? request.getWorkoutDate() : LocalDate.now());
        workout.setUser(user);

        Workout saved = workoutRepository.save(workout);
        return mapToResponse(saved);
    }

    @Cacheable(value = "workouts", key = "#userId")
    public List<WorkoutResponse> getUserWorkouts(Long userId) {
        List<Workout> workouts = workoutRepository.findByUserId(userId);
        return workouts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "workouts", key = "#userId + '_' + #workoutId")
    public WorkoutResponse getWorkoutById(Long userId, Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to workout");
        }

        return mapToResponse(workout);
    }

    @CacheEvict(value = "workouts", key = "#userId", allEntries = true)
    public WorkoutResponse updateWorkout(Long userId, Long workoutId, WorkoutRequest request) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to workout");
        }

        workout.setExerciseName(request.getExerciseName());
        if (request.getDurationMinutes() != null) {
            workout.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getWorkoutDate() != null) {
            workout.setWorkoutDate(request.getWorkoutDate());
        }

        Workout updated = workoutRepository.save(workout);
        return mapToResponse(updated);
    }

    @CacheEvict(value = "workouts", key = "#userId", allEntries = true)
    public void deleteWorkout(Long userId, Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to workout");
        }

        workoutRepository.delete(workout);
    }

    private WorkoutResponse mapToResponse(Workout workout) {
        return new WorkoutResponse(
                workout.getId(),
                workout.getExerciseName(),
                workout.getDurationMinutes(),
                workout.getWorkoutDate()
        );
    }
}



