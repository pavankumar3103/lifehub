import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/useData";
import api from "../services/api/client";

export default function Profile() {
    const { user } = useAuth();
    const { habits = [], meals = [], moodEntries = [], workouts = [] } = useData();

    const [editing, setEditing] = useState(null); // "name" | "email" | "password"
    const [form, setForm] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                currentPassword: "",
                newPassword: ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setMessage("");
    };

    const startEditing = (field) => {
        setEditing(field);
        setError("");
        setMessage("");
        setForm({
            name: user?.name || "",
            email: user?.email || "",
            currentPassword: "",
            newPassword: ""
        });
    };

    const handleCancel = () => {
        setEditing(null);
        setError("");
        setMessage("");
        setForm({
            name: user?.name || "",
            email: user?.email || "",
            currentPassword: "",
            newPassword: ""
        });
    };

    const validate = () => {
        if (!user) {
            setError("User not authenticated");
            return false;
        }

        if (editing === "name") {
            if (!form.name.trim()) {
                setError("Name cannot be empty.");
                return false;
            }
        }

        if (editing === "email") {
            if (!form.email.trim()) {
                setError("Email cannot be empty.");
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
                setError("Enter a valid email address.");
                return false;
            }
            if (!form.currentPassword) {
                setError("Current password is required to change email.");
                return false;
            }
        }

        if (editing === "password") {
            if (!form.currentPassword) {
                setError("Current password is required to change password.");
                return false;
            }
            if (!form.newPassword || form.newPassword.length < 6) {
                setError("New password must be at least 6 characters.");
                return false;
            }
        }

        return true;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const payload = {};
        if (editing === "name") {
            payload.name = form.name.trim();
        }
        if (editing === "email") {
            payload.email = form.email.trim();
            payload.currentPassword = form.currentPassword;
        }
        if (editing === "password") {
            payload.currentPassword = form.currentPassword;
            payload.newPassword = form.newPassword;
        }

        try {
            const response = await api.put("/users/profile", payload);
            const data = response.data;

            if (data.success) {
                const updatedUser = data.data;
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setMessage("Profile updated successfully.");
                setError("");
                setEditing(null);
                setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
                window.location.reload();
            } else {
                setError(data.message || "Update failed.");
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.message || "Update failed.";
            setError(errorMsg);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const stats = {
        totalHabits: habits.length,
        activeHabits: habits.filter((h) => h.isActive).length,
        totalMeals: meals.length,
        totalWorkouts: workouts.length,
        totalMoodEntries: moodEntries.length,
        totalGrams: meals.reduce((sum, m) => sum + (m.quantityGrams || 0), 0),
        totalMinutes: workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0),
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl shadow-2xl border-4 border-white/20">
                        {getInitials(user?.name)}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{user?.name || "User"}</h1>
                        <p className="text-indigo-100 text-lg">{user?.email || ""}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                    <div className="text-3xl mb-3">🧘‍♂️</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.activeHabits}</div>
                    <div className="text-slate-400 text-sm">Active Habits</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                    <div className="text-3xl mb-3">🍽️</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalMeals}</div>
                    <div className="text-slate-400 text-sm">Meals Tracked</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                    <div className="text-3xl mb-3">💪</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalWorkouts}</div>
                    <div className="text-slate-400 text-sm">Workouts</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                    <div className="text-3xl mb-3">😌</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalMoodEntries}</div>
                    <div className="text-slate-400 text-sm">Mood Entries</div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>

                <div className="py-4 border-b border-slate-700/50">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-slate-400 text-sm mb-2">Full Name</div>
                            {editing === "name" ? (
                                <input
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="bg-slate-700 text-white px-3 py-2 rounded w-full"
                                />
                            ) : (
                                <div className="text-white font-medium">{user?.name}</div>
                            )}
                        </div>
                        {editing === "name" ? (
                            <div className="flex gap-2 w-44 flex-shrink-0">
                                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-teal-500 rounded text-white font-medium hover:bg-teal-600">
                                    Save
                                </button>
                                <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-slate-700 rounded text-white font-medium hover:bg-slate-600">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => startEditing("name")} className="w-20 px-4 py-2 bg-slate-700 rounded text-white font-medium hover:bg-slate-600 flex-shrink-0">
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="py-4 border-b border-slate-700/50">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-slate-400 text-sm mb-2">Email</div>
                            {editing === "email" ? (
                                <div className="space-y-2">
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="bg-slate-700 text-white px-3 py-2 rounded w-full"
                                    />
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        placeholder="Current Password"
                                        value={form.currentPassword}
                                        onChange={handleChange}
                                        className="bg-slate-700 text-white px-3 py-2 rounded w-full"
                                    />
                                </div>
                            ) : (
                                <div className="text-white font-medium">{user?.email}</div>
                            )}
                        </div>
                        {editing === "email" ? (
                            <div className="flex gap-2 w-44 flex-shrink-0">
                                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-teal-500 rounded text-white font-medium hover:bg-teal-600">
                                    Save
                                </button>
                                <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-slate-700 rounded text-white font-medium hover:bg-slate-600">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => startEditing("email")} className="w-20 px-4 py-2 bg-slate-700 rounded text-white font-medium hover:bg-slate-600 flex-shrink-0">
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-slate-400 text-sm mb-2">Password</div>
                            {editing === "password" ? (
                                <div className="space-y-2">
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        placeholder="Current Password"
                                        value={form.currentPassword}
                                        onChange={handleChange}
                                        className="bg-slate-700 text-white px-3 py-2 rounded w-full"
                                    />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="New Password"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        className="bg-slate-700 text-white px-3 py-2 rounded w-full"
                                    />
                                </div>
                            ) : (
                                <div className="text-white font-medium">••••••••</div>
                            )}
                        </div>
                        {editing === "password" ? (
                            <div className="flex gap-2 w-44 flex-shrink-0">
                                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-teal-500 rounded text-white font-medium hover:bg-teal-600">
                                    Save
                                </button>
                                <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-slate-700 rounded text-white font-medium hover:bg-slate-600">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => startEditing("password")} className="w-20 px-4 py-2 bg-slate-700 rounded text-white font-medium hover:bg-slate-600 flex-shrink-0">
                                Change
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="text-sm text-red-400 mt-4">{error}</div>}
                {message && !error && <div className="text-sm text-green-400 mt-4">{message}</div>}
            </div>
        </div>
    );
}
