import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Middleware Subdomain Routing Tests
 * 
 * These tests verify the subdomain detection and routing logic
 * without actually running the full Next.js middleware.
 */

// Helper to simulate host detection logic from middleware
function detectSubdomain(host: string): 'event' | 'donasi' | 'main' {
  if (host.startsWith('event.')) return 'event';
  if (host.startsWith('donasi.')) return 'donasi';
  return 'main';
}

// Helper to simulate rewrite path logic
function getRewritePath(host: string, pathname: string): string {
  const subdomain = detectSubdomain(host);
  
  if (subdomain === 'event' && !pathname.startsWith('/event')) {
    return `/event${pathname}`;
  }
  
  if (subdomain === 'donasi' && !pathname.startsWith('/donasi')) {
    return `/donasi${pathname}`;
  }
  
  return pathname;
}

// Helper to check if path should be blocked on subdomain
function shouldBlockOnSubdomain(host: string, pathname: string): boolean {
  const subdomain = detectSubdomain(host);
  
  if (subdomain === 'event' || subdomain === 'donasi') {
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
      return true;
    }
  }
  
  return false;
}

// Helper to check if main domain path should redirect to subdomain
function shouldRedirectToSubdomain(host: string, pathname: string): { redirect: boolean; subdomain?: string } {
  const subdomain = detectSubdomain(host);
  
  if (subdomain === 'main') {
    if (pathname.startsWith('/event')) {
      return { redirect: true, subdomain: 'event' };
    }
    if (pathname.startsWith('/donasi')) {
      return { redirect: true, subdomain: 'donasi' };
    }
  }
  
  return { redirect: false };
}

describe('Subdomain Detection', () => {
  it('should detect event subdomain', () => {
    expect(detectSubdomain('event.ia-rk.com')).toBe('event');
    expect(detectSubdomain('event.localhost')).toBe('event');
  });

  it('should detect donasi subdomain', () => {
    expect(detectSubdomain('donasi.ia-rk.com')).toBe('donasi');
    expect(detectSubdomain('donasi.localhost')).toBe('donasi');
  });

  it('should detect main domain', () => {
    expect(detectSubdomain('ia-rk.com')).toBe('main');
    expect(detectSubdomain('www.ia-rk.com')).toBe('main');
    expect(detectSubdomain('localhost:3000')).toBe('main');
  });
});

describe('Subdomain Rewrite Logic', () => {
  it('should rewrite event.ia-rk.com/ to /event/', () => {
    expect(getRewritePath('event.ia-rk.com', '/')).toBe('/event/');
  });

  it('should rewrite event.ia-rk.com/some-event to /event/some-event', () => {
    expect(getRewritePath('event.ia-rk.com', '/some-event')).toBe('/event/some-event');
  });

  it('should NOT double-rewrite event.ia-rk.com/event/... ', () => {
    expect(getRewritePath('event.ia-rk.com', '/event/my-events')).toBe('/event/my-events');
  });

  it('should rewrite donasi.ia-rk.com/ to /donasi/', () => {
    expect(getRewritePath('donasi.ia-rk.com', '/')).toBe('/donasi/');
  });

  it('should rewrite donasi.ia-rk.com/checkout to /donasi/checkout', () => {
    expect(getRewritePath('donasi.ia-rk.com', '/checkout')).toBe('/donasi/checkout');
  });

  it('should NOT rewrite main domain paths', () => {
    expect(getRewritePath('ia-rk.com', '/tentang')).toBe('/tentang');
    expect(getRewritePath('ia-rk.com', '/bidang')).toBe('/bidang');
  });
});

describe('Subdomain Isolation (Block Admin)', () => {
  it('should block /admin from event subdomain', () => {
    expect(shouldBlockOnSubdomain('event.ia-rk.com', '/admin')).toBe(true);
    expect(shouldBlockOnSubdomain('event.ia-rk.com', '/admin/events')).toBe(true);
  });

  it('should block /dashboard from event subdomain', () => {
    expect(shouldBlockOnSubdomain('event.ia-rk.com', '/dashboard')).toBe(true);
    expect(shouldBlockOnSubdomain('event.ia-rk.com', '/dashboard/profile')).toBe(true);
  });

  it('should block /admin from donasi subdomain', () => {
    expect(shouldBlockOnSubdomain('donasi.ia-rk.com', '/admin')).toBe(true);
  });

  it('should block /dashboard from donasi subdomain', () => {
    expect(shouldBlockOnSubdomain('donasi.ia-rk.com', '/dashboard')).toBe(true);
  });

  it('should NOT block /admin from main domain', () => {
    expect(shouldBlockOnSubdomain('ia-rk.com', '/admin')).toBe(false);
    expect(shouldBlockOnSubdomain('www.ia-rk.com', '/admin')).toBe(false);
  });

  it('should NOT block other paths from subdomains', () => {
    expect(shouldBlockOnSubdomain('event.ia-rk.com', '/')).toBe(false);
    expect(shouldBlockOnSubdomain('event.ia-rk.com', '/register/event-1')).toBe(false);
    expect(shouldBlockOnSubdomain('donasi.ia-rk.com', '/checkout')).toBe(false);
  });
});

describe('Main Domain Redirect to Subdomain', () => {
  it('should redirect ia-rk.com/event/* to event subdomain', () => {
    const result = shouldRedirectToSubdomain('ia-rk.com', '/event');
    expect(result.redirect).toBe(true);
    expect(result.subdomain).toBe('event');
  });

  it('should redirect ia-rk.com/event/some-event to event subdomain', () => {
    const result = shouldRedirectToSubdomain('ia-rk.com', '/event/some-event');
    expect(result.redirect).toBe(true);
    expect(result.subdomain).toBe('event');
  });

  it('should redirect ia-rk.com/donasi/* to donasi subdomain', () => {
    const result = shouldRedirectToSubdomain('ia-rk.com', '/donasi');
    expect(result.redirect).toBe(true);
    expect(result.subdomain).toBe('donasi');
  });

  it('should redirect ia-rk.com/donasi/checkout to donasi subdomain', () => {
    const result = shouldRedirectToSubdomain('ia-rk.com', '/donasi/checkout');
    expect(result.redirect).toBe(true);
    expect(result.subdomain).toBe('donasi');
  });

  it('should NOT redirect other main domain paths', () => {
    expect(shouldRedirectToSubdomain('ia-rk.com', '/').redirect).toBe(false);
    expect(shouldRedirectToSubdomain('ia-rk.com', '/tentang').redirect).toBe(false);
    expect(shouldRedirectToSubdomain('ia-rk.com', '/bidang').redirect).toBe(false);
    expect(shouldRedirectToSubdomain('ia-rk.com', '/admin').redirect).toBe(false);
  });

  it('should NOT redirect if already on subdomain', () => {
    expect(shouldRedirectToSubdomain('event.ia-rk.com', '/event').redirect).toBe(false);
    expect(shouldRedirectToSubdomain('donasi.ia-rk.com', '/donasi').redirect).toBe(false);
  });
});
