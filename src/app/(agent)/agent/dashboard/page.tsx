"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "./useContext";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import AgentTable from "@/components/agentTable";

export default function Dashboard() {
  const session = useUser();

  const totalRows = 320; // Total rows as a constant
  const [progress, setProgress] = useState(0);
  const [userCount, setUserCount] = useState(0); // Total users count
  const [productCount, setProductCount] = useState(0); // Total products count

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = await createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (!user || userError) {
        redirect("/"); // Redirect if user is not authenticated
        return;
      }

      // Fetch agent details
      const { data: agentSession, error: agentError } = await supabase
        .from("agents")
        .select("agentId")
        .eq("user_id", user.id)
        .single();

      if (agentError || !agentSession) {
        console.error("Error fetching agent session:", agentError);
        return;
      }

      // Fetch total users under this agent
      const { count: userCount, error: userCountError } = await supabase
        .from("user_profile")
        .select("*", { count: "exact" })
        .eq("agentId", agentSession.agentId);

      // Fetch total products
      const { count: productCount, error: productCountError } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("agentId", agentSession.agentId);


      if (userCountError) console.error("Error fetching user count:", userCountError);
      if (productCountError) console.error("Error fetching product count:", productCountError);

      setUserCount(userCount || 0);
      setProductCount(productCount || 0);
    };

    fetchCounts();
  }, []);

  // Update progress percentage
  useEffect(() => {
    const percentage = (userCount / totalRows) * 100;
    setProgress(percentage);
  }, [userCount]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {session?.fname}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl font-bold">{productCount}</p>
        </div>
        {/* Progress Task */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2 sm:col-span-1">
          <h3 className="text-lg font-semibold">Task Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{progress.toFixed(0)}% completed</p>
        </div>
      </div>


<AgentTable />

    </div>
  );
}
