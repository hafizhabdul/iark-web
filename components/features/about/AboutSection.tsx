export interface AboutSectionProps {
  className?: string;
}

export function AboutSection({ className = '' }: AboutSectionProps) {
  const stats = [
    { value: '500+', label: 'Alumni' },
    { value: '23', label: 'Chapters of Impact' },
    { value: '15+', label: 'Tahun Berdampak' },
  ];

  return (
    <section className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background - matching hero section */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Decorative small elements with animations - matching hero section */}
      <div className="absolute top-20 right-1/4 w-10 h-10 bg-iark-blue rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-1/2 left-16 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 right-20 w-12 h-12 bg-iark-yellow rounded-full opacity-30 animate-pulse-slow" />
      <div className="absolute top-1/3 right-12 w-6 h-6 bg-iark-red/30 rounded-lg rotate-12 animate-drift" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-red/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-red rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Apa itu IARK?
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-center text-gray-700 leading-relaxed mb-16 max-w-3xl mx-auto">
          IARK adalah <span className="font-semibold text-iark-red">Ikatan Alumni Rumah Kepemimpinan</span>,
          wadah kolaborasi lintas angkatan yang menjadi tempat berbagi, berkontribusi,
          dan menumbuhkan semangat kepemimpinan berintegritas untuk Indonesia.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl md:text-6xl font-bold text-iark-red mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
