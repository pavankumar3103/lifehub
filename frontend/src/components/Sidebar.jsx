import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Sidebar() {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: "📊", color: "from-blue-500 to-cyan-500" },
        { path: "/habits", label: "Habits", icon: "🧘‍♂️", color: "from-purple-500 to-pink-500" },
        { path: "/meals", label: "Meals", icon: "🍽️", color: "from-orange-500 to-red-500" },
        { path: "/workouts", label: "Workouts", icon: "💪", color: "from-green-500 to-emerald-500" },
        { path: "/mood", label: "Mood", icon: "😌", color: "from-yellow-500 to-amber-500" },
        { path: "/analytics", label: "Analytics", icon: "📈", color: "from-teal-500 to-cyan-500" },
        { path: "/profile", label: "Profile", icon: "👤", color: "from-indigo-500 to-purple-500" },
    ];

    return (
        <aside className="sidebar-container hidden md:flex flex-col w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-r border-slate-700/50 shadow-2xl">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700/50">
                <Logo size="normal" variant="white" />
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
                {navItems.map((item, index) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onMouseEnter={() => setHoveredItem(item.path)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`sidebar-link group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                            isActive(item.path)
                                ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-teal-500/20 scale-105`
                                : hoveredItem === item.path
                                ? "bg-slate-700/50 text-white scale-105"
                                : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                        }`}
                        style={{
                            animationDelay: `${index * 50}ms`
                        }}
                    >
                        {/* Active indicator */}
                        {isActive(item.path) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
                        
                        <span className={`text-2xl transition-transform duration-300 ${
                            isActive(item.path) || hoveredItem === item.path ? "scale-110" : ""
                        }`}>
                            {item.icon}
                        </span>
                        <span className="font-semibold text-base">{item.label}</span>
                        
                        {/* Hover effect */}
                        {hoveredItem === item.path && !isActive(item.path) && (
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-xl blur-sm`}></div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700/50">
                <div className="text-xs text-slate-400 text-center">
                    <p>LifeHub v1.0</p>
                    <p className="mt-1">Track. Grow. Thrive.</p>
                </div>
            </div>
        </aside>
    );
}