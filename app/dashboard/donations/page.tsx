import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DonationHistoryContent from '@/components/features/dashboard/DonationHistoryContent';

export default async function DonationHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/masuk?redirectTo=/dashboard/donations');
  }

  const { data } = await supabase
    .from('donations')
    .select(`
      id,
      order_id,
      amount,
      payment_status,
      created_at,
      campaigns:campaign_id (title, slug)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const donations = (data || []).map((d: any) => ({
    ...d,
    campaign: d.campaigns || null,
  }));

  return <DonationHistoryContent donations={donations} />;
}
