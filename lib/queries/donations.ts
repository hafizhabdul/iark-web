import { createClient } from '@/lib/supabase/client';

export interface Donation {
  id: string;
  order_id: string;
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  message: string | null;
  is_anonymous: boolean;
  payment_status: 'pending' | 'paid' | 'expired' | 'failed';
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface DonationStats {
  total_amount: number;
  total_count: number;
  paid_amount: number;
  paid_count: number;
}

/**
 * Fetch all donations (admin)
 */
export async function fetchAllDonations(): Promise<Donation[]> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching donations:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch donations by status (admin)
 */
export async function fetchDonationsByStatus(
  status: 'pending' | 'paid' | 'expired' | 'failed'
): Promise<Donation[]> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('donations')
    .select('*')
    .eq('payment_status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching donations by status:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch paid donations for public display
 */
export async function fetchPaidDonations(limit = 100): Promise<Donation[]> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('donations')
    .select('id, donor_name, amount, message, is_anonymous, paid_at')
    .eq('payment_status', 'paid')
    .order('paid_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching paid donations:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch donation by order ID
 */
export async function fetchDonationByOrderId(orderId: string): Promise<Donation | null> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('donations')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) {
    console.error('Error fetching donation:', error);
    return null;
  }

  return data;
}

/**
 * Get donation statistics
 */
export async function getDonationStats(): Promise<DonationStats> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('donations')
    .select('amount, payment_status');

  if (error) {
    console.error('Error fetching donation stats:', error);
    return { total_amount: 0, total_count: 0, paid_amount: 0, paid_count: 0 };
  }

  const stats = (data || []).reduce(
    (acc: DonationStats, d: { amount: number; payment_status: string }) => {
      acc.total_amount += d.amount;
      acc.total_count += 1;
      if (d.payment_status === 'paid') {
        acc.paid_amount += d.amount;
        acc.paid_count += 1;
      }
      return acc;
    },
    { total_amount: 0, total_count: 0, paid_amount: 0, paid_count: 0 }
  );

  return stats;
}
