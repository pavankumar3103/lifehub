package com.lifehub.service;

import com.lifehub.dto.HabitRequest;
import com.lifehub.dto.HabitResponse;
import com.lifehub.model.Habit;
import com.lifehub.model.User;
import com.lifehub.repository.HabitRepository;
import com.lifehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HabitService {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository;

    @CacheEvict(value = {"habits", "analytics"}, key = "#userId", allEntries = true)
    public HabitResponse createHabit(Long userId, HabitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Habit habit = new Habit();
        habit.setHabitName(request.getHabitName());
        habit.setUser(user);
        habit.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        Habit saved = habitRepository.save(habit);
        return mapToResponse(saved);
    }

    @Cacheable(value = "habits", key = "#userId")
    public List<HabitResponse> getUserHabits(Long userId) {
        List<Habit> habits = habitRepository.findByUserId(userId);
        return habits.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "habits", key = "#userId + '_' + #habitId")
    public HabitResponse getHabitById(Long userId, Long habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to habit");
        }

        return mapToResponse(habit);
    }

    @CacheEvict(value = {"habits", "analytics"}, key = "#userId", allEntries = true)
    public HabitResponse updateHabit(Long userId, Long habitId, HabitRequest request) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to habit");
        }

        habit.setHabitName(request.getHabitName());
        if (request.getIsActive() != null) {
            habit.setIsActive(request.getIsActive());
        }

        Habit updated = habitRepository.save(habit);
        return mapToResponse(updated);
    }

    @CacheEvict(value = {"habits", "analytics"}, key = "#userId", allEntries = true)
    public void deleteHabit(Long userId, Long habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to habit");
        }

        habitRepository.delete(habit);
    }

    private HabitResponse mapToResponse(Habit habit) {
        return new HabitResponse(
                habit.getId(),
                habit.getHabitName(),
                habit.getIsActive(),
                habit.getCreatedAt()
        );
    }
}
