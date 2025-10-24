import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <nav className="navbar-container bg-white/80 backdrop-blur-md shadow-lg py-4 px-6 flex justify-between items-center border-b border-slate-200">
            <Link to="/" className="flex items-center">
                <Logo size="normal" />
            </Link>
            <div className="navbar-links flex gap-6">
                <Link to="/dashboard" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Dashboard</Link>
                <Link to="/habits" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Habits</Link>
                <Link to="/meals" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Meals</Link>
                <Link to="/workouts" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Workouts</Link>
                <Link to="/mood" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Mood</Link>
                <Link to="/profile" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Profile</Link>
            </div>
        </nav>
    );
}