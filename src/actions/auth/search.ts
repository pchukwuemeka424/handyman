// actions/search.ts
"use server";

import { redirect } from "next/navigation";

export async function search(formData: FormData) {
  const search = formData.get('search');
  const state = formData.get('state');

  // Perform search logic here
  redirect(`/filter/?q=${search}&state=${state}`);
}

 