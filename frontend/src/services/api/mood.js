// src/services/api/mood.js
import api from './client';

export const getAllMoodEntries = () => api.get('/mood-entries');
export const createMoodEntry = (data) => api.post('/mood-entries', data);
export const updateMoodEntry = (id, data) => api.put(`/mood-entries/${id}`, data);
export const deleteMoodEntry = (id) => api.delete(`/mood-entries/${id}`);
