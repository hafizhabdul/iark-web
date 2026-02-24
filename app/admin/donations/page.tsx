import { createClient } from '@/lib/supabase/server';
import AdminDonationsContent from '@/components/admin/AdminDonationsContent';

export default async function AdminDonationsPage() {
  const supabase = await createClient();
  const [donationsRes, campaignsRes] = await Promise.all([
    supabase.from('donations').select('*').order('created_at', { ascending: false }),
    supabase.from('donation_campaigns').select('id, title, slug').order('title', { ascending: true }),
  ]);
  return (
    <AdminDonationsContent
      initialDonations={donationsRes.data || []}
      initialCampaigns={campaignsRes.data || []}
    />
  );
}
