import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, LogIn } from 'lucide-react';
import { CrossDomainLink } from '@/components/features/shared/CrossDomainLink';

function EventHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logos/iark-logo.png"
              alt="IARK"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">IARK Events</span>
              <span className="text-xs text-gray-500">Portal Kegiatan</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

function EventFooter() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/iark-logo.png"
              alt="IARK"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-semibold">IARK Events</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <CrossDomainLink href="/" className="hover:text-white transition-colors">
              Website Utama
            </CrossDomainLink>
            <CrossDomainLink href="/" subdomain="donasi" className="hover:text-white transition-colors">
              Donasi
            </CrossDomainLink>
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} IARK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <EventHeader />
      <main className="flex-1">{children}</main>
      <EventFooter />
    </div>
  );
}
