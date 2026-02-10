'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, ArrowRight } from 'lucide-react';
import { DonationCampaignWithProgress } from '@/lib/supabase/types';
import { CampaignProgress } from './CampaignProgress';
import { DonasiLink } from './DonasiLink';

interface CampaignCardProps {
  campaign: DonationCampaignWithProgress;
  index?: number;
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const excerpt = campaign.description
    ? campaign.description.length > 120
      ? campaign.description.slice(0, 120) + '...'
      : campaign.description
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <DonasiLink path={`/${campaign.slug}`}>
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-iark-red/20">
          <div className="relative w-full h-48">
            {campaign.image_url ? (
              <Image
                src={campaign.image_url}
                alt={campaign.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-iark-red to-iark-blue flex items-center justify-center">
                <Heart className="w-12 h-12 text-white/50" />
              </div>
            )}
            {campaign.is_featured && (
              <div className="absolute top-3 left-3">
                <span className="bg-iark-red text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Unggulan
                </span>
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-iark-red transition-colors line-clamp-2">
              {campaign.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{excerpt}</p>

            <CampaignProgress
              paidAmount={campaign.paid_amount}
              targetAmount={campaign.target_amount}
              progressPct={campaign.progress_pct}
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Heart className="w-4 h-4 text-iark-red" />
                <span>{campaign.paid_count} donatur</span>
              </div>

              <div className="flex items-center gap-2 text-iark-red font-semibold group-hover:gap-3 transition-all">
                <span>Donasi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </DonasiLink>
    </motion.div>
  );
}
