/* eslint-disable react-refresh/only-export-components */
// src/context/DataContext.jsx
import { createContext, useEffect, useState, useCallback } from 'react';
import { habitsAPI, mealsAPI, moodAPI, workoutsAPI } from '../services/api';
import { useAuth } from './AuthContext';

export const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleError = useCallback((err, fallbackMessage) => {
    console.error(fallbackMessage, err);
    setErrorMessage(
      err?.response?.data?.message ||
        err?.message ||
        fallbackMessage
    );
  }, []);

  const fetchHabits = useCallback(async () => {
    try {
      const response = await habitsAPI.getAllHabits();
      const payload = response.data;
      const data = payload?.data ?? payload;
      return Array.isArray(data) ? data : [];
    } catch (err) {
      handleError(err, 'Failed to fetch habits');
      return [];
    }
  }, [handleError]);

  const fetchMeals = useCallback(async () => {
    try {
      const response = await mealsAPI.getAllMeals();
      const payload = response.data;
      const data = payload?.data ?? payload;
      return Array.isArray(data) ? data : [];
    } catch (err) {
      handleError(err, 'Failed to fetch meals');
      return [];
    }
  }, [handleError]);

  const fetchWorkouts = useCallback(async () => {
    try {
      const response = await workoutsAPI.getAllWorkouts();
      const payload = response.data;
      const data = payload?.data ?? payload;
      return Array.isArray(data) ? data : [];
    } catch (err) {
      handleError(err, 'Failed to fetch workouts');
      return [];
    }
  }, [handleError]);

  const fetchMoodEntries = useCallback(async () => {
    try {
      const response = await moodAPI.getAllMoodEntries();
      const payload = response.data;
      const data = payload?.data ?? payload;
      return Array.isArray(data) ? data : [];
    } catch (err) {
      handleError(err, 'Failed to fetch mood entries');
      return [];
    }
  }, [handleError]);

  const refreshData = useCallback(async () => {
    // Check both user state and token in localStorage
    const token = localStorage.getItem('token');
    if (!user || !token) {
      setHabits([]);
      setMeals([]);
      setWorkouts([]);
      setMoodEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const [habitsList, mealsList, workoutsList, moodList] = await Promise.all([
        fetchHabits(),
        fetchMeals(),
        fetchWorkouts(),
        fetchMoodEntries(),
      ]);

      setHabits(habitsList);
      setMeals(mealsList);
      setWorkouts(workoutsList);
      setMoodEntries(moodList);
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Error handling is done in individual fetch functions
    } finally {
      setLoading(false);
    }
  }, [user, fetchHabits, fetchMeals, fetchWorkouts, fetchMoodEntries]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addHabit = async (habitData) => {
    try {
      const response = await habitsAPI.createHabit(habitData);
      const payload = response.data;
      const data = payload?.data ?? payload;
      setHabits((prev) => [...prev, data]);
      return data;
    } catch (err) {
      handleError(err, 'Failed to add habit');
      throw err;
    }
  };

  const updateHabit = async (id, habitData) => {
    try {
      const response = await habitsAPI.updateHabit(id, habitData);
      const payload = response.data;
      const data = payload?.data ?? payload;
      setHabits((prev) =>
        prev.map((habit) => (habit.id === data.id ? data : habit))
      );
      return data;
    } catch (err) {
      handleError(err, 'Failed to update habit');
      throw err;
    }
  };

  const deleteHabit = async (id) => {
    try {
      await habitsAPI.deleteHabit(id);
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
    } catch (err) {
      handleError(err, 'Failed to delete habit');
      throw err;
    }
  };

  const addMeal = async (mealData) => {
    try {
      const response = await mealsAPI.createMeal(mealData);
      const payload = response.data;
      const data = payload?.data ?? payload;
      setMeals((prev) => [...prev, data]);
      return data;
    } catch (err) {
      handleError(err, 'Failed to add meal');
      throw err;
    }
  };

  const updateMeal = async (id, mealData) => {
    try {
      const response = await mealsAPI.updateMeal(id, mealData);
      const payload = response.data;
      const data = payload?.data ?? payload;
      setMeals((prev) =>
        prev.map((meal) => (meal.id === data.id ? data : meal))
      );
      return data;
    } catch (err) {
      handleError(err, 'Failed to update meal');
      throw err;
    }
  };

  const deleteMeal = async (id) => {
    try {
      await mealsAPI.deleteMeal(id);
      setMeals((prev) => prev.filter((meal) => meal.id !== id));
    } catch (err) {
      handleError(err, 'Failed to delete meal');
      throw err;
    }
  };

  const addWorkout = async (workoutData) => {
    try {
      const response = await workoutsAPI.createWorkout(workoutData);
      const payload = response.data;
      const data = payload?.data ?? payload;
      setWorkouts((prev) => [...prev, data]);
      return data;
    } catch (err) {
      handleError(err, 'Failed to add workout');
      throw err;
    }
  };

  const updateWorkout = async (id, workoutData) => {
    try {
      const response = await workoutsAPI.updateWorkout(id, workoutData);
      const payload = response.data;
      const data = payload?.data ?? payload;
      setWorkouts((prev) =>
        prev.map((workout) => (workout.id === data.id ? data : workout))
      );
      return data;
    } catch (err) {
      handleError(err, 'Failed to update workout');
      throw err;
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await workoutsAPI.deleteWorkout(id);
      setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    } catch (err) {
      handleError(err, 'Failed to delete workout');
      throw err;
    }
  };

  const addMood = async (moodData) => {
    try {
      const response = await moodAPI.createMoodEntry(moodData);
      const payload = response.data;
      const data = payload?.data ?? payload;
      setMoodEntries((prev) => [...prev, data]);
      return data;
    } catch (err) {
      handleError(err, 'Failed to add mood entry');
      throw err;
    }
  };

  const updateMood = async (id, moodData) => {
    try {
      const response = await moodAPI.updateMoodEntry(id, moodData);
      const payload = response.data;
      const data = payload?.data ?? payload;
      setMoodEntries((prev) =>
        prev.map((entry) => (entry.id === data.id ? data : entry))
      );
      return data;
    } catch (err) {
      handleError(err, 'Failed to update mood entry');
      throw err;
    }
  };

  const deleteMood = async (id) => {
    try {
      await moodAPI.deleteMoodEntry(id);
      setMoodEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      handleError(err, 'Failed to delete mood entry');
      throw err;
    }
  };

  const value = {
    habits,
    meals,
    workouts,
    moodEntries,
    loading,
    errorMessage,
    refreshData,
    addHabit,
    updateHabit,
    deleteHabit,
    addMeal,
    updateMeal,
    deleteMeal,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addMood,
    updateMood,
    deleteMood,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
