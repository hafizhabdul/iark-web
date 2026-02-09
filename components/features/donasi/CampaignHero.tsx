'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Users, Target } from 'lucide-react';
import { DonationCampaignWithProgress } from '@/lib/supabase/types';
import { CampaignProgress } from './CampaignProgress';

interface CampaignHeroProps {
  campaign: DonationCampaignWithProgress;
  onDonateClick?: () => void;
}

export function CampaignHero({ campaign, onDonateClick }: CampaignHeroProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-12 lg:py-20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
          >
            {campaign.image_url ? (
              <Image
                src={campaign.image_url}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-iark-red to-iark-blue flex items-center justify-center">
                <Heart className="w-24 h-24 text-white/30" />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {campaign.is_featured && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-iark-red/10 text-iark-red rounded-full text-sm font-semibold mb-4 w-fit">
                <Heart className="w-4 h-4" />
                Kampanye Unggulan
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {campaign.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {campaign.description}
            </p>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
              <CampaignProgress
                paidAmount={campaign.paid_amount}
                targetAmount={campaign.target_amount}
                progressPct={campaign.progress_pct}
              />

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-iark-red/10 rounded-lg">
                    <Users className="w-5 h-5 text-iark-red" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{campaign.paid_count}</div>
                    <div className="text-sm text-gray-500">Donatur</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-iark-blue/10 rounded-lg">
                    <Target className="w-5 h-5 text-iark-blue" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(campaign.target_amount)}
                    </div>
                    <div className="text-sm text-gray-500">Target</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onDonateClick}
              className="bg-iark-red hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1"
            >
              <Heart className="w-5 h-5" />
              Donasi Sekarang
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
