// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();
  // Add your Supabase setup code here
  const supabase = createServerClient({ cookieStore });
  return supabase;
}
