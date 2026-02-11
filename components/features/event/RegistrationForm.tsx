'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Turnstile } from '@marsidev/react-turnstile';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ANGKATAN_OPTIONS, KAMPUS_OPTIONS } from '@/lib/constants/regional';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

interface RegistrationFormProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    angkatan?: number;
    regional?: string;
    asrama?: string;
  } | null;
}

export function RegistrationForm({ eventId, eventSlug, eventTitle, eventDate, eventLocation, user }: RegistrationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    angkatan: user?.angkatan?.toString() || '',
    asrama: user?.asrama || '',
    kampus: '',
    kampusCustom: '',
    organization: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate turnstile for guest users
      if (!user && !turnstileToken) {
        setError('Silakan selesaikan verifikasi keamanan');
        setIsSubmitting(false);
        return;
      }

      const supabase = createClient();

      // Call RPC function for race-condition-safe registration
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: rpcError } = await (supabase as any).rpc('register_for_event', {
        p_event_id: eventId,
        p_user_id: user?.id || null,
        p_full_name: formData.fullName,
        p_email: formData.email,
        p_phone: formData.phone || null,
        p_angkatan: formData.angkatan ? parseInt(formData.angkatan) : null,
        p_asrama: formData.asrama || null,
        p_kampus: formData.kampus === 'lainnya'
          ? formData.kampusCustom || null
          : formData.kampus
            ? KAMPUS_OPTIONS.find(o => o.value === formData.kampus)?.label || null
            : null,
        p_organization: formData.organization || null,
      });

      if (rpcError) {
        // Handle specific errors
        if (rpcError.message.includes('Event is full')) {
          setError('Maaf, kuota event sudah penuh');
        } else if (rpcError.message.includes('already exists') || rpcError.message.includes('duplicate')) {
          setError('Email ini sudah terdaftar untuk event ini');
        } else if (rpcError.message.includes('Registration is closed')) {
          setError('Pendaftaran untuk event ini sudah ditutup');
        } else if (rpcError.message.includes('deadline')) {
          setError('Batas waktu pendaftaran sudah terlewat');
        } else {
          setError('Gagal mendaftar. Silakan coba lagi.');
          console.error('Registration error:', rpcError);
        }
        setIsSubmitting(false);
        return;
      }

      // Success!
      setSuccess(true);
      
      // Send confirmation email (fire-and-forget, don't block UI)
      fetch('/api/email/registration-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          eventName: eventTitle,
          eventDate,
          eventLocation,
        }),
      }).catch(console.error);

      // Redirect after 2 seconds (use relative path, works on subdomain)
      setTimeout(() => {
        router.push(`/${eventSlug}?registered=true`);
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-gray-600 mb-4">
          Anda telah terdaftar untuk <strong>{eventTitle}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Konfirmasi akan dikirim ke email Anda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Nama Lengkap *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          placeholder="Masukkan nama lengkap"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={!!user?.email}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Nomor WhatsApp
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          placeholder="08xxxxxxxxxx"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="angkatan" className="block text-sm font-medium text-gray-700 mb-2">
            Angkatan RK
          </label>
          <select
            id="angkatan"
            name="angkatan"
            value={formData.angkatan}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="">Pilih Angkatan</option>
            {ANGKATAN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="asrama" className="block text-sm font-medium text-gray-700 mb-2">
            Asrama
          </label>
          <select
            id="asrama"
            name="asrama"
            value={formData.asrama}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="">Pilih Asrama</option>
            <option value="Bogor">Bogor</option>
            <option value="Makassar">Makassar</option>
            <option value="Yogyakarta">Yogyakarta</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Malang">Malang</option>
            <option value="Bandung">Bandung</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Asal Kampus
        </label>
        <SearchableDropdown
          options={KAMPUS_OPTIONS}
          value={formData.kampus}
          onChange={(val) => setFormData(prev => ({ ...prev, kampus: val, kampusCustom: val !== 'lainnya' ? '' : prev.kampusCustom }))}
          placeholder="Pilih Kampus"
          searchPlaceholder="Cari nama kampus..."
        />
        {formData.kampus === 'lainnya' && (
          <input
            type="text"
            id="kampusCustom"
            name="kampusCustom"
            value={formData.kampusCustom}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
            placeholder="Ketik nama kampus"
          />
        )}
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
          Instansi / Tempat Kerja
        </label>
        <input
          type="text"
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          placeholder="Nama perusahaan atau instansi"
        />
      </div>

      {/* Turnstile for guest users */}
      {!user && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.includes('your_') && (
        <div className="flex justify-center">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken(null)}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-iark-red text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Mendaftar...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Daftar Sekarang
          </>
        )}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Dengan mendaftar, Anda menyetujui untuk menerima informasi terkait event ini via email.
      </p>
    </form>
  );
}
