export interface BatchLeader {
  name: string;
  photo: string;
  quote: string;
  currentRole: string;
}

export interface BatchData {
  angkatan: number;
  year: string;
  funFact: string;
  leader: BatchLeader;
}

export const batchData: BatchData[] = [
  {
    angkatan: 1,
    year: '2010',
    funFact: 'Angkatan pertama dengan 25 anggota yang menjadi pionir gerakan kepemimpinan nasional.',
    leader: {
      name: 'Hendra Wijaya',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
      quote: 'Menjadi yang pertama adalah tanggung jawab besar untuk membuka jalan bagi generasi berikutnya.',
      currentRole: 'CEO PT Nusantara Tech',
    },
  },
  {
    angkatan: 2,
    year: '2011',
    funFact: 'Dikenal sebagai "Angkatan Harmoni" karena kekompakannya yang luar biasa hingga hari ini.',
    leader: {
      name: 'Nurul Hidayah',
      photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
      quote: 'Kebersamaan adalah kunci - kami bukan hanya rekan, tapi keluarga.',
      currentRole: 'Direktur Yayasan Pendidikan Cahaya',
    },
  },
  {
    angkatan: 3,
    year: '2012',
    funFact: 'Mencetak pengusaha sosial terbanyak dengan 12 anggota yang mendirikan social enterprise.',
    leader: {
      name: 'Agung Setiawan',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      quote: 'Kepemimpinan sejati adalah tentang menciptakan dampak positif bagi sesama.',
      currentRole: 'Founder Social Impact Lab',
    },
  },
  {
    angkatan: 4,
    year: '2013',
    funFact: 'Memiliki tradisi "Kumpul Bulanan" yang masih rutin dilakukan selama 10+ tahun.',
    leader: {
      name: 'Maya Sari',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      quote: 'Konsistensi dalam silaturahmi adalah bentuk komitmen kami terhadap nilai RK.',
      currentRole: 'Country Manager Fintech Global',
    },
  },
  {
    angkatan: 5,
    year: '2014',
    funFact: 'Angkatan dengan alumni terbanyak di sektor pemerintahan (8 ASN dan 2 diplomat).',
    leader: {
      name: 'Dimas Ardianto',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      quote: 'Melayani negara adalah panggilan, bukan sekadar pekerjaan.',
      currentRole: 'Kepala Dinas Pemuda & Olahraga',
    },
  },
  {
    angkatan: 6,
    year: '2015',
    funFact: 'Terkenal dengan program mentorship yang telah membimbing 200+ mahasiswa.',
    leader: {
      name: 'Fitria Rahmawati',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      quote: 'Berbagi ilmu adalah investasi terbaik untuk masa depan bangsa.',
      currentRole: 'Head of People Development, Unicorn Startup',
    },
  },
  {
    angkatan: 7,
    year: '2016',
    funFact: 'Menjadi angkatan paling aktif di media sosial dengan konten kepemimpinan viral.',
    leader: {
      name: 'Farhan Ramadhan',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      quote: 'Di era digital, pengaruh positif bisa menjangkau lebih banyak orang.',
      currentRole: 'Content Creator & Public Speaker',
    },
  },
  {
    angkatan: 8,
    year: '2017',
    funFact: 'Memiliki grup musik "RK8 Band" yang sering tampil di acara IARK.',
    leader: {
      name: 'Aisyah Putri',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      quote: 'Kreativitas adalah cara kami mengekspresikan nilai kepemimpinan.',
      currentRole: 'Produser Musik & Founder Record Label',
    },
  },
  {
    angkatan: 9,
    year: '2018',
    funFact: 'Pelopor inisiatif "Green Leadership" dengan 5 proyek lingkungan berkelanjutan.',
    leader: {
      name: 'Bayu Pratama',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      quote: 'Kepemimpinan harus peduli pada keberlanjutan bumi kita.',
      currentRole: 'Environmental Consultant',
    },
  },
  {
    angkatan: 10,
    year: '2019',
    funFact: 'Angkatan dengan jumlah anggota terbanyak (45 orang) dari berbagai provinsi.',
    leader: {
      name: 'Citra Dewi',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      quote: 'Keberagaman adalah kekuatan, bukan hambatan untuk kolaborasi.',
      currentRole: 'Regional Manager Multinational Corp',
    },
  },
  {
    angkatan: 11,
    year: '2020',
    funFact: 'Angkatan pandemi yang sukses membangun jaringan virtual paling solid.',
    leader: {
      name: 'Evan Kurniawan',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      quote: 'Pandemi mengajarkan kami bahwa adaptasi adalah kunci survival.',
      currentRole: 'Tech Entrepreneur & Investor',
    },
  },
  {
    angkatan: 12,
    year: '2021',
    funFact: 'Memulai tradisi "12 Days of Leadership" - berbagi insight harian selama 12 hari.',
    leader: {
      name: 'Gita Pramesti',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      quote: 'Konsistensi dalam berbagi adalah cara kami meneruskan api kepemimpinan.',
      currentRole: 'Management Consultant',
    },
  },
];
