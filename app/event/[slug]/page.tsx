import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CountdownTimer } from '@/components/features/event';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  Video, 
  ArrowLeft,
  Share2,
  CheckCircle
} from 'lucide-react';

export const revalidate = 60;

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
  is_live: boolean;
  registration_enabled: boolean;
  max_participants: number | null;
  registration_deadline: string | null;
  event_type: 'online' | 'offline' | 'hybrid';
  meeting_link: string | null;
  contact_person: string | null;
  contact_whatsapp: string | null;
  price: number;
  registration_count: number;
}

async function getEvent(slug: string): Promise<EventDetail | null> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('events')
    .select(`
      *,
      event_registrations(count)
    `)
    .eq('slug', slug)
    .eq('is_live', true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description || '',
    date: data.date,
    location: data.location || '',
    image_url: data.image_url,
    is_live: data.is_live,
    registration_enabled: data.registration_enabled ?? false,
    max_participants: data.max_participants,
    registration_deadline: data.registration_deadline,
    event_type: data.event_type || 'offline',
    meeting_link: data.meeting_link,
    contact_person: data.contact_person,
    contact_whatsapp: data.contact_whatsapp,
    price: data.price ?? 0,
    registration_count: data.event_registrations?.[0]?.count || 0,
  };
}

export default async function EventDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);
  const now = new Date();
  const isPast = eventDate < now;
  const isFull = event.max_participants !== null && event.registration_count >= event.max_participants;
  const isDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) < now;
  const canRegister = !isPast && !isFull && !isDeadlinePassed && event.registration_enabled;

  const formattedDate = eventDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = eventDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-iark-red to-iark-blue">
        {event.image_url && (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link 
            href="/event"
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>

        {/* Countdown */}
        {!isPast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white">
            <CountdownTimer targetDate={event.date} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg -mt-16 relative z-10 p-6 md:p-8">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              event.event_type === 'online' 
                ? 'bg-blue-100 text-blue-700' 
                : event.event_type === 'hybrid'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {event.event_type === 'online' ? '🌐 Online' : event.event_type === 'hybrid' ? '🔄 Hybrid' : '📍 Offline'}
            </span>
            
            {isPast && (
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                Selesai
              </span>
            )}
            {isFull && !isPast && (
              <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                Kuota Penuh
              </span>
            )}
            {event.price === 0 && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                Gratis
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {event.title}
          </h1>

          {/* Event Info Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-iark-red mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{formattedDate}</p>
                <p className="text-sm text-gray-600">{formattedTime} WIB</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-iark-red mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{event.location}</p>
                {event.event_type !== 'offline' && event.meeting_link && (
                  <p className="text-sm text-gray-600">Link akan dikirim via email</p>
                )}
              </div>
            </div>

            {event.max_participants && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-iark-red mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {event.registration_count} / {event.max_participants} Peserta
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.max_participants - event.registration_count} slot tersisa
                  </p>
                </div>
              </div>
            )}

            {event.contact_person && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-iark-red mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{event.contact_person}</p>
                  {event.contact_whatsapp && (
                    <a 
                      href={`https://wa.me/${event.contact_whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-iark-red hover:underline"
                    >
                      Hubungi via WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Deskripsi Event</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          {/* Registration CTA */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {event.price > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600">Biaya Pendaftaran</p>
                    <p className="text-2xl font-bold text-iark-red">
                      Rp {event.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">Gratis</p>
                )}
              </div>

              {canRegister ? (
                <Link
                  href={`/event/register/${event.slug}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-iark-red text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Daftar Sekarang
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-bold text-lg cursor-not-allowed"
                >
                  {isPast ? 'Event Telah Selesai' : isFull ? 'Kuota Penuh' : 'Pendaftaran Ditutup'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
