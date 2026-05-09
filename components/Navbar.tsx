'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, MessageCircle, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { SearchOverlay } from './SearchOverlay';
import gsap from 'gsap';

interface Category {
  id: string;
  name: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const announcementRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    if (announcementRef.current) {
      tl.from(announcementRef.current, { y: -40, opacity: 0, duration: 0.5, ease: 'power3.out' });
    }
    if (navRef.current) {
      tl.from(navRef.current, { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2');
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = [
    { label: 'Products', href: '/#products' },
    { label: 'Why Us', href: '/#why-us' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div ref={announcementRef} className="w-full py-2 px-4 text-center text-xs font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: '#0A1628', color: '#C9A844' }}>
        Premium Goldsmith Tools &amp; Machinery — Manufacturer Direct — Rajkot, India — International Export Available →
      </div>

      {/* Main navbar */}
      <nav ref={navRef} className="sticky top-0 z-50 w-full shadow-lg" style={{ backgroundColor: '#0F52BA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-bold text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                MICROSET
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-white/80 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide">
                  {link.label}
                </a>
              ))}

              {categories.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center gap-1 text-white/80 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide">
                    Categories
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                    {categories.map((cat) => (
                      <a key={cat.id} href="/#products" className="block px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm">
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/70 border border-white/30 rounded-lg hover:border-white/60 hover:text-white transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
                <kbd className="ml-1 text-xs bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>

              <a
                href="https://wa.me/919879074051"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#C9A844', color: '#0A1628' }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            {/* Mobile right side */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-md text-white/80 hover:text-white">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-white/80 hover:text-white">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden border-t border-white/20 py-4 space-y-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors font-medium uppercase text-sm tracking-wide" onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              ))}

              {categories.length > 0 && (
                <div>
                  <button
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors font-medium uppercase text-sm tracking-wide text-left"
                  >
                    Categories
                    <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {categoryOpen && (
                    <div className="pl-4 mt-1 space-y-1 border-l-2 border-white/30">
                      {categories.map((cat) => (
                        <a key={cat.id} href="/#products" className="block px-3 py-2 text-sm text-white/70 hover:text-white rounded-md transition-colors" onClick={() => { setIsOpen(false); setCategoryOpen(false); }}>
                          {cat.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <a
                  href="https://wa.me/919879074051"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-semibold text-sm"
                  style={{ backgroundColor: '#C9A844', color: '#0A1628' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
