import React from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import DashboardCard from "../components/DashboardCard.jsx";

export default function Dashboard() {
    const { user } = useAuth();
    const { habits = [], meals = [], moodEntries = [], workouts = [], loading } = useData();

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Hello, {user?.name || 'User'}! 👋</h1>
                <p className="text-slate-600">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Hello, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-slate-600 mb-6">Welcome to your personalized dashboard</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardCard title="Habits" data={(habits || []).slice(0, 5)} />
                <DashboardCard title="Meals" data={(meals || []).slice(0, 5)} />
                <DashboardCard title="Mood" data={(moodEntries || []).slice(0, 5)} />
                <DashboardCard title="Workouts" data={(workouts || []).slice(0, 5)} />
            </div>
        </div>
    );
}