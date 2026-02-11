'use client';

import { ArrowLeft } from 'lucide-react';
import { EventLink } from './EventLink';

export function BackToEventsLink() {
  return (
    <EventLink 
      path="/"
      className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Kembali</span>
    </EventLink>
  );
}
