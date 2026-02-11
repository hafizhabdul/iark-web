import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Heart, ArrowLeft, Users, TrendingUp } from 'lucide-react';
import { DonorWallCard } from '@/components/features/donasi/DonorWallCard';
import type { CampaignDonorWall } from '@/lib/supabase/types';

export const revalidate = 120;

interface DonationStats {
  total_paid_amount: number;
  total_paid_count: number;
  total_campaigns: number;
}

async function getDonationStats(): Promise<DonationStats> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('vw_donation_overall_stats')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching stats:', error);
    return { total_paid_amount: 0, total_paid_count: 0, total_campaigns: 0 };
  }

  return data || { total_paid_amount: 0, total_paid_count: 0, total_campaigns: 0 };
}

async function getAllDonors(): Promise<CampaignDonorWall[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('vw_campaign_donor_wall')
    .select('*')
    .order('paid_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching donors:', error);
    return [];
  }

  return data || [];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function DonorsPage() {
  const [stats, donors] = await Promise.all([getDonationStats(), getAllDonors()]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-iark-red to-iark-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Donasi
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Wall of Fame</h1>
          </div>
          <p className="text-white/80 text-lg">
            Terima kasih kepada para donatur yang telah mendukung IARK
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-3xl font-bold">{stats.total_paid_count}</p>
              <p className="text-white/80">Total Donatur</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">{formatCurrency(stats.total_paid_amount)}</p>
              <p className="text-white/80">Total Terkumpul</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-3xl font-bold">{stats.total_campaigns || 0}</p>
              <p className="text-white/80">Kampanye Aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donors Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Semua Donatur</h2>

          {donors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor, index) => (
                <DonorWallCard key={donor.donation_id} donor={donor} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Belum Ada Donatur
              </h3>
              <p className="text-gray-500 mb-6">
                Jadilah yang pertama mendukung IARK
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-iark-red text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                <Heart className="w-5 h-5" />
                Donasi Sekarang
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {donors.length > 0 && (
        <section className="py-12 px-4 bg-white border-t">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ingin Bergabung?
            </h2>
            <p className="text-gray-600 mb-6">
              Kontribusi Anda sangat berarti bagi komunitas alumni RK
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-iark-red text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Donasi Sekarang
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
