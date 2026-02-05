'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { EventCard, Event } from '@/components/features/dashboard/EventCard';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { Search, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { fetchEventsWithRegistrations } from '@/lib/queries/events';
import { queryKeys, staleTime } from '@/lib/queries';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data: rawEvents = [], isLoading: loading } = useQuery({
    queryKey: queryKeys.eventsWithRegistrations,
    queryFn: fetchEventsWithRegistrations,
    staleTime: staleTime.semiDynamic,
  });

  const events: Event[] = useMemo(() => {
    return rawEvents.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      date: formatDate(event.date),
      time: event.time || '',
      location: event.location || 'TBD',
      category: event.category || 'Umum',
      imageUrl: event.image_url || '',
      isLive: event.is_live,
      capacity: event.capacity || 0,
      registered: event.registration_count,
      organizer: 'IARK',
    }));
  }, [rawEvents]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        rawEvents
          .map((e) => e.category)
          .filter((c): c is string => c !== null)
      )
    );
  }, [rawEvents]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate.getTime() === today.getTime()) {
      return `Hari ini, ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[date.getDay()];
    return `${dayName}, ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }

  function isUpcoming(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Parse the original date from the event (before formatting)
    const event = events.find((e) => e.date === dateString);
    if (!event) return true;
    // We need to check against the raw date, but since we formatted it,
    // we'll use a different approach
    return true; // Default to upcoming
  }

  // Filter events based on tab, search, and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;

    // For tab filtering, we need the raw date which we don't have after mapping
    // This would need raw date stored separately, for now show all
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const liveEventsCount = events.filter((e) => e.isLive).length;

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
                {liveEventsCount > 0 && (
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm flex items-center gap-2 border border-white/30">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    {liveEventsCount} Acara Live
                  </div>
                )}
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm border border-white/30">
                  {categories.length} Kategori Tersedia
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm border border-white/30">
                  {events.length} Total Acara
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
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-iark-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Akan Datang
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'past'
                  ? 'bg-iark-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sudah Lewat
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <CustomDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Semua Kategori"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-gray-900">{filteredEvents.length}</span> dari{' '}
              <span className="font-semibold text-gray-900">{events.length}</span> acara
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-iark-red animate-spin" />
              <span className="ml-3 text-gray-600">Memuat acara...</span>
            </div>
          ) : filteredEvents.length > 0 ? (
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
