'use client';

import { User } from 'lucide-react';

export interface AuthChoiceProps {
  mode: 'donation' | 'event';
  onLoginClick: () => void;
  onGuestClick: () => void;
  guestLabel?: string;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

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
        <div className="flex-shrink-0 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
          <GoogleIcon />
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-900">Masuk dengan Google</p>
          <p className="text-sm text-gray-500">Data otomatis terisi</p>
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
