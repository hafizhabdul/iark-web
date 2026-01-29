'use client';

import { useState } from 'react';
import { TestimoniSlider } from './TestimoniSlider';
import { testimonialData } from '@/lib/data/testimonialData';

export interface TestimoniSectionProps {
  className?: string;
}

type FilterType = 'all' | 'ketua_angkatan' | 'tokoh_ternama';

export function TestimoniSection({ className = '' }: TestimoniSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { label: string; value: FilterType }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Ketua Angkatan', value: 'ketua_angkatan' },
    { label: 'Tokoh Ternama', value: 'tokoh_ternama' },
  ];

  const filteredTestimonials =
    activeFilter === 'all'
      ? testimonialData
      : testimonialData.filter((t) => t.type === activeFilter);

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
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Cerita inspiratif dari para alumni yang terus berkontribusi
        </p>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.value
                  ? 'bg-iark-red text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Testimonials Slider */}
        <TestimoniSlider
          testimonials={filteredTestimonials}
          autoPlayInterval={6000}
        />
      </div>
    </section>
  );
}
