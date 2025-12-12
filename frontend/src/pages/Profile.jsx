import React from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/useData";

export default function Profile() {
    const { user } = useAuth();
    const { habits = [], meals = [], moodEntries = [], workouts = [] } = useData();

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const stats = {
        totalHabits: habits.length,
        activeHabits: habits.filter(h => h.isActive).length,
        totalMeals: meals.length,
        totalWorkouts: workouts.length,
        totalMoodEntries: moodEntries.length,
        totalGrams: meals.reduce((sum, m) => sum + (m.quantityGrams || 0), 0),
        totalMinutes: workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0),
    };

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl shadow-2xl border-4 border-white/20">
                        {getInitials(user?.name)}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{user?.name || "User"}</h1>
                        <p className="text-indigo-100 text-lg">{user?.email || ""}</p>
                        <div className="mt-3 flex items-center gap-2 text-indigo-200 text-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                    <div className="text-3xl mb-3">🧘‍♂️</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.activeHabits}</div>
                    <div className="text-slate-400 text-sm">Active Habits</div>
                    <div className="text-slate-500 text-xs mt-1">{stats.totalHabits} total</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                    <div className="text-3xl mb-3">🍽️</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalMeals}</div>
                    <div className="text-slate-400 text-sm">Meals Tracked</div>
                    <div className="text-slate-500 text-xs mt-1">{Math.round(stats.totalGrams / 1000)}kg total</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                    <div className="text-3xl mb-3">💪</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalWorkouts}</div>
                    <div className="text-slate-400 text-sm">Workouts</div>
                    <div className="text-slate-500 text-xs mt-1">{stats.totalMinutes} min total</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                    <div className="text-3xl mb-3">😌</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalMoodEntries}</div>
                    <div className="text-slate-400 text-sm">Mood Entries</div>
                    <div className="text-slate-500 text-xs mt-1">Keep tracking!</div>
                </div>
            </div>

            {/* Account Information */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-slate-700/50">
                        <div>
                            <div className="text-slate-400 text-sm mb-1">Full Name</div>
                            <div className="text-white font-medium">{user?.name || "—"}</div>
                        </div>
                        <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200">
                            Edit
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-slate-700/50">
                        <div>
                            <div className="text-slate-400 text-sm mb-1">Email Address</div>
                            <div className="text-white font-medium">{user?.email || "—"}</div>
                        </div>
                        <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200">
                            Edit
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-4">
                        <div>
                            <div className="text-slate-400 text-sm mb-1">Account Status</div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center gap-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/50 hover:border-teal-500/50 transition-all duration-200 group">
                        <div className="text-2xl">🔔</div>
                        <div className="text-left flex-1">
                            <div className="text-white font-medium group-hover:text-teal-400 transition-colors">Notifications</div>
                            <div className="text-slate-400 text-sm">Manage your notification preferences</div>
                        </div>
                        <svg className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button className="flex items-center gap-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/50 hover:border-teal-500/50 transition-all duration-200 group">
                        <div className="text-2xl">🔒</div>
                        <div className="text-left flex-1">
                            <div className="text-white font-medium group-hover:text-teal-400 transition-colors">Privacy & Security</div>
                            <div className="text-slate-400 text-sm">Update your security settings</div>
                        </div>
                        <svg className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}