import React, { useState } from "react";
import { useData } from "../context/useData";
import { mealsAPI } from "../services/api";
import { downloadCsv } from "../utils/exportUtils";

export default function Meals() {
    const { meals, addMeal } = useData();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [grams, setGrams] = useState("");
    const [error, setError] = useState("");
    const [exportError, setExportError] = useState("");

    const handleExport = async () => {
        downloadCsv(
            mealsAPI.exportMeals,
            'meals.csv',
            () => setExportError(""),
            (error) => setExportError(error)
        );
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Please enter a dish name");
            return;
        }
        try {
            await addMeal({
                dishName: name.trim(),
                quantityGrams: grams ? parseInt(grams) : null,
                mealDate: new Date().toISOString().slice(0,10)
            });
            setName("");
            setGrams("");
            setError("");
            setOpen(false);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to add meal");
        }
    };

    const closeOnBackdrop = () => setOpen(false);
    const stop = (e) => e.stopPropagation();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Meals</h1>
                    <p className="text-slate-400">Track your nutrition and meals</p>
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
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Meal
                    </button>
                </div>
            </div>

            {meals.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No meals tracked yet</h3>
                    <p className="text-slate-400 mb-6">Start tracking your meals to see your nutrition data</p>
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                        Log Your First Meal
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meals.map((m, idx) => (
                        <div
                            key={m.id}
                            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-orange-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="text-4xl mb-4 p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 w-fit">
                                🍽️
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                {m.dishName || m.name}
                            </h3>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                <div>
                                    <div className="text-2xl font-bold text-orange-400">{m.quantityGrams ?? m.grams ?? 0}</div>
                                    <div className="text-slate-400 text-sm">grams</div>
                                </div>
                                <div className="text-slate-500 text-xs">
                                    {m.mealDate ? new Date(m.mealDate).toLocaleDateString() : '—'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in" onClick={closeOnBackdrop}>
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700/50 animate-slide-up" onClick={stop}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Add Meal</h2>
                            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
                        <form onSubmit={onSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Dish name</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="e.g., Grilled chicken salad"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Quantity (grams)</label>
                                <input
                                    type="number"
                                    value={grams}
                                    onChange={e => setGrams(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="e.g., 350"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-200">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">Add Meal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}