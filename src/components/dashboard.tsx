"use client";

import { useUser } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import MultiSelectCombobox from "./MultiSelectCombobox";
import supabaseDb from "@/utils/supabase-db";

const Dashboard: React.FC = () => {
  const user = useUser();
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchUserRating = async () => {
      try {
        const { data, error } = await supabaseDb
          .from("rating")
          .select("stars")
          .eq("user_id", user.user_id);

        if (error) throw error;

        const totalStars = data.reduce(
          (acc, rating) => acc + (parseFloat(rating.stars) || 0),
          0
        );
        const reviewCount = data.length;
        const calculatedRating =
          reviewCount > 0 ? Math.round((totalStars / reviewCount) * 10) / 10 : 0;

        setAverageRating(calculatedRating);
      } catch (error) {
        console.error("Error fetching user rating:", error.message);
      }
    };

    fetchUserRating();
  }, [user?.user_id]);

  const fetchNotificationCount = async () => {
    if (!user?.user_id) return;

    try {
      const { count, error } = await supabaseDb
        .from("message")
        .select("id", { count: "exact" }) // Selecting specific column for accurate count
        .eq("user_id", user.user_id);

      if (error) throw error;
      setNotificationCount(count ?? 0);
    } catch (error) {
      console.error("Error fetching notification count:", error.message);
    }
  };

  useEffect(() => {
    fetchNotificationCount();

    // ✅ Fix: Use correct real-time subscription for database changes
    const subscription = supabaseDb
      .channel("realtime:message")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message", filter: `user_id=eq.${user?.user_id}` },
        (payload) => {
          console.log("New message update:", payload);
          fetchNotificationCount(); // Refresh count on update
        }
      )
      .subscribe();

    return () => {
      supabaseDb.removeChannel(subscription);
    };
  }, [user?.user_id]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return "⭐".repeat(fullStars) + (halfStar ? "⭐" : "") + "☆".repeat(emptyStars);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-4xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome, <span className="capitalize">{user?.fname ?? "Guest"} {user?.lname ?? ""}</span>
        </h1>
        <div>{user?.busName}</div>

        {/* Rating & Notifications */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Rating</h2>
            <p className="text-2xl font-bold text-yellow-400">
              {averageRating !== null ? `${renderStars(averageRating)} ${averageRating}/5` : "Loading..."}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Notifications</h2>
            <p className="text-2xl font-bold text-red-500">{notificationCount} New</p>
          </div>
        </div>

        {/* Add Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Your Skills</h2>
          <form>
            <MultiSelectCombobox />
            <button className="mt-4 w-full p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
              Add Skill
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
