'use client';

import { motion } from 'framer-motion';
import { User, MessageCircle } from 'lucide-react';
import { CampaignDonorWall } from '@/lib/supabase/types';

interface DonorWallCardProps {
  donor: CampaignDonorWall;
  index?: number;
}

export function DonorWallCard({ donor, index = 0 }: DonorWallCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const displayName = donor.display_name || 'Hamba Allah';
  const truncatedMessage = donor.message
    ? donor.message.length > 100
      ? donor.message.slice(0, 100) + '...'
      : donor.message
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-iark-red to-red-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-gray-900 truncate">{displayName}</h4>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {getTimeAgo(donor.paid_at)}
            </span>
          </div>

          <div className="text-sm font-medium text-iark-red mt-0.5">
            {formatCurrency(donor.amount)}
          </div>

          {truncatedMessage && (
            <div className="flex items-start gap-1.5 mt-2">
              <MessageCircle className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 italic">&ldquo;{truncatedMessage}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
