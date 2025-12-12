// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import api from '../services/api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
            // Set default auth header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        console.log('Attempting login with:', { email: credentials.email });
        try {
            const response = await authAPI.login(credentials);
            console.log('Login response received:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            console.log('Response data type:', typeof response.data);
            console.log('Response data keys:', Object.keys(response.data || {}));
            
            // The backend returns: { success: true, message: "...", data: { token, refreshToken, type, user } }
            const responseData = response.data;
            
            // Handle case where response.data might be the ApiResponse directly
            if (!responseData) {
                throw new Error('No response data received from server');
            }
            
            // Check if response indicates success
            if (responseData.success === false) {
                const errorMsg = responseData.message || 'Login failed';
                console.error('Login failed:', errorMsg);
                throw new Error(errorMsg);
            }
            
            // Extract auth data from response.data.data
            let authData = responseData.data;
            
            // If data is not nested, try responseData directly
            if (!authData && responseData.token) {
                authData = responseData;
            }
            
            if (!authData) {
                console.error('No auth data found in response:', responseData);
                throw new Error('Invalid response from server: missing data');
            }
            
            console.log('Auth data extracted:', authData);
            console.log('Auth data keys:', Object.keys(authData));
            
            if (!authData.token) {
                console.error('Token missing in auth data:', authData);
                throw new Error('Invalid response from server: missing token');
            }
            
            const { token, refreshToken, type, user: userData } = authData;

            if (!userData) {
                console.error('User data missing in auth data:', authData);
                throw new Error('Invalid response from server: missing user data');
            }

            console.log('Storing token and user data...');
            // Store token and user data - use try-catch to ensure it's saved
            try {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken || '');
                localStorage.setItem('tokenType', type || 'Bearer');
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Verify token was saved immediately
                const savedToken = localStorage.getItem('token');
                if (!savedToken || savedToken !== token) {
                    console.error('Failed to save token to localStorage');
                    console.error('Expected token length:', token.length);
                    console.error('Saved token length:', savedToken?.length);
                    throw new Error('Failed to save authentication token');
                }
                
                console.log('Token successfully saved to localStorage');
                console.log('Token length:', savedToken.length);
            } catch (storageError) {
                console.error('localStorage error:', storageError);
                throw new Error('Failed to save authentication data: ' + storageError.message);
            }

            // Set default auth header for both API clients
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Set user state - this must happen before navigation
            setUser(userData);
            
            console.log('Login successful!');
            console.log('Token in localStorage:', !!localStorage.getItem('token'));
            console.log('User set:', userData);
            
            // Double-check token is still there after a brief delay
            setTimeout(() => {
                const checkToken = localStorage.getItem('token');
                if (!checkToken) {
                    console.error('WARNING: Token disappeared from localStorage!');
                } else {
                    console.log('Token still in localStorage after delay');
                }
            }, 100);
            
            return userData;
        } catch (error) {
            console.error('=== LOGIN ERROR ===');
            console.error('Error object:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response?.data);
            console.error('Error response status:', error.response?.status);
            console.error('Error response headers:', error.response?.headers);
            console.error('===================');
            
            // Extract error message from response
            let errorMessage = 'Login failed. Please check your credentials.';
            
            if (error.response) {
                // Server responded with error
                const responseData = error.response.data;
                if (responseData) {
                    errorMessage = responseData.message || 
                                 responseData.error || 
                                 `Server error: ${error.response.status}`;
                } else {
                    errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'Unable to connect to server. Please check if the backend is running.';
            } else {
                // Something else happened
                errorMessage = error.message || 'An unexpected error occurred';
            }
            
            throw new Error(errorMessage);
        }
    };

    const register = async (credentials) => {
        try {
            const response = await authAPI.register(credentials);
            console.log('Register response:', response);
            
            // The backend returns: { success: true, message: "...", data: { token, refreshToken, type, user } }
            const responseData = response.data;
            
            // Check if response indicates success
            if (!responseData.success) {
                throw new Error(responseData.message || 'Registration failed');
            }
            
            // Extract auth data from response.data.data
            const authData = responseData.data;
            
            if (!authData || !authData.token) {
                throw new Error('Invalid response from server: missing token');
            }
            
            const { token, refreshToken, type, user: userData } = authData;

            if (!userData) {
                throw new Error('Invalid response from server: missing user data');
            }

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken || '');
            localStorage.setItem('tokenType', type || 'Bearer');
            localStorage.setItem('user', JSON.stringify(userData));

            // Set default auth header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Register error:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.message || 
                               'Registration failed. Please try again.';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};