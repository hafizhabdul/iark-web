/**
 * Utility functions for subdomain-aware routing
 */

/**
 * Check if currently on donasi subdomain
 */
export function isDonasiSubdomain(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.host.startsWith('donasi.');
}

/**
 * Check if currently on event subdomain
 */
export function isEventSubdomain(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.host.startsWith('event.');
}

/**
 * Get the correct href for donasi routes
 * On subdomain: /slug
 * On main domain: /donasi/slug
 */
export function getDonasiHref(path: string): string {
  // Remove leading /donasi if present
  const cleanPath = path.replace(/^\/donasi/, '');

  if (isDonasiSubdomain()) {
    return cleanPath || '/';
  }
  return `/donasi${cleanPath}`;
}

/**
 * Get the correct href for event routes
 * On subdomain: /slug
 * On main domain: /event/slug
 */
export function getEventHref(path: string): string {
  // Remove leading /event if present
  const cleanPath = path.replace(/^\/event/, '');

  if (isEventSubdomain()) {
    return cleanPath || '/';
  }
  return `/event${cleanPath}`;
}

/**
 * Get the base host (without event. or donasi. prefix)
 * Handles both production (ia-rk.com) and development (localhost:3000)
 */
export function getBaseHost(): string {
  if (typeof window === 'undefined') return '';
  const host = window.location.host;
  
  // Remove event. or donasi. prefix
  const cleanHost = host.replace(/^(event\.|donasi\.)/, '');
  
  return cleanHost;
}

/**
 * Get an absolute URL for a cross-domain/subdomain link
 * Properly handles subdomain navigation between event/donasi/main
 */
export function getCrossDomainUrl(path: string, subdomain?: 'event' | 'donasi'): string {
  if (typeof window === 'undefined') return path;

  const protocol = window.location.protocol;
  const baseHost = getBaseHost();

  if (subdomain) {
    // Navigate to event.domain.com or donasi.domain.com
    return `${protocol}//${subdomain}.${baseHost}${path}`;
  }

  // Navigate to main domain (without any subdomain prefix)
  return `${protocol}//${baseHost}${path}`;
}

