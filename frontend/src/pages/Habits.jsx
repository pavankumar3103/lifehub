// src/pages/Habits.jsx
import { useMemo, useState } from 'react';
import { useData } from '../context/useData';
import { habitsAPI } from '../services/api';

export default function Habits() {
  const {
    habits,
    loading,
    errorMessage,
    addHabit,
    updateHabit,
    deleteHabit,
  } = useData();

  const [formOpen, setFormOpen] = useState(false);
  const [currentHabit, setCurrentHabit] = useState(null);
  const [habitName, setHabitName] = useState('');
  const [formError, setFormError] = useState('');
  const [exportError, setExportError] = useState('');

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      const aDate = new Date(a.createdAt ?? 0).getTime();
      const bDate = new Date(b.createdAt ?? 0).getTime();
      return bDate - aDate;
    });
  }, [habits]);

  // Remove the problematic useEffect - DataContext already handles data fetching
  // The useEffect was causing infinite loops by calling refreshData repeatedly

  const openCreateForm = () => {
    setCurrentHabit(null);
    setHabitName('');
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (habit) => {
    setCurrentHabit(habit);
    setHabitName(habit.habitName ?? habit.name ?? '');
    setFormError('');
    setFormOpen(true);
  };

  const downloadCsv = async (apiCall, filename) => {
    try {
      const response = await apiCall();
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setExportError('');
    } catch (err) {
      console.error('Failed to export habits', err);
      setExportError('Unable to export habits. Please try again.');
    }
  };

  const handleExport = async () => {
    await downloadCsv(habitsAPI.exportHabits, 'habits.csv');
  };

  const closeForm = () => {
    setFormOpen(false);
    setCurrentHabit(null);
    setHabitName('');
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!habitName.trim()) {
      setFormError('Habit name is required.');
      return;
    }

    const payload = {
      habitName: habitName.trim(),
      isActive: true,
    };

    try {
      if (currentHabit) {
        await updateHabit(currentHabit.id, payload);
      } else {
        await addHabit(payload);
      }
      closeForm();
    } catch (err) {
      console.error('Failed to save habit', err);
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to save habit. Please try again.'
      );
    }
  };

  const handleDelete = async (habitId) => {
    if (!window.confirm('Delete this habit?')) return;
    try {
      await deleteHabit(habitId);
    } catch (err) {
      console.error('Failed to delete habit', err);
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to delete habit. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-slate-400">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Habits</h1>
          <p className="text-slate-400">Track and build consistent habits</p>
          {errorMessage && (
            <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {errorMessage}
            </div>
          )}
          {exportError && (
            <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {exportError}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-5 py-3 bg-slate-700/70 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all duration-300"
          >
            Export
          </button>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Habit
          </button>
        </div>
      </div>

      {sortedHabits.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
          <div className="text-6xl mb-4">🧘‍♂️</div>
          <h3 className="text-2xl font-bold text-white mb-2">No habits yet</h3>
          <p className="text-slate-400 mb-6">Start building better habits today!</p>
          <button
            onClick={openCreateForm}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHabits.map((habit, idx) => (
            <div
              key={habit.id}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  🧘‍♂️
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    habit.isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                  }`}>
                    {habit.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                {habit.habitName ?? habit.name}
              </h3>
              
              <p className="text-slate-400 text-sm mb-4">
                Created {habit.createdAt ? new Date(habit.createdAt).toLocaleDateString() : '—'}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => openEditForm(habit)}
                  className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-medium transition-all duration-200 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg font-medium transition-all duration-200 text-sm border border-red-500/30 hover:border-red-500/50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in"
          onClick={closeForm}
        >
          <div
            className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700/50 p-6 animate-slide-up"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {currentHabit ? 'Edit Habit' : 'Add New Habit'}
              </h2>
              <button 
                onClick={closeForm} 
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-3 text-sm text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Habit Name
                </label>
                <input
                  value={habitName}
                  onChange={(event) => setHabitName(event.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g., Read 10 pages every night"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  {currentHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}