import React from "react";
import { useAuth } from "../context/AuthContext";
import DashboardCard from "../components/DashboardCard.jsx";
import { mockHabits, mockMeals, mockMood } from "../data/mockData.js";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Hello, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-slate-600 mb-6">Welcome to your personalized dashboard</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardCard title="Habits" data={mockHabits} />
                <DashboardCard title="Meals" data={mockMeals} />
                <DashboardCard title="Mood" data={mockMood} />
            </div>
        </div>
    );
}