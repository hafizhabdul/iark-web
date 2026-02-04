'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { BatchTabs } from './BatchTabs';
import { FunFactCard } from './FunFactCard';
import { LeaderProfileCard } from './LeaderProfileCard';
import { batchData } from '@/lib/data/batchData';
import { testimonialData } from '@/lib/data/testimonialData';

export interface BatchStoriesSectionProps {
  className?: string;
}

type MainTabType = 'angkatan' | 'tokoh';

export function BatchStoriesSection({ className = '' }: BatchStoriesSectionProps) {
  const [mainTab, setMainTab] = useState<MainTabType>('angkatan');
  const [activeAngkatan, setActiveAngkatan] = useState(1);

  const currentBatch = batchData.find((b) => b.angkatan === activeAngkatan) || batchData[0];

  // Get tokoh ternama from testimonial data
  const tokohTernama = testimonialData.filter((t) => t.type === 'tokoh_ternama');

  const mainTabs: { label: string; value: MainTabType }[] = [
    { label: 'Angkatan', value: 'angkatan' },
    { label: 'Tokoh', value: 'tokoh' },
  ];

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

        {/* Main Tabs (Angkatan / Tokoh) */}
        <div className="flex justify-center gap-4 mb-8">
          {mainTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMainTab(tab.value)}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
                mainTab === tab.value
                  ? 'bg-iark-red text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on main tab */}
        <AnimatePresence mode="wait">
          {mainTab === 'angkatan' ? (
            <motion.div
              key="angkatan-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Angkatan Tabs */}
              <div className="mb-8">
                <BatchTabs
                  activeAngkatan={activeAngkatan}
                  onSelect={setActiveAngkatan}
                  totalAngkatan={batchData.length}
                />
              </div>

              {/* Angkatan Content */}
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
            </motion.div>
          ) : (
            <motion.div
              key="tokoh-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tokoh Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokohTernama.map((tokoh, index) => (
                  <motion.div
                    key={tokoh.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Photo */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={tokoh.photo}
                        alt={tokoh.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">{tokoh.name}</h3>
                        <p className="text-sm text-white/80">{tokoh.title}</p>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="p-5">
                      <p className="text-gray-600 text-sm italic leading-relaxed">
                        &ldquo;{tokoh.quote}&rdquo;
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs bg-iark-yellow/20 text-yellow-700 px-3 py-1 rounded-full font-medium">
                          Tokoh Inspiratif
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {tokohTernama.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">Belum ada data tokoh.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
