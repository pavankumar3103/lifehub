import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('lifehub_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('lifehub_users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('lifehub_user', JSON.stringify(foundUser));
            return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
    };

    const register = (name, email, password) => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('lifehub_users') || '[]');
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            return { success: false, error: 'User already exists with this email' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem('lifehub_users', JSON.stringify(users));
        
        setUser(newUser);
        localStorage.setItem('lifehub_user', JSON.stringify(newUser));
        
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lifehub_user');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

