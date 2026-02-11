import { createPublicClient as createClient } from '@/lib/supabase/public';
import type { Batch, BatchLeader, Testimonial } from '@/lib/supabase/types';

export interface BatchWithLeaders extends Batch {
  batch_leaders: BatchLeader[];
}

// Fetch all batches with their leaders
export async function fetchBatchesWithLeaders(): Promise<BatchWithLeaders[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('batches')
    .select('*, batch_leaders(*)')
    .order('angkatan', { ascending: true });

  if (error) throw error;
  return (data || []) as BatchWithLeaders[];
}

// Fetch tokoh ternama testimonials
export async function fetchTokohTernama(): Promise<Testimonial[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('type', 'tokoh_ternama')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export interface BatchStoriesData {
  batches: BatchWithLeaders[];
  tokohTernama: Testimonial[];
}

// Fetch batch stories data (batches + tokoh) in parallel
export async function fetchBatchStoriesData(): Promise<BatchStoriesData> {
  const supabase = createClient();

  const [batchesRes, tokohRes] = await Promise.all([
    supabase
      .from('batches')
      .select('*, batch_leaders(*)')
      .order('angkatan', { ascending: true }),
    supabase
      .from('testimonials')
      .select('*')
      .eq('type', 'tokoh_ternama')
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
  ]);

  return {
    batches: (batchesRes.data || []) as BatchWithLeaders[],
    tokohTernama: (tokohRes.data || []) as Testimonial[],
  };
}
