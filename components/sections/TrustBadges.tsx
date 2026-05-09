'use client';

import { useEffect, useRef } from 'react';
import { Globe, Award, Building2, Shield, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const badges = [
  { icon: <Globe className="w-10 h-10" />, title: 'India Made', subtitle: 'Proudly Manufactured in India', from: '#F97316', to: '#EA580C', light: '#FFF7ED' },
  { icon: <Award className="w-10 h-10" />, title: 'Certified Quality', subtitle: 'International Quality Standards', from: '#3B82F6', to: '#1D4ED8', light: '#EFF6FF' },
  { icon: <Building2 className="w-10 h-10" />, title: 'Rajkot Expertise', subtitle: 'Jewelry Capital of India', from: '#8B5CF6', to: '#6D28D9', light: '#F5F3FF' },
  { icon: <Shield className="w-10 h-10" />, title: 'Trusted Partner', subtitle: 'Serving Global Markets', from: '#10B981', to: '#059669', light: '#ECFDF5' },
];

const marketplaces = [
  { name: 'IndiaMART', url: 'https://www.indiamart.com', description: "Connect with us on India's largest B2B marketplace", color: '#16a34a' },
  { name: 'TradeIndia', url: 'https://www.tradeindia.com', description: "Discover our products on TradeIndia's trusted platform", color: '#2563eb' },
];

export function TrustBadges() {
  const headingRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const marketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(Array.from(headingRef.current.children), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 95%', once: true },
        });
      }
      if (badgesRef.current) {
        gsap.fromTo(Array.from(badgesRef.current.children), { y: 50, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: badgesRef.current, start: 'top 95%', once: true },
        });
      }
      if (marketRef.current) {
        gsap.fromTo(Array.from(marketRef.current.children), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: marketRef.current, start: 'top 95%', once: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#EEF2FF_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headingRef} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">Trust</span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Trust MICROSET JK</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Decades of excellence, international quality standards, and commitment to our customers.
          </p>
        </div>

        <div ref={badgesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="rounded-2xl p-7 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group relative overflow-hidden"
              style={{ backgroundColor: badge.light }}
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-4 shadow-lg mx-auto group-hover:scale-110 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${badge.from}, ${badge.to})` }}
              >
                {badge.icon}
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Marketplace links */}
        <div className="bg-[linear-gradient(135deg,#0A1628,#0F2D6B)] rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Find Us On</h3>
              <p className="text-white/60">Connect with us on India's leading B2B marketplaces.</p>
            </div>
            <div ref={marketRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketplaces.map((m, index) => (
                <a
                  key={index}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-2xl p-6 transition-all duration-300 group flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">{m.name}</h4>
                    <p className="text-white/50 text-sm">{m.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-white transition-colors flex-shrink-0 ml-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
