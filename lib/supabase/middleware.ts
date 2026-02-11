import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Get the root domain for cookie sharing across subdomains
 * e.g., "event.ia-rk.com" -> ".ia-rk.com"
 * For localhost, returns undefined (no domain restriction)
 */
function getCookieDomain(host: string): string | undefined {
  // Don't set domain for localhost (development)
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return undefined;
  }
  
  // Extract root domain (e.g., "event.ia-rk.com" -> ".ia-rk.com")
  const parts = host.split('.');
  if (parts.length >= 2) {
    // Get last two parts (e.g., "ia-rk.com") and prefix with dot
    return '.' + parts.slice(-2).join('.');
  }
  
  return undefined;
}

export async function updateSession(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const cookieDomain = getCookieDomain(host);

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set cookie domain for cross-subdomain sharing
            const cookieOptions = {
              ...options,
              ...(cookieDomain && { domain: cookieDomain }),
            };
            supabaseResponse.cookies.set(name, value, cookieOptions);
          });
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE - refreshes the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ['/dashboard', '/admin'];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/masuk';
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Admin-only routes
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
