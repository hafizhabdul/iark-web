'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BatchTabs } from './BatchTabs';
import { FunFactCard } from './FunFactCard';
import { LeaderProfileCard } from './LeaderProfileCard';
import { batchData } from '@/lib/data/batchData';

export interface BatchStoriesSectionProps {
  className?: string;
}

export function BatchStoriesSection({ className = '' }: BatchStoriesSectionProps) {
  const [activeAngkatan, setActiveAngkatan] = useState(1);

  const currentBatch = batchData.find((b) => b.angkatan === activeAngkatan) || batchData[0];

  return (
    <section className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Decorative elements */}
      <div className="absolute top-32 left-1/3 w-10 h-10 bg-iark-blue rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 right-20 w-8 h-8 bg-iark-yellow rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 left-16 w-12 h-12 bg-iark-red rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-red/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-red rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Cerita Angkatan
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Setiap angkatan memiliki cerita unik dan pemimpin inspiratif
        </p>

        {/* Tabs */}
        <div className="mb-8">
          <BatchTabs
            activeAngkatan={activeAngkatan}
            onSelect={setActiveAngkatan}
            totalAngkatan={batchData.length}
          />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAngkatan}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <FunFactCard
              funFact={currentBatch.funFact}
              angkatan={currentBatch.angkatan}
              year={currentBatch.year}
            />
            <LeaderProfileCard
              leader={currentBatch.leader}
              angkatan={currentBatch.angkatan}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
