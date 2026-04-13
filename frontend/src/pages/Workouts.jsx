import React, { useState, useMemo } from "react";
import { useData } from "../context/useData";
import DateRangeFilter from "../components/DateRangeFilter";

export default function Workouts() {
    const { workouts, addWorkout } = useData();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [error, setError] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredWorkouts = useMemo(() => {
        return workouts.filter(w => {
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const exerciseName = (w.exerciseName || w.name || "").toLowerCase();
                if (!exerciseName.includes(searchLower)) return false;
            }
            if (!w.workoutDate) return true;
            const wDate = new Date(w.workoutDate).toISOString().slice(0,10);
            if (startDate && wDate < startDate) return false;
            if (endDate && wDate > endDate) return false;
            return true;
        });
    }, [workouts, startDate, endDate, searchQuery]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Please enter an exercise name");
            return;
        }
        try {
            await addWorkout({
                exerciseName: name.trim(),
                durationMinutes: duration ? parseInt(duration) : null,
                workoutDate: new Date().toISOString().slice(0,10)
            });
            setName("");
            setDuration("");
            setError("");
            setOpen(false);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to add workout");
        }
    };

    const closeOnBackdrop = () => setOpen(false);
    const stop = (e) => e.stopPropagation();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Workouts</h1>
                    <p className="text-slate-400">Track your exercise and fitness activities</p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Workout
                </button>
            </div>

            <div className="flex flex-col gap-4 mb-2 mt-2">
                <input
                    type="text"
                    placeholder="Search workouts by name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <div className="flex justify-start">
                    <DateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        focusBorderClass="focus:border-green-500"
                    />
                </div>
            </div>

            {workouts.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No workouts logged yet</h3>
                    <p className="text-slate-400 mb-6">Start tracking your workouts to build a stronger you</p>
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                        Log Your First Workout
                    </button>
                </div>
            ) : filteredWorkouts.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No results match your filter</h3>
                    <p className="text-slate-400 mb-6">Try adjusting your search or date range</p>
                    <button
                        onClick={() => {setSearchQuery(''); setStartDate(''); setEndDate('');}}
                        className="bg-slate-700/50 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkouts.map((w, idx) => (
                        <div
                            key={w.id}
                            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="text-4xl mb-4 p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 w-fit">
                                💪
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                                {w.exerciseName || w.name}
                            </h3>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                <div>
                                    <div className="text-2xl font-bold text-green-400">{w.durationMinutes || 0}</div>
                                    <div className="text-slate-400 text-sm">minutes</div>
                                </div>
                                <div className="text-slate-500 text-xs">
                                    {w.workoutDate ? new Date(w.workoutDate).toLocaleDateString() : '—'}
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
                            <h2 className="text-2xl font-bold text-white">Add Workout</h2>
                            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
                        <form onSubmit={onSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Exercise</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="e.g., 5km run or Push-ups"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Time (minutes)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={e => setDuration(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="e.g., 30"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-200">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">Add Workout</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
