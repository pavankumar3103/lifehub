package com.lifehub.repository;

import com.lifehub.model.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {
    List<MoodEntry> findByUserId(Long userId);
    Optional<MoodEntry> findByUserIdAndMoodDate(Long userId, LocalDate moodDate);
    List<MoodEntry> findByUserIdAndMoodDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}



