'use client';

import { useState, useEffect, ReactNode } from 'react';
import { getCrossDomainUrl } from '@/lib/utils/subdomain';

interface LoginLinkProps {
  children: ReactNode;
  className?: string;
}

export function LoginLink({ children, className }: LoginLinkProps) {
  const [href, setHref] = useState('/masuk');

  useEffect(() => {
    const currentUrl = window.location.href;
    const loginUrl = getCrossDomainUrl(`/masuk?redirectTo=${encodeURIComponent(currentUrl)}`);
    setHref(loginUrl);
  }, []);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
