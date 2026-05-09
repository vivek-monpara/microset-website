import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { ManufacturingCapabilities } from '@/components/sections/ManufacturingCapabilities';
import { ExportProducts } from '@/components/sections/ExportProducts';
import { TrustBadges } from '@/components/sections/TrustBadges';
import { WhatsAppCTA } from '@/components/sections/WhatsAppCTA';
import { Marquee } from '@/components/Marquee';

const MARQUEE_1 = [
  'Premium Quality',
  'Made in India',
  'Rajkot Based',
  'Bulk Supply Ready',
  'International Export',
  '20+ Years Experience',
  '500+ Happy Customers',
  'Manufacturer Direct',
];

const MARQUEE_2 = [
  'Goldsmith Tools',
  'Jewelry Machinery',
  'Hand Tools',
  'Power Tools',
  'Wholesale Pricing',
  'Export Certified',
  'Custom Orders',
  'Quality Assured',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <Marquee items={MARQUEE_1} bgColor="#F4C430" textColor="#0A1628" speed={30} size="md" />
      <FeaturedProducts />
      <WhyChooseUs />
      <Marquee items={MARQUEE_2} bgColor="#0F52BA" textColor="#F4C430" speed={25} size="md" separator="◆" />
      <ManufacturingCapabilities />
      <ExportProducts />
      <Marquee items={MARQUEE_1} bgColor="#0A1628" textColor="#C9A844" speed={35} size="sm" separator="★" />
      <TrustBadges />
      <WhatsAppCTA />
    </main>
  );
}
