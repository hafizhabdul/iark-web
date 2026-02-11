'use client';

import { DormCard } from './DormCard';
import { useQuery } from '@tanstack/react-query';
import { fetchDormitories } from '@/lib/queries/homepage';
import { queryKeys, staleTime } from '@/lib/queries';

export interface Dormitory {
  id: string;
  name: string;
  city: string;
  province: string | null;
  image_url: string | null;
  total_rooms: number | null;
  occupied_rooms: number | null;
  description: string | null;
}

export interface AsramaGallerySectionProps {
  className?: string;
  initialData?: Dormitory[];
}

export function AsramaGallerySection({
  className = '',
  initialData
}: AsramaGallerySectionProps) {
  const { data: dormitories = [], isLoading } = useQuery({
    queryKey: queryKeys.dormitories,
    queryFn: fetchDormitories,
    initialData: initialData,
    staleTime: staleTime.static,
  });

  return (
    <section id="asrama" className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-iark-yellow/5 rounded-full blur-3xl" />

      {/* Decorative elements */}
      <div className="absolute top-32 right-1/4 w-10 h-10 bg-iark-blue rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 left-16 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 right-20 w-12 h-12 bg-iark-yellow rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-red/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-red rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Asrama Rumah Kepemimpinan
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Rumah kedua bagi mahasiswa RK tersebar di berbagai kota di Indonesia
        </p>

        {/* Dorm Cards Grid */}
        {isLoading && !dormitories.length ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-iark-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dormitories.map((dorm, index) => (
              <DormCard key={dorm.id} dormitory={dorm as any} index={index} />
            ))}
          </div>
        )}

        {!isLoading && dormitories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Belum ada data asrama tersedia.
          </div>
        )}
      </div>
    </section>
  );
}
