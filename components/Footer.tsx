'use client';

import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="text-white py-12 md:py-16" style={{ backgroundColor: '#0F52BA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="mb-4">
              <span className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>MICROSET</span>
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Premium goldsmith tools and jewellery machinery manufacturer. Made in India. Rajkot Based.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  Why Us
                </a>
              </li>
            </ul>
          </div>

          {/* Marketplaces */}
          <div>
            <h4 className="font-semibold mb-4">Find Us On</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="https://www.indiamart.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  IndiaMART
                </a>
              </li>
              <li>
                <a href="https://www.tradeindia.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  TradeIndia
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@microsetjk.com" className="hover:text-white transition-colors">
                  info@microsetjk.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+919879074051" className="hover:text-white transition-colors">
                  +91 98790 74051
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Rajkot, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-white/20 pt-8 flex justify-between items-center">
          <p className="text-sm text-white/70">
            © 2024 MICROSET JK. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
