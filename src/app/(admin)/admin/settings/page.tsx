"use server";

import React from "react";
import GeneralSetting from "./GeneralSetting";
import { createClient } from "@/utils/supabase/server";

export default async function Settings() {


 

  const supabase =await  createClient(); // No need for await here

  // Fetch user details
  const { data: userDetails, error: userError } = await supabase.auth.getUser();

  if (userError || !userDetails?.user) {
    console.error("Error fetching user:", userError);
    return <div>Error loading user details</div>;
  }

  // Fetch site information if user exists
  const { data: siteInfo, error: siteError } = await supabase
    .from("site_info")
    .select("*")
    .single();

  if (siteError) {
    console.error("Error fetching site info:", siteError);
  }

  return (

    <div>

      <GeneralSetting userDetails={userDetails} siteInfo={siteInfo} />
    </div>
  );
}
