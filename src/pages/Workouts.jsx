import React, { useState } from "react";
import { useData } from "../context/DataContext";

export default function Workouts() {
    const { workouts, addWorkout } = useData();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [error, setError] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Please enter an exercise name");
            return;
        }
        addWorkout(name.trim(), duration);
        setName("");
        setDuration("");
        setError("");
        setOpen(false);
    };

    const closeOnBackdrop = () => setOpen(false);
    const stop = (e) => e.stopPropagation();

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Workouts</h1>
                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <span className="text-xl leading-none">+</span> Add
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    {workouts.length === 0 ? (
                        <p className="text-slate-600 text-lg">No workouts yet. Add your first one!</p>
                    ) : (
                        <ul className="divide-y">
                            {workouts.map(w => (
                                <li key={w.id} className="py-3 flex justify-between">
                                    <span className="text-slate-800">{w.name}</span>
                                    <span className="text-slate-500">{w.durationMinutes} min</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeOnBackdrop}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={stop}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-slate-800">Add Workout</h2>
                            <button onClick={() => setOpen(false)} className="text-slate-500">✕</button>
                        </div>
                        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1 text-slate-600">Exercise</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="e.g., 5km run or Push-ups"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 text-slate-600">Time (minutes)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={e => setDuration(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="e.g., 30"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}