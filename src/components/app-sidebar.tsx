"use client";
import React from 'react';
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export function AppSidebar() {
  const supabase = createClient();

  // Fetch menu data using useEffect
  const [menu, setMenu] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('menu')
        .select('*');

      if (error) {
        console.error('Error fetching menu data:', error);
      } else {
        setMenu(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 flex justify-start">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white h-full shadow-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Sidebar</h2>
          <button className="text-white focus:outline-none">Close</button>
        </div>

        <div className="space-y-4">
          {menu.map((menuItem) => {
            const Icon = iconMap[menuItem.icon?.toLowerCase()];
            return (
              <div key={menuItem.title} className="flex items-center gap-2 py-2 hover:bg-gray-700 rounded-md">
                {Icon && <Icon size={24} />}
                <Link href={menuItem.url}>
                  <span>{menuItem.title}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50"></div>
    </div>
  );
}

const iconMap = {
  calendar: Calendar,
  home: Home,
  inbox: Inbox,
  search: Search,
  settings: Settings,
};
