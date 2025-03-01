"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function RegisterVendor(state: any, formData: FormData) {
  const supabase = await createClient();

  // Validation schema
  const schema = z.object({
    shopname: z.string().min(3, "Shop name must be at least 3 characters long"),
    phone: z.string().regex(/^\d{11}$/, "Phone must be 11 digits"),
    address: z.string().optional(),
    stat: z.string().min(2, "State is required"),
    about: z.string().optional(),
    marketname: z.string().min(3, "Market name must be at least 3 characters long"),
    city: z.string().min(2, "City is required"),
    line: z.string().optional(),
    agentId: z.string().optional(), // Assuming this is optional
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    username:  z.string().optional(),

  });

  // Convert formData to a usable object
  const profileData = Object.fromEntries(formData.entries());

  // Validate data
  const validation = schema.safeParse(profileData);
  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  // Sign up user with email and password in Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (authError) {
    console.error("Sign up error:", authError);
    return { errors: { message: authError.message || "Failed to sign up" } };
  }

  // Insert vendor profile into Supabase
  const { error: profileError } = await supabase.from("user_profile").insert([
    { id: authData.user?.id,
      shopname: validation.data.shopname,
      phone: validation.data.phone,
      location: validation.data.address,
      stat: validation.data.stat,
      about: validation.data.about,
      marketname: validation.data.marketname,
      city: validation.data.city,
      line: validation.data.line,
      agentId: validation.data.agentId,
      latitude: validation.data.latitude,
      longitude: validation.data.longitude,
      username: validation.data.username,
      kyc_status: "Approved",
      pd: validation.data.password,
      email: validation.data.email,
    },
  ]);

  if (profileError) {
    console.error("Profile insert error:", profileError);
    return { errors: { message: profileError.message || "Failed to update profile" } };
  }

  // Redirect after successful registration
  redirect("/dashboard");
  return null;
}
