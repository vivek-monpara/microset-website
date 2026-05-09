'use client';

import { useEffect, useRef } from 'react';
import { MessageCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function WhatsAppCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(Array.from(contentRef.current.children), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 90%', once: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden bg-[linear-gradient(135deg,#0A1628_0%,#0F52BA_50%,#0A3D91_100%)]">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A844]/10 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />
      <div className="absolute inset-0 hero-pattern opacity-20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div ref={contentRef}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">We respond within 30 minutes</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Get <span className="gold-shimmer">Started?</span>
          </h2>

          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Connect with us today for product inquiries, bulk orders, or custom requirements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://wa.me/919879074051" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] w-full sm:w-auto">
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <a href="tel:+919879074051">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto">
                <Phone className="w-5 h-5" />
                Call Us Now
              </button>
            </a>
          </div>

          <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-white/50 mb-0.5">WhatsApp</p>
                <p className="font-semibold">+91 9999999999</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white sm:border-l border-white/10 sm:pl-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-white/50 mb-0.5">Email</p>
                <p className="font-semibold">info@microsetjk.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
