'use client';

import { motion } from 'framer-motion';
import { Heart, Users } from 'lucide-react';

interface CampaignStatsProps {
  paidAmount: number;
  paidCount: number;
}

export function CampaignStats({ paidAmount, paidCount }: CampaignStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-iark-red to-red-700 rounded-2xl p-6 text-white shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5" />
        <h3 className="font-semibold">Statistik Donasi</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-sm text-white/80">Total Donasi</span>
          </div>
          <div className="text-xl font-bold">{formatCurrency(paidAmount)}</div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm text-white/80">Donatur</span>
          </div>
          <div className="text-xl font-bold">{paidCount.toLocaleString('id-ID')}</div>
        </div>
      </div>
    </motion.div>
  );
}
