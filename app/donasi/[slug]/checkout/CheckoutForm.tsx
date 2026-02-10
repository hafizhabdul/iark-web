'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import Image from 'next/image';
import { ArrowLeft, Heart, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DonasiLink } from '@/components/features/donasi';
import { getDonasiHref, getCrossDomainUrl } from '@/lib/utils/subdomain';
import { AuthChoice } from '@/components/features/auth/AuthChoice';

const DONATION_AMOUNTS = [
  { value: 10000, label: 'Rp 10.000' },
  { value: 25000, label: 'Rp 25.000' },
  { value: 50000, label: 'Rp 50.000' },
  { value: 100000, label: 'Rp 100.000' },
  { value: 250000, label: 'Rp 250.000' },
  { value: 500000, label: 'Rp 500.000' },
  { value: 1000000, label: 'Rp 1.000.000' },
];

interface CampaignForCheckout {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

interface UserForCheckout {
  id: string;
  email: string;
  name: string;
  phone: string;
}

interface CheckoutFormProps {
  campaign: CampaignForCheckout;
  user: UserForCheckout | null;
}

type CheckoutMode = 'auth_choice' | 'logged_in' | 'guest';

export function CheckoutForm({ campaign, user }: CheckoutFormProps) {
  const router = useRouter();

  // Determine initial mode
  const initialMode: CheckoutMode = user ? 'logged_in' : 'auth_choice';
  const [mode, setMode] = useState<CheckoutMode>(initialMode);

  const [formData, setFormData] = useState({
    amount: 100000,
    customAmount: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
    isAnonymous: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileEnabled = !!turnstileSiteKey && !turnstileSiteKey.includes('your_');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(turnstileEnabled ? null : 'skip');
  const turnstileRef = useRef<TurnstileInstance>(null);

  const isGuest = mode === 'guest';
  const isLoggedIn = mode === 'logged_in';

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

  const handleLoginClick = () => {
    const checkoutUrl = getCrossDomainUrl(`/${campaign.slug}/checkout`, 'donasi');
    const loginUrl = getCrossDomainUrl(`/masuk?redirectTo=${encodeURIComponent(checkoutUrl)}`);
    window.location.href = loginUrl;
  };

  const handleGuestClick = () => {
    setMode('guest');
    setFormData(prev => ({
      ...prev,
      name: 'Hamba Allah',
      email: '',
      isAnonymous: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!isGuest && !formData.name.trim()) {
      setError('Nama wajib diisi');
      return;
    }
    if (!isGuest && (!formData.email.trim() || !formData.email.includes('@'))) {
      setError('Email tidak valid');
      return;
    }
    if (isGuest && formData.email.trim() && !formData.email.includes('@')) {
      setError('Email tidak valid');
      return;
    }
    if (finalAmount < 1000) {
      setError('Minimal donasi Rp 1.000');
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
          donor_name: isGuest ? (formData.name.trim() || 'Hamba Allah') : formData.name.trim(),
          donor_email: formData.email.trim(),
          donor_phone: isGuest ? null : (formData.phone || null),
          message: formData.message || null,
          is_anonymous: isGuest ? true : formData.isAnonymous,
          is_guest: isGuest,
          campaign_id: campaign.id,
          turnstile_token: turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses donasi');
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        router.push(getDonasiHref(`/success?order_id=${data.order_id}`));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setIsSubmitting(false);
      // Reset Turnstile so user can retry
      turnstileRef.current?.reset();
      setTurnstileToken(turnstileEnabled ? null : 'skip');
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
        <DonasiLink
          path={`/${campaign.slug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-iark-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Kampanye
        </DonasiLink>

        {/* Campaign Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {campaign.image_url && (
            <div className="relative h-40 w-full">
              <Image
                src={campaign.image_url}
                alt={campaign.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          <div className={`p-6 ${campaign.image_url ? '-mt-12 relative z-10' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-iark-red rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${campaign.image_url ? 'text-white' : 'text-gray-900'}`}>
                Donasi untuk
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign.title}</h2>
            {campaign.description && (
              <p className="text-gray-600 mt-2 line-clamp-2">{campaign.description}</p>
            )}
          </div>
        </div>

        {/* Auth Choice (State 1: not logged in, no choice yet) */}
        {mode === 'auth_choice' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih cara berdonasi</h3>
            <AuthChoice
              mode="donation"
              onLoginClick={handleLoginClick}
              onGuestClick={handleGuestClick}
            />
          </div>
        )}

        {/* Donation Form (State 2 & 3) */}
        {(isLoggedIn || isGuest) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            {/* Logged in banner */}
            {isLoggedIn && user && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-700 text-sm font-medium">
                    Masuk sebagai: {user.name || user.email}
                  </p>
                  {user.name && (
                    <p className="text-green-600 text-xs">{user.email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Guest banner */}
            {isGuest && (
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700 text-sm font-medium">Donasi sebagai Hamba Allah</p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('auth_choice');
                    setFormData(prev => ({ ...prev, name: '', email: '', isAnonymous: false }));
                  }}
                  className="text-sm text-iark-red hover:underline"
                >
                  Ubah
                </button>
              </div>
            )}

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
                    inputMode="numeric"
                    value={formData.customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
                  />
                </div>
              </div>

              {finalAmount > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-semibold text-lg">
                    Total Donasi: {formatCurrency(finalAmount)}
                  </p>
                </div>
              )}
            </div>

            {/* Donor Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Informasi Donatur</h3>

              {/* Name - editable for logged in, optional for guest */}
              {isLoggedIn && (
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
              )}

              {isGuest && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama (Opsional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
                    placeholder="Hamba Allah"
                  />
                  <p className="text-xs text-gray-500 mt-1">Kosongkan untuk donasi atas nama &ldquo;Hamba Allah&rdquo;</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={!isGuest}
                  readOnly={isLoggedIn}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red ${
                    isLoggedIn ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                  }`}
                  placeholder="email@contoh.com"
                />
                {isGuest && (
                  <p className="text-xs text-gray-500 mt-1">Untuk notifikasi pembayaran</p>
                )}
              </div>

              {/* Phone - only for logged in */}
              {isLoggedIn && (
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
              )}

              {/* Message */}
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
                  placeholder="Tulis pesan atau doa untuk kampanye ini..."
                />
              </div>

              {/* Anonymous toggle - only for logged in */}
              {isLoggedIn && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="w-5 h-5 text-iark-red border-gray-300 rounded focus:ring-iark-red"
                  />
                  <span className="text-gray-700">Sembunyikan nama saya (Hamba Allah)</span>
                </label>
              )}
            </div>

            {/* Turnstile */}
            {turnstileEnabled && (
              <div className="flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey!}
                  onSuccess={setTurnstileToken}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => {
                    setTurnstileToken(null);
                    turnstileRef.current?.reset();
                  }}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken || finalAmount < 1000}
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
                  Lanjutkan ke Pembayaran{finalAmount >= 1000 ? ` - ${formatCurrency(finalAmount)}` : ''}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Dengan berdonasi, Anda menyetujui syarat dan ketentuan IARK
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
