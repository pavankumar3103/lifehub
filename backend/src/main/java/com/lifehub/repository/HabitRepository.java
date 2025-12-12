package com.lifehub.repository;

import com.lifehub.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserId(Long userId);
    List<Habit> findByUserIdAndIsActive(Long userId, Boolean isActive);
}



