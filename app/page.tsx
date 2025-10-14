import { Header, Footer } from '@/components/layout';
import { HeroSection } from '@/components/features/hero';
import { AboutSection } from '@/components/features/about';
import { TestimoniSection } from '@/components/features/testimoni';
import { DonasiSection } from '@/components/features/donasi';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <TestimoniSection />
      <DonasiSection />
      <Footer />
    </div>
  );
}
