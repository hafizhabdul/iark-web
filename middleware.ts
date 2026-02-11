import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Skip internal Next.js paths (static files, API internals, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return await updateSession(request);
  }

  // Subdomain detection
  const isEventSubdomain = host.startsWith('event.');
  const isDonasiSubdomain = host.startsWith('donasi.');

  // Block admin/dashboard routes from subdomains & redirect /masuk to main domain
  if (isEventSubdomain || isDonasiSubdomain) {
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard')) {
      const mainUrl = new URL(url);
      mainUrl.host = host.replace(/^(event\.|donasi\.)/, '');
      mainUrl.pathname = '/';
      return NextResponse.redirect(mainUrl);
    }
    
    // Redirect /masuk to main domain
    if (url.pathname === '/masuk' || url.pathname === '/daftar') {
      const mainUrl = new URL(url);
      mainUrl.host = host.replace(/^(event\.|donasi\.)/, '');
      return NextResponse.redirect(mainUrl);
    }
  }

  // Redirect: ia-rk.com/event/* → event.ia-rk.com/*
  if (!isEventSubdomain && url.pathname.startsWith('/event')) {
    const eventUrl = new URL(url);
    eventUrl.host = host.replace(/^(www\.)?/, 'event.');
    eventUrl.pathname = url.pathname.replace(/^\/event/, '') || '/';
    return NextResponse.redirect(eventUrl, 301);
  }

  // Redirect: ia-rk.com/donasi/* → donasi.ia-rk.com/*
  if (!isDonasiSubdomain && url.pathname.startsWith('/donasi')) {
    const donasiUrl = new URL(url);
    donasiUrl.host = host.replace(/^(www\.)?/, 'donasi.');
    donasiUrl.pathname = url.pathname.replace(/^\/donasi/, '') || '/';
    return NextResponse.redirect(donasiUrl, 301);
  }

  // Rewrite: event.ia-rk.com/* → /event/*
  // Skip in development - handled by next.config.ts rewrites
  if (isEventSubdomain && !url.pathname.startsWith('/event')) {
    // In production, middleware handles the rewrite
    if (process.env.NODE_ENV === 'production') {
      url.pathname = `/event${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    // In development, let next.config.ts rewrites handle it
    return await updateSession(request);
  }

  // Redirect: /checkout (generic) → /donasi-umum/checkout on donasi subdomain
  if (isDonasiSubdomain && url.pathname === '/checkout') {
    url.pathname = '/donasi-umum/checkout';
    return NextResponse.redirect(url);
  }

  // Rewrite: donasi.ia-rk.com/* → /donasi/*
  // Skip in development - handled by next.config.ts rewrites
  if (isDonasiSubdomain && !url.pathname.startsWith('/donasi')) {
    // In production, middleware handles the rewrite
    if (process.env.NODE_ENV === 'production') {
      url.pathname = `/donasi${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    // In development, let next.config.ts rewrites handle it
    return await updateSession(request);
  }

  // Default: main domain + session update
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
