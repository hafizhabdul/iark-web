'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Event } from '@/components/features/dashboard/EventCard';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2, Bookmark, Info, CheckCircle } from 'lucide-react';

// Mock events data (same as events page)
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

// Extended event details (in real app, this would come from API)
const extendedEventDetails: { [key: string]: any } = {
  '1': {
    fullDescription: 'Workshop ini dirancang khusus untuk para pemimpin muda yang ingin menciptakan perubahan positif di komunitas mereka. Melalui sesi interaktif, studi kasus, dan diskusi kelompok, peserta akan mempelajari berbagai strategi kepemimpinan yang efektif dan bagaimana menerapkannya dalam konteks sosial.',
    agenda: [
      { time: '09:00 - 09:30', activity: 'Registrasi & Welcome Coffee' },
      { time: '09:30 - 11:00', activity: 'Sesi 1: Foundations of Social Leadership' },
      { time: '11:00 - 11:15', activity: 'Coffee Break' },
      { time: '11:15 - 13:00', activity: 'Sesi 2: Case Study Analysis' },
      { time: '13:00 - 14:00', activity: 'Lunch Break' },
      { time: '14:00 - 15:30', activity: 'Sesi 3: Workshop & Group Discussion' },
      { time: '15:30 - 16:00', activity: 'Q&A dan Closing' },
    ],
    speakers: [
      { name: 'Dr. Sarah Wijaya', role: 'Social Innovation Expert', avatar: 'https://ui-avatars.com/api/?name=Sarah+Wijaya&background=E21C24&color=fff' },
      { name: 'Ahmad Fauzi', role: 'Community Leader', avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=1E40AF&color=fff' },
    ],
    requirements: [
      'Laptop untuk workshop session',
      'Komitmen hadir full day',
      'Pengalaman di organisasi/komunitas (diutamakan)',
    ],
    benefits: [
      'Sertifikat partisipasi',
      'Modul workshop digital',
      'Akses ke komunitas alumni',
      'Lunch & coffee break',
      'Networking opportunity',
    ],
  },
  '2': {
    fullDescription: 'Diskusi mendalam tentang bagaimana teknologi AI dan machine learning dapat digunakan untuk menyelesaikan berbagai masalah sosial di Indonesia. Belajar dari praktisi yang telah mengimplementasikan solusi tech for good di lapangan.',
    agenda: [
      { time: '19:00 - 19:15', activity: 'Opening & Introduction' },
      { time: '19:15 - 19:45', activity: 'Keynote: AI for Social Impact' },
      { time: '19:45 - 20:30', activity: 'Panel Discussion & Case Studies' },
      { time: '20:30 - 21:00', activity: 'Q&A Session' },
    ],
    speakers: [
      { name: 'Budi Santoso', role: 'Senior Software Engineer, Tech for Good Indonesia', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=E21C24&color=fff' },
      { name: 'Dr. Lisa Tanjung', role: 'AI Researcher', avatar: 'https://ui-avatars.com/api/?name=Lisa+Tanjung&background=059669&color=fff' },
    ],
    requirements: [
      'Koneksi internet stabil',
      'Zoom installed di device',
      'Basic understanding of AI (optional)',
    ],
    benefits: [
      'E-certificate',
      'Recording session',
      'Slide deck presentation',
      'Access to AI resources library',
    ],
  },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // Find event by ID
  const event = mockEvents.find((e) => e.id === eventId);
  const details = extendedEventDetails[eventId];

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
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
  const isAlmostFull = spotsLeft <= 10;

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
                    <p className="font-semibold text-gray-900">{event.time}</p>
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
                      {event.registered} / {event.capacity} terdaftar
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Tentang Event</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>
                {details?.fullDescription && (
                  <p className="text-gray-700 leading-relaxed">{details.fullDescription}</p>
                )}
              </div>
            </motion.div>

            {/* Agenda */}
            {details?.agenda && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Agenda</h2>
                <div className="space-y-3">
                  {details.agenda.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 font-semibold text-iark-red text-sm">
                        {item.time}
                      </div>
                      <div className="flex-1 text-gray-700 text-sm">
                        {item.activity}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Speakers */}
            {details?.speakers && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pembicara</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {details.speakers.map((speaker: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={speaker.avatar} alt={speaker.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{speaker.name}</h3>
                        <p className="text-sm text-gray-600">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Requirements & Benefits */}
            <div className="grid md:grid-cols-2 gap-6">
              {details?.requirements && (
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Persyaratan</h2>
                  <ul className="space-y-2">
                    {details.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                        <CheckCircle size={18} className="text-iark-red flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {details?.benefits && (
                <motion.div
                  className="bg-gradient-to-br from-iark-red/5 to-iark-blue/5 rounded-2xl shadow-lg p-8 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Yang Anda Dapatkan</h2>
                  <ul className="space-y-2">
                    {details.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                        <CheckCircle size={18} className="text-iark-red flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
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
                  <p className="text-sm text-gray-600">
                    {spotsLeft} slot tersisa
                    {isAlmostFull && (
                      <span className="text-iark-red font-semibold"> • Segera habis!</span>
                    )}
                  </p>
                </div>

                {/* Progress Bar */}
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

                <motion.button
                  className="w-full py-4 bg-iark-red text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Daftar Sekarang
                </motion.button>

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
