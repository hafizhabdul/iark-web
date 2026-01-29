export interface Activity {
  id: string;
  category: string;
  author: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  imageUrl: string;
  link: string;
}

export const activitiesData: Activity[] = [
  {
    id: '1',
    category: 'Event',
    author: 'Tim IARK',
    title: 'Musyawarah Nasional IARK 2024: Menguatkan Kolaborasi Alumni',
    subtitle: 'Lebih dari 500 alumni berkumpul di Jakarta untuk merumuskan arah strategis organisasi dan memperkuat jaringan lintas angkatan.',
    date: '15 Jan 2024',
    readTime: '5 min read',
    likes: 234,
    comments: 45,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    link: '/cerita/munas-2024',
  },
  {
    id: '2',
    category: 'Program',
    author: 'Bidang Pendidikan',
    title: 'Leadership Workshop Series: Membangun Pemimpin Digital',
    subtitle: 'Program mentorship intensif yang menghubungkan alumni senior dengan mahasiswa RK aktif untuk berbagi pengalaman dan ilmu.',
    date: '10 Jan 2024',
    readTime: '4 min read',
    likes: 189,
    comments: 32,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    link: '/cerita/workshop-leadership',
  },
  {
    id: '3',
    category: 'Sosial',
    author: 'Bidang Sosial',
    title: 'IARK Charity Run 2024: Berlari untuk Pendidikan',
    subtitle: 'Kegiatan lari amal yang berhasil mengumpulkan dana untuk beasiswa mahasiswa kurang mampu dan renovasi fasilitas asrama.',
    date: '5 Jan 2024',
    readTime: '3 min read',
    likes: 312,
    comments: 67,
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
    link: '/cerita/charity-run-2024',
  },
];
