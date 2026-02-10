'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Heart, ArrowRight, Loader2, Clock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DonasiLink } from '@/components/features/donasi';
import { getCrossDomainUrl } from '@/lib/utils/subdomain';

interface DonationInfo {
  order_id: string;
  amount: number;
  donor_name: string;
  payment_status: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [donation, setDonation] = useState<DonationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchDonation();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  async function fetchDonation() {
    try {
      const response = await fetch(`/api/donations/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setDonation(data);
      }
    } catch (error) {
      console.error('Error fetching donation:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-iark-red animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat informasi donasi...</p>
        </div>
      </div>
    );
  }

  const isPending = donation?.payment_status === 'pending';
  const isPaid = donation?.payment_status === 'paid';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          {isPaid ? (
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          ) : isPending ? (
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-16 h-16 text-yellow-600" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-16 h-16 text-iark-red" />
            </div>
          )}
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isPaid ? 'Terima Kasih!' : isPending ? 'Menunggu Pembayaran' : 'Donasi Diterima!'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {isPaid
              ? 'Donasi Anda telah berhasil diproses. Semoga Allah SWT membalas kebaikan Anda.'
              : isPending
              ? 'Silakan selesaikan pembayaran Anda. Kami akan mengirimkan konfirmasi setelah pembayaran berhasil.'
              : 'Terima kasih atas dukungan Anda untuk IARK.'}
          </p>
        </motion.div>

        {/* Donation Details */}
        {donation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="font-semibold text-gray-900 mb-4">Detail Donasi</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-mono text-sm">{donation.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah</span>
                <span className="font-semibold text-iark-red">{formatCurrency(donation.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-semibold ${isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isPaid ? 'Berhasil' : 'Menunggu'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <DonasiLink
            path="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-iark-red text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Donasi Lagi
          </DonasiLink>

          <button
            onClick={() => {
              const text = `Saya baru saja berdonasi melalui IARK. Yuk ikut berdonasi! ${window.location.origin}`;
              const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
              window.open(waUrl, '_blank');
            }}
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Bagikan via WhatsApp
          </button>

          <a
            href={getCrossDomainUrl('/')}
            className="inline-flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Kembali ke Beranda
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Share Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-gray-500 text-sm"
        >
          Bagikan kebaikan Anda dan ajak teman-teman untuk berdonasi juga!
        </motion.p>
      </div>
    </div>
  );
}

export default function DonasiSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-iark-red animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
