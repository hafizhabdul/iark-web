import Image from 'next/image';
import { createPublicClient } from '@/lib/supabase/public';
import { unstable_cache } from 'next/cache';
import { ManagementMember } from '../pengurus/ManagementGrid';

export interface BidangSectionProps {
  className?: string;
}

const getBidangMembers = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    // Ambil pengurus inti
    const { data, error } = await supabase
      .from('management')
      .select('*')
      .eq('role', 'pengurus_inti')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []) as ManagementMember[];
  },
  ['bidang-section-grid-final'],
  { revalidate: 3600, tags: ['management'] }
);

export async function BidangSection({ className = '' }: BidangSectionProps) {
  let allMembers: ManagementMember[] = [];
  try {
    allMembers = await getBidangMembers();
  } catch (error) {
    console.error('Error fetching bidang data:', error);
  }

  // Filter: Ambil yang jabatannya mengandung "Ketua Bidang"
  const ketuaBidangList = allMembers.filter(m =>
    m.position.toLowerCase().includes('ketua bidang')
  );

  return (
    <section className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Floating Blobs */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-red-500/5 rounded-full blur-2xl animate-drift" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-iark-yellow/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-iark-yellow rounded-full" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-iark-black mb-4">
            Struktur Bidang IARK
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Para ketua bidang yang berdedikasi menggerakkan program-program strategis untuk kemajuan alumni
          </p>
        </div>

        {/* Grid Ketua Bidang */}
        {ketuaBidangList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {ketuaBidangList.map((bidang, index) => (
              <div
                key={bidang.id}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-iark-yellow hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-iark-yellow to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Photo */}
                <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden ring-4 ring-gray-50 group-hover:ring-iark-yellow/30 transition-all duration-500">
                  <Image
                    src={bidang.photo || '/images/placeholder-avatar.png'}
                    alt={bidang.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="w-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{bidang.name}</h3>

                  {/* Badge Position */}
                  <div className="inline-flex items-center px-4 py-1.5 bg-iark-yellow/10 text-iark-yellow rounded-full mb-4 group-hover:bg-iark-yellow group-hover:text-white transition-colors duration-300">
                    <p className="font-bold text-xs uppercase tracking-wider">{bidang.position}</p>
                  </div>

                  {bidang.angkatan && (
                    <div className="border-t border-gray-100 pt-4 w-full">
                      <p className="text-sm text-gray-500 font-medium">
                        Angkatan {bidang.angkatan}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="font-medium text-lg">Belum ada data Ketua Bidang</p>
            <p className="text-sm mt-1 text-gray-400">Data struktur bidang sedang dalam pembaruan.</p>
          </div>
        )}
      </div>
    </section>
  );
}
