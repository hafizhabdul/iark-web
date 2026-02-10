import { createClient } from '@/lib/supabase/client';
import type { DonationCampaignWithProgress, CampaignDonorWall } from '@/lib/supabase/types';

/** PGRST205 = relation (table/view) does not exist */
function isViewNotFound(error: { code?: string }): boolean {
  return error.code === 'PGRST205';
}

/**
 * Fetch all active campaigns with progress
 */
export async function fetchActiveCampaigns(): Promise<DonationCampaignWithProgress[]> {
  const supabase = createClient();
  
  const { data, error } = await (supabase as any)
    .from('vw_donation_campaign_progress')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    if (isViewNotFound(error)) return [];
    throw error;
  }
  return data ?? [];
}

/**
 * Fetch featured campaigns (for homepage)
 */
export async function fetchFeaturedCampaigns(limit = 3): Promise<DonationCampaignWithProgress[]> {
  const supabase = createClient();
  
  const { data, error } = await (supabase as any)
    .from('vw_donation_campaign_progress')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (isViewNotFound(error)) return [];
    throw error;
  }
  return data ?? [];
}

/**
 * Fetch single campaign by slug with progress
 */
export async function fetchCampaignBySlug(slug: string): Promise<DonationCampaignWithProgress | null> {
  const supabase = createClient();
  
  const { data, error } = await (supabase as any)
    .from('vw_donation_campaign_progress')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116' || isViewNotFound(error)) return null;
    throw error;
  }
  return data;
}

/**
 * Fetch campaign by ID
 */
export async function fetchCampaignById(id: string): Promise<DonationCampaignWithProgress | null> {
  const supabase = createClient();
  
  const { data, error } = await (supabase as any)
    .from('vw_donation_campaign_progress')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116' || isViewNotFound(error)) return null;
    throw error;
  }
  return data;
}

/**
 * Fetch donor wall for a campaign
 */
export async function fetchCampaignDonorWall(campaignId: string, limit = 20): Promise<CampaignDonorWall[]> {
  const supabase = createClient();
  
  const { data, error } = await (supabase as any)
    .from('vw_campaign_donor_wall')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('paid_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (isViewNotFound(error)) return [];
    throw error;
  }
  return data ?? [];
}

/**
 * Fetch overall donation stats
 */
export async function fetchOverallDonationStats(): Promise<{ paid_amount: number; paid_count: number }> {
  const supabase = createClient();
  
  const { data, error } = await (supabase as any)
    .from('vw_donation_overall_stats')
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116' || isViewNotFound(error)) {
      return { paid_amount: 0, paid_count: 0 };
    }
    throw error;
  }
  return {
    paid_amount: data?.total_paid_amount ?? 0,
    paid_count: data?.total_paid_count ?? 0,
  };
}

/**
 * Fetch user's donation history
 */
export async function fetchUserDonations(userId: string) {
  const supabase = createClient();

  const { data, error } = await (supabase as any)
    .from('donations')
    .select(`
      id,
      order_id,
      amount,
      payment_status,
      created_at,
      campaigns:campaign_id (title, slug)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((d: any) => ({
    ...d,
    campaign: d.campaigns || null,
  }));
}

/**
 * Fetch all campaigns (admin)
 */
export async function fetchAllCampaigns(): Promise<DonationCampaignWithProgress[]> {
  const supabase = createClient();
  
  const { data, error } = await (supabase as any)
    .from('vw_donation_campaign_progress')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    if (isViewNotFound(error)) return [];
    throw error;
  }
  return data ?? [];
}
