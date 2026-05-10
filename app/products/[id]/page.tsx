import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Phone, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/#products" className="hover:text-blue-600 transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-medium">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* LEFT — Image gallery */}
          <ProductImageGallery images={imageList} title={product.title} />

          {/* RIGHT — Details */}
          <div>
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-2">
              {product.title}
            </h1>

            {/* Category tag */}
            <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
              <span className="text-blue-600 font-medium">{product.category}</span>
              {product.productCode && (
                <>
                  <span>•</span>
                  <span className="font-mono">{product.productCode}</span>
                </>
              )}
              <span>•</span>
              {product.inStock ? (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  <XCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-[15px] mb-6 border-t border-gray-100 pt-5">
              {product.description}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={`https://wa.me/919879074051?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-md font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle className="w-4 h-4" />
                Inquire on WhatsApp
              </a>
              <a
                href="tel:+919879074051"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-md font-semibold text-sm border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: '#0F52BA', color: '#0F52BA' }}
              >
                <Phone className="w-4 h-4" />
                +91 98790 74051
              </a>
            </div>

            {/* Key highlights — from database */}
            {product.features && product.features.length > 0 && (
              <div className="rounded-lg border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#0F52BA' }} />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust row */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
              <span>🇮🇳 Made in India</span>
              <span className="h-3 w-px bg-gray-200" />
              <span>⭐ 20+ Years Experience</span>
              <span className="h-3 w-px bg-gray-200" />
              <span>📦 Export Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── INFORMATION SECTION ── */}
      <div className="border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">Information</h2>

          {/* Specs table */}
          {(product.productCode || product.sku || product.category) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Specs</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-200">
                    {product.productCode && (
                      <tr className="grid grid-cols-2">
                        <td className="px-5 py-4 bg-gray-50">
                          <span className="font-semibold text-gray-700">Product Code</span>
                        </td>
                        <td className="px-5 py-4 border-l border-gray-200">
                          <span className="font-semibold text-gray-700">SKU</span>
                        </td>
                        <td className="px-5 py-3 bg-white col-start-1 text-gray-600 font-mono">
                          {product.productCode}
                        </td>
                        <td className="px-5 py-3 border-l border-gray-200 text-gray-600 font-mono">
                          {product.sku || '—'}
                        </td>
                      </tr>
                    )}
                    <tr className="grid grid-cols-2">
                      <td className="px-5 py-4 bg-gray-50">
                        <span className="font-semibold text-gray-700">Category</span>
                      </td>
                      <td className="px-5 py-4 border-l border-gray-200 bg-gray-50">
                        <span className="font-semibold text-gray-700">Availability</span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{product.category}</td>
                      <td className="px-5 py-3 border-l border-gray-200">
                        <span className={product.inStock ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                    <tr className="grid grid-cols-2">
                      <td className="px-5 py-4 bg-gray-50">
                        <span className="font-semibold text-gray-700">Origin</span>
                      </td>
                      <td className="px-5 py-4 border-l border-gray-200 bg-gray-50">
                        <span className="font-semibold text-gray-700">Manufactured By</span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">Rajkot, Gujarat, India</td>
                      <td className="px-5 py-3 border-l border-gray-200 text-gray-600">MICROSET</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Features list in info section */}
          {product.features && product.features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#0F52BA' }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact for more specs */}
          <div className="rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: '#EEF3FC' }}>
            <div>
              <p className="font-semibold text-gray-800">Need detailed specifications or a bulk quote?</p>
              <p className="text-sm text-gray-500 mt-0.5">Our team responds within minutes on WhatsApp.</p>
            </div>
            <a
              href={`https://wa.me/919879074051?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#0F52BA' }}
            >
              <MessageCircle className="w-4 h-4" />
              Ask us about this product
            </a>
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">More in {product.category}</h2>
              <Link href="/#products" className="text-sm font-medium text-blue-600 hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rel) => {
                const relImg = (rel.images && rel.images[0]) || rel.image || '';
                return (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.id}`}
                    className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all hover:border-blue-300"
                  >
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                      {relImg ? (
                        <img
                          src={relImg}
                          alt={rel.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-gray-300 text-xs">No image</div>
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {rel.title}
                      </p>
                      {rel.productCode && (
                        <p className="text-[10px] text-gray-400 font-mono mt-1">{rel.productCode}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile sticky WhatsApp */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-lg lg:hidden z-50">
        <a
          href={`https://wa.me/919879074051?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-md font-bold text-white text-sm"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageCircle className="w-5 h-5" />
          Inquire on WhatsApp
        </a>
      </div>

    </div>
  );
}
