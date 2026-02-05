'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlumniCard, Alumni } from '@/components/features/dashboard/AlumniCard';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { motion } from 'framer-motion';
import { fetchAlumni } from '@/lib/queries/dashboard';
import { queryKeys, staleTime } from '@/lib/queries';
import type { Profile } from '@/lib/supabase/types';

export default function AlumniDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  const { data: profilesData = [], isLoading } = useQuery({
    queryKey: queryKeys.alumni,
    queryFn: fetchAlumni,
    staleTime: staleTime.semiDynamic,
  });

  const alumni: Alumni[] = useMemo(() => {
    return (profilesData as Profile[]).map((profile) => ({
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      batch: profile.angkatan ? `RK Angkatan ${profile.angkatan}` : '',
      field: profile.job_title || '',
      location: profile.location || '',
      avatar: profile.photo || undefined,
      currentRole: profile.job_title || undefined,
      company: profile.company || undefined,
      linkedin: profile.linkedin || undefined,
    }));
  }, [profilesData]);

  const filteredAlumni = useMemo(() => {
    return alumni.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.field.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBatch = !selectedBatch || a.batch === selectedBatch;
      return matchesSearch && matchesBatch;
    });
  }, [alumni, searchQuery, selectedBatch]);

  const batches = useMemo(() => {
    return Array.from(new Set(alumni.map((a) => a.batch))).filter(Boolean).sort();
  }, [alumni]);

  const batchOptions = useMemo(() => {
    return [
      { value: '', label: 'All Batches' },
      ...batches.map((batch) => ({ value: batch, label: batch })),
    ];
  }, [batches]);

  const handleAlumniClick = (alumni: Alumni) => {
    // Use Next.js router for client-side navigation (no page reload)
    window.location.href = `/dashboard/alumni/${alumni.id}`;
  };

  return (
    <div className="relative min-h-screen bg-white p-6 lg:p-8 overflow-hidden">
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative small elements with animations */}
      <div className="absolute top-20 right-1/4 w-10 h-10 bg-iark-yellow rounded-full opacity-20 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 left-16 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift pointer-events-none" />
      <div className="absolute bottom-1/3 right-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow pointer-events-none" />

      {/* Main content - with relative positioning to stay above decorations */}
      <div className="relative z-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
        <p className="text-gray-600">Browse and connect with IARK alumni members</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iark-red focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Batch Filter */}
        <div className="sm:w-48">
          <CustomDropdown
            options={batchOptions}
            value={selectedBatch}
            onChange={setSelectedBatch}
            placeholder="All Batches"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredAlumni.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{alumni.length}</span> alumni
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-iark-red border-t-transparent"></div>
        </div>
      ) : filteredAlumni.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredAlumni.map((alumni, index) => (
            <motion.div
              key={alumni.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <AlumniCard alumni={alumni} onClick={() => handleAlumniClick(alumni)} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No alumni found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
      </div>
    </div>
  );
}
