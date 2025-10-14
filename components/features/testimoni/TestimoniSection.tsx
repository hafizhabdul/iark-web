import Image from 'next/image';

export interface TestimoniSectionProps {
  className?: string;
}

interface Testimoni {
  quote: string;
  name: string;
  title: string;
  angkatan: string;
  photo: string;
}

export function TestimoniSection({ className = '' }: TestimoniSectionProps) {
  const testimonials: Testimoni[] = [
    {
      quote: 'Rumah Kepemimpinan membentuk karakter saya dalam memimpin dengan integritas. IARK menjadi wadah untuk terus berkontribusi dan berbagi dengan generasi selanjutnya.',
      name: 'Dr. Ahmad Fauzi',
      title: 'CEO Tech Startup',
      angkatan: 'Angkatan 5',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
      quote: 'Nilai-nilai kepemimpinan yang saya pelajari di RK menjadi fondasi dalam setiap langkah karir saya. Bersama IARK, kita terus menginspirasi pemimpin masa depan.',
      name: 'Sarah Wijaya, M.Sc.',
      title: 'Aktivis Sosial & Pendiri NGO',
      angkatan: 'Angkatan 8',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    },
    {
      quote: 'IARK bukan hanya organisasi alumni, tapi keluarga besar yang saling mendukung. Di sini saya belajar bahwa kepemimpinan sejati adalah tentang melayani.',
      name: 'Budi Santoso',
      title: 'Pengusaha & Mentor Startup',
      angkatan: 'Angkatan 12',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
  ];

  return (
    <section className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-iark-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />

      {/* Decorative small elements with animations */}
      <div className="absolute top-32 right-1/3 w-10 h-10 bg-iark-red rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 left-16 w-8 h-8 bg-iark-yellow rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 right-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-yellow/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-yellow rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Testimoni Tokoh
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Cerita inspiratif dari para alumni yang terus berkontribusi
        </p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {/* Large Quote Mark */}
              <div className="text-6xl text-iark-red leading-none mb-4">&ldquo;</div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 flex-grow italic">
                {testimonial.quote}
              </p>

              {/* Person Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                {/* Photo */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Name & Title */}
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.title}
                  </p>
                  <p className="text-sm text-iark-red font-medium">
                    {testimonial.angkatan}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
