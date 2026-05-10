'use client';

import { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
        No image available
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3">
        {/* Vertical thumbnail strip — left side */}
        {images.length > 1 && (
          <div className="flex flex-col gap-2 w-16 flex-shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 transition-all ${
                  idx === activeIndex
                    ? 'border-blue-600 shadow-md'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-contain p-1 bg-gray-50"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="flex-1 relative group">
          <div className="aspect-square bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-8">
            <img
              src={images[activeIndex]}
              alt={`${title} — image ${activeIndex + 1}`}
              className="w-full h-full object-contain transition-opacity duration-200"
            />
          </div>

          {/* Zoom button */}
          <button
            onClick={() => setZoomed(true)}
            className="absolute bottom-3 right-3 bg-white border border-gray-200 rounded-full p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
            title="Zoom"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Zoom lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
            onClick={() => setZoomed(false)}
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
          <img
            src={images[activeIndex]}
            alt={title}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
