import React from "react";

export default function DashboardCard({ title, data }) {
    const items = Array.isArray(data) ? data : [];

    const renderSecondary = (item) => {
        if (typeof item !== 'object' || !item) return null;
        if (typeof item.quantityGrams === 'number') return <span className="text-slate-500">{item.quantityGrams} g</span>;
        if (typeof item.durationMinutes === 'number') return <span className="text-slate-500">{item.durationMinutes} min</span>;
        if (item.moodValue || item.mood) return <span className="text-slate-700">{item.moodValue || item.mood}</span>;
        return null;
    };

    const renderPrimary = (item) => {
        if (typeof item !== 'object' || !item) return String(item);
        return item.habitName || item.dishName || item.exerciseName || item.name || item.moodDate || item.date || "";
    };

    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold text-lg text-slate-800">{title}</h2>
            {items.length === 0 ? (
                <p className="mt-2 text-slate-500">No entries yet</p>
            ) : (
                <ul className="mt-2 divide-y">
                    {items.map((item, idx) => (
                        <li key={item.id ?? idx} className="py-2 flex justify-between items-center">
                            <span className="text-slate-800 truncate pr-3">{renderPrimary(item)}</span>
                            {renderSecondary(item)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}