import React, { useState } from "react";
import HomeNavbar from "../components/HomeNavbar";
import Logo from "../components/Logo";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            
            // Reset status after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900">
            <HomeNavbar />
            
            {/* Hero Section */}
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Get in <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="px-6 pb-24">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-teal-500/20">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    placeholder="Your name"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            {/* Subject Field */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    placeholder="What's this about?"
                                />
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Tell us what's on your mind..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>

                            {/* Success Message */}
                            {submitStatus === "success" && (
                                <div className="p-4 bg-teal-500/20 border border-teal-500/50 rounded-lg text-teal-400 text-center">
                                    <p className="font-medium">Thank you! Your message has been sent successfully.</p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-6 border border-teal-500/20 text-center">
                            <div className="text-3xl mb-4">📧</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                            <p className="text-slate-400">support@lifehub.com</p>
                        </div>
                        <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-6 border border-teal-500/20 text-center">
                            <div className="text-3xl mb-4">💬</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
                            <p className="text-slate-400">Within 24 hours</p>
                        </div>
                        <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-6 border border-teal-500/20 text-center">
                            <div className="text-3xl mb-4">🌐</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Available</h3>
                            <p className="text-slate-400">24/7 Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
