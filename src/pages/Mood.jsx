import React from "react";

export default function Mood() {
    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Mood</h1>
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <p className="text-slate-600 text-lg">Welcome to your Mood page! Track your daily moods and emotional well-being here.</p>
                </div>
            </div>
        </div>
    );
}