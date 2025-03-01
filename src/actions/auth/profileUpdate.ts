"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function profileUpdate(state: any, formData: FormData) {
  const supabase = await createClient();

  // Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Authentication error:", authError?.message);
    return { errors: { message: "Authentication error" } };
  }

  // Validation schema
  const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    shopname: z.string().min(3, "Shop name must be at least 3 characters long"),
    phone: z.string().regex(/^\d{11}$/, "Phone must be 11 digits"),
    address: z.string().optional(),
    stat: z.string().min(2, "State is required"),
    city: z.string().min(2, "City is required"),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    twitter: z.string().optional(),
    about: z.string().optional(),
  });

  const profileData = Object.fromEntries(formData);
  const validation = schema.safeParse(profileData);

  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("user_profile")
    .update(validation.data)
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { errors: { message: "Failed to update profile" } };
  }

  // Redirect and ensure function ends
  redirect("/dashboard");
  return null; // Ensure no further execution happens after the redirect
}
