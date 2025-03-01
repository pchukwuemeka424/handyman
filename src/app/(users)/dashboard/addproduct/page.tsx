"use server";
import React from 'react';
import Topbar from '@/components/topbar';
import ProductForm from '@/components/ProductForm';
import addProduct from '@/actions/auth/productsAdd';
import { createClient } from "@/utils/supabase/server";

export default async function Product() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return <div className="text-red-500 p-4">Error fetching user data.</div>;
  }

  // Fetch total product uploads
  const { count: totalUploads = 0, error: totalUploadsError } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("id", user.id);

  if (totalUploadsError) {
    console.error("Error fetching total uploads:", totalUploadsError);
    return <div className="text-red-500 p-4">Error fetching total uploads.</div>;
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !profile.plan) {
    console.error("Error fetching profile or plan:", profileError, profile);
    return <div className="text-red-500 p-4">Error fetching profile data or plan is missing.</div>;
  }


  const maxUploads = profile.plan; // Fallback to 0 if plan is invalid
  const canUpload = totalUploads < maxUploads;

  console.log({
    userId: user.id,
    plan: profile.plan,
    totalUploads,
    maxUploads,
    canUpload
  });

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 p-6 bg-gray-50 space-y-6 overflow-y-auto">
     
        
        {/* Debugging logs */}
        <pre className="bg-gray-100 p-2 text-xs">
          Total Uploads: {totalUploads}| Max Uploads: {maxUploads === Infinity ? "Unlimited" : maxUploads}
        </pre>

        {maxUploads === Infinity || canUpload ? (
          <div className="bg-green-500 text-white p-4 rounded-md">
            {maxUploads === Infinity
              ? "You have unlimited product uploads."
              : `You can upload ${maxUploads - totalUploads} more products.`}
          </div>
        ) : (
          <div className="bg-red-500 text-white p-4 rounded-md">
            You have reached the maximum number of product uploads. Please upgrade your plan to add more products.
          </div>
        )}

        <ProductForm handler={addProduct} canUpload={canUpload} profile={profile} />
      </div>
    </div>
  );
}
