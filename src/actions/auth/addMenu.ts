"use server";

import { createClient } from "@/utils/supabase/server";

export default async function addMenu(state: any, formData: FormData) {
  const supabase =await createClient();
  const menu_name = formData.get("menu_name")?.toString() || "";
  const menu_link = formData.get("menu_link")?.toString() || "";

  const { error } = await supabase
    .from("menu")
    .insert([{ title: menu_name, url: menu_link }]);

  if (error) {
    console.error(error.message);
  }
}
