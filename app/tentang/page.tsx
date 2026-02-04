import { Header, Footer } from '@/components/layout';
import { AboutSection } from '@/components/features/about';
import { PengurusSection } from '@/components/features/pengurus';

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-iark-red to-iark-blue text-white py-20 px-8 overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-20 w-16 h-16 bg-iark-yellow rounded-full opacity-30 animate-float" />
        <div className="absolute bottom-20 left-10 w-20 h-20 bg-white rounded-full opacity-20 animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-iark-yellow rounded-full opacity-40 animate-float-slow" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tentang IARK
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed">
            Ikatan Alumni Rumah Kepemimpinan - Wadah Kolaborasi untuk Indonesia Lebih Baik
          </p>
        </div>
      </section>

      {/* About Section */}
      <AboutSection showSeeMore={false} />

      {/* Pengurus Section */}
      <PengurusSection />

      <Footer />
    </div>
  );
}
