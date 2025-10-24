import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="layout-container flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Sidebar />
            <div className="content-container flex flex-col flex-1">
                <Navbar />
                <main className="page-content flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}