'use client';

import { LogIn, User } from 'lucide-react';

export interface AuthChoiceProps {
  mode: 'donation' | 'event';
  onLoginClick: () => void;
  onGuestClick: () => void;
  guestLabel?: string;
}

export function AuthChoice({
  mode,
  onLoginClick,
  onGuestClick,
  guestLabel,
}: AuthChoiceProps) {
  const defaultGuestLabel =
    mode === 'donation' ? 'Lanjut sebagai Hamba Allah' : 'Lanjut sebagai Tamu';

  const guestSubtext =
    mode === 'donation'
      ? 'Donasi anonim tanpa menyimpan riwayat'
      : 'Isi data manual untuk pendaftaran';

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onLoginClick}
        className="flex items-center gap-4 w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-iark-blue hover:bg-blue-50/50 transition-all duration-200"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-iark-blue/10 rounded-full flex items-center justify-center">
          <LogIn className="w-5 h-5 text-iark-blue" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-900">Masuk / Daftar</p>
          <p className="text-sm text-gray-500">Login dengan Google atau Email</p>
        </div>
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400 font-medium">atau</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={onGuestClick}
        className="flex items-center gap-4 w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-iark-red hover:bg-red-50/50 transition-all duration-200"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-iark-red/10 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-iark-red" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-900">
            {guestLabel || defaultGuestLabel}
          </p>
          <p className="text-sm text-gray-500">{guestSubtext}</p>
        </div>
      </button>
    </div>
  );
}
