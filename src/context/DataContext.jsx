import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function useData() {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error('useData must be used within a DataProvider');
	}
	return context;
}

function buildStorageKey(userId) {
	return `lifehub_data_${userId || 'guest'}`;
}

export function DataProvider({ children }) {
	const { user } = useAuth();
	const storageKey = useMemo(() => buildStorageKey(user?.id), [user?.id]);

	const [habits, setHabits] = useState([]);
	const [meals, setMeals] = useState([]);
	const [workouts, setWorkouts] = useState([]);
	const [moodEntries, setMoodEntries] = useState([]);
	const [loading, setLoading] = useState(true);

	// Load user-specific data
	useEffect(() => {
		const raw = localStorage.getItem(storageKey);
		if (raw) {
			try {
				const parsed = JSON.parse(raw);
				setHabits(parsed.habits || []);
				setMeals(parsed.meals || []);
				setWorkouts(parsed.workouts || []);
				setMoodEntries(parsed.moodEntries || []);
			} catch {}
		} else {
			setHabits([]);
			setMeals([]);
			setWorkouts([]);
			setMoodEntries([]);
		}
		setLoading(false);
	}, [storageKey]);

	// Persist whenever data changes
	useEffect(() => {
		if (loading) return;
		const payload = {
			habits,
			meals,
			workouts,
			moodEntries,
			updatedAt: new Date().toISOString(),
		};
		localStorage.setItem(storageKey, JSON.stringify(payload));
	}, [habits, meals, workouts, moodEntries, loading, storageKey]);

	const addHabit = (name) => {
		const newHabit = { id: crypto.randomUUID?.() || String(Date.now()), name };
		setHabits(prev => [newHabit, ...prev]);
	};

	const addMeal = (name, grams) => {
		const newMeal = { id: crypto.randomUUID?.() || String(Date.now()), name, quantityGrams: Number(grams) || 0 };
		setMeals(prev => [newMeal, ...prev]);
	};

	const addWorkout = (name, durationMinutes) => {
		const newWorkout = { id: crypto.randomUUID?.() || String(Date.now()), name, durationMinutes: Number(durationMinutes) || 0 };
		setWorkouts(prev => [newWorkout, ...prev]);
	};

	const addMood = (dateISO, mood) => {
		const newMood = { id: crypto.randomUUID?.() || String(Date.now()), date: dateISO, mood };
		setMoodEntries(prev => [newMood, ...prev]);
	};

	const value = {
		loading,
		habits,
		meals,
		workouts,
		moodEntries,
		addHabit,
		addMeal,
		addWorkout,
		addMood,
	};

	return (
		<DataContext.Provider value={value}>
			{children}
		</DataContext.Provider>
	);
}
