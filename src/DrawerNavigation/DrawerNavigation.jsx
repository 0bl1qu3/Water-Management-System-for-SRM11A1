import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const DrawerNavigatorTab = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Top Navigation Code: Fixed tab at the top of the screen */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center bg-white px-4 py-3 shadow">
          <button onClick={() => setIsOpen(true)} className="text-gray-800">
            <Menu size={26} />
          </button>
          <h1 className="ml-4 text-xl font-semibold">CampusTracker</h1>
        </div>

        {/* Drawer Navigation Code: Content of opened left drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-70 bg-white z-50 shadow transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <span className="text-lg font-bold">Hey there!</span>
            <button onClick={() => setIsOpen(false)} className="text-3xl text-gray-600">
              ×
            </button>
          </div>

          {/* Links to other pages */}
          <nav className="p-4 space-y-4">
            <Link to="/" className="block hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/reports" className="block hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Reports
            </Link>
            <Link to="/updates" className="block hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Updates
            </Link>
          </nav>
        </div>

        {/* Overlay Code: Background of screen when drawer is open. I made it transparent */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-transparent z-40"
          />
        )}

        {/* Main content of screens with padding to avoid overlap with the fixed header */}
        <div className="pt-16">{children}</div>
      </div>
    );
};

export default DrawerNavigatorTab;