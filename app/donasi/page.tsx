import { Metadata } from 'next';
import { Heart, Users, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CampaignCard } from '@/components/features/donasi/CampaignCard';
import type { DonationCampaignWithProgress } from '@/lib/supabase/types';

export const revalidate = 60; // ISR

export const metadata: Metadata = {
  title: 'Donasi - IARK',
  description: 'Dukung program dan kegiatan IARK melalui donasi. Bersama membangun alumni berintegritas dan Indonesia lebih baik.',
  openGraph: {
    title: 'Donasi - IARK',
    description: 'Dukung program dan kegiatan IARK melalui donasi. Bersama membangun alumni berintegritas dan Indonesia lebih baik.',
  },
};

async function fetchActiveCampaignsServer(): Promise<DonationCampaignWithProgress[]> {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('vw_donation_campaign_progress')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
    return data ?? [];
  } catch (e) {
    console.error('Error fetching campaigns:', e);
    return [];
  }
}

async function fetchOverallDonationStatsServer(): Promise<{ paid_amount: number; paid_count: number }> {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('vw_donation_overall_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching stats:', error);
      return { paid_amount: 0, paid_count: 0 };
    }
    return {
      paid_amount: data?.total_paid_amount ?? 0,
      paid_count: data?.total_paid_count ?? 0,
    };
  } catch (e) {
    console.error('Error fetching stats:', e);
    return { paid_amount: 0, paid_count: 0 };
  }
}

export default async function DonasiPage() {
  const [campaigns, stats] = await Promise.all([
    fetchActiveCampaignsServer(),
    fetchOverallDonationStatsServer(),
  ]);

  const featuredCampaigns = campaigns.filter(c => c.is_featured);
  const regularCampaigns = campaigns.filter(c => !c.is_featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-iark-red via-red-600 to-iark-blue py-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-xl" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full blur-xl" />
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white rounded-full blur-xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center text-white mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Donasi untuk IARK
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Bersama Membangun Alumni Berintegritas dan Indonesia Lebih Baik
            </p>
          </div>

          {/* Overall Stats */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(stats.paid_amount)}
                </div>
                <div className="text-sm text-white/80">Total Donasi Terkumpul</div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stats.paid_count.toLocaleString('id-ID')}
                </div>
                <div className="text-sm text-white/80">Total Donatur</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      {featuredCampaigns.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-iark-red rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Kampanye Unggulan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign, index) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* All Campaigns */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-iark-blue rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {featuredCampaigns.length > 0 ? 'Kampanye Lainnya' : 'Semua Kampanye'}
          </h2>
        </div>

        {regularCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCampaigns.map((campaign, index) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={index} />
            ))}
          </div>
        ) : featuredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Kampanye Aktif
            </h3>
            <p className="text-gray-600">
              Kampanye donasi baru akan segera diumumkan. Stay tuned!
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
