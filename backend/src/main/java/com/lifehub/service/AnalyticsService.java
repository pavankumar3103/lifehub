package com.lifehub.service;

import com.lifehub.dto.HabitAnalyticsResponse;
import com.lifehub.dto.HabitResponse;
import com.lifehub.dto.RecommendationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnalyticsService {

    @Autowired
    private HabitService habitService;
    
    @Autowired
    private ObjectMapper objectMapper;

    // Common habit categories based on keywords
    private static final Map<String, String> CATEGORY_KEYWORDS = Map.of(
            "Exercise", "exercise|workout|gym|run|jog|yoga|fitness|cardio|strength|walk|swim|bike|cycling",
            "Health", "meditation|sleep|water|vitamin|health|wellness|hydration|stretch|breath",
            "Learning", "read|study|learn|course|book|education|practice|skill|language",
            "Productivity", "focus|productivity|task|plan|organize|schedule|journal|review|goal",
            "Social", "call|meet|friend|family|social|connect|chat|visit|network",
            "Creative", "write|draw|paint|music|creative|art|design|craft|compose",
            "Finance", "save|budget|invest|money|finance|expense|track|spending"
    );
    
    // Complementary habits - habits that work well together
    private static final Map<String, List<String>> COMPLEMENTARY_HABITS = Map.of(
            "Exercise", List.of("Stretch after workout", "Drink water", "Track progress"),
            "Health", List.of("Morning meditation", "Evening reflection", "Sleep schedule"),
            "Learning", List.of("Take notes", "Practice daily", "Review weekly"),
            "Productivity", List.of("Morning planning", "Evening review", "Time blocking"),
            "Social", List.of("Weekly check-in", "Gratitude practice", "Quality time"),
            "Creative", List.of("Daily practice", "Share work", "Seek feedback"),
            "Finance", List.of("Track expenses", "Review budget", "Set savings goals")
    );
    
    // Category-specific habit suggestions
    private static final Map<String, List<Map<String, String>>> CATEGORY_SUGGESTIONS = Map.of(
            "Exercise", List.of(
                    Map.of("name", "Morning Walk", "description", "Start your day with a 20-minute walk for energy and mental clarity"),
                    Map.of("name", "Stretch Daily", "description", "5-10 minutes of stretching improves flexibility and reduces injury risk"),
                    Map.of("name", "Strength Training", "description", "2-3 times per week for muscle strength and bone health")
            ),
            "Health", List.of(
                    Map.of("name", "Drink 8 Glasses Water", "description", "Stay hydrated throughout the day for better energy and focus"),
                    Map.of("name", "7-8 Hours Sleep", "description", "Consistent sleep schedule improves mood, focus, and overall health"),
                    Map.of("name", "5-Minute Meditation", "description", "Daily meditation reduces stress and improves mental clarity")
            ),
            "Learning", List.of(
                    Map.of("name", "Read 20 Minutes", "description", "Daily reading expands knowledge and improves focus"),
                    Map.of("name", "Learn New Skill", "description", "Dedicate 30 minutes daily to learning something new"),
                    Map.of("name", "Practice Language", "description", "15 minutes daily language practice builds fluency over time")
            ),
            "Productivity", List.of(
                    Map.of("name", "Morning Planning", "description", "Plan your day each morning to increase focus and productivity"),
                    Map.of("name", "Evening Review", "description", "Review your day to learn and improve tomorrow"),
                    Map.of("name", "Time Blocking", "description", "Block time for important tasks to reduce distractions")
            ),
            "Social", List.of(
                    Map.of("name", "Call Family Weekly", "description", "Regular connection with family strengthens relationships"),
                    Map.of("name", "Meet Friends Monthly", "description", "Regular social connections improve mental health"),
                    Map.of("name", "Express Gratitude", "description", "Daily gratitude practice improves mood and relationships")
            ),
            "Creative", List.of(
                    Map.of("name", "Daily Creative Practice", "description", "30 minutes daily creative work builds skills and joy"),
                    Map.of("name", "Share Your Work", "description", "Sharing creative work builds confidence and community"),
                    Map.of("name", "Explore New Medium", "description", "Trying new creative forms expands your artistic range")
            ),
            "Finance", List.of(
                    Map.of("name", "Track Daily Expenses", "description", "Daily expense tracking helps identify spending patterns"),
                    Map.of("name", "Weekly Budget Review", "description", "Regular budget reviews help achieve financial goals"),
                    Map.of("name", "Save 10% Income", "description", "Automatic savings builds financial security over time")
            )
    );

    @Cacheable(value = "analytics", key = "'analytics_' + #userId")
    public HabitAnalyticsResponse analyzeHabitPatterns(Long userId) {
        List<HabitResponse> habits = normalizeHabitsList(habitService.getUserHabits(userId));
        
        if (habits.isEmpty()) {
            return createEmptyAnalytics();
        }

        // Calculate basic statistics
        int totalHabits = habits.size();
        int activeHabits = (int) habits.stream()
                .filter(h -> h.getIsActive() != null && h.getIsActive())
                .count();
        int inactiveHabits = totalHabits - activeHabits;
        double activeHabitsPercentage = totalHabits > 0 
                ? (double) activeHabits / totalHabits * 100 
                : 0.0;

        // Calculate habit ages (parse createdAt string back to LocalDateTime)
        List<Long> habitAges = habits.stream()
                .map(h -> ChronoUnit.DAYS.between(parseCreatedAt(h), LocalDateTime.now()))
                .collect(Collectors.toList());

        double averageHabitAgeDays = habitAges.stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0.0);

        int oldestHabitAgeDays = habitAges.stream()
                .mapToInt(Long::intValue)
                .max()
                .orElse(0);

        int newestHabitAgeDays = habitAges.stream()
                .mapToInt(Long::intValue)
                .min()
                .orElse(0);

        // Analyze categories
        List<HabitAnalyticsResponse.HabitCategoryStats> categoryStats = analyzeCategories(habits);

        // Generate insights
        List<String> insights = generateInsights(habits, activeHabits, inactiveHabits, 
                averageHabitAgeDays, activeHabitsPercentage);

        return new HabitAnalyticsResponse(
                totalHabits,
                activeHabits,
                inactiveHabits,
                Math.round(activeHabitsPercentage * 100.0) / 100.0,
                Math.round(averageHabitAgeDays * 100.0) / 100.0,
                oldestHabitAgeDays,
                newestHabitAgeDays,
                categoryStats,
                insights
        );
    }

    @Cacheable(value = "analytics", key = "'recommendations_' + #userId")
    public RecommendationResponse generateRecommendations(Long userId) {
        List<HabitResponse> habits = normalizeHabitsList(habitService.getUserHabits(userId));
        List<RecommendationResponse.Recommendation> recommendations = new ArrayList<>();

        if (habits.isEmpty()) {
            recommendations.add(createRecommendation(
                    "GET_STARTED",
                    "Start Your First Habit",
                    "You don't have any habits yet. Start with something simple and achievable!",
                    "HIGH",
                    "Create your first habit - try something like 'Drink 8 glasses of water daily' or 'Read for 15 minutes'"
            ));
            // Add a few starter suggestions
            recommendations.addAll(getStarterHabitSuggestions());
            return new RecommendationResponse(recommendations, 
                    "Get started by creating your first habit!");
        }

        // Analyze patterns
        int activeHabits = (int) habits.stream()
                .filter(h -> h.getIsActive() != null && h.getIsActive())
                .count();
        int totalHabits = habits.size();
        double activePercentage = (double) activeHabits / totalHabits * 100;
        
        // Calculate habit ages for better recommendations
        Map<String, Long> habitAges = new HashMap<>();
        for (HabitResponse habit : habits) {
            long age = ChronoUnit.DAYS.between(parseCreatedAt(habit), LocalDateTime.now());
            habitAges.put(habit.getHabitName(), age);
        }
        
        // Analyze categories
        List<HabitAnalyticsResponse.HabitCategoryStats> categoryStats = analyzeCategories(habits);
        Set<String> existingCategories = categoryStats.stream()
                .map(HabitAnalyticsResponse.HabitCategoryStats::getCategory)
                .collect(Collectors.toSet());

        // Recommendation 1: Too many inactive habits
        if (activePercentage < 50 && totalHabits > 2) {
            recommendations.add(createRecommendation(
                    "REACTIVATE",
                    "Reactivate Inactive Habits",
                    String.format("You have %d inactive habits. Consider reactivating some or removing ones you no longer need.", 
                            totalHabits - activeHabits),
                    "MEDIUM",
                    "Review your inactive habits and either reactivate them or delete ones you've moved on from"
            ));
        }

        // Recommendation 2: Need more variety
        if (categoryStats.size() < 3 && totalHabits >= 3) {
            recommendations.add(createRecommendation(
                    "DIVERSIFY",
                    "Diversify Your Habits",
                    String.format("You have %d habit(s) in %d category/categories. Try adding habits from different areas of life.", 
                            totalHabits, categoryStats.size()),
                    "LOW",
                    "Consider adding habits from categories you haven't explored: Health, Learning, Creative, or Social"
            ));
        }
        
        // Recommendation 2b: Always suggest diversification for 3-5 habits if they're in same category
        if (totalHabits >= 3 && totalHabits <= 5 && categoryStats.size() == 1) {
            recommendations.add(createRecommendation(
                    "DIVERSIFY",
                    "Explore New Habit Categories",
                    String.format("All your habits are in the '%s' category. Try adding habits from other areas!", 
                            categoryStats.get(0).getCategory()),
                    "MEDIUM",
                    "Add habits from different categories like Health, Learning, Creative, or Social to build a well-rounded routine"
            ));
        }

        // Recommendation 3: Too many habits
        if (totalHabits > 10) {
            recommendations.add(createRecommendation(
                    "FOCUS",
                    "Focus on Quality Over Quantity",
                    "You have many habits. Consider focusing on fewer, more impactful ones.",
                    "MEDIUM",
                    "Review your habits and consider consolidating or removing less important ones"
            ));
        }

        // Recommendation 4: Too few habits (updated to include 3-5 habits)
        if (totalHabits >= 3 && totalHabits <= 5 && activeHabits > 0) {
            recommendations.add(createRecommendation(
                    "EXPAND",
                    "Build a Well-Rounded Routine",
                    String.format("You have %d habit(s). Consider adding a few more to build a comprehensive lifestyle routine.", totalHabits),
                    "LOW",
                    "Add 1-2 new habits that complement your existing ones"
            ));
        } else if (totalHabits < 3 && activeHabits > 0) {
            recommendations.add(createRecommendation(
                    "EXPAND",
                    "Expand Your Habit Portfolio",
                    "You're doing great with your current habits! Consider adding a few more to build a well-rounded routine.",
                    "LOW",
                    "Add 1-2 new habits that complement your existing ones"
            ));
        }

        // Recommendation 5: Old habits that might need review
        long oldHabits = habits.stream()
                .filter(h -> {
                    long age = ChronoUnit.DAYS.between(parseCreatedAt(h), LocalDateTime.now());
                    return age > 90 && (h.getIsActive() == null || !h.getIsActive());
                })
                .count();

        if (oldHabits > 0) {
            recommendations.add(createRecommendation(
                    "REVIEW",
                    "Review Old Habits",
                    String.format("You have %d habit(s) older than 90 days that are inactive. Time for a review!", oldHabits),
                    "LOW",
                    "Review your old habits - either reactivate them if they're still relevant or remove them"
            ));
        }

        // Recommendation 6: Suggest complementary habits for existing categories
        if (activeHabits > 0) {
            List<RecommendationResponse.Recommendation> complementary = getComplementaryHabitSuggestions(habits, categoryStats);
            recommendations.addAll(complementary);
        }
        
        // Recommendation 7: Suggest habits for missing categories
        List<RecommendationResponse.Recommendation> categoryGaps = getCategoryGapSuggestions(existingCategories, habits);
        recommendations.addAll(categoryGaps);
        
        // Recommendation 8: Suggest based on habit age (new vs established)
        List<RecommendationResponse.Recommendation> ageBased = getAgeBasedRecommendations(habits, habitAges);
        recommendations.addAll(ageBased);
        
        // Recommendation 9: Popular successful habits (always add if we have less than 3 recommendations)
        if (recommendations.size() < 3) {
            List<RecommendationResponse.Recommendation> popularSuggestions = getPopularHabitSuggestions(habits);
            recommendations.addAll(popularSuggestions);
        }
        
        // If still no recommendations, add a general encouragement
        if (recommendations.isEmpty()) {
            recommendations.add(createRecommendation(
                    "ENCOURAGEMENT",
                    "Keep Up the Great Work!",
                    String.format("You're maintaining %d active habit(s)! Consider exploring new areas to enhance your lifestyle.", activeHabits),
                    "LOW",
                    "Try adding habits from different categories like Health, Learning, or Creative activities"
            ));
        }
        
        // Sort recommendations by priority (HIGH -> MEDIUM -> LOW)
        Map<String, Integer> priorityOrder = Map.of("HIGH", 0, "MEDIUM", 1, "LOW", 2);
        recommendations.sort((a, b) -> {
            int aPriority = priorityOrder.getOrDefault(a.getPriority(), 3);
            int bPriority = priorityOrder.getOrDefault(b.getPriority(), 3);
            return Integer.compare(aPriority, bPriority);
        });
        
        // Limit to top 5 recommendations to avoid overwhelming the user
        if (recommendations.size() > 5) {
            recommendations = recommendations.subList(0, 5);
        }

        String summary = generateSummary(habits, recommendations);
        return new RecommendationResponse(recommendations, summary);
    }

    private List<HabitAnalyticsResponse.HabitCategoryStats> analyzeCategories(List<HabitResponse> habits) {
        Map<String, Integer> categoryCount = new HashMap<>();
        Map<String, Integer> activeCategoryCount = new HashMap<>();

        for (HabitResponse habit : habits) {
            String category = categorizeHabit(habit.getHabitName());
            categoryCount.put(category, categoryCount.getOrDefault(category, 0) + 1);
            if (habit.getIsActive() != null && habit.getIsActive()) {
                activeCategoryCount.put(category, activeCategoryCount.getOrDefault(category, 0) + 1);
            }
        }

        return categoryCount.entrySet().stream()
                .map(entry -> new HabitAnalyticsResponse.HabitCategoryStats(
                        entry.getKey(),
                        entry.getValue(),
                        activeCategoryCount.getOrDefault(entry.getKey(), 0)
                ))
                .sorted((a, b) -> b.getCount().compareTo(a.getCount()))
                .collect(Collectors.toList());
    }

    private String categorizeHabit(String habitName) {
        String lowerName = habitName.toLowerCase();
        for (Map.Entry<String, String> entry : CATEGORY_KEYWORDS.entrySet()) {
            if (lowerName.matches(".*(" + entry.getValue() + ").*")) {
                return entry.getKey();
            }
        }
        return "Other";
    }

    private List<String> generateInsights(List<HabitResponse> habits, int activeHabits, 
                                          int inactiveHabits, double averageAge, double activePercentage) {
        List<String> insights = new ArrayList<>();

        if (activePercentage >= 80) {
            insights.add("Great job! You're maintaining most of your habits active.");
        } else if (activePercentage < 50) {
            insights.add("Consider reviewing your inactive habits - you have more inactive than active habits.");
        }

        if (averageAge > 60) {
            insights.add("Your habits have been around for a while - you're building consistency!");
        } else if (averageAge < 7) {
            insights.add("You're just starting out - keep going! Consistency is key.");
        }

        List<HabitAnalyticsResponse.HabitCategoryStats> categories = analyzeCategories(habits);
        if (categories.size() > 0) {
            String topCategory = categories.get(0).getCategory();
            insights.add(String.format("Your most common habit category is: %s", topCategory));
        }

        if (habits.size() >= 5 && activePercentage >= 70) {
            insights.add("You're maintaining a good balance of multiple active habits!");
        }

        return insights;
    }

    private List<RecommendationResponse.Recommendation> getPopularHabitSuggestions(List<HabitResponse> habits) {
        List<RecommendationResponse.Recommendation> suggestions = new ArrayList<>();
        Set<String> existingHabits = habits.stream()
                .map(h -> h.getHabitName().toLowerCase())
                .collect(Collectors.toSet());

        // Popular habits that users might not have
        Map<String, String> popularHabits = Map.of(
                "Morning Meditation", "Start your day with 5-10 minutes of meditation for better focus",
                "Daily Reading", "Read for at least 15 minutes daily to build knowledge",
                "Evening Reflection", "Spend 5 minutes reflecting on your day",
                "Hydration Goal", "Drink 8 glasses of water throughout the day",
                "Exercise Routine", "Include 30 minutes of physical activity in your day"
        );

        for (Map.Entry<String, String> habit : popularHabits.entrySet()) {
            if (!existingHabits.contains(habit.getKey().toLowerCase()) && 
                !existingHabits.stream().anyMatch(h -> h.contains(habit.getKey().toLowerCase().split(" ")[0]))) {
                suggestions.add(createRecommendation(
                        "SUGGESTION",
                        "Consider: " + habit.getKey(),
                        habit.getValue(),
                        "LOW",
                        "Add '" + habit.getKey() + "' to your habits"
                ));
                if (suggestions.size() >= 2) break; // Limit to 2 suggestions
            }
        }

        return suggestions;
    }

    private RecommendationResponse.Recommendation createRecommendation(
            String type, String title, String description, String priority, String action) {
        return new RecommendationResponse.Recommendation(type, title, description, priority, action);
    }
    
    /**
     * Get starter habit suggestions for new users
     */
    private List<RecommendationResponse.Recommendation> getStarterHabitSuggestions() {
        List<RecommendationResponse.Recommendation> suggestions = new ArrayList<>();
        
        List<Map<String, String>> starters = List.of(
                Map.of("name", "Drink 8 Glasses Water", "description", "Simple and impactful - hydration improves energy and focus"),
                Map.of("name", "10-Minute Morning Walk", "description", "Easy to start, great for physical and mental health"),
                Map.of("name", "Read 15 Minutes Daily", "description", "Builds knowledge and improves focus")
        );
        
        for (Map<String, String> starter : starters) {
            suggestions.add(createRecommendation(
                    "SUGGESTION",
                    "Try: " + starter.get("name"),
                    starter.get("description"),
                    "MEDIUM",
                    "Add '" + starter.get("name") + "' as your first habit"
            ));
        }
        
        return suggestions;
    }
    
    /**
     * Get complementary habit suggestions based on existing habits
     */
    private List<RecommendationResponse.Recommendation> getComplementaryHabitSuggestions(
            List<HabitResponse> habits, List<HabitAnalyticsResponse.HabitCategoryStats> categories) {
        List<RecommendationResponse.Recommendation> suggestions = new ArrayList<>();
        Set<String> existingHabitNames = habits.stream()
                .map(h -> h.getHabitName().toLowerCase())
                .collect(Collectors.toSet());
        
        // Find active habits and suggest complements
        for (HabitResponse habit : habits) {
            if (habit.getIsActive() != null && habit.getIsActive()) {
                String category = categorizeHabit(habit.getHabitName());
                List<String> complements = COMPLEMENTARY_HABITS.getOrDefault(category, List.of());
                
                for (String complement : complements) {
                    String complementLower = complement.toLowerCase();
                    // Check if user doesn't already have this habit
                    boolean hasSimilar = existingHabitNames.stream()
                            .anyMatch(h -> h.contains(complementLower.split(" ")[0]) || complementLower.contains(h.split(" ")[0]));
                    
                    if (!hasSimilar) {
                        suggestions.add(createRecommendation(
                                "COMPLEMENT",
                                "Complement: " + complement,
                                String.format("This pairs well with your '%s' habit for better results", habit.getHabitName()),
                                "LOW",
                                "Add '" + complement + "' to enhance your " + category + " routine"
                        ));
                        break; // Only suggest one complement per category
                    }
                }
            }
        }
        
        return suggestions.stream().limit(2).collect(Collectors.toList());
    }
    
    /**
     * Get suggestions for missing categories
     */
    private List<RecommendationResponse.Recommendation> getCategoryGapSuggestions(
            Set<String> existingCategories, List<HabitResponse> habits) {
        List<RecommendationResponse.Recommendation> suggestions = new ArrayList<>();
        Set<String> allCategories = new HashSet<>(CATEGORY_KEYWORDS.keySet());
        allCategories.removeAll(existingCategories);
        
        // If user has less than 3 categories, suggest missing ones
        if (existingCategories.size() < 3 && !allCategories.isEmpty()) {
            List<String> missingCategories = new ArrayList<>(allCategories);
            Collections.shuffle(missingCategories); // Randomize for variety
            
            for (String category : missingCategories.stream().limit(2).collect(Collectors.toList())) {
                List<Map<String, String>> categoryHabits = CATEGORY_SUGGESTIONS.getOrDefault(category, List.of());
                if (!categoryHabits.isEmpty()) {
                    Map<String, String> suggestion = categoryHabits.get(0);
                    suggestions.add(createRecommendation(
                            "DIVERSIFY",
                            "Explore " + category + ": " + suggestion.get("name"),
                            suggestion.get("description"),
                            "MEDIUM",
                            "Add '" + suggestion.get("name") + "' to diversify your habit portfolio"
                    ));
                }
            }
        }
        
        return suggestions;
    }
    
    /**
     * Get age-based recommendations (new habits vs established ones)
     */
    private List<RecommendationResponse.Recommendation> getAgeBasedRecommendations(
            List<HabitResponse> habits, Map<String, Long> habitAges) {
        List<RecommendationResponse.Recommendation> suggestions = new ArrayList<>();
        
        // Find very new habits (less than 7 days)
        long newHabits = habits.stream()
                .filter(h -> habitAges.getOrDefault(h.getHabitName(), 999L) < 7)
                .filter(h -> h.getIsActive() != null && h.getIsActive())
                .count();
        
        if (newHabits > 0) {
            suggestions.add(createRecommendation(
                    "FOCUS",
                    "Focus on New Habits",
                    String.format("You have %d new habit(s). Focus on consistency for the first 2-3 weeks before adding more.", newHabits),
                    "MEDIUM",
                    "Maintain your new habits daily - consistency is key in the first few weeks"
            ));
        }
        
        // Find well-established habits (more than 60 days)
        long establishedHabits = habits.stream()
                .filter(h -> habitAges.getOrDefault(h.getHabitName(), 0L) > 60)
                .filter(h -> h.getIsActive() != null && h.getIsActive())
                .count();
        
        if (establishedHabits >= 3 && habits.size() < 8) {
            suggestions.add(createRecommendation(
                    "EXPAND",
                    "Ready to Expand",
                    String.format("You've successfully maintained %d habit(s) for over 2 months! You're ready to add more.", establishedHabits),
                    "LOW",
                    "Consider adding 1-2 new habits that complement your established routine"
            ));
        }
        
        return suggestions;
    }

    private String generateSummary(List<HabitResponse> habits, 
                                  List<RecommendationResponse.Recommendation> recommendations) {
        int activeHabits = (int) habits.stream()
                .filter(h -> h.getIsActive() != null && h.getIsActive())
                .count();

        if (habits.isEmpty()) {
            return "Start building your habit tracking journey!";
        }

        if (recommendations.isEmpty()) {
            return String.format("You're doing great with %d active habit(s)! Keep up the consistency.", activeHabits);
        }

        long highPriority = recommendations.stream()
                .filter(r -> "HIGH".equals(r.getPriority()))
                .count();

        if (highPriority > 0) {
            return String.format("You have %d high-priority recommendation(s) to improve your habit tracking.", highPriority);
        }

        return String.format("You have %d recommendation(s) to optimize your %d habit(s).", 
                recommendations.size(), habits.size());
    }

    private HabitAnalyticsResponse createEmptyAnalytics() {
        return new HabitAnalyticsResponse(
                0, 0, 0, 0.0, 0.0, 0, 0,
                new ArrayList<>(),
                Arrays.asList("You don't have any habits yet. Start by creating your first habit!")
        );
    }

    // Helper: parse createdAt string into LocalDateTime safely
    private LocalDateTime parseCreatedAt(HabitResponse h) {
        // HabitResponse.createdAt is a LocalDateTime now — return it directly (fallback to now)
        if (h == null || h.getCreatedAt() == null) {
            return LocalDateTime.now();
        }
        return h.getCreatedAt();
    }
    
    /**
     * Normalize habits list - converts LinkedHashMap (from Redis cache) to HabitResponse if needed
     * This handles Redis deserialization issues where cached lists come back as LinkedHashMap
     */
    @SuppressWarnings("unchecked")
    private List<HabitResponse> normalizeHabitsList(List<?> habits) {
        if (habits == null || habits.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Check if first element is already HabitResponse
        Object first = habits.get(0);
        if (first instanceof HabitResponse) {
            return (List<HabitResponse>) habits;
        }
        
        // Convert LinkedHashMap to HabitResponse
        List<HabitResponse> normalized = new ArrayList<>();
        for (Object item : habits) {
            if (item instanceof HabitResponse) {
                normalized.add((HabitResponse) item);
            } else if (item instanceof Map) {
                // Convert Map to HabitResponse using ObjectMapper
                HabitResponse habit = objectMapper.convertValue(item, HabitResponse.class);
                normalized.add(habit);
            }
        }
        return normalized;
    }
}
