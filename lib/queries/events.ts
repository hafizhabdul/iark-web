import { createClient } from '@/lib/supabase/client';

// Re-export for backward compatibility with existing dashboard
export interface EventWithRegistrations {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  is_live: boolean;
  capacity: number | null;
  registration_count: number;
  content?: string | null;
  registration_url?: string | null;
}

/**
 * Fetch events with registration count (for dashboard)
 */
export async function fetchEventsWithRegistrations(): Promise<EventWithRegistrations[]> {
  const supabase = createClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('events')
    .select(`
      id,
      title,
      description,
      date,
      location,
      image_url,
      is_live,
      max_participants,
      event_registrations(count)
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching events with registrations:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: null,
    location: event.location,
    category: null,
    image_url: event.image_url,
    is_live: event.is_live,
    capacity: event.max_participants,
    registration_count: event.event_registrations?.[0]?.count || 0,
  }));
}

export interface EventData {
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
}

export interface EventWithRegistrationCount extends EventData {
  registration_count: number;
}

/**
 * Fetch all upcoming events (for event portal)
 */
export async function fetchUpcomingEvents(): Promise<EventWithRegistrationCount[]> {
  const supabase = createClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('events')
    .select(`
      *,
      event_registrations(count)
    `)
    .eq('is_live', true)
    .eq('registration_enabled', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((event: any) => ({
    ...event,
    registration_count: event.event_registrations?.[0]?.count || 0,
  }));
}

/**
 * Fetch all events (including past) for archive
 */
export async function fetchAllEvents(): Promise<EventWithRegistrationCount[]> {
  const supabase = createClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('events')
    .select(`
      *,
      event_registrations(count)
    `)
    .eq('is_live', true)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching all events:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((event: any) => ({
    ...event,
    registration_count: event.event_registrations?.[0]?.count || 0,
  }));
}

/**
 * Fetch single event by ID (for dashboard/admin)
 */
export async function fetchEventById(id: string): Promise<EventWithRegistrations | null> {
  const supabase = createClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('events')
    .select(`
      id,
      title,
      description,
      date,
      location,
      image_url,
      is_live,
      max_participants,
      content,
      registration_url,
      event_registrations(count)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event by id:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: null,
    location: data.location,
    category: null,
    image_url: data.image_url,
    is_live: data.is_live,
    capacity: data.max_participants,
    registration_count: data.event_registrations?.[0]?.count || 0,
    content: data.content,
    registration_url: data.registration_url,
  };
}

/**
 * Fetch single event by slug
 */
export async function fetchEventBySlug(slug: string): Promise<EventWithRegistrationCount | null> {
  const supabase = createClient();
  
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

  if (error) {
    console.error('Error fetching event by slug:', error);
    return null;
  }

  return {
    ...data,
    registration_count: data.event_registrations?.[0]?.count || 0,
  };
}

/**
 * Check if user is registered for an event
 */
export async function checkUserRegistration(eventId: string, email: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Error checking registration:', error);
    return false;
  }

  return !!data;
}

/**
 * Get user's registered events
 */
export async function fetchUserRegisteredEvents(userId: string): Promise<EventData[]> {
  const supabase = createClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('event_registrations')
    .select(`
      event:events(*)
    `)
    .eq('user_id', userId)
    .neq('status', 'cancelled')
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('Error fetching user events:', error);
    return [];
  }

  return (data || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((reg: any) => reg.event)
    .filter((event: EventData | null): event is EventData => event !== null);
}
