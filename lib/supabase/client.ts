import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/types';

/**
 * Get the root domain for cookie sharing across subdomains.
 * Must match the domain used in middleware.ts to avoid duplicate cookies.
 */
function getCookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return undefined;
  const parts = host.split('.');
  if (parts.length >= 2) {
    return '.' + parts.slice(-2).join('.');
  }
  return undefined;
}

export function createClient() {
  const cookieDomain = getCookieDomain();

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        ...(cookieDomain && { domain: cookieDomain }),
      },
    }
  );
}
