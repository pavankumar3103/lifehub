package com.lifehub.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class MealRequest {
    @NotBlank(message = "Dish name is required")
    private String dishName;
    
    private Integer quantityGrams;
    
    private LocalDate mealDate;

    public String getDishName() {
        return dishName;
    }

    public void setDishName(String dishName) {
        this.dishName = dishName;
    }

    public Integer getQuantityGrams() {
        return quantityGrams;
    }

    public void setQuantityGrams(Integer quantityGrams) {
        this.quantityGrams = quantityGrams;
    }

    public LocalDate getMealDate() {
        return mealDate;
    }

    public void setMealDate(LocalDate mealDate) {
        this.mealDate = mealDate;
    }
}



