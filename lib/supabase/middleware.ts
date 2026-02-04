import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { rateLimit } from '../security/rate-limit';

export async function updateSession(request: NextRequest) {
  // 1. Rate Limiting Check
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/masuk') ||
    request.nextUrl.pathname.startsWith('/daftar');

  const rlConfig = isAuthRoute
    ? { limit: 10, windowMs: 60000 } // Auth: 10 req/min
    : { limit: 100, windowMs: 60000 }; // Others: 100 req/min

  const rlResult = rateLimit(ip, rlConfig);

  if (!rlResult.success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': rlResult.limit.toString(),
        'X-RateLimit-Remaining': rlResult.remaining.toString(),
        'X-RateLimit-Reset': rlResult.reset.toString(),
      }
    });
  }

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
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
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
