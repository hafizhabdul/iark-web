import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Heart, ArrowLeft, User } from 'lucide-react';

export const revalidate = 120; // Revalidate every 2 minutes

interface Donor {
  id: string;
  donor_name: string;
  amount: number;
  message: string | null;
  is_anonymous: boolean;
  paid_at: string;
}

async function getDonors(): Promise<Donor[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('donations')
    .select('id, donor_name, amount, message, is_anonymous, paid_at')
    .eq('payment_status', 'paid')
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function DonorsPage() {
  const donors = await getDonors();

  const totalDonations = donors.reduce((sum, d) => sum + d.amount, 0);
  const totalDonors = donors.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-iark-red to-iark-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/donasi"
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
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">{totalDonors}</p>
              <p className="text-white/80">Donatur</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">{formatCurrency(totalDonations)}</p>
              <p className="text-white/80">Total Terkumpul</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donors List */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {donors.length > 0 ? (
            <div className="grid gap-4">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-iark-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {donor.is_anonymous ? (
                        <User className="w-6 h-6 text-gray-400" />
                      ) : (
                        <span className="text-xl font-bold text-iark-red">
                          {donor.donor_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {donor.is_anonymous ? 'Anonim' : donor.donor_name}
                        </h3>
                        <span className="text-iark-red font-bold whitespace-nowrap">
                          {formatCurrency(donor.amount)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatDate(donor.paid_at)}
                      </p>
                      {donor.message && (
                        <p className="text-gray-600 italic text-sm">
                          &ldquo;{donor.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
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
                href="/donasi/checkout"
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
              href="/donasi/checkout"
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
