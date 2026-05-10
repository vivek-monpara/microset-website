import Link from 'next/link';
import { MessageCircle, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  index?: number;
}

export function ProductCard({ id, image, title, description, index = 0 }: ProductCardProps) {
  const isGold = index % 2 === 1;

  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">

      {/* Image */}
      <Link href={`/products/${id}`} className="block relative overflow-hidden" style={{ backgroundColor: '#F7F3EE' }}>
        <div className="aspect-square overflow-hidden flex items-center justify-center p-4">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
          <ArrowUpRight className="w-4 h-4 text-foreground" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${id}`}>
          <h3 className="text-base font-bold text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{description}</p>

        <a href="https://wa.me/919879074051" target="_blank" rel="noopener noreferrer">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:shadow-md"
            style={isGold
              ? { backgroundColor: '#C9A844', color: '#0A1628' }
              : { backgroundColor: '#0F52BA', color: '#ffffff' }
            }
          >
            <MessageCircle className="w-4 h-4" />
            Inquire Now
          </button>
        </a>
      </div>
    </div>
  );
}
