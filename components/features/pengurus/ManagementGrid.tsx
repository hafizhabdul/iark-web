import { ManagementCard } from './ManagementCard';
import { createPublicClient } from '@/lib/supabase/public';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';

const getMembers = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('management')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []) as ManagementMember[];
  },
  ['management-home'],
  { revalidate: 3600, tags: ['management'] }
);

export interface ManagementMember {
  id: string;
  name: string;
  position: string;
  angkatan: string | null;
  photo: string | null;
  role: string;
  instagram: string | null;
  linkedin: string | null;
  order_index: number | null;
}

export interface ManagementGridProps {
  className?: string;
  initialData?: ManagementMember[];
}

export function ManagementGrid({ className = '', initialData }: ManagementGridProps) {
  const allMembers = initialData || [];

  const pengurusInti = allMembers.filter((m) => m.role === 'pengurus_inti');
  const ketuaAngkatan = allMembers.filter((m) => m.role === 'ketua_angkatan');

  return (
    <section className={`relative py-24 px-8 bg-gray-50 overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Decorative elements */}
      <div className="absolute top-32 left-1/4 w-10 h-10 bg-iark-yellow rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 right-16 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 left-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-blue/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-blue rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Pengurus Inti IARK
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Kenali para pemimpin yang menggerakkan IARK dengan dedikasi dan integritas
        </p>

        {/* Pengurus Inti Grid - Show top 6 only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pengurusInti.slice(0, 6).map((member, index) => (
            <ManagementCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* View All Button */}
        {pengurusInti.length > 6 && (
          <div className="flex justify-center mb-20">
            <Link
              href="/tentang"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-iark-blue text-iark-blue font-bold rounded-full hover:bg-iark-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-iark-blue/20"
            >
              Lihat Struktur Lengkap
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}

        {/* Ketua Angkatan Section - Text Only */}
        {ketuaAngkatan.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-iark-black">
              Ketua Angkatan
            </h3>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {ketuaAngkatan.map((member, index) => (
                  <div
                    key={member.id}
                    className="text-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                    <p className="text-xs text-iark-red mt-1">{member.position}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
