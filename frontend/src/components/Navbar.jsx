import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-[#121212] text-white border-b border-gray-800">
      <h1 className="text-lg font-bold">⚡ CipherStudio</h1>

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-300">{user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <a href="/login" className="text-gray-300 hover:text-white">
              Login
            </a>
            <a href="/signup" className="text-gray-300 hover:text-white">
              Signup
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
