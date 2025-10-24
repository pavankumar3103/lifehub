import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Sidebar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/habits", label: "Habits", icon: "🧘‍♂️" },
        { path: "/meals", label: "Meals", icon: "🍽️" },
        { path: "/workouts", label: "Workouts", icon: "💪" },
        { path: "/mood", label: "Mood", icon: "😌" },
        { path: "/profile", label: "Profile", icon: "👤" },
    ];

    return (
        <aside className="sidebar-container hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <Logo size="normal" variant="white" />
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(item.path)
                                ? "bg-teal-500/20 text-teal-400 border-l-4 border-teal-400"
                                : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}