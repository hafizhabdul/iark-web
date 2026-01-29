export interface BidangPreview {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string; // Lucide icon name
  color: 'red' | 'blue' | 'yellow';
}

export const bidangData: BidangPreview[] = [
  {
    id: '1',
    name: 'Bidang IELTS',
    shortName: 'IELTS',
    description: 'Subsidi IELTS dan Pendampingan Beasiswa',
    icon: 'GraduationCap',
    color: 'red',
  },
  {
    id: '2',
    name: 'Bidang Keputrian',
    shortName: 'Keputrian',
    description: 'Keputrian dan Kekeluargaan',
    icon: 'Heart',
    color: 'red',
  },
  {
    id: '3',
    name: 'Bidang Ngaji',
    shortName: 'Ngaji',
    description: 'Ngaji Sebentar dan Asah Nurani',
    icon: 'BookOpen',
    color: 'red',
  },
  {
    id: '4',
    name: 'Bidang Bisnis',
    shortName: 'Bisnis',
    description: 'Kolaborasi Bisnis Alumni',
    icon: 'Briefcase',
    color: 'blue',
  },
  {
    id: '5',
    name: 'Bidang Politik',
    shortName: 'Politik',
    description: 'Pendampingan dan Kaderisasi Politik',
    icon: 'Landmark',
    color: 'blue',
  },
  {
    id: '6',
    name: 'Bidang Distrik Barat',
    shortName: 'Distrik Barat',
    description: 'Koordinasi Alumni Wilayah Barat',
    icon: 'MapPin',
    color: 'blue',
  },
  {
    id: '7',
    name: 'Bidang Distrik Timur',
    shortName: 'Distrik Timur',
    description: 'Koordinasi Alumni Wilayah Timur',
    icon: 'MapPin',
    color: 'yellow',
  },
  {
    id: '8',
    name: 'Bidang Karir',
    shortName: 'Karir',
    description: 'Persiapan dan Pengembangan Karir Alumni',
    icon: 'TrendingUp',
    color: 'yellow',
  },
  {
    id: '9',
    name: 'Bidang Kajian',
    shortName: 'Kajian',
    description: 'Sharing Alumni dan Kolaborasi Kajian Strategis',
    icon: 'Lightbulb',
    color: 'yellow',
  },
  {
    id: '10',
    name: 'Bidang HFVN RK',
    shortName: 'HFVN RK',
    description: 'Program HFVN Rumah Kepemimpinan',
    icon: 'Users',
    color: 'red',
  },
  {
    id: '11',
    name: 'Bidang IT Center',
    shortName: 'IT Center',
    description: 'Teknologi Informasi dan Digital',
    icon: 'Monitor',
    color: 'blue',
  },
  {
    id: '12',
    name: 'Bidang Media',
    shortName: 'Media',
    description: 'Media dan Komunikasi',
    icon: 'Megaphone',
    color: 'yellow',
  },
];
