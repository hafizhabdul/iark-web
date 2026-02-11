'use client';

import { motion } from 'framer-motion';

interface CampaignProgressProps {
  paidAmount: number;
  targetAmount: number;
  progressPct: number;
}

export function CampaignProgress({ paidAmount, targetAmount, progressPct }: CampaignProgressProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const clampedProgress = Math.min(progressPct, 100);

  return (
    <div className="w-full">
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-iark-red to-red-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-sm">
        <span className="font-semibold text-iark-red">{formatCurrency(paidAmount)}</span>
        <span className="text-gray-500">dari {formatCurrency(targetAmount)}</span>
      </div>
      <div className="mt-1">
        <span className="text-xs font-medium text-gray-600">
          {progressPct.toFixed(1)}% tercapai
        </span>
      </div>
    </div>
  );
}
