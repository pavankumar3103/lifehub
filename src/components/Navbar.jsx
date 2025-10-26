import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar-container bg-white/80 backdrop-blur-md shadow-lg py-4 px-6 flex justify-between items-center border-b border-slate-200">
            <Link to="/dashboard" className="flex items-center">
                <Logo size="normal" />
            </Link>
            <div className="navbar-links flex gap-6 items-center">
                <Link to="/dashboard" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Dashboard</Link>
                <Link to="/habits" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Habits</Link>
                <Link to="/meals" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Meals</Link>
                <Link to="/workouts" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Workouts</Link>
                <Link to="/mood" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Mood</Link>
                <Link to="/profile" className="nav-link text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200">Profile</Link>
                {user && (
                    <button
                        onClick={handleLogout}
                        className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}