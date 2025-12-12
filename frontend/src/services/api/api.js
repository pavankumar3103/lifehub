// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't clear storage for auth endpoints (login/register) - let them handle their own errors
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                              error.config?.url?.includes('/auth/register');
        
        if (!isAuthEndpoint && (error.response?.status === 401 || error.response?.status === 403)) {
            // Token expired or invalid - clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenType');
            // Redirect to login page if not already there
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export const habitsAPI = {
    getAllHabits: () => api.get('/habits'),
    createHabit: (payload) => api.post('/habits', payload),
    updateHabit: (id, payload) => api.put(`/habits/${id}`, payload),
    deleteHabit: (id) => api.delete(`/habits/${id}`),
};

export const mealsAPI = {
    getAllMeals: () => api.get('/meals'),
    createMeal: (payload) => api.post('/meals', payload),
    updateMeal: (id, payload) => api.put(`/meals/${id}`, payload),
    deleteMeal: (id) => api.delete(`/meals/${id}`),
};

export const workoutsAPI = {
    getAllWorkouts: () => api.get('/workouts'),
    createWorkout: (payload) => api.post('/workouts', payload),
    updateWorkout: (id, payload) => api.put(`/workouts/${id}`, payload),
    deleteWorkout: (id) => api.delete(`/workouts/${id}`),
};

export const moodAPI = {
    getAllMoodEntries: () => api.get('/mood-entries'),
    createMoodEntry: (payload) => api.post('/mood-entries', payload),
    updateMoodEntry: (id, payload) => api.put(`/mood-entries/${id}`, payload),
    deleteMoodEntry: (id) => api.delete(`/mood-entries/${id}`),
};

export default api;
