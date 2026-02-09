import { createClient } from '@/lib/supabase/server';
import { EventCard } from '@/components/features/event';
import { Calendar, Search } from 'lucide-react';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface EventWithCount {
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
  created_at: string;
  registration_count: number;
}

async function getEvents(): Promise<{ upcoming: EventWithCount[]; past: EventWithCount[] }> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch upcoming events
  const { data: upcoming, error: upcomingError } = await supabase
    .from('events')
    .select(`
      *,
      event_registrations(count)
    `)
    .eq('is_live', true)
    .gte('date', now)
    .order('date', { ascending: true });

  // Fetch past events (limit 6)
  const { data: past, error: pastError } = await supabase
    .from('events')
    .select(`
      *,
      event_registrations(count)
    `)
    .eq('is_live', true)
    .lt('date', now)
    .order('date', { ascending: false })
    .limit(6);

  if (upcomingError) console.error('Error fetching upcoming events:', upcomingError);
  if (pastError) console.error('Error fetching past events:', pastError);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapEvents = (events: any[]): EventWithCount[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (events || []).map((event: any) => ({
      ...event,
      registration_count: event.event_registrations?.[0]?.count || 0,
    })) as EventWithCount[];
  };

  return {
    upcoming: mapEvents(upcoming || []),
    past: mapEvents(past || []),
  };
}

export default async function EventListPage() {
  const { upcoming, past } = await getEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-iark-red via-red-600 to-iark-blue py-16 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-xl" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full blur-xl" />
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white rounded-full blur-xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Event & Kegiatan IARK
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Temukan dan daftar ke berbagai kegiatan yang diselenggarakan oleh IARK
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
              <span className="font-bold text-2xl">{upcoming.length}</span>
              <span className="ml-2 opacity-90">Event Mendatang</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
              <span className="font-bold text-2xl">{past.length}+</span>
              <span className="ml-2 opacity-90">Event Selesai</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-iark-red rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Event Mendatang</h2>
        </div>

        {upcoming.length > 0 ? (
          <div className="space-y-6">
            {upcoming.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Event Mendatang
            </h3>
            <p className="text-gray-600">
              Event baru akan segera diumumkan. Stay tuned!
            </p>
          </div>
        )}
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Event Sebelumnya</h2>
          </div>

          <div className="space-y-6 opacity-75">
            {past.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
