import Image from 'next/image';
import Link from 'next/link';

export interface DonasiSectionProps {
  className?: string;
}

export function DonasiSection({ className = '' }: DonasiSectionProps) {
  return (
    <section className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />

      {/* Decorative small elements with animations */}
      <div className="absolute top-20 left-1/4 w-10 h-10 bg-iark-yellow rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-1/2 right-16 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Asymmetric Side-by-Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Side - Visual Impact */}
          <div className="relative bg-gradient-to-br from-iark-red to-red-700 p-12 lg:p-16 flex flex-col justify-center items-center text-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-iark-yellow/20 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Large Impact Visual - Image */}
              <div className="mb-8">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80"
                    alt="IARK Impact"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Impact Statement */}
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Dampak Nyata
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Setiap kontribusi Anda menciptakan perubahan untuk generasi pemimpin masa depan
              </p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-iark-red/10 text-iark-red rounded-full text-sm font-semibold mb-6 w-fit">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              Kontribusi untuk IARK
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Bersama Menumbuhkan
              <br />
              <span className="text-iark-red">Pemimpin Berintegritas</span>
            </h2>

            {/* Supporting Text */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Kontribusi Anda membantu kami melanjutkan misi membentuk kepemimpinan berkualitas untuk Indonesia yang lebih baik
            </p>

            {/* CTA Button */}
            <Link
              href="/donasi"
              className="bg-iark-red hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 w-fit hover:-translate-y-1 mb-8"
            >
              Kontribusi Sekarang
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            {/* Stats - Inline */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-iark-red">100+</div>
                <div className="text-sm text-gray-600">Alumni Terbantu</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-iark-blue">50+</div>
                <div className="text-sm text-gray-600">Program Terlaksana</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-iark-yellow">15+</div>
                <div className="text-sm text-gray-600">Tahun Berdampak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
