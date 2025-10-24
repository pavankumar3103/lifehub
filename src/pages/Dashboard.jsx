import React from "react";
import DashboardCard from "../components/DashboardCard.jsx";
import { mockHabits, mockMeals, mockMood } from "../data/mockData.js";

export default function Dashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardCard title="Habits" data={mockHabits} />
                <DashboardCard title="Meals" data={mockMeals} />
                <DashboardCard title="Mood" data={mockMood} />
            </div>
        </div>
    );
}