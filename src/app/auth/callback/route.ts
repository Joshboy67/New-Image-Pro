import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('Auth callback received, code present:', !!code);

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: (name: string) => cookieStore.get(name)?.value,
            set: (name: string, value: string, options: any) => {
              cookieStore.set(name, value, options);
              return undefined;
            },
            remove: (name: string, options: any) => {
              cookieStore.set(name, '', { ...options, maxAge: 0 });
              return undefined;
            },
          },
        }
      );
      
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error.message);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
        );
      }
      
      console.log('Session established successfully, redirecting to dashboard');
    } catch (err: any) {
      console.error('Unexpected error in auth callback:', err);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('An unexpected error occurred')}`, request.url)
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
} 