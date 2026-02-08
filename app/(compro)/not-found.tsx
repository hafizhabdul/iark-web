import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function ComproNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-iark-red mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-iark-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
