import React from "react";
import { Lock } from 'lucide-react';

export default function AuthLayout({ children, image }) {
    return (<>

        <nav className="fixed top-0 w-full bg-theme-primary flex items-center justify-center py-3 lg:py-4">
            <div className="flex items-center space-x-2">
                <Lock className="text-black" size={22} strokeWidth={4} />
                <h1 className="text-black text-lg lg:text-xl font-bold">BUILD</h1>
            </div>
        </nav>
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left image */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5">
                <img
                    src={image}
                    alt="auth"
                    className="h-screen w-full object-cover"
                />
            </div>

            {/* Right form area */}
            <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm">{children}</div>
            </div>
        </div>
    </>
    );
}
