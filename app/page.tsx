import { Header, Footer } from '@/components/layout';
import { HeroSection } from '@/components/features/hero';
import { AboutSection } from '@/components/features/about';
import { BidangPreviewSection } from '@/components/features/bidang';
import { BatchStoriesSection } from '@/components/features/batch';
import { ManagementGrid } from '@/components/features/pengurus';
import { TestimoniSection } from '@/components/features/testimoni';
import { PastActivitiesSection } from '@/components/features/activities';
import { AsramaGallerySection } from '@/components/features/asrama';
import { DonasiSection, StickyDonationCTA } from '@/components/features/donasi';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <BidangPreviewSection />
      <BatchStoriesSection />
      <ManagementGrid />
      <TestimoniSection />
      <PastActivitiesSection />
      <AsramaGallerySection />
      <DonasiSection />
      <Footer />
      <StickyDonationCTA />
    </div>
  );
}
