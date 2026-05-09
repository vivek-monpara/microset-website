'use client';

import { useEffect, useRef } from 'react';
import { MessageCircle, ChevronDown, Star, Award, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  { value: 500, suffix: '+', label: 'Happy Customers', icon: Star },
  { value: 25, suffix: '+', label: 'Product Categories', icon: Award },
  { value: 20, suffix: '+', label: 'Years Experience', icon: Globe },
];

const FLOATING_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80', alt: 'Gold jewelry', cls: 'top-4 left-4 w-48 h-48 rotate-[-6deg]' },
  { src: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=400&q=80', alt: 'Goldsmith tools', cls: 'top-16 right-4 w-40 h-40 rotate-[6deg]' },
  { src: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?auto=format&fit=crop&w=400&q=80', alt: 'Jewelry workshop', cls: 'bottom-16 left-8 w-44 h-44 rotate-[3deg]' },
  { src: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80', alt: 'Precision tools', cls: 'bottom-4 right-4 w-36 h-36 rotate-[-4deg]' },
];

export function HeroSection() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(badgeRef.current, { y: -30, opacity: 0, duration: 0.7 })
      .from(headingRef.current, { y: 60, opacity: 0, duration: 1 }, '-=0.4')
      .from(subRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.6')
      .from(btnsRef.current?.children ? Array.from(btnsRef.current.children) : [], { y: 30, opacity: 0, stagger: 0.15, duration: 0.7 }, '-=0.5')
      .from(metricsRef.current?.children ? Array.from(metricsRef.current.children) : [], { y: 30, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.4')
      .from(imgContainerRef.current?.children ? Array.from(imgContainerRef.current.children) : [], { scale: 0.8, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.8');

    METRICS.forEach(({ value, suffix }, i) => {
      const el = counterRefs.current[i];
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value, duration: 2, delay: 1 + i * 0.15, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
      });
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[linear-gradient(135deg,#060D1F_0%,#0A1A3D_45%,#0F2D6B_100%)]">
      {/* Dot grid pattern */}
      <div className="absolute inset-0 hero-pattern opacity-60" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C9A844]/15 rounded-full blur-[120px] animate-float-delayed pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-600/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Text */}
        <div>
          <div ref={badgeRef} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#C9A844]/40 bg-[#C9A844]/10">
            <span className="w-2 h-2 rounded-full bg-[#C9A844] animate-pulse" />
            <span className="text-sm font-medium text-[#C9A844]">Made in India • Rajkot Based</span>
          </div>

          <h1 ref={headingRef} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Premium<br />
            <span className="gold-shimmer">Goldsmith</span><br />
            Tools & Machinery
          </h1>

          <p ref={subRef} className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
            Manufacturer-direct supply of high-quality jewellery machinery and goldsmith tools for wholesale, retail, and international export.
          </p>

          <div ref={btnsRef} className="flex flex-col sm:flex-row gap-4 mb-14">
            <a href="#products">
              <button className="px-8 py-4 bg-[#C9A844] hover:bg-[#B8973A] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,68,0.4)] w-full sm:w-auto">
                Explore Products
              </button>
            </a>
            <a href="https://wa.me/919879074051" target="_blank" rel="noopener noreferrer">
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </button>
            </a>
          </div>

          {/* Metrics */}
          <div ref={metricsRef} className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
            {METRICS.map(({ suffix, label, icon: Icon }, i) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Icon className="w-4 h-4 text-[#C9A844] mr-1" />
                  <span ref={(el) => { counterRefs.current[i] = el; }} className="text-2xl font-bold text-white">
                    0{suffix}
                  </span>
                </div>
                <p className="text-xs text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image collage */}
        <div ref={imgContainerRef} className="relative h-[500px] hidden lg:block">
          {FLOATING_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`absolute ${img.cls} rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 card-hover`}
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ))}
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#C9A844]/20 blur-2xl animate-pulse-gold" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#products" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
