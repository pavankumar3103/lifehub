import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { getHabitAnalytics, getAnalyticsSummary } from '../services/api/analytics';
import { useData } from '../context/useData';

const COLORS = ['#14b8a6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function Analytics() {
  const { meals = [], workouts = [], moodEntries = [] } = useData();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsRes] = await Promise.all([
        getHabitAnalytics(),
        getAnalyticsSummary(),
      ]);
      
      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data);
      }
      // summaryRes currently unused in UI; ignore for now
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const habitStatusData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: 'Active', value: analytics.activeHabits || 0, color: '#10b981' },
      { name: 'Inactive', value: analytics.inactiveHabits || 0, color: '#ef4444' },
    ];
  }, [analytics]);

  const categoryData = useMemo(() => {
    if (!analytics?.categoryStats) return [];
    return analytics.categoryStats.map((cat, index) => ({
      name: cat.category,
      total: cat.count,
      active: cat.activeCount,
      color: COLORS[index % COLORS.length],
    }));
  }, [analytics]);

  // Time-based trends (last 7 days)
  const weeklyTrends = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const mealsCount = meals.filter(m => m.mealDate === dateStr).length;
      const workoutsCount = workouts.filter(w => w.workoutDate === dateStr).length;
      const moodCount = moodEntries.filter(m => m.moodDate === dateStr).length;
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        meals: mealsCount,
        workouts: workoutsCount,
        mood: moodCount,
      });
    }
    return days;
  }, [meals, workouts, moodEntries]);

  // Meal quantity trends
  const mealQuantityTrends = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMeals = meals.filter(m => m.mealDate === dateStr);
      const totalGrams = dayMeals.reduce((sum, m) => sum + (m.quantityGrams || 0), 0);
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        grams: totalGrams,
      });
    }
    return days;
  }, [meals]);

  // Workout duration trends
  const workoutDurationTrends = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayWorkouts = workouts.filter(w => w.workoutDate === dateStr);
      const totalMinutes = dayWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        minutes: totalMinutes,
      });
    }
    return days;
  }, [workouts]);

  // Mood distribution
  const moodDistribution = useMemo(() => {
    const moodCounts = {};
    moodEntries.forEach(entry => {
      const mood = entry.moodValue || '😊';
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood,
      value: count,
    }));
  }, [moodEntries]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalMeals = meals.length;
    const totalWorkouts = workouts.length;
    const totalMoodEntries = moodEntries.length;
    const totalGrams = meals.reduce((sum, m) => sum + (m.quantityGrams || 0), 0);
    const totalMinutes = workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
    
    return {
      totalMeals,
      totalWorkouts,
      totalMoodEntries,
      totalGrams: Math.round(totalGrams / 1000 * 10) / 10, // kg
      totalMinutes,
      avgMealSize: totalMeals > 0 ? Math.round(totalGrams / totalMeals) : 0,
      avgWorkoutDuration: totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0,
    };
  }, [meals, workouts, moodEntries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="text-teal-400 hover:text-teal-300 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Analytics & Insights 📊
          </h1>
          <p className="text-teal-100 text-lg">Track your progress and discover patterns</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="text-3xl mb-2">🍽️</div>
          <div className="text-3xl font-bold text-white">{overallStats.totalMeals}</div>
          <div className="text-slate-400 text-sm">Total Meals</div>
          <div className="text-teal-400 text-xs mt-1">{overallStats.totalGrams}kg tracked</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="text-3xl mb-2">💪</div>
          <div className="text-3xl font-bold text-white">{overallStats.totalWorkouts}</div>
          <div className="text-slate-400 text-sm">Total Workouts</div>
          <div className="text-teal-400 text-xs mt-1">{overallStats.totalMinutes} min total</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="text-3xl mb-2">😌</div>
          <div className="text-3xl font-bold text-white">{overallStats.totalMoodEntries}</div>
          <div className="text-slate-400 text-sm">Mood Entries</div>
          <div className="text-teal-400 text-xs mt-1">Keep tracking!</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="text-3xl mb-2">🧘‍♂️</div>
          <div className="text-3xl font-bold text-white">{analytics?.activeHabits || 0}</div>
          <div className="text-slate-400 text-sm">Active Habits</div>
          <div className="text-teal-400 text-xs mt-1">
            {analytics?.activeHabitsPercentage?.toFixed(1) || 0}% active
          </div>
        </div>
      </div>

      {/* Habit Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Habit Status Pie Chart */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Habit Status</h2>
            {habitStatusData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={habitStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {habitStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                No habit data available
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Habit Categories</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#14b8a6" name="Total Habits" />
                  <Bar dataKey="active" fill="#10b981" name="Active Habits" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                No category data available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weekly Trends */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">7-Day Activity Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyTrends}>
            <defs>
              <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="meals"
              stackId="1"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorMeals)"
              name="Meals"
            />
            <Area
              type="monotone"
              dataKey="workouts"
              stackId="1"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorWorkouts)"
              name="Workouts"
            />
            <Area
              type="monotone"
              dataKey="mood"
              stackId="1"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorMood)"
              name="Mood Entries"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Meal & Workout Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Quantity Trends */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Meal Quantity Trends (7 Days)</h2>
          <div className="mb-4 text-sm text-slate-400">
            Avg: {overallStats.avgMealSize}g per meal
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mealQuantityTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`${value}g`, 'Quantity']}
              />
              <Line
                type="monotone"
                dataKey="grams"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Duration Trends */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Workout Duration Trends (7 Days)</h2>
          <div className="mb-4 text-sm text-slate-400">
            Avg: {overallStats.avgWorkoutDuration} min per workout
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={workoutDurationTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`${value} min`, 'Duration']}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood Distribution */}
      {moodDistribution.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Mood Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights */}
      {analytics?.insights && analytics.insights.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">💡 Insights</h2>
          <div className="space-y-3">
            {analytics.insights.map((insight, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl p-4 border border-teal-500/20"
              >
                <p className="text-teal-300">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Habit Statistics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-xl">
            <div className="text-slate-400 text-sm mb-2">Average Habit Age</div>
            <div className="text-3xl font-bold text-white">
              {analytics.averageHabitAgeDays?.toFixed(1) || 0}
            </div>
            <div className="text-slate-500 text-xs mt-1">days</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-xl">
            <div className="text-slate-400 text-sm mb-2">Oldest Habit</div>
            <div className="text-3xl font-bold text-white">
              {analytics.oldestHabitAgeDays || 0}
            </div>
            <div className="text-slate-500 text-xs mt-1">days old</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-xl">
            <div className="text-slate-400 text-sm mb-2">Newest Habit</div>
            <div className="text-3xl font-bold text-white">
              {analytics.newestHabitAgeDays || 0}
            </div>
            <div className="text-slate-500 text-xs mt-1">days old</div>
          </div>
        </div>
      )}
    </div>
  );
}
