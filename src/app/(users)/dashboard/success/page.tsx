"use client";

import React, { useEffect, useState } from "react";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Failed to fetch user.");
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("user_profile")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setError("Failed to fetch profile.");
        setLoading(false);
        return;
      }

      const upgradedPlan = profileData?.plan * 2;

      const { error: updateError } = await supabase
        .from("user_profile")
        .update({ subscription_plan: "Standard", plan: upgradedPlan })
        .eq("id", user.id);

      if (updateError) {
        setError("Failed to update plan.");
      } else {
        setProfile({ ...profileData, plan: upgradedPlan });
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <CheckCircleIcon className="text-green-500 w-16 h-16 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Your upgrade has been successfully processed. You now have access to all premium features.
        </p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
