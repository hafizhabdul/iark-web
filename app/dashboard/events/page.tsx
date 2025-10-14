'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EventCard, Event } from '@/components/features/dashboard/EventCard';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { Search, Calendar, MapPin, Users } from 'lucide-react';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Workshop Kepemimpinan untuk Perubahan Sosial',
    description: 'Belajar strategi kepemimpinan efektif untuk menciptakan dampak sosial yang berkelanjutan di komunitas Anda. Workshop interaktif dengan studi kasus nyata.',
    date: 'Sabtu, 18 Oktober 2025',
    time: '09:00 - 16:00 WIB',
    location: 'Rumah Kepemimpinan, Jakarta',
    category: 'Kepemimpinan',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    isLive: false,
    capacity: 50,
    registered: 38,
    organizer: 'IARK',
  },
  {
    id: '2',
    title: 'Tech Talk: AI untuk Social Good',
    description: 'Diskusi interaktif tentang implementasi AI dan machine learning untuk menyelesaikan masalah sosial di Indonesia bersama praktisi tech for good.',
    date: 'Hari ini, 14 Oktober 2025',
    time: '19:00 - 21:00 WIB',
    location: 'Online via Zoom',
    category: 'Teknologi',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    isLive: true,
    capacity: 100,
    registered: 87,
    organizer: 'IARK Tech Community',
  },
  {
    id: '3',
    title: 'Networking Night: Alumni Gathering Bandung',
    description: 'Malam pertemuan alumni IARK di Bandung. Berbagi cerita, membangun koneksi, dan eksplorasi kolaborasi untuk dampak sosial yang lebih besar.',
    date: 'Jumat, 24 Oktober 2025',
    time: '18:00 - 21:00 WIB',
    location: 'The Stone Cafe, Bandung',
    category: 'Networking',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    isLive: false,
    capacity: 40,
    registered: 28,
    organizer: 'IARK Bandung Chapter',
  },
  {
    id: '4',
    title: 'Bootcamp Social Entrepreneurship',
    description: 'Program intensif 3 hari untuk mengembangkan ide bisnis sosial Anda. Dari ideasi hingga business model canvas dan pitching.',
    date: 'Senin - Rabu, 27-29 Oktober 2025',
    time: '08:00 - 17:00 WIB',
    location: 'Impact Hub Jakarta',
    category: 'Kewirausahaan',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    isLive: false,
    capacity: 30,
    registered: 22,
    organizer: 'IARK',
  },
  {
    id: '5',
    title: 'Webinar: Pendidikan Inklusif di Era Digital',
    description: 'Membahas strategi dan best practices dalam menciptakan pendidikan yang inklusif dan accessible untuk semua kalangan di era digital.',
    date: 'Kamis, 30 Oktober 2025',
    time: '14:00 - 16:00 WIB',
    location: 'Online via Zoom',
    category: 'Pendidikan',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    isLive: false,
    capacity: 150,
    registered: 92,
    organizer: 'IARK Education Forum',
  },
  {
    id: '6',
    title: 'Aksi Bersih Pantai & Edukasi Lingkungan',
    description: 'Bergabunglah dalam aksi nyata membersihkan pantai sambil belajar tentang isu lingkungan dan solusi berkelanjutan.',
    date: 'Minggu, 2 November 2025',
    time: '06:00 - 12:00 WIB',
    location: 'Pantai Ancol, Jakarta',
    category: 'Lingkungan',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80',
    isLive: false,
    capacity: 60,
    registered: 45,
    organizer: 'IARK Environment Initiative',
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Filter events
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    const matchesDate = !selectedDate || filterByDate(event, selectedDate);
    return matchesSearch && matchesCategory && matchesDate;
  });

  function filterByDate(event: Event, dateFilter: string): boolean {
    // Simple mock filtering logic
    if (dateFilter === 'today') return event.date.includes('Hari ini');
    if (dateFilter === 'week') return true; // Mock: show all for now
    if (dateFilter === 'month') return true; // Mock: show all for now
    return true;
  }

  // Get unique categories
  const categories = Array.from(new Set(mockEvents.map((e) => e.category)));
  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const dateOptions = [
    { value: '', label: 'Semua Waktu' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          className="relative h-96 bg-gradient-to-br from-iark-red via-red-600 to-iark-blue overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-xl" />
            <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full blur-xl" />
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white rounded-full blur-xl" />
          </div>

          {/* Floating Animated Icons */}
          <motion.div
            className="absolute top-20 left-1/4 opacity-20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Calendar size={40} className="text-white" />
          </motion.div>
          <motion.div
            className="absolute top-32 right-1/4 opacity-20"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MapPin size={36} className="text-white" />
          </motion.div>
          <motion.div
            className="absolute bottom-24 right-1/3 opacity-20"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Users size={38} className="text-white" />
          </motion.div>

          {/* Hero Content */}
          <div className="relative h-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Temukan Acara IARK
              </h1>
              <p className="text-xl text-white mb-6 max-w-2xl mx-auto drop-shadow-md">
                Jelajahi workshop, diskusi, dan gathering yang dirancang untuk mengembangkan
                kepemimpinan dan dampak sosial Anda
              </p>

              {/* Quick Stats Badges */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm flex items-center gap-2 border border-white/30">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  2 Acara Hari Ini
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm border border-white/30">
                  6 Kategori Tersedia
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm border border-white/30">
                  {mockEvents.length} Total Acara
                </div>
              </motion.div>

              {/* Search Bar in Hero */}
              <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari acara berdasarkan judul, deskripsi, atau lokasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-2xl focus:outline-none focus:ring-2 focus:ring-white text-gray-900 placeholder:text-gray-500 bg-white"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg
              className="relative block w-full h-12"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-white"
              ></path>
            </svg>
          </div>
        </motion.div>

        {/* Filters Section */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <CustomDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Semua Kategori"
              />
            </div>
            <div className="flex-1">
              <CustomDropdown
                options={dateOptions}
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Semua Waktu"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-gray-900">{filteredEvents.length}</span> dari{' '}
              <span className="font-semibold text-gray-900">{mockEvents.length}</span> acara
            </p>
          </div>

          {/* Events List */}
          {filteredEvents.length > 0 ? (
            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <EventCard
                    event={event}
                    onClick={() => {
                      window.location.href = `/dashboard/events/${event.id}`;
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada acara ditemukan</h3>
              <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
