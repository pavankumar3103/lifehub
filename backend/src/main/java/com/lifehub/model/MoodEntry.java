package com.lifehub.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "mood_entries")
public class MoodEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mood_value", nullable = false)
    private String moodValue;

    @Column(name = "mood_date", nullable = false)
    private LocalDate moodDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public MoodEntry() {
    }

    public MoodEntry(Long id, String moodValue, LocalDate moodDate, String notes, User user) {
        this.id = id;
        this.moodValue = moodValue;
        this.moodDate = moodDate;
        this.notes = notes;
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        if (moodDate == null) {
            moodDate = LocalDate.now();
        }
    }

    // Getters and Setters
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
