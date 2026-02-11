import Image from 'next/image';
import { createPublicClient } from '@/lib/supabase/public';
import { unstable_cache } from 'next/cache';
import { ManagementMember } from './ManagementGrid';

export interface PengurusSectionProps {
  className?: string;
}

const getMembers = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('management')
      .select('*')
      .eq('role', 'pengurus_inti')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []) as ManagementMember[];
  },
  ['pengurus-section-data'],
  { revalidate: 3600, tags: ['management'] }
);

export async function PengurusSection({ className = '' }: PengurusSectionProps) {
  let allMembers: ManagementMember[] = [];
  try {
    allMembers = await getMembers();
  } catch (error) {
    console.error('Error fetching pengurus:', error);
  }

  // Helper untuk mencari member berdasarkan posisi
  const findMember = (positionQuery: string) =>
    allMembers.find(m => m.position.toLowerCase().includes(positionQuery.toLowerCase()));

  // 1. Ketua Umum (Level 1)
  const ketuaUmum = findMember('Ketua Umum');

  // 2. Wakil Ketua Umum & Sekretariat Inti (Level 2)
  // Prioritas urutan: Waketum -> Sekjen -> Bendum
  // Kita cari semua yang bukan Ketua Umum dan bukan Ketua Bidang
  const coreOfficers = allMembers.filter(m => {
    const pos = m.position.toLowerCase();
    // Exclude Ketua Umum
    if (pos.includes('ketua umum') && !pos.includes('wakil')) return false;

    // Include Waketum, Sekjen, Bendum, and their deputies
    return (
      pos.includes('wakil ketua umum') ||
      pos.includes('sekretaris jenderal') ||
      pos.includes('bendahara') ||
      pos.includes('wakil sekretaris') ||
      pos.includes('wakil bendahara')
    );
  }).sort((a, b) => {
    // Custom sort order
    const getScore = (pos: string) => {
      pos = pos.toLowerCase();
      if (pos.includes('wakil ketua umum')) return 1;
      if (pos.includes('sekretaris jenderal') && !pos.includes('wakil')) return 2;
      if (pos.includes('bendahara') && !pos.includes('wakil')) return 3;
      return 4; // Wakil-wakil lainnya
    };
    return getScore(a.position) - getScore(b.position);
  });

  // 3. Ketua Bidang/Divisi (Level 3)
  const ketuaDivisi = allMembers.filter(m => {
    const pos = m.position.toLowerCase();
    // Anything starting with "Ketua" but not Ketua Umum/Waketum
    // Or anything explicitly containing "Ketua Bidang"
    // Also include specific known patterns like "Ketua 1", "Ketua 2"
    return (
      (pos.startsWith('ketua') && !pos.includes('ketua umum')) ||
      pos.includes('ketua bidang') ||
      pos.includes('ketua divisi')
    ) && !coreOfficers.some(c => c.id === m.id); // Ensure not already in core
  });

  // 4. Sisanya (Lainnya)
  const others = allMembers.filter(m =>
    m.id !== ketuaUmum?.id &&
    !coreOfficers.some(c => c.id === m.id) &&
    !ketuaDivisi.some(k => k.id === m.id)
  );

  // Combine Divisi & Others for the bottom grid if needed, or keep separate
  // Let's merge them for a cleaner "Operational Leaders" grid if desired,
  // or keep layout hierarchy: KetuaUmum -> Core -> Divisi -> Others

  return (
    <section className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-iark-red/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-iark-red rounded-full" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-iark-black mb-4">
            Struktur Organisasi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tim kepemimpinan yang berdedikasi untuk memajukan IARK dan alumni RK
          </p>
        </div>

        {/* --- LEVEL 1: KETUA UMUM --- */}
        {ketuaUmum && (
          <div className="flex justify-center mb-12 relative z-20">
            <div className="group relative bg-gradient-to-br from-iark-red to-red-600 rounded-3xl p-1.5 shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 transition-all duration-500">
              <div className="bg-white rounded-[20px] p-8 text-center w-full max-w-xs md:max-w-sm">
                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-iark-red/10 group-hover:ring-iark-red/30 transition-all duration-500">
                  <Image
                    src={ketuaUmum.photo || '/images/placeholder-avatar.png'}
                    alt={ketuaUmum.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{ketuaUmum.name}</h3>
                <div className="inline-block px-4 py-1.5 bg-iark-red/10 rounded-full">
                  <p className="text-iark-red font-bold uppercase text-sm tracking-wide">{ketuaUmum.position}</p>
                </div>
                {ketuaUmum.angkatan && (
                  <p className="text-sm text-gray-500 mt-4 font-medium">Angkatan {ketuaUmum.angkatan}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Connector Line Level 1 to 2 */}
        {ketuaUmum && coreOfficers.length > 0 && (
          <div className="flex justify-center -mt-16 mb-12 relative z-10">
            <div className="h-24 w-0.5 bg-gradient-to-b from-transparent via-gray-300 to-gray-300" />
          </div>
        )}

        {/* --- LEVEL 2: CORE OFFICERS (Sekjen, Bendum, Waketum) --- */}
        {coreOfficers.length > 0 && (
          <div className="relative mb-20">
            {/* Horizontal connecting line top */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[80%] h-8 border-t-2 border-l-2 border-r-2 border-gray-200 rounded-t-3xl hidden md:block" />

            <div className="flex flex-wrap justify-center gap-8 md:gap-10">
              {coreOfficers.map((member) => (
                <div
                  key={member.id}
                  className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl border border-gray-100 hover:border-iark-blue transition-all duration-300 w-full md:w-64 flex flex-col items-center relative z-20"
                >
                  <div className="relative w-28 h-28 mb-5 rounded-full overflow-hidden ring-4 ring-gray-50 group-hover:ring-iark-blue/20 transition-all duration-300">
                    <Image
                      src={member.photo || '/images/placeholder-avatar.png'}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{member.name}</h3>
                  <p className="text-iark-blue font-semibold text-sm mb-2">{member.position}</p>
                  {member.angkatan && (
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      Angkatan {member.angkatan}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- LEVEL 3 & 4: DIVISION CHIEFS & OTHERS --- */}
        {(ketuaDivisi.length > 0 || others.length > 0) && (
          <div className="relative">
            {/* Section Title Divider */}
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px bg-gray-200 flex-grow" />
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Bidang & Divisi</span>
              <div className="h-px bg-gray-200 flex-grow" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...ketuaDivisi, ...others].map((member) => (
                <div
                  key={member.id}
                  className="group bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg border border-gray-100 hover:border-iark-yellow transition-all duration-300 flex flex-col items-center"
                >
                  <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-iark-yellow/40 transition-all duration-300">
                    <Image
                      src={member.photo || '/images/placeholder-avatar.png'}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">{member.name}</h3>
                  <p className="text-iark-red font-medium text-xs mb-2 line-clamp-2 min-h-[2.5em]">{member.position}</p>
                  {member.angkatan && (
                    <p className="text-[10px] text-gray-400">Angkatan {member.angkatan}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {allMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>Data struktur organisasi sedang diperbarui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
