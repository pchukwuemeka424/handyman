"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error("Authentication error:", authError?.message);
          setError("Authentication error");
          return;
        }

        const { data, error: dataError } = await supabase
          .from("user_profile")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dataError) throw dataError;
        setUserDetails(data);
      } catch (error) {
        setError(error.message || "Failed to fetch user data.");
      }
    };

    fetchUser();

    // Load Flutterwave Payment Script if not already loaded
    if (!document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      script.onload = () => console.log("Flutterwave Payment Script Loaded");
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const handlePayment = async () => {
    if (!userDetails) {
      setError("User details are not available.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous error

    const publicKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY;
    const txRef = `rave-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    try {
      FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: txRef,
         redirect_url: "/dashboard/success",
        amount: 100,
        currency: "NGN",
        payment_options: "card, mobilemoney, ussd",
        customer: {
          email: userDetails?.email || "user@example.com",
          phone_number: "234099940409",
          name: userDetails?.name || "User",
        },
        callback: async function (response) {
          console.log("Payment Response:", response);
          if (response.status === "successful") {
            // Update user_profile subscription plan
          
              window.location.href = "/dashboard";
              console.log("redirecy.");
            if (updateError) {
              console.error("Error updating user profile:", updateError);
              setError("Failed to update user profile.");
            } else {
              console.log("User profile updated successfully.");
            
            }
          } else {
            setError("Payment failed. Please try again.");
          }
          setLoading(false);
        },
        onclose: function () {
          setLoading(false);
        },
      });
    } catch (paymentError) {
      setError(paymentError.message || "Payment processing failed.");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upgrade Plan</title>
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">Upgrade Your Plan</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-gray-700 mb-4">Upgrade to the Pro Plan and enjoy more features!</p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Advanced Features</li>
              <li>Priority Support</li>
              <li>Access to Beta Features</li>
            </ul>
            <div className="text-center">
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : "Upgrade Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
