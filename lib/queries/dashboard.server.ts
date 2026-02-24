import { createClient } from '@/lib/supabase/server';
import type { DashboardStats } from './dashboard';

export async function fetchDashboardStatsServer(): Promise<DashboardStats> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_dashboard_stats');

  if (error) {
    console.error('RPC failed on server, using fallback:', error);
    const [storiesRes, pendingRes, usersRes, eventsRes, upcomingRes, registrationsRes, donationsRes] = await Promise.all([
      supabase.from('stories').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('stories').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }).gte('date', new Date().toISOString().split('T')[0]),
      supabase.from('event_registrations').select('id', { count: 'exact', head: true }),
      supabase.from('donations').select('amount').eq('payment_status', 'paid'),
    ]);
    const donationsAmount = (donationsRes.data || []).reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);
    return {
      total_stories: storiesRes.count || 0,
      pending_stories: pendingRes.count || 0,
      total_users: usersRes.count || 0,
      total_events: eventsRes.count || 0,
      upcoming_events: upcomingRes.count || 0,
      total_registrations: registrationsRes.count || 0,
      total_donations: donationsRes.data?.length || 0,
      total_donations_amount: donationsAmount,
    };
  }

  return data as DashboardStats;
}

export async function fetchPendingStoriesServer() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('stories')
    .select(`
      id, title, slug, excerpt, category, created_at,
      author:profiles!author_id (name, angkatan, photo)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending stories on server:', error);
    return [];
  }
  return data || [];
}
