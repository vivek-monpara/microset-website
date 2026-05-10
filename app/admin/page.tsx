'use client';

import { useState, useEffect, useRef } from 'react';
import { Trash2, Edit2, Plus, Upload, X, Star, Package, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import AdminNavbar from '@/components/AdminNavbar';

interface Product {
  id: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  features?: string[];
  price?: number;
  category: string;
  featured?: boolean;
  productCode?: string;
  sku?: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

const emptyForm = {
  title: '',
  description: '',
  images: [] as string[],
  features: [] as string[],
  price: '',
  category: '',
  productCode: '',
  sku: '',
  inStock: true,
  featured: false,
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400 transition";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        if (list.length > 0)
          setFormData((prev) => ({ ...prev, category: prev.category || list[0].name }));
      }
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
    try {
      setFetchError(null);
      const res = await fetch('/api/products');
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Error ${res.status}`); }
      setProducts(Array.isArray(await res.json()) ? await res.json() : []);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Failed to load');
      setProducts([]);
    } finally { setLoading(false); }
  };

  // re-fetch cleanly
  const reload = async () => {
    const res = await fetch('/api/products');
    if (res.ok) setProducts(Array.isArray(await res.json()) ? await res.json() : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: formData.price ? parseFloat(formData.price) : null }),
      });
      if (res.ok) { await reload(); resetForm(); }
      else { const e = await res.json().catch(() => ({})); alert(e.error || 'Error saving product'); }
    } catch { alert('Error saving product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) await reload(); else alert('Error deleting product');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!res.ok) { alert((await res.json()).error || 'Upload failed'); continue; }
        const { url } = await res.json();
        setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
      }
    } catch { alert('Upload failed'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleEdit = (p: Product) => {
    const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
    setFormData({ title: p.title, description: p.description, images: imgs, features: p.features || [], price: p.price?.toString() || '', category: p.category, productCode: p.productCode || '', sku: p.sku || '', inStock: p.inStock, featured: p.featured || false });
    setFeatureInput(''); setEditingId(p.id); setShowForm(true);
    setTimeout(() => document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const resetForm = () => {
    setFormData({ ...emptyForm, category: categories[0]?.name || '' });
    setFeatureInput(''); setEditingId(null); setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addFeature = () => {
    const t = featureInput.trim(); if (!t) return;
    setFormData((p) => ({ ...p, features: [...p.features, t] })); setFeatureInput('');
  };

  const set = (key: string, val: unknown) => setFormData((p) => ({ ...p, [key]: val }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 shadow-sm"
            style={{ backgroundColor: showForm ? '#6B7280' : '#0F52BA' }}
          >
            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Product</>}
          </button>
        </div>

        {/* ── FORM ── */}
        {showForm && (
          <div id="product-form" className="mb-10">
            {/* Form header */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="text-gray-400">Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-400">Products</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-800">{editingId ? 'Edit Product' : 'New Product'}</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT — 2/3 */}
                <div className="lg:col-span-2 space-y-5">

                  {/* Basic Info */}
                  <SectionCard title="Basic Information">
                    <div className="space-y-4">
                      <Field label="Product Title" required>
                        <input type="text" value={formData.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Ring Stretcher And Reducer Size 1-15" required className={inputCls} />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Product Code">
                          <input type="text" value={formData.productCode} onChange={(e) => set('productCode', e.target.value)} placeholder="e.g. MJK-001" className={inputCls} />
                        </Field>
                        <Field label="SKU">
                          <input type="text" value={formData.sku} onChange={(e) => set('sku', e.target.value)} placeholder="e.g. SKU-001" className={inputCls} />
                        </Field>
                      </div>
                      <Field label="Description" required>
                        <textarea value={formData.description} onChange={(e) => set('description', e.target.value)} placeholder="Detailed product description..." required rows={5} className={inputCls + ' resize-none'} />
                      </Field>
                    </div>
                  </SectionCard>

                  {/* Key Features */}
                  <SectionCard title="Key Features / Highlights">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                          placeholder="e.g. Hardened steel body with polished finish"
                          className={inputCls + ' flex-1'}
                        />
                        <button type="button" onClick={addFeature}
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 flex-shrink-0">
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                      {formData.features.length > 0 ? (
                        <ul className="space-y-2">
                          {formData.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-3 px-3.5 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                              <span className="flex-1 text-gray-700">{f}</span>
                              <button type="button" onClick={() => setFormData((p) => ({ ...p, features: p.features.filter((_, j) => j !== i) }))}
                                className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg">
                          No features added yet. Press Enter or click Add.
                        </p>
                      )}
                    </div>
                  </SectionCard>

                  {/* Images */}
                  <SectionCard title="Product Images">
                    <div className="flex flex-wrap gap-3 mb-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group w-24 h-24">
                          <Image src={img} alt={`img-${idx}`} width={96} height={96}
                            className="w-24 h-24 object-contain rounded-lg border border-gray-200 bg-gray-50 p-1" unoptimized />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">MAIN</span>
                          )}
                          <button type="button" onClick={() => setFormData((p) => ({ ...p, images: p.images.filter((_, j) => j !== idx) }))}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                        {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" /> : (
                          <><Upload className="w-5 h-5 text-gray-400 mb-1" /><span className="text-[10px] text-gray-400 text-center">Add Image</span></>
                        )}
                      </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    <p className="text-xs text-gray-400">First image is used as the main display image. You can add multiple.</p>
                  </SectionCard>
                </div>

                {/* RIGHT — 1/3 */}
                <div className="space-y-5">

                  {/* Publish / Status */}
                  <SectionCard title="Publish">
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-800">In Stock</p>
                          <p className="text-xs text-gray-400">Shown as available to buyers</p>
                        </div>
                        <div
                          onClick={() => set('inStock', !formData.inStock)}
                          className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${formData.inStock ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.inStock ? 'translate-x-5' : 'translate-x-1'}`} />
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Featured
                          </p>
                          <p className="text-xs text-gray-400">Show on homepage</p>
                        </div>
                        <div
                          onClick={() => set('featured', !formData.featured)}
                          className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${formData.featured ? 'bg-amber-400' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.featured ? 'translate-x-5' : 'translate-x-1'}`} />
                        </div>
                      </label>
                    </div>
                  </SectionCard>

                  {/* Organisation */}
                  <SectionCard title="Organisation">
                    <div className="space-y-3">
                      <Field label="Category" required>
                        <select value={formData.category} onChange={(e) => set('category', e.target.value)} required className={inputCls}>
                          <option value="">Select category...</option>
                          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                        {categories.length === 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            No categories. <a href="/admin/categories" className="underline">Create one first.</a>
                          </p>
                        )}
                      </Field>
                      <Field label="Internal Price ₹">
                        <input type="number" value={formData.price} onChange={(e) => set('price', e.target.value)} placeholder="For reference only, not shown publicly" step="0.01" className={inputCls} />
                      </Field>
                    </div>
                  </SectionCard>

                  {/* Action buttons */}
                  <div className="space-y-2.5">
                    <button type="submit" disabled={saving || uploading}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#0F52BA' }}>
                      {saving ? 'Saving…' : editingId ? 'Update Product' : 'Create Product'}
                    </button>
                    <button type="button" onClick={resetForm}
                      className="w-full py-3 rounded-xl font-semibold text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── PRODUCT TABLE ── */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
        ) : fetchError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">{fetchError}</p>
            <button onClick={fetchProducts} className="mt-3 px-4 py-2 border border-red-300 rounded-lg text-sm text-red-600 hover:bg-red-50">Retry</button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">All Products</span>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No products yet</p>
                <p className="text-gray-400 text-sm">Click "Add Product" to get started</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Featured</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => {
                    const thumb = (p.images && p.images[0]) || p.image;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          {thumb ? (
                            <Image src={thumb} alt={p.title} width={44} height={44}
                              className="w-11 h-11 object-contain rounded-lg border border-gray-100 bg-gray-50 p-0.5" unoptimized />
                          ) : (
                            <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{p.title}</p>
                          {p.productCode && <p className="text-xs text-gray-400 font-mono mt-0.5">{p.productCode}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{p.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          {p.featured
                            ? <span className="flex items-center gap-1 text-xs font-semibold text-amber-600"><Star className="w-3.5 h-3.5 fill-amber-400" />Yes</span>
                            : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {p.inStock ? 'In Stock' : 'Out'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(p)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-semibold">
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => handleDelete(p.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
