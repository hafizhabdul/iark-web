'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { CampaignDonorWall } from '@/lib/supabase/types';
import { DonorWallCard } from './DonorWallCard';

interface DonorWallListProps {
  donors: CampaignDonorWall[];
  loading?: boolean;
  emptyMessage?: string;
}

function DonorSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 mt-2" />
          <div className="h-3 bg-gray-200 rounded w-full mt-3" />
        </div>
      </div>
    </div>
  );
}

export function DonorWallList({
  donors,
  loading = false,
  emptyMessage = 'Belum ada donatur. Jadilah yang pertama!',
}: DonorWallListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <DonorSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {donors.map((donor, index) => (
        <DonorWallCard key={donor.donation_id} donor={donor} index={index} />
      ))}
    </div>
  );
}
