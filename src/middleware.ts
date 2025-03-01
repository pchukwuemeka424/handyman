import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './utils/supabaseSession'; // Adjust the path as necessary

export async function middleware(request: NextRequest) {
  // Refresh session and handle cookies
  const response = await updateSession(request);

  // Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Fetch the user's role from the user_profile table
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profile')
    .select('role')
    .eq('id', user.id)
    .single();

  // Redirect users without admin privileges
  if (profileError || userProfile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Allow access for authenticated admins
  return response;
}

// Apply middleware only to the `/admin` path
export const config = {
  matcher: '/admin/:path*',
};
