"use client";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: error.message }; // Return error state
  }
 redirect('/login');
}
