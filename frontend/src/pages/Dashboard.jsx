import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/useData";
import Recommendations from "../components/Recommendations";

export default function Dashboard() {
    const { user } = useAuth();
    const { habits = [], meals = [], moodEntries = [], workouts = [], loading } = useData();

    const stats = useMemo(() => {
        const activeHabits = habits.filter(h => h.isActive).length;
        const totalMeals = meals.length;
        const totalWorkouts = workouts.length;
        const totalMoodEntries = moodEntries.length;
        const totalGrams = meals.reduce((sum, m) => sum + (m.quantityGrams || 0), 0);
        const totalMinutes = workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

        return {
            activeHabits,
            totalHabits: habits.length,
            totalMeals,
            totalWorkouts,
            totalMoodEntries,
            totalGrams,
            totalMinutes,
        };
    }, [habits, meals, workouts, moodEntries]);

    const recentItems = useMemo(() => {
        const allItems = [
            ...habits.slice(0, 3).map(h => ({ ...h, type: 'habit', background: "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80')", color: 'purple' })),
            ...meals.slice(0, 3).map(m => ({ ...m, type: 'meal', background: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80')", color: 'orange' })),
            ...workouts.slice(0, 3).map(w => ({ ...w, type: 'workout', background: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80')", color: 'green' })),
            ...moodEntries.slice(0, 3).map(m => ({ ...m, type: 'mood', background: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80')", color: 'yellow' })),
        ].sort((a, b) => {
            const aDate = new Date(a.createdAt || a.mealDate || a.workoutDate || a.moodDate || 0);
            const bDate = new Date(b.createdAt || b.mealDate || b.workoutDate || b.moodDate || 0);
            return bDate - aDate;
        }).slice(0, 6);

        return allItems;
    }, [habits, meals, workouts, moodEntries]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                    <p className="text-slate-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
                    </h1>
                    <p className="text-teal-100 text-lg">Here's your progress overview for today</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Habits Stat */}
                <Link to="/habits" className="group">
                    <div className="relative rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80')"
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-600/90"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-5xl">🧘‍♂️</span>
                                <div className="text-white/50 group-hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-white">
                                <div className="text-3xl font-bold">{stats.activeHabits}</div>
                                <div className="text-purple-100 text-sm mt-1">Active Habits</div>
                                <div className="text-purple-200 text-xs mt-2">{stats.totalHabits} total</div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Meals Stat */}
                <Link to="/meals" className="group">
                    <div className="relative rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80')"
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-red-600/90"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-5xl">🍽️</span>
                                <div className="text-white/50 group-hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-white">
                                <div className="text-3xl font-bold">{stats.totalMeals}</div>
                                <div className="text-orange-100 text-sm mt-1">Meals Tracked</div>
                                <div className="text-orange-200 text-xs mt-2">{Math.round(stats.totalGrams / 1000)}kg total</div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Workouts Stat */}
                <Link to="/workouts" className="group">
                    <div className="relative rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80')"
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-emerald-600/90"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-5xl">💪</span>
                                <div className="text-white/50 group-hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-white">
                                <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
                                <div className="text-green-100 text-sm mt-1">Workouts</div>
                                <div className="text-green-200 text-xs mt-2">{stats.totalMinutes} min total</div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Mood Stat */}
                <Link to="/mood" className="group">
                    <div className="relative rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80')"
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/90 to-amber-600/90"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-5xl">😌</span>
                                <div className="text-white/50 group-hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-white">
                                <div className="text-3xl font-bold">{stats.totalMoodEntries}</div>
                                <div className="text-yellow-100 text-sm mt-1">Mood Entries</div>
                                <div className="text-yellow-200 text-xs mt-2">Keep tracking!</div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                    <Link to="/dashboard" className="text-teal-400 hover:text-teal-300 text-sm font-medium">
                        View All →
                    </Link>
                </div>
                {recentItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-slate-400 text-lg">No recent activity</p>
                        <p className="text-slate-500 text-sm mt-2">Start tracking to see your activity here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentItems.map((item, idx) => {

                            const name = item.habitName || item.dishName || item.exerciseName || item.moodValue || "Unknown";
                            const date = new Date(item.createdAt || item.mealDate || item.workoutDate || item.moodDate || Date.now());
                            
                            return (
                                <Link
                                    key={`${item.type}-${item.id}-${idx}`}
                                    to={`/${item.type === 'habit' ? 'habits' : item.type === 'meal' ? 'meals' : item.type === 'workout' ? 'workouts' : 'mood'}`}
                                    className="bg-gradient-to-r bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50 hover:border-teal-500/50 transition-all duration-300 hover:scale-[1.02] group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div 
                                            className="w-12 h-12 rounded-lg bg-cover bg-center border border-white/20 shadow-md"
                                            style={{
                                                backgroundImage: item.background
                                            }}
                                        ></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-medium truncate group-hover:text-teal-400 transition-colors">
                                                {name}
                                            </div>
                                            <div className="text-slate-400 text-sm mt-1">
                                                {date.toLocaleDateString()} • {item.type}
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Recommendations Section */}
            <Recommendations />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <Link to="/habits" className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80')"
                        }}
                    ></div>
                    <div className="relative z-10">
                        <div className="mb-3">
                            <span className="text-4xl">🧘‍♂️</span>
                        </div>
                        <div className="text-white font-semibold mb-1 group-hover:text-teal-400 transition-colors">Add Habit</div>
                        <div className="text-slate-400 text-sm">Track a new habit</div>
                    </div>
                </Link>
                <Link to="/meals" className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80')"
                        }}
                    ></div>
                    <div className="relative z-10">
                        <div className="mb-3">
                            <span className="text-4xl">🍽️</span>
                        </div>
                        <div className="text-white font-semibold mb-1 group-hover:text-teal-400 transition-colors">Log Meal</div>
                        <div className="text-slate-400 text-sm">Record what you ate</div>
                    </div>
                </Link>
                <Link to="/workouts" className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80')"
                        }}
                    ></div>
                    <div className="relative z-10">
                        <div className="mb-3">
                            <span className="text-4xl">💪</span>
                        </div>
                        <div className="text-white font-semibold mb-1 group-hover:text-teal-400 transition-colors">Log Workout</div>
                        <div className="text-slate-400 text-sm">Track your exercise</div>
                    </div>
                </Link>
                <Link to="/mood" className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80')"
                        }}
                    ></div>
                    <div className="relative z-10">
                        <div className="mb-3">
                            <span className="text-4xl">😌</span>
                        </div>
                        <div className="text-white font-semibold mb-1 group-hover:text-teal-400 transition-colors">Log Mood</div>
                        <div className="text-slate-400 text-sm">How are you feeling?</div>
                    </div>
                </Link>
                <Link to="/analytics" className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-6 border border-teal-500/50 hover:border-teal-400/50 transition-all duration-300 hover:scale-105 group shadow-lg shadow-teal-500/20">
                    <div className="text-3xl mb-3">📈</div>
                    <div className="text-white font-semibold mb-1 group-hover:text-teal-100 transition-colors">View Analytics</div>
                    <div className="text-teal-100 text-sm">Charts & insights</div>
                </Link>
            </div>
        </div>
    );
}