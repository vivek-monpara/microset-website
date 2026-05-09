import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, ArrowLeft, Tag, Hash } from 'lucide-react';

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image available
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                <Tag className="w-3 h-3" />
                {product.category}
              </span>
              {product.inStock ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">In Stock</span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Out of Stock</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">{product.title}</h1>

            {product.price && (
              <p className="text-2xl font-semibold text-primary mb-4">₹{product.price.toLocaleString('en-IN')}</p>
            )}

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            <div className="space-y-2 mb-8">
              {product.productCode && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Product Code:</span>
                  <span className="font-mono font-medium text-foreground">{product.productCode}</span>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-mono font-medium text-foreground">{product.sku}</span>
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/919879074051?text=Hi, I'm interested in ${encodeURIComponent(product.title)}${product.productCode ? ` (Code: ${product.productCode})` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-lg transition-colors">
                <MessageCircle className="w-5 h-5" />
                Inquire on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
