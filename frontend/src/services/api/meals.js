// src/services/api/meals.js
import api from './client';

export const getAllMeals = () => api.get('/meals');
export const createMeal = (data) => api.post('/meals', data);
export const updateMeal = (id, data) => api.put(`/meals/${id}`, data);
export const deleteMeal = (id) => api.delete(`/meals/${id}`);
