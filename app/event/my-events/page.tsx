import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Clock3 } from 'lucide-react';

interface Registration {
  id: string;
  status: string;
  registered_at: string;
  event: {
    id: string;
    title: string;
    slug: string;
    date: string;
    location: string;
    event_type: string;
  };
}

async function getUserRegistrations(): Promise<Registration[]> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('event_registrations')
    .select(`
      id,
      status,
      registered_at,
      event:events(id, title, slug, date, location, event_type)
    `)
    .eq('user_id', user.id)
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).filter((reg: any) => reg.event !== null) as Registration[];
}

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/masuk?redirect=/event/my-events');
  }

  const registrations = await getUserRegistrations();

  const now = new Date();
  const upcomingEvents = registrations.filter(
    reg => new Date(reg.event.date) >= now && reg.status !== 'cancelled'
  );
  const pastEvents = registrations.filter(
    reg => new Date(reg.event.date) < now || reg.status === 'cancelled'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Terkonfirmasi
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full">
            <XCircle className="w-3 h-3" />
            Dibatalkan
          </span>
        );
      case 'attended':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Hadir
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            <Clock3 className="w-3 h-3" />
            Terdaftar
          </span>
        );
    }
  };

  const EventCard = ({ registration }: { registration: Registration }) => {
    const eventDate = new Date(registration.event.date);
    const isPast = eventDate < now;

    return (
      <Link href={`/event/${registration.event.slug}`}>
        <div className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${isPast ? 'opacity-60' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {registration.event.title}
            </h3>
            {getStatusBadge(registration.status)}
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-iark-red" />
              <span>
                {eventDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-iark-red" />
              <span>
                {eventDate.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} WIB
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-iark-red" />
              <span className="truncate max-w-[150px]">{registration.event.location}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Saya</h1>
        <p className="text-gray-600 mb-8">Daftar event yang telah Anda daftarkan</p>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Event Terdaftar
            </h2>
            <p className="text-gray-600 mb-6">
              Anda belum mendaftar ke event apapun.
            </p>
            <Link
              href="/event"
              className="inline-flex items-center gap-2 bg-iark-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Jelajahi Event
            </Link>
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Event Mendatang ({upcomingEvents.length})
                </h2>
                <div className="space-y-3">
                  {upcomingEvents.map((reg) => (
                    <EventCard key={reg.id} registration={reg} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  Riwayat ({pastEvents.length})
                </h2>
                <div className="space-y-3">
                  {pastEvents.map((reg) => (
                    <EventCard key={reg.id} registration={reg} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
