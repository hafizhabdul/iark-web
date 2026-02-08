import Link from 'next/link';
import Image from 'next/image';
import { Heart, Shield } from 'lucide-react';

function DonasiHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/donasi" className="flex items-center gap-3">
            <Image
              src="/logos/iark-logo.png"
              alt="IARK"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">IARK Donasi</span>
              <span className="text-xs text-gray-500">Portal Donasi</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/donasi/donors"
              className="flex items-center gap-2 text-gray-600 hover:text-iark-red transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Donatur</span>
            </Link>
            <Link
              href="/donasi/checkout"
              className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Donasi</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function DonasiFooter() {
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
            <span className="font-semibold">IARK Donasi</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            <span>Pembayaran aman via Pakasir</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Website Utama
            </Link>
            <Link href="/event" className="hover:text-white transition-colors">
              Events
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} IARK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function DonasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DonasiHeader />
      <main className="flex-1">{children}</main>
      <DonasiFooter />
    </div>
  );
}
