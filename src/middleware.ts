import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware for the auth callback route
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set(name, value, options);
          return undefined;
        },
        remove: (name, options) => {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
          return undefined;
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if user is authenticated for protected routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect logged in users away from auth pages
  if (session && (
    req.nextUrl.pathname.startsWith('/login') || 
    req.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/auth/callback',
    '/auth/login',
    '/forgot-password',
    '/reset-password',
  ],
}; 