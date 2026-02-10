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
  // Default to /donasi/path for SSR, then compute correct path on client
  const [href, setHref] = useState(`/donasi${path.startsWith('/') ? path : `/${path}`}`);

  useEffect(() => {
    // Compute correct href after mount (when window is available)
    setHref(getDonasiHref(path));
  }, [path]);

  return <Link href={href} {...props}>{children}</Link>;
}
