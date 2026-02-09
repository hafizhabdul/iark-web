import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, Heart, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fetchCampaignBySlug, fetchCampaignDonorWall } from '@/lib/queries/donationCampaigns';
import { DonorWallList, DonasiLink } from '@/components/features/donasi';
import { CampaignHeroClient } from './CampaignHeroClient';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await fetchCampaignBySlug(slug);

  if (!campaign) {
    return {
      title: 'Kampanye Tidak Ditemukan',
    };
  }

  const description = campaign.description || `Dukung kampanye ${campaign.title} - IARK`;

  return {
    title: `${campaign.title} | Donasi IARK`,
    description,
    openGraph: {
      title: campaign.title,
      description,
      images: campaign.image_url ? [campaign.image_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: campaign.title,
      description,
      images: campaign.image_url ? [campaign.image_url] : [],
    },
  };
}

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await fetchCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  const donors = await fetchCampaignDonorWall(campaign.id, 20);
  const displayDonors = donors.slice(0, 10);
  const hasMoreDonors = donors.length > 10;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <DonasiLink
            path="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-iark-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Kampanye
          </DonasiLink>
        </div>
      </div>

      {/* Campaign Hero */}
      <CampaignHeroClient campaign={campaign} checkoutPath={`/${slug}/checkout`} />

      {/* Content Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Tentang Kampanye Ini
                </h2>
                {campaign.content ? (
                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-iark-red prose-a:no-underline hover:prose-a:underline">
                    <ReactMarkdown>{campaign.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    {campaign.description || 'Belum ada deskripsi untuk kampanye ini.'}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar - Donor Wall */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-iark-red/10 rounded-lg">
                    <Users className="w-5 h-5 text-iark-red" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Donatur Terbaru</h3>
                </div>

                <DonorWallList donors={displayDonors} />

                {hasMoreDonors && (
                  <DonasiLink
                    path={`/${slug}/donors`}
                    className="mt-4 block text-center text-iark-red hover:text-red-700 font-medium transition-colors"
                  >
                    Lihat Semua Donatur →
                  </DonasiLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-2xl z-50 p-4">
        <DonasiLink
          path={`/${slug}/checkout`}
          className="flex items-center justify-center gap-2 w-full bg-iark-red hover:bg-red-700 text-white font-bold py-4 px-6 rounded-full text-lg transition-colors duration-300"
        >
          <Heart className="w-5 h-5" />
          Donasi Sekarang
        </DonasiLink>
      </div>

      {/* Desktop Floating CTA */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <DonasiLink
          path={`/${slug}/checkout`}
          className="flex items-center gap-3 bg-iark-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
        >
          <Heart className="w-5 h-5" />
          Donasi Sekarang
        </DonasiLink>
      </div>

      {/* Bottom padding for mobile CTA */}
      <div className="h-24 md:h-0" />
    </div>
  );
}
