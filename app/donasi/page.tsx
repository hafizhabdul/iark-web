import { DonasiPageSection } from '@/components/features/donasi';

export default function DonasiPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-iark-red to-iark-blue text-white py-20 px-8 overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-20 w-16 h-16 bg-iark-yellow rounded-full opacity-50 animate-float" />
        <div className="absolute bottom-20 left-10 w-20 h-20 bg-white rounded-full opacity-30 animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-iark-yellow rounded-full opacity-60 animate-float-slow" />
        <div className="absolute top-1/3 left-1/4 w-14 h-14 bg-white rounded-full opacity-25 animate-float" />
        <div className="absolute bottom-32 right-1/4 w-10 h-10 bg-iark-yellow rounded-full opacity-40 animate-drift" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Donasi untuk IARK
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed">
            Bersama Membangun Alumni Berintegritas dan Indonesia Lebih Baik
          </p>
        </div>
      </section>

      {/* Main Content */}
      <DonasiPageSection />
    </div>
  );
}
