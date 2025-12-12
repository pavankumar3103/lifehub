package com.lifehub.service;

import com.lifehub.dto.MoodEntryRequest;
import com.lifehub.dto.MoodEntryResponse;
import com.lifehub.model.MoodEntry;
import com.lifehub.model.User;
import com.lifehub.repository.MoodEntryRepository;
import com.lifehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MoodEntryService {

    @Autowired
    private MoodEntryRepository moodEntryRepository;

    @Autowired
    private UserRepository userRepository;

    @CacheEvict(value = "moodEntries", key = "#userId", allEntries = true)
    public MoodEntryResponse createMoodEntry(Long userId, MoodEntryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate moodDate = request.getMoodDate() != null ? request.getMoodDate() : LocalDate.now();

        // Check if mood entry already exists for this date
        Optional<MoodEntry> existingEntry = moodEntryRepository.findByUserIdAndMoodDate(userId, moodDate);
        
        MoodEntry moodEntry;
        if (existingEntry.isPresent()) {
            // Update existing entry
            moodEntry = existingEntry.get();
            moodEntry.setMoodValue(request.getMoodValue());
            moodEntry.setNotes(request.getNotes());
        } else {
            // Create new entry
            moodEntry = new MoodEntry();
            moodEntry.setMoodValue(request.getMoodValue());
            moodEntry.setMoodDate(moodDate);
            moodEntry.setNotes(request.getNotes());
            moodEntry.setUser(user);
        }

        MoodEntry saved = moodEntryRepository.save(moodEntry);
        return mapToResponse(saved);
    }

    @Cacheable(value = "moodEntries", key = "#userId")
    public List<MoodEntryResponse> getUserMoodEntries(Long userId) {
        List<MoodEntry> entries = moodEntryRepository.findByUserId(userId);
        return entries.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "moodEntries", key = "#userId + '_' + #moodEntryId")
    public MoodEntryResponse getMoodEntryById(Long userId, Long moodEntryId) {
        MoodEntry moodEntry = moodEntryRepository.findById(moodEntryId)
                .orElseThrow(() -> new RuntimeException("Mood entry not found"));

        if (!moodEntry.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to mood entry");
        }

        return mapToResponse(moodEntry);
    }

    @CacheEvict(value = "moodEntries", key = "#userId", allEntries = true)
    public MoodEntryResponse updateMoodEntry(Long userId, Long moodEntryId, MoodEntryRequest request) {
        MoodEntry moodEntry = moodEntryRepository.findById(moodEntryId)
                .orElseThrow(() -> new RuntimeException("Mood entry not found"));

        if (!moodEntry.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to mood entry");
        }

        moodEntry.setMoodValue(request.getMoodValue());
        if (request.getNotes() != null) {
            moodEntry.setNotes(request.getNotes());
        }
        if (request.getMoodDate() != null) {
            moodEntry.setMoodDate(request.getMoodDate());
        }

        MoodEntry updated = moodEntryRepository.save(moodEntry);
        return mapToResponse(updated);
    }

    @CacheEvict(value = "moodEntries", key = "#userId", allEntries = true)
    public void deleteMoodEntry(Long userId, Long moodEntryId) {
        MoodEntry moodEntry = moodEntryRepository.findById(moodEntryId)
                .orElseThrow(() -> new RuntimeException("Mood entry not found"));

        if (!moodEntry.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to mood entry");
        }

        moodEntryRepository.delete(moodEntry);
    }

    private MoodEntryResponse mapToResponse(MoodEntry moodEntry) {
        return new MoodEntryResponse(
                moodEntry.getId(),
                moodEntry.getMoodValue(),
                moodEntry.getMoodDate(),
                moodEntry.getNotes()
        );
    }
}



