'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Event } from '@/components/features/dashboard/EventCard';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2, Bookmark, Info, Loader2 } from 'lucide-react';
import { fetchEventById } from '@/lib/queries/events';
import { queryKeys, staleTime } from '@/lib/queries';
import DOMPurify from 'isomorphic-dompurify';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { data: eventData, isLoading } = useQuery({
    queryKey: queryKeys.eventDetail(eventId),
    queryFn: () => fetchEventById(eventId),
    staleTime: staleTime.semiDynamic,
  });

  const event: Event | null = eventData
    ? {
        id: eventData.id,
        title: eventData.title,
        description: eventData.description || '',
        date: formatDate(eventData.date),
        time: eventData.time || '',
        location: eventData.location || 'TBD',
        category: eventData.category || 'Umum',
        imageUrl: eventData.image_url || '',
        isLive: eventData.is_live,
        capacity: eventData.capacity || 0,
        registered: eventData.registration_count,
        organizer: 'IARK',
      }
    : null;

  const content = eventData?.content ?? null;
  const registrationUrl = eventData?.registration_url ?? null;

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-iark-red animate-spin" />
        <span className="ml-3 text-gray-600">Memuat event...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600 mb-4">The event you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/dashboard/events')}
            className="text-iark-red hover:underline font-semibold"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const spotsLeft = event.capacity - event.registered;
  const isAlmostFull = spotsLeft <= 10 && spotsLeft > 0;

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/dashboard/events')}
          className="flex items-center gap-2 text-gray-600 hover:text-iark-red mb-6 font-semibold transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft size={20} />
          Kembali ke Events
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-iark-red to-iark-blue flex items-center justify-center">
                  <Calendar size={80} className="text-white" />
                </div>
              )}

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2">
                {event.isLive && (
                  <div className="bg-iark-red text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                )}
                <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {event.category}
                </div>
              </div>

              {/* Action Buttons on Image */}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={20} className="text-gray-700" />
                </motion.button>
                <motion.button
                  className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bookmark size={20} className="text-gray-700" />
                </motion.button>
              </div>
            </motion.div>

            {/* Event Info */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Info size={16} />
                <span>Diselenggarakan oleh <span className="font-semibold text-gray-900">{event.organizer}</span></span>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-iark-red/10 rounded-lg">
                    <Calendar size={20} className="text-iark-red" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal</p>
                    <p className="font-semibold text-gray-900">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-iark-red/10 rounded-lg">
                    <Clock size={20} className="text-iark-red" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Waktu</p>
                    <p className="font-semibold text-gray-900">{event.time || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-iark-red/10 rounded-lg">
                    <MapPin size={20} className="text-iark-red" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lokasi</p>
                    <p className="font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-iark-red/10 rounded-lg">
                    <Users size={20} className="text-iark-red" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kapasitas</p>
                    <p className="font-semibold text-gray-900">
                      {event.capacity > 0 ? `${event.registered} / ${event.capacity} terdaftar` : 'Tidak terbatas'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Tentang Event</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>
                {content && (
                  <div
                    className="text-gray-700 leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-8 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Registration Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">Gratis</span>
                  </div>
                  {event.capacity > 0 && (
                    <p className="text-sm text-gray-600">
                      {spotsLeft} slot tersisa
                      {isAlmostFull && (
                        <span className="text-iark-red font-semibold"> • Segera habis!</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                {event.capacity > 0 && (
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-iark-red h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                <motion.a
                  href={registrationUrl || '#'}
                  target={registrationUrl ? '_blank' : undefined}
                  rel={registrationUrl ? 'noopener noreferrer' : undefined}
                  className="block w-full py-4 bg-iark-red text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Daftar Sekarang
                </motion.a>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Dengan mendaftar, Anda setuju dengan syarat dan ketentuan IARK
                </p>
              </div>

              {/* Share Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Bagikan Event</h3>
                <div className="flex gap-2">
                  <motion.button
                    className="flex-1 p-3 bg-white rounded-lg border border-gray-200 hover:border-iark-red transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 size={20} className="text-gray-700 mx-auto" />
                  </motion.button>
                  <motion.button
                    className="flex-1 p-3 bg-white rounded-lg border border-gray-200 hover:border-iark-red transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 text-gray-700 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </motion.button>
                  <motion.button
                    className="flex-1 p-3 bg-white rounded-lg border border-gray-200 hover:border-iark-red transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 text-gray-700 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
