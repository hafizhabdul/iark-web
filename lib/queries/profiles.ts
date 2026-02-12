import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Fetch current user's profile
 */
export async function fetchCurrentUserProfile(): Promise<Profile | null> {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching current user profile:', error.message);
    return null;
  }

  return data as Profile;
}

/**
 * Fetch profile by user ID
 */
export async function fetchProfileById(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile by ID:', error.message);
    return null;
  }

  return data as Profile;
}

/**
 * Update current user's profile
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await (supabase as any)
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Fetch all profiles (admin)
 */
export async function fetchAllProfiles(): Promise<Profile[]> {
  const supabase = createClient();

  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all profiles:', error.message);
    return [];
  }

  return (data as Profile[]) || [];
}

/**
 * Search and filter profiles (admin)
 */
export async function searchProfiles(params: {
  search?: string;
  angkatan?: number;
  regional?: string;
  asrama?: string;
}): Promise<Profile[]> {
  const supabase = createClient();
  const { search, angkatan, regional, asrama } = params;

  let query = (supabase as any)
    .from('profiles')
    .select('*');

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (angkatan) {
    query = query.eq('angkatan', angkatan);
  }

  if (regional) {
    query = query.eq('regional', regional);
  }

  if (asrama) {
    query = query.eq('asrama', asrama);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error searching profiles:', error.message);
    return [];
  }

  return (data as Profile[]) || [];
}
