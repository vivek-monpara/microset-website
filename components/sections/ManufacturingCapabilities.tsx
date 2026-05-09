'use client';

import { useEffect, useRef } from 'react';
import { Cpu, Zap, Wrench, TrendingUp, ClipboardCheck, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  { icon: <Cpu className="w-8 h-8" />, title: 'Advanced Technology', description: 'State-of-the-art manufacturing equipment and precision machinery for superior product quality.', from: '#6366F1', to: '#4F46E5' },
  { icon: <Zap className="w-8 h-8" />, title: 'Fast Production', description: 'High-speed production capabilities with turnaround times optimized for bulk orders.', from: '#F59E0B', to: '#D97706' },
  { icon: <Wrench className="w-8 h-8" />, title: 'Custom Solutions', description: 'Tailored manufacturing solutions to meet specific client requirements and specifications.', from: '#10B981', to: '#059669' },
  { icon: <TrendingUp className="w-8 h-8" />, title: 'Scalable Production', description: 'Capacity to scale production up or down based on market demand and client needs.', from: '#3B82F6', to: '#1D4ED8' },
  { icon: <ClipboardCheck className="w-8 h-8" />, title: 'Quality Control', description: 'Rigorous quality assurance protocols ensuring every product meets international standards.', from: '#EF4444', to: '#DC2626' },
  { icon: <Users className="w-8 h-8" />, title: 'Expert Team', description: 'Skilled craftspeople and engineers with decades of combined industry experience.', from: '#8B5CF6', to: '#7C3AED' },
];

export function ManufacturingCapabilities() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(Array.from(headingRef.current.children), { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 95%', once: true },
        });
      }
      if (gridRef.current) {
        gsap.fromTo(Array.from(gridRef.current.children), { y: 70, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 95%', once: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20 bg-[#0A1628] relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 hero-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headingRef} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-[#C9A844] text-sm font-semibold rounded-full mb-4">Capabilities</span>
          <h2 className="text-4xl font-bold text-white mb-4">Our Manufacturing Capabilities</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Equipped with advanced technology and a team of master craftspeople delivering world-class goldsmith tools.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-2"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${cap.from}, ${cap.to})` }}
              >
                {cap.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{cap.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
