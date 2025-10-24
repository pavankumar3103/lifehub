import React from "react";
import DashboardCard from "../components/DashboardCard";
import { mockHabits, mockMeals, mockMood } from "../data/mockData";

export default function Dashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardCard title="Habits" data={mockHabits} />
                <DashboardCard title="Meals" data={mockMeals} />
                <DashboardCard title="Mood" data={mockMood} />
            </div>
        </div>
    );
}