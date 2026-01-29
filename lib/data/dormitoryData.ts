export interface Dormitory {
  id: string;
  name: string;
  city: string;
  province: string;
  imageUrl: string;
  totalRooms: number;
  occupiedRooms: number;
  description: string;
}

export const dormitoryData: Dormitory[] = [
  {
    id: '1',
    name: 'Asrama RK Jakarta',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    totalRooms: 50,
    occupiedRooms: 45,
    description: 'Asrama pusat dengan fasilitas lengkap di jantung ibukota.',
  },
  {
    id: '2',
    name: 'Asrama RK Bandung',
    city: 'Bandung',
    province: 'Jawa Barat',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    totalRooms: 40,
    occupiedRooms: 38,
    description: 'Asrama dengan suasana sejuk di kota kembang.',
  },
  {
    id: '3',
    name: 'Asrama RK Yogyakarta',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    totalRooms: 35,
    occupiedRooms: 32,
    description: 'Asrama di kota pelajar dengan nuansa budaya Jawa.',
  },
  {
    id: '4',
    name: 'Asrama RK Surabaya',
    city: 'Surabaya',
    province: 'Jawa Timur',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    totalRooms: 45,
    occupiedRooms: 40,
    description: 'Asrama terbesar di Jawa Timur dengan akses strategis.',
  },
  {
    id: '5',
    name: 'Asrama RK Makassar',
    city: 'Makassar',
    province: 'Sulawesi Selatan',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    totalRooms: 30,
    occupiedRooms: 28,
    description: 'Asrama di gerbang Indonesia Timur.',
  },
  {
    id: '6',
    name: 'Asrama RK Medan',
    city: 'Medan',
    province: 'Sumatera Utara',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    totalRooms: 35,
    occupiedRooms: 30,
    description: 'Asrama strategis di pusat kota Medan.',
  },
];
