package com.lifehub.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "meals")
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dish_name", nullable = false)
    private String dishName;

    @Column(name = "quantity_grams")
    private Integer quantityGrams;

    @Column(name = "meal_date", nullable = false)
    private LocalDate mealDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Meal() {
    }

    public Meal(Long id, String dishName, Integer quantityGrams, LocalDate mealDate, User user) {
        this.id = id;
        this.dishName = dishName;
        this.quantityGrams = quantityGrams;
        this.mealDate = mealDate;
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        if (mealDate == null) {
            mealDate = LocalDate.now();
        }
    }

    // Getters and Setters
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
