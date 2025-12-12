package com.lifehub.service;

import com.lifehub.dto.MealRequest;
import com.lifehub.dto.MealResponse;
import com.lifehub.model.Meal;
import com.lifehub.model.User;
import com.lifehub.repository.MealRepository;
import com.lifehub.repository.UserRepository;
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
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private UserRepository userRepository;

    @CacheEvict(value = "meals", key = "#userId", allEntries = true)
    public MealResponse createMeal(Long userId, MealRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Meal meal = new Meal();
        meal.setDishName(request.getDishName());
        meal.setQuantityGrams(request.getQuantityGrams());
        meal.setMealDate(request.getMealDate() != null ? request.getMealDate() : LocalDate.now());
        meal.setUser(user);

        Meal saved = mealRepository.save(meal);
        return mapToResponse(saved);
    }

    @Cacheable(value = "meals", key = "#userId")
    public List<MealResponse> getUserMeals(Long userId) {
        List<Meal> meals = mealRepository.findByUserId(userId);
        return meals.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "meals", key = "#userId + '_' + #mealId")
    public MealResponse getMealById(Long userId, Long mealId) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        if (!meal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to meal");
        }

        return mapToResponse(meal);
    }

    @CacheEvict(value = "meals", key = "#userId", allEntries = true)
    public MealResponse updateMeal(Long userId, Long mealId, MealRequest request) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        if (!meal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to meal");
        }

        meal.setDishName(request.getDishName());
        if (request.getQuantityGrams() != null) {
            meal.setQuantityGrams(request.getQuantityGrams());
        }
        if (request.getMealDate() != null) {
            meal.setMealDate(request.getMealDate());
        }

        Meal updated = mealRepository.save(meal);
        return mapToResponse(updated);
    }

    @CacheEvict(value = "meals", key = "#userId", allEntries = true)
    public void deleteMeal(Long userId, Long mealId) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        if (!meal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to meal");
        }

        mealRepository.delete(meal);
    }

    private MealResponse mapToResponse(Meal meal) {
        return new MealResponse(
                meal.getId(),
                meal.getDishName(),
                meal.getQuantityGrams(),
                meal.getMealDate()
        );
    }
}



