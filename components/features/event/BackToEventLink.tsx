'use client';

import { ArrowLeft } from 'lucide-react';
import { EventLink } from './EventLink';

interface BackToEventLinkProps {
  slug: string;
}

export function BackToEventLink({ slug }: BackToEventLinkProps) {
  return (
    <EventLink 
      path={`/${slug}`}
      className="inline-flex items-center gap-2 text-gray-600 hover:text-iark-red mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Kembali ke Detail Event
    </EventLink>
  );
}
