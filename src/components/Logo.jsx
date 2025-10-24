import React from "react";

export default function Logo({ size = "normal", className = "", variant = "default" }) {
    const sizeClasses = {
        small: "text-lg",
        normal: "text-2xl",
        large: "text-4xl"
    };

    // Variant for different contexts (default, white, etc.)
    const getTextColor = () => {
        if (variant === "white") {
            return "text-white";
        }
        return "bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent";
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Logo icon */}
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">L</span>
            </div>
            {/* Logo text */}
            <span 
                className={`font-bold ${getTextColor()} ${sizeClasses[size]}`}
                style={variant === "default" ? { color: '#2DD4BF' } : {}}
            >
                LifeHub
            </span>
        </div>
    );
}
