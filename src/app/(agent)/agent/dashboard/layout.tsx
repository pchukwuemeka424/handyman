"use client";
import React from "react";
import { Menu, User, X } from "lucide-react";
import { UserProvider } from "./useContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = React.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // Added missing state

  return (
    <UserProvider>
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-5 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex md:flex-col`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 md:hidden text-white"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Dashboard Title */}
        <h2 className="text-xl font-bold mb-4">Agent Dashboard</h2>

    
        {/* Navigation Links */}
        <nav>
          <ul>
            {[
              "Dashboard",
              "Vendor",
              "Manage Vendor",
              "Current Location",
              "Orders",
              "Revenue",
              "Settings",
              "Logout",
            ].map((item) => (
              <li
                key={item}
                className="py-2 hover:bg-gray-700 px-3 rounded cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100">
        <button
          className="md:hidden mb-4 p-2 bg-gray-800 text-white rounded"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        <p className="mt-2 text-gray-700">
          This is your dashboard where you can manage your tasks.
        </p>

        {/* Dashboard Stats */}
        {children}
      </main>
    </div>
    </UserProvider>
  );
}
