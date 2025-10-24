import React from "react";

export default function DashboardCard({ title, data }) {
    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold text-lg">{title}</h2>
            <ul className="mt-2">
                {data.map((item, idx) => (
                    <li key={idx} className="border-b py-1">{item.name || item.date}</li>
                ))}
            </ul>
        </div>
    );
}