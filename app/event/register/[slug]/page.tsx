import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { RegistrationForm } from '@/components/features/event';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';

interface EventForRegistration {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  registration_enabled: boolean;
  max_participants: number | null;
  registration_deadline: string | null;
  price: number;
  registration_count: number;
}

async function getEventForRegistration(slug: string): Promise<EventForRegistration | null> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('events')
    .select(`
      id,
      title,
      slug,
      date,
      location,
      registration_enabled,
      max_participants,
      registration_deadline,
      price,
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
    date: data.date,
    location: data.location,
    registration_enabled: data.registration_enabled,
    max_participants: data.max_participants,
    registration_deadline: data.registration_deadline,
    price: data.price ?? 0,
    registration_count: data.event_registrations?.[0]?.count || 0,
  };
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('name, phone, angkatan, regional, asrama')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || '',
    name: profile?.name || user.user_metadata?.full_name || '',
    phone: profile?.phone || '',
    angkatan: profile?.angkatan || null,
    regional: profile?.regional || '',
    asrama: profile?.asrama || '',
  };
}

export default async function EventRegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [event, user] = await Promise.all([
    getEventForRegistration(slug),
    getCurrentUser(),
  ]);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);
  const now = new Date();
  const isPast = eventDate < now;
  const isFull = event.max_participants !== null && event.registration_count >= event.max_participants;
  const isDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) < now;

  // Can't register if event is past, full, or deadline passed
  if (isPast || isFull || isDeadlinePassed || !event.registration_enabled) {
    redirect(`/event/${slug}`);
  }

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href={`/${slug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-iark-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Event
        </Link>

        {/* Event Summary Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-iark-red" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-iark-red" />
              <span>{formattedTime} WIB</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-iark-red" />
              <span>{event.location}</span>
            </div>
          </div>

          {event.price > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">Biaya Pendaftaran</p>
              <p className="text-xl font-bold text-iark-red">
                Rp {event.price.toLocaleString('id-ID')}
              </p>
            </div>
          )}
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Form Pendaftaran</h2>

          {user ? (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                ✓ Anda login sebagai <strong>{user.email}</strong>
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                Anda mendaftar sebagai tamu. <Link href="/masuk" className="font-semibold underline">Login</Link> untuk menyimpan riwayat pendaftaran.
              </p>
            </div>
          )}

          <RegistrationForm
            eventId={event.id}
            eventSlug={event.slug}
            eventTitle={event.title}
            eventDate={formattedDate}
            eventLocation={event.location}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}
