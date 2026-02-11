'use client';

import { useRouter } from 'next/navigation';
import { CampaignHero } from '@/components/features/donasi/CampaignHero';
import { DonationCampaignWithProgress } from '@/lib/supabase/types';
import { getDonasiHref } from '@/lib/utils/subdomain';

interface CampaignHeroClientProps {
  campaign: DonationCampaignWithProgress;
  /** Path relative to /donasi, e.g. "/beasiswa/checkout" */
  checkoutPath: string;
}

export function CampaignHeroClient({ campaign, checkoutPath }: CampaignHeroClientProps) {
  const router = useRouter();

  const handleDonateClick = () => {
    const href = getDonasiHref(checkoutPath);
    router.push(href);
  };

  return (
    <CampaignHero
      campaign={campaign}
      onDonateClick={handleDonateClick}
    />
  );
}
