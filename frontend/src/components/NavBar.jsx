import React from 'react';
import { Lock } from 'lucide-react';
import { MapPinned } from 'lucide-react';

const Navbar = ({ bgColor = 'bg-theme-primary', avatarUrl }) => {
    return (
        <nav className={`w-full select-none ${bgColor} flex items-center justify-between px-4 lg:px-12 py-3 relative`}>
            {/* BUILD Text - left on mobile, center from md onwards */}
            <div className="flex items-center space-x-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 cursor-default">
                <Lock className="text-black" size={18} strokeWidth={4} />
                <h1 className="text-black text-base lg:text-xl font-inter font-extrabold">BUILD</h1>
            </div>

            <div className="ml-auto flex items-center gap-4 lg:gap-24">
                <button
                    className={`bg-theme-secondary text-black transition-colors duration-500 hover:bg-white flex items-center justify-center rounded-full p-2 w-10 h-10 lg:w-auto lg:h-auto lg:px-6 lg:py-2 `}>
                    {/* Show Icon on mobile + tablet, text only on lg+ */}
                    <MapPinned className="block lg:hidden" size={18} />
                    <span className="hidden lg:block text-sm lg:text-base">Post Property</span>
                </button>

                {/* Avatar */}
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-10 lg:w-14 h-10 lg:h-14 rounded-full object-cover backdrop-blur bg-white/10"
                />
            </div>
        </nav>
    );
};


export default Navbar;
