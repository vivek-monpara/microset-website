import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, ArrowLeft, Tag, Hash, Package, CheckCircle2, XCircle } from 'lucide-react';
import { ProductImageGallery } from '@/components/ProductImageGallery';

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  // Build image list: prefer images[] array, fallback to single image
  const imageList: string[] =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const whatsappMsg = `Hi, I'm interested in ${product.title}${product.productCode ? ` (Code: ${product.productCode})` : ''}. Please share more details.`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3EE' }}>
      {/* Top bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — Image Gallery */}
          <ProductImageGallery images={imageList} title={product.title} />

          {/* Right — Details */}
          <div className="flex flex-col gap-5">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                <Tag className="w-3 h-3" />
                {product.category}
              </span>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  <XCircle className="w-3 h-3" /> Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-base">
              {product.description}
            </p>

            {/* Product identifiers */}
            {(product.productCode || product.sku) && (
              <div className="bg-white rounded-xl border border-border p-4 space-y-2">
                {product.productCode && (
                  <div className="flex items-center gap-3 text-sm">
                    <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground w-28">Product Code</span>
                    <span className="font-mono font-semibold text-foreground">{product.productCode}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex items-center gap-3 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground w-28">SKU</span>
                    <span className="font-mono font-semibold text-foreground">{product.sku}</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="pt-2 space-y-3">
              <a
                href={`https://wa.me/919879074051?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-base transition-colors shadow-md">
                  <MessageCircle className="w-5 h-5" />
                  Inquire on WhatsApp
                </button>
              </a>
              <p className="text-center text-xs text-muted-foreground">
                Get bulk pricing, custom specs &amp; delivery details instantly
              </p>
            </div>

            {/* Divider info */}
            <div className="border-t border-border pt-4 mt-2">
              <p className="text-xs text-muted-foreground">
                MICROSET — Goldsmith Tools &amp; Jewellery Machinery, Rajkot, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
