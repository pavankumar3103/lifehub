package com.lifehub.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class MoodEntryRequest {
    @NotBlank(message = "Mood value is required")
    private String moodValue;
    
    private LocalDate moodDate;
    
    private String notes;

    public String getMoodValue() {
        return moodValue;
    }

    public void setMoodValue(String moodValue) {
        this.moodValue = moodValue;
    }

    public LocalDate getMoodDate() {
        return moodDate;
    }

    public void setMoodDate(LocalDate moodDate) {
        this.moodDate = moodDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}



