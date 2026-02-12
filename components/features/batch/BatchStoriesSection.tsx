'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BatchTabs } from './BatchTabs';
import { FunFactCard } from './FunFactCard';
import { LeaderProfileCard } from './LeaderProfileCard';
import { fetchBatchStoriesData, type BatchStoriesData } from '@/lib/queries/batches';
import { queryKeys, staleTime } from '@/lib/queries';

export interface BatchStoriesSectionProps {
  className?: string;
  initialData?: BatchStoriesData;
}

type MainTabType = 'angkatan' | 'tokoh';

export function BatchStoriesSection({
  className = '',
  initialData
}: BatchStoriesSectionProps) {
  const [mainTab, setMainTab] = useState<MainTabType>('angkatan');
  const [activeAngkatan, setActiveAngkatan] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.batchesWithLeaders,
    queryFn: fetchBatchStoriesData,
    initialData: initialData,
    staleTime: staleTime.static,
  });

  const batches = data?.batches || [];
  const tokohTernama = data?.tokohTernama || [];

  const currentBatch = batches.find((b) => b.angkatan === activeAngkatan) || batches[0];
  const currentLeader = currentBatch?.batch_leaders?.find((l) => l.is_ketua) || currentBatch?.batch_leaders?.[0];

  const mainTabs: { label: string; value: MainTabType }[] = [
    { label: 'Angkatan', value: 'angkatan' },
    { label: 'Tokoh', value: 'tokoh' },
  ];

  if (isLoading) {
    return (
      <section className={`relative py-12 px-5 md:py-24 md:px-8 bg-white overflow-hidden ${className}`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-6" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto mb-12" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-2xl" />
              <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative py-12 px-5 md:py-24 md:px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-iark-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Decorative elements */}
      <div className="hidden md:block absolute top-32 left-1/3 w-10 h-10 bg-iark-blue rounded-full opacity-20 animate-pulse-slow" />
      <div className="hidden md:block absolute top-2/3 right-20 w-8 h-8 bg-iark-yellow rounded-full opacity-20 animate-drift" />
      <div className="hidden md:block absolute bottom-1/4 left-16 w-12 h-12 bg-iark-red rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-red/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-red rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Cerita Angkatan
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-center text-gray-600 mb-6 md:mb-12 max-w-3xl mx-auto">
          Setiap angkatan memiliki cerita unik dan pemimpin inspiratif
        </p>

        {/* Main Tabs (Angkatan / Tokoh) */}
        <div className="flex justify-center gap-3 mb-6 md:gap-4 md:mb-8">
          {mainTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMainTab(tab.value)}
              className={`px-5 py-2.5 text-base md:px-8 md:py-3 md:text-lg rounded-full font-semibold transition-all duration-300 ${mainTab === tab.value
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
                  totalAngkatan={batches.length}
                />
              </div>

              {/* Angkatan Content */}
              {currentBatch && (
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
                      funFact={currentBatch.fun_fact || ''}
                      angkatan={currentBatch.angkatan}
                      year={currentBatch.year?.toString() || ''}
                    />
                    {currentLeader && (
                      <LeaderProfileCard
                        leader={{
                          name: currentLeader.name,
                          photo: currentLeader.photo || '',
                          quote: currentLeader.quote || '',
                          job_title: currentLeader.job_title || '',
                        }}
                        angkatan={currentBatch.angkatan}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {batches.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">Belum ada data angkatan.</p>
                </div>
              )}
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
                        src={tokoh.photo || '/placeholder-avatar.jpg'}
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
