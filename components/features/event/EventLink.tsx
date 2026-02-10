'use client';

import Link from 'next/link';
import { getEventHref } from '@/lib/utils/subdomain';
import { ComponentProps, useState, useEffect } from 'react';

interface EventLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  /** Path relative to /event, e.g. "/" for listing, "/my-events" */
  path: string;
}

export function EventLink({ path, children, ...props }: EventLinkProps) {
  // Default to /event/path for SSR, then compute correct path on client
  const [href, setHref] = useState(`/event${path.startsWith('/') ? path : `/${path}`}`);

  useEffect(() => {
    // Compute correct href after mount (when window is available)
    setHref(getEventHref(path));
  }, [path]);

  return <Link href={href} {...props}>{children}</Link>;
}
