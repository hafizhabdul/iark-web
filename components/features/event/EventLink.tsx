'use client';

import Link from 'next/link';
import { getEventHref } from '@/lib/utils/subdomain';
import { ComponentProps, useState, useEffect } from 'react';

interface EventLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  /** Path relative to /event, e.g. "/" for listing, "/my-events" */
  path: string;
}

export function EventLink({ path, children, ...props }: EventLinkProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute href - on server/initial render use /event prefix, on client detect subdomain
  const href = mounted 
    ? getEventHref(path)
    : `/event${path.startsWith('/') ? path : `/${path}`}`;

  return (
    <span suppressHydrationWarning>
      <Link href={href} {...props}>{children}</Link>
    </span>
  );
}
