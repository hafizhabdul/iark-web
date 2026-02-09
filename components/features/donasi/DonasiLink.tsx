'use client';

import Link from 'next/link';
import { getDonasiHref } from '@/lib/utils/subdomain';
import { ComponentProps } from 'react';

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
  const href = getDonasiHref(path);
  return <Link href={href} {...props}>{children}</Link>;
}
