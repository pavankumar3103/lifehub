import React, { useState, useEffect } from 'react';

export default function DashboardPreview() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation when component mounts
        setIsVisible(true);
    }, []);
    // Sample data for preview
    const sampleStats = {
        activeHabits: 8,
        totalHabits: 12,
        totalMeals: 24,
        totalWorkouts: 15,
        totalMoodEntries: 18,
    };

    const sampleHabits = [
        { name: "Morning Meditation", isActive: true },
        { name: "Drink 2L Water", isActive: true },
        { name: "Evening Reading", isActive: true },
    ];

    const sampleRecentActivity = [
        { name: "Morning Run", type: "workout", time: "2h ago" },
        { name: "Grilled Chicken", type: "meal", time: "4h ago" },
        { name: "Feeling Great", type: "mood", time: "6h ago" },
    ];

    return (
        <div className={`bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-teal-500/20 overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
            {/* Dashboard Header */}
            <div className="mb-6">
                <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 rounded-xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold text-white mb-1">Good Morning, User! 👋</h3>
                    <p className="text-teal-100 text-sm">Here's your progress overview</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Animated stat cards */}
                {/* Habit Stat */}
                <div className="relative rounded-xl p-4 shadow-lg overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80')"
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-600/90"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 mb-2"></div>
                        <div className="text-white">
                            <div className="text-2xl font-bold">{sampleStats.activeHabits}</div>
                            <div className="text-purple-100 text-xs">Active Habits</div>
                        </div>
                    </div>
                </div>

                {/* Meal Stat */}
                <div className="relative rounded-xl p-4 shadow-lg overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80')"
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-red-600/90"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 mb-2"></div>
                        <div className="text-white">
                            <div className="text-2xl font-bold">{sampleStats.totalMeals}</div>
                            <div className="text-orange-100 text-xs">Meals Tracked</div>
                        </div>
                    </div>
                </div>

                {/* Workout Stat */}
                <div className="relative rounded-xl p-4 shadow-lg overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80')"
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-emerald-600/90"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 mb-2"></div>
                        <div className="text-white">
                            <div className="text-2xl font-bold">{sampleStats.totalWorkouts}</div>
                            <div className="text-green-100 text-xs">Workouts</div>
                        </div>
                    </div>
                </div>

                {/* Mood Stat */}
                <div className="relative rounded-xl p-4 shadow-lg overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80')"
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/90 to-amber-600/90"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 mb-2"></div>
                        <div className="text-white">
                            <div className="text-2xl font-bold">{sampleStats.totalMoodEntries}</div>
                            <div className="text-yellow-100 text-xs">Mood Entries</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Habits */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50">
                    <h4 className="text-white font-semibold mb-3 text-sm">Recent Activity</h4>
                    <div className="space-y-2">
                        {sampleRecentActivity.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-600/30 hover:bg-slate-600/50 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-white text-sm font-medium truncate">{item.name}</div>
                                    <div className="text-slate-400 text-xs">{item.type} • {item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Habits */}
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50">
                    <h4 className="text-white font-semibold mb-3 text-sm">Active Habits</h4>
                    <div className="space-y-2">
                        {sampleHabits.map((habit, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-600/30 hover:bg-slate-600/50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-white text-sm font-medium truncate">{habit.name}</div>
                                    <div className="text-slate-400 text-xs">Active</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Analytics Preview */}
            <div className="mt-4 bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50">
                <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
                    <span>📊</span> Analytics & Insights
                </h4>
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-slate-600/30">
                        <div className="text-teal-400 text-lg font-bold">62%</div>
                        <div className="text-slate-400 text-xs">Active Rate</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-600/30">
                        <div className="text-cyan-400 text-lg font-bold">4</div>
                        <div className="text-slate-400 text-xs">Categories</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-600/30">
                        <div className="text-purple-400 text-lg font-bold">5</div>
                        <div className="text-slate-400 text-xs">Recommendations</div>
                    </div>
                </div>
            </div>

            {/* Interactive Note */}
            <div className="mt-4 p-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-lg border border-teal-500/20">
                <p className="text-teal-300 text-xs text-center">
                    ✨ <strong>Interactive Dashboard</strong> - Real-time updates, charts, and personalized insights
                </p>
            </div>
        </div>
    );
}
