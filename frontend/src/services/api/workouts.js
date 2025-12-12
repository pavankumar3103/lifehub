// src/services/api/workouts.js
import api from './client';

export const getAllWorkouts = () => api.get('/workouts');
export const createWorkout = (data) => api.post('/workouts', data);
export const updateWorkout = (id, data) => api.put(`/workouts/${id}`, data);
export const deleteWorkout = (id) => api.delete(`/workouts/${id}`);
