export const REGIONAL_OPTIONS = [
  { value: 'aceh', label: 'Aceh' },
  { value: 'bali', label: 'Bali' },
  { value: 'banten', label: 'Banten' },
  { value: 'bengkulu', label: 'Bengkulu' },
  { value: 'gorontalo', label: 'Gorontalo' },
  { value: 'jakarta', label: 'DKI Jakarta' },
  { value: 'jambi', label: 'Jambi' },
  { value: 'jawa-barat', label: 'Jawa Barat' },
  { value: 'jawa-tengah', label: 'Jawa Tengah' },
  { value: 'jawa-timur', label: 'Jawa Timur' },
  { value: 'kalimantan-barat', label: 'Kalimantan Barat' },
  { value: 'kalimantan-selatan', label: 'Kalimantan Selatan' },
  { value: 'kalimantan-tengah', label: 'Kalimantan Tengah' },
  { value: 'kalimantan-timur', label: 'Kalimantan Timur' },
  { value: 'kalimantan-utara', label: 'Kalimantan Utara' },
  { value: 'kepulauan-bangka-belitung', label: 'Kepulauan Bangka Belitung' },
  { value: 'kepulauan-riau', label: 'Kepulauan Riau' },
  { value: 'lampung', label: 'Lampung' },
  { value: 'maluku', label: 'Maluku' },
  { value: 'maluku-utara', label: 'Maluku Utara' },
  { value: 'nusa-tenggara-barat', label: 'Nusa Tenggara Barat' },
  { value: 'nusa-tenggara-timur', label: 'Nusa Tenggara Timur' },
  { value: 'papua', label: 'Papua' },
  { value: 'papua-barat', label: 'Papua Barat' },
  { value: 'papua-barat-daya', label: 'Papua Barat Daya' },
  { value: 'papua-pegunungan', label: 'Papua Pegunungan' },
  { value: 'papua-selatan', label: 'Papua Selatan' },
  { value: 'papua-tengah', label: 'Papua Tengah' },
  { value: 'riau', label: 'Riau' },
  { value: 'sulawesi-barat', label: 'Sulawesi Barat' },
  { value: 'sulawesi-selatan', label: 'Sulawesi Selatan' },
  { value: 'sulawesi-tengah', label: 'Sulawesi Tengah' },
  { value: 'sulawesi-tenggara', label: 'Sulawesi Tenggara' },
  { value: 'sulawesi-utara', label: 'Sulawesi Utara' },
  { value: 'sumatera-barat', label: 'Sumatera Barat' },
  { value: 'sumatera-selatan', label: 'Sumatera Selatan' },
  { value: 'sumatera-utara', label: 'Sumatera Utara' },
  { value: 'yogyakarta', label: 'DI Yogyakarta' },
];

export const ANGKATAN_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 2009 },
  (_, i) => {
    const year = 2010 + i;
    return { value: year, label: `Angkatan ${year}` };
  }
);
