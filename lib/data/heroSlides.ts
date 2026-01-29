export interface EventSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
}

export const heroSlides: EventSlide[] = [
  {
    id: '1',
    title: 'Musyawarah Nasional IARK 2024',
    subtitle: 'Menguatkan Kolaborasi Alumni untuk Indonesia',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  },
  {
    id: '2',
    title: 'Leadership Summit 2024',
    subtitle: 'Membangun Pemimpin Berintegritas',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80',
  },
  {
    id: '3',
    title: 'IARK Charity Run',
    subtitle: 'Berlari untuk Masa Depan Pendidikan',
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80',
  },
  {
    id: '4',
    title: 'Temu Alumni Nasional',
    subtitle: 'Silaturahmi dan Networking Lintas Angkatan',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
  },
  {
    id: '5',
    title: 'Workshop Entrepreneurship',
    subtitle: 'Membangun Bisnis dengan Nilai-nilai Kepemimpinan',
    imageUrl: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=1200&q=80',
  },
];
