'use client';

import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-[#F7F3EE] border border-border flex items-center justify-center text-muted-foreground text-sm">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-[#F7F3EE] border border-border">
        <img
          src={images[activeIndex]}
          alt={`${title} — image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
      </div>

      {/* Thumbnails — only show if more than one image */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                idx === activeIndex
                  ? 'border-primary shadow-md scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
