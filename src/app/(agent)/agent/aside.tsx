"use client";
import { useState } from 'react';
import React from "react";
import { X } from "lucide-react"; // Ensure you have lucide-react installed

interface Agent {
  name: string;
  agentId: string;
}

interface AsideProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  agent: Agent;
}
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
export default function Aside({ isSidebarOpen, setIsSidebarOpen, agent }: AsideProps) {
  return (
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

      {/* Agent Info */}
      <div className="mb-4">
        <p className="text-sm">Agent Name:</p>
        <p className="font-semibold"></p>
      </div>
      <div className="mb-4">
        <p className="text-sm">Agent ID:</p>
        <p className="font-semibold"></p>
      </div>

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
  );
}
