'use client';

import { useEffect, useRef } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FeaturedProducts() {
  const { products, loading, error } = useProducts(undefined, { featured: true });
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 95%', once: true },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = Array.from(gridRef.current.children);
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 70, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current!, start: 'top 95%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [loading]);

  return (
    <section id="products" className="py-16 md:py-24" style={{ backgroundColor: '#F7F3EE' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">Our Products</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our premium range of goldsmith tools and jewellery machinery manufactured to highest quality standards.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
            Error loading products: {error}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image || '/placeholder.svg?height=400&width=400'}
                title={product.title}
                description={product.description}
                index={i}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products found yet.</p>
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Need a specific product?</p>
          <a href="https://wa.me/919879074051" target="_blank" rel="noopener noreferrer">
            <button className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium">
              Request Custom Quote
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
