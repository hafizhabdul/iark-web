'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Turnstile } from '@marsidev/react-turnstile';
import Link from 'next/link';
import { ArrowLeft, Heart, Loader2, AlertCircle } from 'lucide-react';

const DONATION_AMOUNTS = [
  { value: 50000, label: 'Rp 50.000' },
  { value: 100000, label: 'Rp 100.000' },
  { value: 250000, label: 'Rp 250.000' },
  { value: 500000, label: 'Rp 500.000' },
  { value: 1000000, label: 'Rp 1.000.000' },
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAmount = searchParams.get('amount');

  const [formData, setFormData] = useState({
    amount: initialAmount ? parseInt(initialAmount) : 100000,
    customAmount: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    isAnonymous: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount, customAmount: '' }));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      customAmount: value,
      amount: value ? parseInt(value) : 0,
    }));
  };

  const finalAmount = formData.customAmount ? parseInt(formData.customAmount) : formData.amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.name.trim()) {
      setError('Nama wajib diisi');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Email tidak valid');
      return;
    }
    if (finalAmount < 10000) {
      setError('Minimal donasi Rp 10.000');
      return;
    }
    if (!turnstileToken) {
      setError('Verifikasi keamanan diperlukan');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          donor_name: formData.name,
          donor_email: formData.email,
          donor_phone: formData.phone || null,
          message: formData.message || null,
          is_anonymous: formData.isAnonymous,
          turnstile_token: turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses donasi');
      }

      // Redirect to payment gateway
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        // Fallback: redirect to success with order_id
        router.push(`/donasi/success?order_id=${data.order_id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/donasi"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-iark-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-iark-red to-iark-blue text-white rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Donasi untuk IARK</h1>
          </div>
          <p className="text-white/80">
            Kontribusi Anda membantu membangun komunitas alumni yang lebih baik
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Pilih Nominal Donasi
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DONATION_AMOUNTS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAmountSelect(value)}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    formData.amount === value && !formData.customAmount
                      ? 'border-iark-red bg-iark-red/5 text-iark-red'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-2">Atau masukkan nominal lain:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="text"
                  value={formData.customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
                />
              </div>
            </div>

            {finalAmount > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold">
                  Total Donasi: {formatCurrency(finalAmount)}
                </p>
              </div>
            )}
          </div>

          {/* Donor Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Informasi Donatur</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
                placeholder="email@contoh.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. WhatsApp (Opsional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pesan / Doa (Opsional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red resize-none"
                placeholder="Tulis pesan atau doa untuk IARK..."
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="w-5 h-5 text-iark-red border-gray-300 rounded focus:ring-iark-red"
              />
              <span className="text-gray-700">Sembunyikan nama saya (donasi anonim)</span>
            </label>
          </div>

          {/* Turnstile */}
          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken(null)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !turnstileToken || finalAmount < 10000}
            className="w-full py-4 bg-iark-red text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Lanjutkan ke Pembayaran
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Dengan berdonasi, Anda menyetujui syarat dan ketentuan IARK
          </p>
        </form>
      </div>
    </div>
  );
}

export default function DonasiCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-iark-red animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
