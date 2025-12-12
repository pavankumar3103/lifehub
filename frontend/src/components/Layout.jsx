import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="layout-container flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Sidebar />
            <div className="content-container flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="page-content flex-1 p-6 md:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}