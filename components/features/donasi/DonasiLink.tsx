'use client';

import Link from 'next/link';
import { getDonasiHref } from '@/lib/utils/subdomain';
import { ComponentProps, useState, useEffect } from 'react';

interface DonasiLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  /** Path relative to /donasi, e.g. "/" for landing, "/beasiswa" for campaign */
  path: string;
}

/**
 * Subdomain-aware link component for donasi routes.
 * Automatically adjusts href based on whether user is on subdomain or main domain.
 * 
 * Usage:
 * - <DonasiLink path="/">Home</DonasiLink>
 * - <DonasiLink path="/beasiswa">Beasiswa</DonasiLink>
 * - <DonasiLink path="/beasiswa/checkout">Checkout</DonasiLink>
 */
export function DonasiLink({ path, children, ...props }: DonasiLinkProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute href - on server/initial render use /donasi prefix, on client detect subdomain
  const href = mounted 
    ? getDonasiHref(path)
    : `/donasi${path.startsWith('/') ? path : `/${path}`}`;

  return (
    <span suppressHydrationWarning>
      <Link href={href} {...props}>{children}</Link>
    </span>
  );
}
