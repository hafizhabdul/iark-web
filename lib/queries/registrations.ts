import { createClient } from '@/lib/supabase/client';

export interface Registration {
  id: string;
  event_id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  angkatan: number | null;
  asrama: string | null;
  organization: string | null;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled';
  registered_at: string;
  event?: {
    id: string;
    title: string;
    slug: string;
    date: string;
    location: string;
    event_type: string;
  };
}

export interface RegistrationWithEvent extends Registration {
  event: {
    id: string;
    title: string;
    slug: string;
    date: string;
    location: string;
    event_type: string;
  };
}

/**
 * Check if email is already registered for an event
 */
export async function checkExistingRegistration(
  eventId: string,
  email: string
): Promise<boolean> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('email', email)
    .neq('status', 'cancelled')
    .maybeSingle();

  if (error) {
    console.error('Error checking registration:', error);
    return false;
  }

  return !!data;
}

/**
 * Get registration by ID
 */
export async function fetchRegistrationById(id: string): Promise<Registration | null> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('event_registrations')
    .select(`
      *,
      event:events(id, title, slug, date, location, event_type)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching registration:', error);
    return null;
  }

  return data;
}

/**
 * Get all registrations for an event (admin)
 */
export async function fetchEventRegistrations(eventId: string): Promise<Registration[]> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }

  return data || [];
}

/**
 * Get user's registrations with event details
 */
export async function fetchUserRegistrations(userId: string): Promise<RegistrationWithEvent[]> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('event_registrations')
    .select(`
      *,
      event:events(id, title, slug, date, location, event_type)
    `)
    .eq('user_id', userId)
    .neq('status', 'cancelled')
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('Error fetching user registrations:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).filter((reg: any) => reg.event !== null);
}

/**
 * Cancel a registration
 */
export async function cancelRegistration(registrationId: string): Promise<boolean> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('event_registrations')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', registrationId);

  if (error) {
    console.error('Error cancelling registration:', error);
    return false;
  }

  return true;
}

/**
 * Update registration status (admin)
 */
export async function updateRegistrationStatus(
  registrationId: string,
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled'
): Promise<boolean> {
  const supabase = createClient();

  const updates: Record<string, string> = { status };
  if (status === 'confirmed') {
    updates.confirmed_at = new Date().toISOString();
  }
  if (status === 'cancelled') {
    updates.cancelled_at = new Date().toISOString();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('event_registrations')
    .update(updates)
    .eq('id', registrationId);

  if (error) {
    console.error('Error updating registration status:', error);
    return false;
  }

  return true;
}

/**
 * Get registration count for an event
 */
export async function getEventRegistrationCount(eventId: string): Promise<number> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count, error } = await (supabase as any)
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .neq('status', 'cancelled');

  if (error) {
    console.error('Error getting registration count:', error);
    return 0;
  }

  return count || 0;
}
