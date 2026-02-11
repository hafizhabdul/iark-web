import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { DonationCampaignWithProgress } from '@/lib/supabase/types';
import { CheckoutForm } from './CheckoutForm';

interface CampaignForCheckout {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

async function getCampaignForCheckout(slug: string): Promise<CampaignForCheckout | null> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('vw_donation_campaign_progress')
    .select('id, title, slug, description, image_url, is_active')
    .eq('slug', slug)
    .single();

  if (error || !data || !data.is_active) return null;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    image_url: data.image_url,
  };
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('name, phone')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || '',
    name: profile?.name || user.user_metadata?.full_name || '',
    phone: profile?.phone || '',
  };
}

export default async function CampaignCheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [campaign, user] = await Promise.all([
    getCampaignForCheckout(slug),
    getCurrentUser(),
  ]);

  if (!campaign) {
    notFound();
  }

  return (
    <CheckoutForm
      campaign={campaign}
      user={user}
    />
  );
}
