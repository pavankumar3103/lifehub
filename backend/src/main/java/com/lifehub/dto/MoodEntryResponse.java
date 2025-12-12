package com.lifehub.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class MoodEntryResponse {
    private Long id;
    private String moodValue;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate moodDate;
    private String notes;

    public MoodEntryResponse() {
    }

    public MoodEntryResponse(Long id, String moodValue, LocalDate moodDate, String notes) {
        this.id = id;
        this.moodValue = moodValue;
        this.moodDate = moodDate;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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



