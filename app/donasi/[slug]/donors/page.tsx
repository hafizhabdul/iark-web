import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Heart, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { DonorWallCard } from '@/components/features/donasi/DonorWallCard';
import type { CampaignDonorWall, DonationCampaignWithProgress } from '@/lib/supabase/types';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCampaignBySlug(slug: string): Promise<DonationCampaignWithProgress | null> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('vw_donation_campaign_progress')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching campaign:', error);
    return null;
  }
  return data;
}

async function getCampaignDonors(
  campaignId: string,
  page: number = 1,
  perPage: number = 30
): Promise<{ donors: CampaignDonorWall[]; total: number }> {
  const supabase = await createClient();
  const offset = (page - 1) * perPage;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, count } = await (supabase as any)
    .from('vw_campaign_donor_wall')
    .select('*', { count: 'exact' })
    .eq('campaign_id', campaignId)
    .order('paid_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (error) {
    console.error('Error fetching donors:', error);
    return { donors: [], total: 0 };
  }

  return { donors: data || [], total: count || 0 };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    return { title: 'Donatur - Tidak Ditemukan' };
  }

  return {
    title: `Donatur ${campaign.title} | IARK`,
    description: `Daftar donatur yang telah mendukung kampanye ${campaign.title}`,
  };
}

export default async function CampaignDonorsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));
  const perPage = 30;

  const campaign = await getCampaignBySlug(slug);
  if (!campaign) {
    notFound();
  }

  const { donors, total } = await getCampaignDonors(campaign.id, currentPage, perPage);
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/donasi/${slug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-iark-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke {campaign.title}
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-gradient-to-br from-iark-red to-iark-blue text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold">Donatur {campaign.title}</h1>
          </div>
          <p className="text-white/80">
            {total} orang telah mendukung kampanye ini
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl md:text-3xl font-bold">{campaign.paid_count}</p>
              <p className="text-white/80 text-sm">Total Donatur</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(campaign.paid_amount)}</p>
              <p className="text-white/80 text-sm">Terkumpul</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donors List */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {donors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donors.map((donor, index) => (
                  <DonorWallCard key={donor.donation_id} donor={donor} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {currentPage > 1 && (
                    <Link
                      href={`/donasi/${slug}/donors?page=${currentPage - 1}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Sebelumnya
                    </Link>
                  )}

                  <span className="px-4 py-2 bg-iark-red text-white rounded-lg">
                    {currentPage} / {totalPages}
                  </span>

                  {currentPage < totalPages && (
                    <Link
                      href={`/donasi/${slug}/donors?page=${currentPage + 1}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Selanjutnya
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Belum Ada Donatur
              </h3>
              <p className="text-gray-500 mb-6">
                Jadilah yang pertama mendukung kampanye ini
              </p>
              <Link
                href={`/donasi/${slug}/checkout`}
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
              Kontribusi Anda sangat berarti untuk {campaign.title}
            </p>
            <Link
              href={`/donasi/${slug}/checkout`}
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
