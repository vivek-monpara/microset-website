'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Plus, Upload, X, Star } from 'lucide-react';
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

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        if (list.length > 0) {
          setFormData((prev) => ({ ...prev, category: prev.category || list[0].name }));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setFetchError(null);
      const response = await fetch('/api/products');
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${response.status}`);
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setFetchError(error instanceof Error ? error.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          images: formData.images,
        }),
      });

      if (response.ok) {
        await fetchProducts();
        resetForm();
        alert(editingId ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.error || 'Error saving product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert('Error deleting product');
      }
    } catch {
      alert('Error deleting product');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const data = new FormData();
        data.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body: data });
        if (!response.ok) {
          const err = await response.json();
          alert(err.error || 'Upload failed');
          continue;
        }
        const { url } = await response.json();
        uploaded.push(url);
      }
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    } catch {
      alert('Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (product: Product) => {
    const imgs = product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
    setFormData({
      title: product.title,
      description: product.description,
      images: imgs,
      features: product.features || [],
      price: product.price?.toString() || '',
      category: product.category,
      productCode: product.productCode || '',
      sku: product.sku || '',
      inStock: product.inStock,
      featured: product.featured || false,
    });
    setFeatureInput('');
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ ...emptyForm, category: categories[0]?.name || '' });
    setFeatureInput('');
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, features: [...prev.features, trimmed] }));
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Product Management</h1>
          <Button
            onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Product'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-muted rounded-lg p-8 mb-8 border border-border">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title + Product Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
                <input
                  type="text"
                  placeholder="Product Code (e.g. MJK-001)"
                  value={formData.productCode}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              </div>

              {/* Description */}
              <textarea
                placeholder="Product Description *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />

              {/* Key Features / Highlights */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Key Features / Highlights ({formData.features.length} added)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Hardened steel construction"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {formData.features.length > 0 && (
                  <ul className="space-y-1.5">
                    {formData.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="flex-1 text-foreground">{f}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted-foreground mt-1">Press Enter or click Add. These show as bullet points on the product page.</p>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Images ({formData.images.length} uploaded)
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group w-24 h-24">
                      <Image
                        src={img}
                        alt={`Image ${idx + 1}`}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-lg border border-border"
                        unoptimized
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1 rounded">
                          MAIN
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add image button */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                        <span className="text-[10px] text-muted-foreground text-center leading-tight px-1">
                          Add Image
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  First image will be used as the main display image. You can add multiple images.
                </p>
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price ₹ (optional — won't be shown publicly)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  step="0.01"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select Category *</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {categories.length === 0 && (
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  No categories yet. <a href="/admin/categories" className="underline font-medium">Create a category first.</a>
                </p>
              )}

              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-foreground text-sm font-medium">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-foreground text-sm font-medium">Featured on Homepage</span>
                </label>
              </div>

              <div className="flex gap-4 pt-2">
                <Button type="submit" disabled={uploading} className="bg-primary hover:bg-primary/90 text-white">
                  {editingId ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : fetchError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">Failed to load products</p>
            <p className="text-red-500 text-sm mt-1">{fetchError}</p>
            <Button onClick={fetchProducts} variant="outline" className="mt-4">Retry</Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-border">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Featured</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const thumb = (product.images && product.images[0]) || product.image;
                  return (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded-lg border border-border"
                            unoptimized
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-lg border border-border flex items-center justify-center text-[10px] text-muted-foreground">
                            No img
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{product.title}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{product.productCode || '-'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
                      <td className="px-4 py-3 text-sm">
                        {product.featured ? (
                          <span className="flex items-center gap-1 text-amber-600 font-medium">
                            <Star className="w-3.5 h-3.5 fill-amber-500" /> Yes
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.inStock ? 'In Stock' : 'Out'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs font-medium"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found. Create one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
