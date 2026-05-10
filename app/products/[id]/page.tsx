import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Phone, ChevronRight, CheckCircle2, XCircle, Hash, Package, Tag } from 'lucide-react';
import { ProductImageGallery } from '@/components/ProductImageGallery';

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const imageList: string[] =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const waMsg = `Hi MICROSET, I'm interested in *${product.title}*${product.productCode ? ` (Code: ${product.productCode})` : ''}. Please share specifications and pricing.`;

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  // Show up to 4 features as bullets on right side
  const bulletFeatures = product.features && product.features.length > 0
    ? product.features.slice(0, 4)
    : null;

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href="/#products" className="hover:text-blue-600 transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-blue-600 font-medium">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-700 truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* ── TOP SECTION: Image + Quick Info ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Gallery */}
          <ProductImageGallery images={imageList} title={product.title} />

          {/* RIGHT — Title, bullets, CTA */}
          <div className="flex flex-col gap-5">

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Category · Code · Stock */}
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="text-blue-600 font-semibold">{product.category}</span>
              {product.productCode && (
                <><span className="text-gray-300">•</span>
                <span className="font-mono text-gray-500">{product.productCode}</span></>
              )}
              <span className="text-gray-300">•</span>
              {product.inStock ? (
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              )}
            </div>

            {/* Bullet features — short version for right column */}
            {bulletFeatures && (
              <div className="border border-gray-200 rounded-lg p-4">
                <ul className="flex flex-col gap-2">
                  {bulletFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#0F52BA' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/919879074051?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle className="w-4 h-4" />
                Inquire on WhatsApp
              </a>
              <a
                href="tel:+919879074051"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold text-sm border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: '#0F52BA', color: '#0F52BA' }}
              >
                <Phone className="w-4 h-4" />
                +91 98790 74051
              </a>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-4 pt-1 text-xs text-gray-400 flex-wrap">
              <span>🇮🇳 Made in India</span>
              <span className="h-3 w-px bg-gray-200" />
              <span>⭐ 20+ Years Experience</span>
              <span className="h-3 w-px bg-gray-200" />
              <span>📦 Export Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BELOW IMAGE: Description + Specs ── */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Description — 2/3 width */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Description</h2>
            <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-line">{product.description}</p>

            {/* All features list */}
            {product.features && product.features.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#0F52BA' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Specs sidebar — 1/3 width */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Specifications</h2>
            <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden text-sm">
              {product.productCode && (
                <div className="flex border-b border-gray-100">
                  <div className="w-1/2 px-4 py-3 bg-gray-50 flex items-center gap-1.5 font-medium text-gray-600">
                    <Hash className="w-3.5 h-3.5" /> Code
                  </div>
                  <div className="w-1/2 px-4 py-3 font-mono text-gray-800">{product.productCode}</div>
                </div>
              )}
              {product.sku && (
                <div className="flex border-b border-gray-100">
                  <div className="w-1/2 px-4 py-3 bg-gray-50 flex items-center gap-1.5 font-medium text-gray-600">
                    <Package className="w-3.5 h-3.5" /> SKU
                  </div>
                  <div className="w-1/2 px-4 py-3 font-mono text-gray-800">{product.sku}</div>
                </div>
              )}
              <div className="flex border-b border-gray-100">
                <div className="w-1/2 px-4 py-3 bg-gray-50 flex items-center gap-1.5 font-medium text-gray-600">
                  <Tag className="w-3.5 h-3.5" /> Category
                </div>
                <div className="w-1/2 px-4 py-3 text-gray-800">{product.category}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-1/2 px-4 py-3 bg-gray-50 font-medium text-gray-600">Origin</div>
                <div className="w-1/2 px-4 py-3 text-gray-800">Rajkot, India</div>
              </div>
              <div className="flex">
                <div className="w-1/2 px-4 py-3 bg-gray-50 font-medium text-gray-600">Stock</div>
                <div className={`w-1/2 px-4 py-3 font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {product.inStock ? 'Available' : 'Out of Stock'}
                </div>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#EEF3FC' }}>
              <p className="text-sm font-semibold text-gray-800 mb-1">Need a bulk quote?</p>
              <p className="text-xs text-gray-500 mb-3">We respond within minutes.</p>
              <a
                href={`https://wa.me/919879074051?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#0F52BA' }}
              >
                <MessageCircle className="w-4 h-4" />
                Ask about this product
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">More in {product.category}</h2>
              <Link href="/#products" className="text-sm font-medium text-blue-600 hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rel) => {
                const relImg = (rel.images && rel.images[0]) || rel.image || '';
                return (
                  <Link key={rel.id} href={`/products/${rel.id}`}
                    className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all">
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                      {relImg
                        ? <img src={relImg} alt={rel.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        : <div className="text-gray-300 text-xs">No image</div>
                      }
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{rel.title}</p>
                      {rel.productCode && <p className="text-[10px] text-gray-400 font-mono mt-1">{rel.productCode}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-lg lg:hidden z-50">
        <a
          href={`https://wa.me/919879074051?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-bold text-white text-sm"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageCircle className="w-5 h-5" />
          Inquire on WhatsApp
        </a>
      </div>

    </div>
  );
}
