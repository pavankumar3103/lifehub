import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import LoginModal from "./LoginModal";

export default function HomeNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLoginSuccess = () => {
        navigate("/dashboard");
    };

    const handleLoginClick = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            setShowModal(true);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-slate-900/95 backdrop-blur-md shadow-xl border-b border-teal-500/20"
                        : "bg-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <Logo size="normal" variant="white" />
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                to="/"
                                className={`nav-link font-medium transition-all duration-200 ${
                                    isActive("/")
                                        ? "text-teal-400 border-b-2 border-teal-400"
                                        : "text-white hover:text-teal-400"
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/contact"
                                className={`nav-link font-medium transition-all duration-200 ${
                                    isActive("/contact")
                                        ? "text-teal-400 border-b-2 border-teal-400"
                                        : "text-white hover:text-teal-400"
                                }`}
                            >
                                Contact Us
                            </Link>
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Login
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={handleLoginClick}
                                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-full text-sm"
                            >
                                {user ? "Dashboard" : "Login"}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <LoginModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </>
    );
}
