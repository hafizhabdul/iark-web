import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type DbEvent = Database['public']['Tables']['events']['Row'];

export interface EventWithRegistrations {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  date: string;
  time: string | null;
  end_date: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  is_live: boolean;
  is_featured: boolean;
  capacity: number | null;
  registration_url: string | null;
  organizer_id: string | null;
  created_at: string;
  updated_at: string;
  registration_count: number;
}

// Fetch all events with registration counts using RPC (solves N+1)
export async function fetchEventsWithRegistrations(): Promise<EventWithRegistrations[]> {
  const supabase = createClient();
  
  // Try RPC first - cast to unknown first since RPC types aren't defined
  const { data, error } = await supabase.rpc('get_events_with_registrations');
  
  if (error) {
    console.error('RPC failed, using fallback:', error);
    return fetchEventsWithRegistrationsFallback();
  }
  
  const events = (data || []) as EventWithRegistrations[];
  return events.map((e) => ({
    ...e,
    registration_count: Number(e.registration_count) || 0,
  }));
}

// Fallback: fetch events then counts in 2 queries (no N+1)
async function fetchEventsWithRegistrationsFallback(): Promise<EventWithRegistrations[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) throw error;
  
  const events = (data || []) as DbEvent[];
  if (events.length === 0) return [];
  
  // Fetch all registration counts in a single query
  const eventIds = events.map((e) => e.id);
  const { data: counts } = await supabase
    .from('event_registrations')
    .select('event_id')
    .in('event_id', eventIds);
  
  // Count registrations per event
  const countMap = new Map<string, number>();
  ((counts || []) as { event_id: string }[]).forEach((r) => {
    countMap.set(r.event_id, (countMap.get(r.event_id) || 0) + 1);
  });
  
  return events.map((e) => ({
    ...e,
    registration_count: countMap.get(e.id) || 0,
  }));
}

// Fetch single event with registration count
export async function fetchEventById(id: string): Promise<EventWithRegistrations | null> {
  const supabase = createClient();
  
  const [eventRes, countRes] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id),
  ]);
  
  if (eventRes.error) throw eventRes.error;
  if (!eventRes.data) return null;
  
  const event = eventRes.data as DbEvent;
  return {
    ...event,
    registration_count: countRes.count || 0,
  };
}

// Check if user is registered for an event
export async function checkEventRegistration(eventId: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return !!data;
}

// Register user for event
export async function registerForEvent(eventId: string, userId: string) {
  const supabase = createClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('event_registrations')
    .insert({ event_id: eventId, user_id: userId })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Unregister user from event
export async function unregisterFromEvent(eventId: string, userId: string) {
  const supabase = createClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('event_registrations')
    .delete()
    .match({ event_id: eventId, user_id: userId });
  
  if (error) throw error;
}
