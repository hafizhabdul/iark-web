'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ManagementCard } from './ManagementCard';
import { managementData, ManagementMember } from '@/lib/data/managementData';

export interface ManagementGridProps {
  className?: string;
}

type FilterType = 'all' | 'pengurus_inti' | 'ketua_angkatan';

export function ManagementGrid({ className = '' }: ManagementGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { label: string; value: FilterType }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Pengurus Inti', value: 'pengurus_inti' },
    { label: 'Ketua Angkatan', value: 'ketua_angkatan' },
  ];

  const filteredMembers: ManagementMember[] =
    activeFilter === 'all'
      ? managementData
      : managementData.filter((m) => m.role === activeFilter);

  return (
    <section className={`relative py-24 px-8 bg-gray-50 overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Decorative elements */}
      <div className="absolute top-32 left-1/4 w-10 h-10 bg-iark-yellow rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 right-16 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 left-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-blue/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-blue rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Pengurus IARK
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Kenali para pemimpin yang menggerakkan IARK dengan dedikasi dan integritas
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
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredMembers.map((member, index) => (
            <ManagementCard key={member.id} member={member} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
