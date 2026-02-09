'use client';

import { ComponentProps, useState, useEffect } from 'react';
import { getCrossDomainUrl } from '@/lib/utils/subdomain';

interface CrossDomainLinkProps extends ComponentProps<'a'> {
    href: string;
    subdomain?: 'event' | 'donasi';
}

/**
 * A link component that handles cross-subdomain navigation.
 * It generates an absolute URL to ensure the user lands on the correct subdomain.
 * Uses useEffect to compute URL on client-side after mount.
 */
export function CrossDomainLink({ href, subdomain, children, ...props }: CrossDomainLinkProps) {
    const [absoluteHref, setAbsoluteHref] = useState(href);

    useEffect(() => {
        // Compute the correct cross-domain URL after mount (when window is available)
        setAbsoluteHref(getCrossDomainUrl(href, subdomain));
    }, [href, subdomain]);

    return (
        <a href={absoluteHref} {...props}>
            {children}
        </a>
    );
}
