import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Subdomain detection
  const isEventSubdomain = host.startsWith('event.');
  const isDonasiSubdomain = host.startsWith('donasi.');

  // Block admin/dashboard routes from subdomains
  if (isEventSubdomain || isDonasiSubdomain) {
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard')) {
      const mainUrl = new URL(url);
      mainUrl.host = host.replace(/^(event\.|donasi\.)/, '');
      mainUrl.pathname = '/';
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
  if (isEventSubdomain && !url.pathname.startsWith('/event')) {
    url.pathname = `/event${url.pathname}`;
    const response = NextResponse.rewrite(url);
    return response;
  }

  // Rewrite: donasi.ia-rk.com/* → /donasi/*
  if (isDonasiSubdomain && !url.pathname.startsWith('/donasi')) {
    url.pathname = `/donasi${url.pathname}`;
    const response = NextResponse.rewrite(url);
    return response;
  }

  // Default: main domain + session update
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
