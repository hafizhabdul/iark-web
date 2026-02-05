import { createClient } from '@/lib/supabase/client';

export interface DashboardStats {
  total_stories: number;
  pending_stories: number;
  total_users: number;
  total_events: number;
  upcoming_events: number;
}

// Fetch dashboard stats using RPC (single query)
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('get_dashboard_stats');
  
  if (error) {
    console.error('RPC failed, using fallback:', error);
    return fetchDashboardStatsFallback();
  }
  
  return data as DashboardStats;
}

// Fallback: parallel queries
async function fetchDashboardStatsFallback(): Promise<DashboardStats> {
  const supabase = createClient();
  
  const [storiesRes, pendingRes, usersRes, eventsRes, upcomingRes] = await Promise.all([
    supabase.from('stories').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('stories').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }).gte('date', new Date().toISOString().split('T')[0]),
  ]);
  
  return {
    total_stories: storiesRes.count || 0,
    pending_stories: pendingRes.count || 0,
    total_users: usersRes.count || 0,
    total_events: eventsRes.count || 0,
    upcoming_events: upcomingRes.count || 0,
  };
}

// Fetch pending stories for admin review
export async function fetchPendingStories() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('stories')
    .select(`
      id, title, slug, excerpt, category, created_at,
      author:profiles!author_id (name, angkatan, photo)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Fetch all users (admin)
export async function fetchAllUsers(roleFilter?: 'admin' | 'alumni' | 'public') {
  const supabase = createClient();
  
  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (roleFilter) {
    query = query.eq('role', roleFilter);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// Fetch alumni profiles
export async function fetchAlumni() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}
