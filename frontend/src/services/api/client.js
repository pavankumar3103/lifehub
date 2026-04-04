// src/services/api/client.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', config.url, 'Token length:', token.length);
    } else {
      console.warn('Request without token:', config.url);
      console.warn('localStorage contents:', {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        allKeys: Object.keys(localStorage)
      });
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
      console.warn('Authentication error:', error.response?.status, error.config?.url);
      console.warn('Error response data:', error.response?.data);
      const token = localStorage.getItem('token');
      console.warn('Token in localStorage:', token ? 'exists' : 'missing');
      if (token) {
        console.warn('Token value (first 20 chars):', token.substring(0, 20) + '...');
      }
      
      // Only clear storage if we're sure the token is invalid
      // Don't clear on first 401 - might be a temporary server issue
      const errorMessage = error.response?.data?.message || '';
      const errorData = error.response?.data || {};
      
      // Don't automatically clear token on 401/403 - let the user try to log in again
      // Only clear if we get a specific error message indicating the token is invalid
      if (error.response?.status === 403) {
        console.warn('403 Forbidden received');
        console.warn('Error message:', errorMessage);
        console.warn('Full error data:', errorData);
        
        // Only clear if error message explicitly says token is invalid
        if (errorMessage.toLowerCase().includes('expired') || 
            errorMessage.toLowerCase().includes('invalid token') ||
            errorMessage.toLowerCase().includes('jwt')) {
          console.warn('Token is explicitly invalid, clearing storage');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenType');
          
          // Redirect to login page if not already there
          if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
            window.location.href = '/';
          }
        } else {
          console.warn('403 error but keeping token - might be permission issue or server error');
        }
      } else if (error.response?.status === 401) {
        // 401 might be temporary - don't clear immediately
        console.warn('401 Unauthorized - Keeping token, might be temporary server issue');
        console.warn('Error message:', errorMessage);
        console.warn('If this persists, please log in again');
      }
    }
    return Promise.reject(error);
  }
);

export default api;