package com.lifehub.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class MealResponse {
    private Long id;
    private String dishName;
    private Integer quantityGrams;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate mealDate;

    public MealResponse() {
    }

    public MealResponse(Long id, String dishName, Integer quantityGrams, LocalDate mealDate) {
        this.id = id;
        this.dishName = dishName;
        this.quantityGrams = quantityGrams;
        this.mealDate = mealDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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



