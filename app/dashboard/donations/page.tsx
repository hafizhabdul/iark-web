'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Heart, Loader2, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { getCrossDomainUrl } from '@/lib/utils/subdomain';

interface UserDonation {
  id: string;
  order_id: string;
  amount: number;
  payment_status: string;
  created_at: string;
  campaign: {
    title: string;
    slug: string;
  } | null;
}

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<UserDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDonations();
  }, []);

  async function fetchUserDonations() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('donations')
      .select(`
        id,
        order_id,
        amount,
        payment_status,
        created_at,
        campaigns:campaign_id (title, slug)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDonations(
        data.map((d: any) => ({
          ...d,
          campaign: d.campaigns || null,
        }))
      );
    }
    setLoading(false);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Berhasil';
      case 'pending': return 'Menunggu';
      case 'expired': return 'Kedaluwarsa';
      case 'failed': return 'Gagal';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-iark-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Donasi</h1>
          <p className="text-gray-600">Daftar donasi yang pernah Anda lakukan</p>
        </div>
        <a
          href={getCrossDomainUrl('/', 'donasi')}
          className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Heart className="w-4 h-4" />
          Donasi Sekarang
        </a>
      </div>

      {donations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Belum ada donasi</h2>
          <p className="text-gray-600 mb-6">Anda belum pernah berdonasi. Yuk mulai berdonasi!</p>
          <a
            href={getCrossDomainUrl('/', 'donasi')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Lihat Kampanye Donasi
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(donation.payment_status)}
                    <span className="text-sm font-medium text-gray-600">
                      {getStatusLabel(donation.payment_status)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {donation.campaign?.title || 'Donasi Umum'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(donation.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {' '}
                    <span className="font-mono">{donation.order_id}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-iark-red">
                    {formatCurrency(donation.amount)}
                  </p>
                  {donation.campaign?.slug && (
                    <a
                      href={getCrossDomainUrl(`/${donation.campaign.slug}`, 'donasi')}
                      className="p-2 text-gray-400 hover:text-iark-red transition-colors"
                      title="Lihat kampanye"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
