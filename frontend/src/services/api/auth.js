// src/services/api/auth.js
import api from './client';

export const login = (credentials) => {
    console.log('Making login request to /auth/login with:', { email: credentials.email });
    return api.post('/auth/login', credentials);
};

export const register = (userData) => {
    console.log('Making register request to /auth/register');
    return api.post('/auth/register', userData);
};