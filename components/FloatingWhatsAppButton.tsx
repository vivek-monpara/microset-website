'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = '919879074051';
  const message = encodeURIComponent('Hi, I am interested in your goldsmith tools and machinery. Can you provide more information?');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  if (!isVisible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Contact us on WhatsApp"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-green-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
      
      {/* Main button */}
      <div className="relative w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 transform">
        <MessageCircle className="w-7 h-7 text-white" />
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg animate-in fade-in-0 zoom-in-95">
          Chat with us on WhatsApp
          <div className="absolute top-full right-2 w-2 h-2 bg-gray-900 transform rotate-45" />
        </div>
      )}
    </a>
  );
}
