// src/services/api/habits.js
import api from './client';

export const getAllHabits = () => api.get('/habits');
export const createHabit = (data) => api.post('/habits', data);
export const updateHabit = (id, data) => api.put(`/habits/${id}`, data);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);
export const exportHabits = () => api.get('/habits/export', { responseType: 'blob', headers: { Accept: 'text/csv' } });