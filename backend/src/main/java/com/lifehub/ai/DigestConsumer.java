package com.lifehub.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifehub.dto.WeeklyInsightResponse;
import com.lifehub.kafka.WeeklyDigestRequested;
import com.lifehub.model.Meal;
import com.lifehub.model.MoodEntry;
import com.lifehub.model.Workout;
import com.lifehub.repository.MealRepository;
import com.lifehub.repository.MoodEntryRepository;
import com.lifehub.repository.WorkoutRepository;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
public class DigestConsumer {

    private static final Logger logger = LoggerFactory.getLogger(DigestConsumer.class);
    private static final Duration INSIGHT_TTL = Duration.ofDays(14);

    @Autowired
    private MoodEntryRepository moodEntryRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private LlmClient llmClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @KafkaListener(topics = "weekly-digest-requested", groupId = "weekly-digest-consumer")
    public void consume(ConsumerRecord<String, WeeklyDigestRequested> record) {
        WeeklyDigestRequested event = record.value();
        Long userId = event.getUserId();
        String weekKey = event.getWeekKey();
        LocalDate weekStart = event.getWeekStart();
        LocalDate weekEnd = weekStart.plusDays(6);

        try {
            List<MoodEntry> moods = moodEntryRepository.findByUserIdAndMoodDateBetween(userId, weekStart, weekEnd);
            List<Workout> workouts = workoutRepository.findByUserIdAndWorkoutDateBetween(userId, weekStart, weekEnd);
            List<Meal> meals = mealRepository.findByUserIdAndMealDateBetween(userId, weekStart, weekEnd);

            String prompt = buildPrompt(moods, workouts, meals);
            String rawJson = llmClient.generateJson(prompt);

            WeeklyInsightResponse insight = objectMapper.readValue(rawJson, WeeklyInsightResponse.class);
            insight.setWeekKey(weekKey);
            insight.setGeneratedAt(Instant.now());

            String redisKey = "insight:" + userId + ":" + weekKey;
            redisTemplate.opsForValue().set(redisKey, insight, INSIGHT_TTL);

            logger.info("Cached weekly insight for user {} week {}", userId, weekKey);
        } catch (Exception e) {
            logger.warn("Failed to generate weekly insight for user {} week {}: {}", userId, weekKey, e.getMessage());
        }
    }

    private String buildPrompt(List<MoodEntry> moods, List<Workout> workouts, List<Meal> meals) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a wellness assistant. Based on the following week of a user's logged activity, ")
                .append("write a concise summary of their week and one concrete, actionable suggestion for next week.\n\n");

        sb.append("Mood entries:\n");
        if (moods.isEmpty()) {
            sb.append("(none logged)\n");
        }
        for (MoodEntry m : moods) {
            sb.append("- ").append(m.getMoodDate()).append(": ").append(m.getMoodValue());
            if (m.getNotes() != null && !m.getNotes().isBlank()) {
                sb.append(" (notes: ").append(m.getNotes()).append(")");
            }
            sb.append("\n");
        }

        sb.append("\nWorkouts:\n");
        if (workouts.isEmpty()) {
            sb.append("(none logged)\n");
        }
        for (Workout w : workouts) {
            sb.append("- ").append(w.getWorkoutDate()).append(": ").append(w.getExerciseName());
            if (w.getDurationMinutes() != null) {
                sb.append(" for ").append(w.getDurationMinutes()).append(" minutes");
            }
            sb.append("\n");
        }

        sb.append("\nMeals:\n");
        if (meals.isEmpty()) {
            sb.append("(none logged)\n");
        }
        for (Meal meal : meals) {
            sb.append("- ").append(meal.getMealDate()).append(": ").append(meal.getDishName());
            if (meal.getQuantityGrams() != null) {
                sb.append(" (").append(meal.getQuantityGrams()).append("g)");
            }
            sb.append("\n");
        }

        sb.append("\nRespond with ONLY a JSON object matching exactly this shape, no other text: ")
                .append("{\"summary\": \"<2-3 sentence summary of the week>\", ")
                .append("\"suggestion\": \"<one concrete, actionable suggestion for next week>\"}");

        return sb.toString();
    }
}
