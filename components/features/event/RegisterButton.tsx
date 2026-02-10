'use client';

import { CheckCircle } from 'lucide-react';
import { EventLink } from './EventLink';

interface RegisterButtonProps {
  slug: string;
}

export function RegisterButton({ slug }: RegisterButtonProps) {
  return (
    <EventLink
      path={`/register/${slug}`}
      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-iark-red text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
    >
      <CheckCircle className="w-5 h-5" />
      Daftar Sekarang
    </EventLink>
  );
}
