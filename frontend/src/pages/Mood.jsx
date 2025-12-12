import React, { useState } from "react";
import { useData } from "../context/useData";

export default function Mood() {
    const { moodEntries, addMood } = useData();
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
    const [mood, setMood] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!mood.trim()) {
            setError("Please enter a mood (emoji or word)");
            return;
        }
        try {
            await addMood({
                moodValue: mood.trim(),
                moodDate: date
            });
            setMood("");
            setDate(new Date().toISOString().slice(0,10));
            setError("");
            setOpen(false);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to add mood entry");
        }
    };

    const closeOnBackdrop = () => setOpen(false);
    const stop = (e) => e.stopPropagation();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Mood</h1>
                    <p className="text-slate-400">Track your emotional well-being</p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Mood
                </button>
            </div>

            {moodEntries.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                    <div className="text-6xl mb-4">😌</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No mood entries yet</h3>
                    <p className="text-slate-400 mb-6">Start tracking your mood to understand your emotional patterns</p>
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                        Log Your First Mood
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {moodEntries.map((m, idx) => (
                        <div
                            key={m.id}
                            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="text-4xl mb-4 p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 w-fit">
                                {m.moodValue || m.mood || '😌'}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                                {m.moodValue || m.mood || 'Mood Entry'}
                            </h3>
                            <div className="text-slate-400 text-sm pt-4 border-t border-slate-700/50">
                                {m.moodDate || m.date ? new Date(m.moodDate || m.date).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                }) : '—'}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in" onClick={closeOnBackdrop}>
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700/50 animate-slide-up" onClick={stop}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Add Mood</h2>
                            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
                        <form onSubmit={onSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Mood</label>
                                <input
                                    value={mood}
                                    onChange={e => setMood(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                    placeholder="e.g., 😊 Happy or 😌 Calm"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-200">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">Add Mood</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}