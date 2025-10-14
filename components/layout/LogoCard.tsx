import Image from 'next/image';
import Link from 'next/link';

export interface LogoCardProps {
  className?: string;
  isScrolled?: boolean;
}

export function LogoCard({ className = '', isScrolled = false }: LogoCardProps) {
  return (
    <Link href="/" className="block">
      <div
        className={`bg-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${className}`}
      >
      {/* Rumah Kepemimpinan Logo - Hidden on mobile */}
      <div className={`relative w-auto hidden md:block transition-all duration-300 ${
        isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-12'
      }`}>
        <Image
          src="/logos/rk-logo.png"
          alt="Rumah Kepemimpinan"
          height={48}
          width={100}
          className={`w-auto object-contain transition-all duration-300 ${
            isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-12'
          }`}
          priority
        />
      </div>

      {/* 23 Chapters of Impact Logo - Hidden on mobile */}
      <div className={`relative w-auto hidden md:block transition-all duration-300 ${
        isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-12'
      }`}>
        <Image
          src="/logos/23-anniversary-logo.png"
          alt="23 Chapters of Impact"
          height={48}
          width={100}
          className={`w-auto object-contain transition-all duration-300 ${
            isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-12'
          }`}
          priority
        />
      </div>

      {/* IARK Logo - Always visible */}
      <div className={`relative w-auto transition-all duration-300 ${
        isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-12'
      }`}>
        <Image
          src="/logos/iark-logo.png"
          alt="IARK"
          height={48}
          width={100}
          className={`w-auto object-contain transition-all duration-300 ${
            isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-12'
          }`}
          priority
        />
      </div>
    </div>
    </Link>
  );
}
