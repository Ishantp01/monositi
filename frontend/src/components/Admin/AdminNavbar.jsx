import React from "react";
import { Menu, Lock } from "lucide-react";
import { Link } from "react-router-dom"

const AdminNavbar = () => {
    const navItems = [
        { name: "Rent", path: "/properties/type/Rent" },
        { name: "Buy", path: "/properties/type/Buy" },
        { name: "Commercial", path: "/properties/type/Commercial" },
        { name: "Users", path: "/admin/users" },
        { name: "Monositi", path: "/admin/monositi" },
    ];

    return (
        <header className="w-full shadow-sm bg-white border-b">
            <nav className={`w-full select-none  flex items-center justify-between px-4 lg:px-12 py-3 relative`}>

                <div className="flex items-center space-x-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 cursor-default">
                    <Lock className="text-black" size={18} strokeWidth={4} />
                    <h1 className="text-black text-base lg:text-xl font-inter font-extrabold">BUILD</h1>
                </div>

                <div className="ml-auto flex items-center gap-4 lg:gap-24">

                    <img
                        src="https://"
                        alt="User Avatar"
                        className="w-10 lg:w-14 h-10 lg:h-14 rounded-full object-cover backdrop-blur bg-white/10"
                    />
                </div>
            </nav>


            {/* Navigation */}
            <nav className="bg-red-50 border-2 border-gray-300 rounded-xl">
                <ul className="flex flex-wrap justify-center gap-4 px-4 py-3 mt-2 mb-2">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                className={`px-4 py-1 border rounded-full transition 
                  ${location.pathname === item.path
                                        ? "bg-red-500 text-white border-red-500"
                                        : "text-red-500 border-red-400 hover:bg-red-500 hover:text-white"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default AdminNavbar;
