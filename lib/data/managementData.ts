export interface ManagementMember {
  id: string;
  name: string;
  position: string;
  angkatan?: string;
  photo: string;
  role: 'pengurus_inti' | 'ketua_angkatan';
  socials: {
    instagram?: string;
    linkedin?: string;
  };
}

export const managementData: ManagementMember[] = [
  // Pengurus Inti
  {
    id: '1',
    name: 'Ahmad Fauzan',
    position: 'Ketua Umum',
    angkatan: 'Angkatan 5',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    role: 'pengurus_inti',
    socials: {
      instagram: 'https://instagram.com/ahmadfauzan',
      linkedin: 'https://linkedin.com/in/ahmadfauzan',
    },
  },
  {
    id: '2',
    name: 'Siti Rahma',
    position: 'Wakil Ketua Umum',
    angkatan: 'Angkatan 7',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    role: 'pengurus_inti',
    socials: {
      instagram: 'https://instagram.com/sitirahma',
      linkedin: 'https://linkedin.com/in/sitirahma',
    },
  },
  {
    id: '3',
    name: 'Budi Santoso',
    position: 'Sekretaris Jenderal',
    angkatan: 'Angkatan 8',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    role: 'pengurus_inti',
    socials: {
      instagram: 'https://instagram.com/budisantoso',
      linkedin: 'https://linkedin.com/in/budisantoso',
    },
  },
  {
    id: '4',
    name: 'Dewi Kusuma',
    position: 'Bendahara Umum',
    angkatan: 'Angkatan 6',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    role: 'pengurus_inti',
    socials: {
      instagram: 'https://instagram.com/dewikusuma',
      linkedin: 'https://linkedin.com/in/dewikusuma',
    },
  },
  {
    id: '5',
    name: 'Rizky Pratama',
    position: 'Ketua Bidang Program',
    angkatan: 'Angkatan 9',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    role: 'pengurus_inti',
    socials: {
      instagram: 'https://instagram.com/rizkypratama',
      linkedin: 'https://linkedin.com/in/rizkypratama',
    },
  },
  {
    id: '6',
    name: 'Putri Handayani',
    position: 'Ketua Bidang Keanggotaan',
    angkatan: 'Angkatan 10',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    role: 'pengurus_inti',
    socials: {
      instagram: 'https://instagram.com/putrihandayani',
      linkedin: 'https://linkedin.com/in/putrihandayani',
    },
  },
  // Ketua Angkatan
  {
    id: '7',
    name: 'Hendra Wijaya',
    position: 'Ketua Angkatan 1',
    angkatan: 'Angkatan 1',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    role: 'ketua_angkatan',
    socials: {
      instagram: 'https://instagram.com/hendrawijaya',
      linkedin: 'https://linkedin.com/in/hendrawijaya',
    },
  },
  {
    id: '8',
    name: 'Nurul Hidayah',
    position: 'Ketua Angkatan 2',
    angkatan: 'Angkatan 2',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    role: 'ketua_angkatan',
    socials: {
      instagram: 'https://instagram.com/nurulhidayah',
      linkedin: 'https://linkedin.com/in/nurulhidayah',
    },
  },
  {
    id: '9',
    name: 'Agung Setiawan',
    position: 'Ketua Angkatan 3',
    angkatan: 'Angkatan 3',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    role: 'ketua_angkatan',
    socials: {
      instagram: 'https://instagram.com/agungsetiawan',
      linkedin: 'https://linkedin.com/in/agungsetiawan',
    },
  },
  {
    id: '10',
    name: 'Maya Sari',
    position: 'Ketua Angkatan 4',
    angkatan: 'Angkatan 4',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    role: 'ketua_angkatan',
    socials: {
      instagram: 'https://instagram.com/mayasari',
      linkedin: 'https://linkedin.com/in/mayasari',
    },
  },
  {
    id: '11',
    name: 'Dimas Ardianto',
    position: 'Ketua Angkatan 5',
    angkatan: 'Angkatan 5',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    role: 'ketua_angkatan',
    socials: {
      instagram: 'https://instagram.com/dimasardianto',
      linkedin: 'https://linkedin.com/in/dimasardianto',
    },
  },
  {
    id: '12',
    name: 'Fitria Rahmawati',
    position: 'Ketua Angkatan 6',
    angkatan: 'Angkatan 6',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    role: 'ketua_angkatan',
    socials: {
      instagram: 'https://instagram.com/fitriarahmawati',
      linkedin: 'https://linkedin.com/in/fitriarahmawati',
    },
  },
];
