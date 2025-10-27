import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import bgImage from "../assets/home-bg.jpg"; // import your background image

const HomePage = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ 
            behavior: "smooth",
            block: "start"
        });
    };

    const handleGetStarted = () => {
        scrollToSection("why-lifehub");
    };

    const handleStartJourney = () => {
        setShowModal(true);
    };

    const handleLoginSuccess = () => {
        navigate("/dashboard");
    };

    // Consistent color palette for life, calmness, and coolness
    const colors = {
        primary: '#2DD4BF',      // Soft teal - represents life and growth
        secondary: '#14B8A6',    // Deeper teal - for depth
        accent: '#0891B2',       // Cool blue - for calmness
        sage: '#6B7280',         // Sage gray - for balance
        calm: '#F0FDFA',         // Calm mint - for soft backgrounds
        dark: '#0F172A',         // Deep slate - for contrast
        muted: '#64748B',        // Muted blue-gray
    };

    return (
        <>
            <LoginModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                onSuccess={handleLoginSuccess}
            />
            {/* -------- HERO SECTION -------- */}
        <div
            className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-6 relative text-white"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
                {/* Calming gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/60" />
                
                {/* Hero content */}
                <div className="text-center max-w-4xl bg-slate-900/60 backdrop-blur-md p-10 rounded-2xl relative z-10 border border-slate-700/30 shadow-2xl">
                {/* Main title */}
                    <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
                        Centralize Your Life with{' '}
                        <span 
                            className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
                            style={{ color: colors.primary }}
                        >
                            LifeHub
                        </span>
                </h1>

                {/* Subtext */}
                    <p className="text-slate-300 text-xl sm:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto">
                        Find peace in progress. Track your habits, set meaningful goals, and watch your growth unfold — all in one serene, focused space.
                </p>

                {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                            onClick={handleGetStarted}
                            className="group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
                        >
                            <span className="flex items-center gap-2">
                                Begin Your Journey
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                    </button>
                        <button className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900 font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                        See Demo
                    </button>
                    </div>
                </div>

                {/* Floating elements for visual interest */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>

            {/* -------- WHY LIFEHUB SECTION -------- */}
            <section 
                id="why-lifehub" 
                className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900 flex flex-col items-center justify-center px-6 relative text-white py-20"
            >
                {/* Soft overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40" />
                
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="mb-16">
                        <h2 className="text-5xl sm:text-6xl font-bold mb-6">
                            Why{' '}
                            <span 
                                className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
                                style={{ color: colors.primary }}
                            >
                                LifeHub
                            </span>
                            ?
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            More than productivity — it's about nurturing your well-being with gentle yet powerful tools for growth.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-teal-500/20 hover:border-teal-400/40">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🧘‍♂️</div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Mindful Tracking</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                Cultivate consistent habits with gentle reminders and visual progress that celebrates every step forward.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-teal-500/20 hover:border-teal-400/40">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🎯</div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Purposeful Goals</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                Set meaningful intentions and reflect on your journey with tools designed for sustainable growth.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-teal-500/20 hover:border-teal-400/40">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🌱</div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Visual Growth</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                See your transformation unfold through beautifully designed charts that tell the story of your progress.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-teal-500/20 hover:border-teal-400/40">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🔒</div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Safe Space</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                Your personal sanctuary online — where your data and progress remain completely private and secure.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* ---How it works--- */}
            <section id="how-it-works" className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 to-cyan-900/10" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="mb-16">
                        <h2 className="text-5xl font-bold mb-6">
                            How It <span 
                                className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
                                style={{ color: colors.primary }}
                            >Works</span>
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Simple steps to transform your daily routine into a meaningful journey of growth and self-discovery.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="group relative p-8 bg-slate-800/60 backdrop-blur-md rounded-2xl border border-teal-500/20 hover:border-teal-400/40 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                            <div className="absolute -top-4 left-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center">1</div>
                            <h3 className="text-2xl font-semibold mb-6 mt-4 text-white">Create Your Sanctuary</h3>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Set up your personal space to track habits, goals, and mood in a way that feels uniquely yours.
                            </p>
                        </div>
                        <div className="group relative p-8 bg-slate-800/60 backdrop-blur-md rounded-2xl border border-teal-500/20 hover:border-teal-400/40 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                            <div className="absolute -top-4 left-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center">2</div>
                            <h3 className="text-2xl font-semibold mb-6 mt-4 text-white">Cultivate Daily Habits</h3>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Log your daily activities, reflections, and mood in a gentle, supportive environment designed for consistency.
                            </p>
                        </div>
                        <div className="group relative p-8 bg-slate-800/60 backdrop-blur-md rounded-2xl border border-teal-500/20 hover:border-teal-400/40 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                            <div className="absolute -top-4 left-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center">3</div>
                            <h3 className="text-2xl font-semibold mb-6 mt-4 text-white">Witness Your Growth</h3>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Watch your progress unfold through beautiful visualizations that celebrate every milestone and moment of growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/*-- See LifeHub in Action ---*/}
            <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/5 to-cyan-900/5" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-16">
                        <h2 className="text-5xl font-bold mb-6">
                            See <span 
                                className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
                                style={{ color: colors.primary }}
                            >LifeHub</span> in Action
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            A peaceful dashboard designed to bring clarity, focus, and joy to your daily life — where productivity meets mindfulness.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto border border-teal-500/20">
                        <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                            <div className="text-center p-12">
                                <div className="text-6xl mb-6">📊</div>
                                <p className="text-xl text-slate-300 mb-4">Interactive Dashboard Preview</p>
                                <p className="text-slate-400">Dashboard preview coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*--- Testimonials ---*/}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 to-cyan-900/10" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="mb-16">
                        <h2 className="text-5xl font-bold mb-6">What Our Community Says</h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Real stories from people who found peace and purpose in their daily routines.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-teal-500/20">
                            <div className="text-4xl mb-6">✨</div>
                            <p className="italic text-slate-300 text-lg leading-relaxed mb-6">
                                "LifeHub transformed how I approach my days. It's not just tracking — it's about finding peace in progress."
                            </p>
                            <p className="font-semibold text-teal-400 text-lg">– Alex M.</p>
                        </div>
                        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-teal-500/20">
                            <div className="text-4xl mb-6">🌅</div>
                            <p className="italic text-slate-300 text-lg leading-relaxed mb-6">
                                "The gentle interface makes morning reflection feel like a warm embrace. I look forward to it every day."
                            </p>
                            <p className="font-semibold text-teal-400 text-lg">– Sarah K.</p>
                        </div>
                        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-teal-500/20">
                            <div className="text-4xl mb-6">🌱</div>
                            <p className="italic text-slate-300 text-lg leading-relaxed mb-6">
                                "Finally, a tool that focuses on growth and clarity rather than just busyness. It's changed how I see progress."
                            </p>
                            <p className="font-semibold text-teal-400 text-lg">– John D.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/*-- Call to action ---*/}
            <section 
                className="text-white text-center py-24 px-6 relative overflow-hidden"
                style={{ backgroundColor: colors.dark }}
            >
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{ 
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
                    }}
                ></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-5xl sm:text-6xl font-bold mb-8">
                        Ready to Begin Your 
                        <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Growth Journey?
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Join thousands of people who have found peace, purpose, and progress in their daily lives.
                    </p>
                    <button 
                        onClick={handleStartJourney}
                        className="group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
                        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
                    >
                        <span className="flex items-center gap-3">
                            Start Your Journey Today
                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
        </div>
            </section>
        </>
    );
};

export default HomePage;