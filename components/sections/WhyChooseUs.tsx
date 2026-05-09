'use client';

import { useEffect, useRef } from 'react';
import { Factory, Award, Zap, TrendingUp, Shield, Globe, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '20+', label: 'Years Experience' },
  { value: '500+', label: 'Happy Customers' },
  { value: '25+', label: 'Product Categories' },
  { value: '15+', label: 'Countries Exported' },
];

const FEATURES = [
  { icon: Factory, title: 'Manufacturer Direct', description: 'Buy straight from the factory — no middlemen, better prices.' },
  { icon: Award, title: 'Made in India', description: 'Crafted in Rajkot, the jewelry capital of India, to international standards.' },
  { icon: Shield, title: 'Quality Assured', description: 'Every product is tested and certified before it leaves our facility.' },
  { icon: TrendingUp, title: 'Bulk Supply Ready', description: 'Large stock, fast dispatch — ideal for wholesalers and retailers.' },
  { icon: Globe, title: 'International Export', description: 'We ship worldwide with proper export documentation and compliance.' },
  { icon: Zap, title: 'Custom Orders', description: 'Need something specific? We take custom tool and machinery orders.' },
];

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );
      gsap.fromTo(rightRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );
      if (statsRef.current) {
        gsap.fromTo(Array.from(statsRef.current.children),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true } }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-us" className="py-16 md:py-24" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top: Stats row */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 pb-16 border-b border-border">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom: Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Heading + description */}
          <div ref={leftRef}>
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full mb-5" style={{ backgroundColor: '#0F52BA15', color: '#0F52BA' }}>
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Why Businesses Choose MICROSET
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              From small jewelers to large export houses — thousands of businesses trust MICROSET for reliable goldsmith tools and machinery, delivered manufacturer-direct from Rajkot.
            </p>
            <a
              href="https://wa.me/919879074051"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#0F52BA' }}
            >
              Talk to Us on WhatsApp
            </a>
          </div>

          {/* Right: Feature list */}
          <div ref={rightRef} className="space-y-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4 group">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 transition-colors duration-200"
                  style={{ backgroundColor: '#0F52BA12' }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#0F52BA' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-0.5 text-base">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
