"use client";

import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ bgColor = "bg-theme-primary", avatarUrl }) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(JSON.parse(storedRole));
  }, []);

  return (
    <nav
      className={`w-full select-none ${bgColor} flex items-center justify-between px-4 lg:px-12 py-3 relative shadow-md`}
    >
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Lock className="text-white" size={20} strokeWidth={4} />
          <h1 className="text-white text-lg lg:text-2xl font-extrabold tracking-wide">
            Monositi
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/add-property"
          className="bg-theme-secondary text-black px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-white border border-black"
        >
          Post Your Property
        </Link>

        {role === "admin" && (
          <Link
            to="/admin"
            className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Admin
          </Link>
        )}

        <Link
          to="/login"
          className="border border-black text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Sign Up
        </Link>

        {avatarUrl && (
          <Link to="/profile">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-10 lg:w-12 h-10 lg:h-12 rounded-full object-cover border-2 border-gray-200 cursor-pointer"
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
