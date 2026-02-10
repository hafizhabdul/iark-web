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
    // Get URL to main domain's /masuk page
    const loginUrl = getCrossDomainUrl('/masuk');
    setHref(loginUrl);
  }, []);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
