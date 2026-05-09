# Quick Reference Guide - MongoDB + Prisma

## 🔗 API Endpoints Quick Reference

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?category=Featured` | Get products by category |
| POST | `/api/products` | Create new product |
| GET | `/api/products/{id}` | Get single product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

---

## 💻 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:migrate

# Seed database with sample data
npm run seed

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📝 Example API Calls

### cURL Examples

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Get featured products:**
```bash
curl "http://localhost:3000/api/products?category=Featured"
```

**Create a product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Gold Furnace",
    "description": "High-capacity electric furnace",
    "category": "Featured",
    "price": 15000,
    "sku": "GF-001",
    "inStock": true
  }'
```

**Update a product:**
```bash
curl -X PUT http://localhost:3000/api/products/{product-id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Gold Furnace",
    "price": 16000
  }'
```

**Delete a product:**
```bash
curl -X DELETE http://localhost:3000/api/products/{product-id}
```

### JavaScript/Fetch Examples

**Get all products:**
```javascript
const response = await fetch('/api/products');
const products = await response.json();
console.log(products);
```

**Create a product:**
```javascript
const newProduct = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Gold Furnace',
    description: 'High-capacity electric furnace',
    category: 'Featured',
    price: 15000,
    sku: 'GF-001',
    inStock: true,
  }),
});

const product = await newProduct.json();
console.log(product);
```

**Update a product:**
```javascript
const updated = await fetch(`/api/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Name',
    price: 16000,
  }),
});

const product = await updated.json();
console.log(product);
```

**Delete a product:**
```javascript
const response = await fetch(`/api/products/${productId}`, {
  method: 'DELETE',
});

const result = await response.json();
console.log(result);
```

---

## 🎯 Using React Hooks

### Fetch Products in Components

```typescript
'use client';

import { useProducts } from '@/hooks/useProducts';

export function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>Category: {product.category}</p>
          {product.price && <p>Price: ₹{product.price}</p>}
        </li>
      ))}
    </ul>
  );
}
```

### Filter by Category

```typescript
export function FeaturedProducts() {
  const { products, loading } = useProducts('Featured');

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
```

### Create/Update/Delete Operations

```typescript
'use client';

import { createProduct, updateProduct, deleteProduct } from '@/hooks/useProducts';

export function ProductForm() {
  const handleCreate = async () => {
    const product = await createProduct({
      title: 'New Product',
      description: 'Description',
      category: 'Featured',
      price: 5000,
      inStock: true,
    });
    console.log('Created:', product);
  };

  const handleUpdate = async (productId: string) => {
    const updated = await updateProduct(productId, {
      title: 'Updated Title',
      price: 6000,
    });
    console.log('Updated:', updated);
  };

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
    console.log('Deleted!');
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Product</button>
      <button onClick={() => handleUpdate('product-id')}>Update</button>
      <button onClick={() => handleDelete('product-id')}>Delete</button>
    </div>
  );
}
```

---

## 📊 Product Object Structure

```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  image?: string;
  price?: number;
  category: string; // "Featured", "Export", "Hand Tools", etc.
  sku?: string;
  inStock: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

---

## 🗂️ Product Categories

Default categories you can use:
- `Featured` - Main featured products
- `Export` - Export-grade products
- `Hand Tools` - Manual tools
- `Machinery` - Automated machinery
- `Power Tools` - Electric/powered tools
- `Safety Equipment` - Safety-related items
- `Accessories` - Product accessories

---

## 🔐 Admin Dashboard

**Access at:** `http://localhost:3000/admin`

**Features:**
- View all products in a table
- Create new products with form
- Edit existing products
- Delete products
- Filter by category and stock status
- Real-time updates

---

## 🛠️ Environment Variables

**`.env.local` file:**
```env
# MongoDB Connection String
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database_name"

# Next.js API URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Local Development
```env
DATABASE_URL="mongodb://localhost:27017/microset_jk"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Production
```env
DATABASE_URL="your-production-mongodb-url"
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
```

---

## 📱 File Locations

```
project/
├── prisma/
│   ├── schema.prisma      ← Database schema
│   └── seed.ts            ← Sample data
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts   ← GET/POST all products
│   │       └── [id]/route.ts ← GET/PUT/DELETE single
│   └── admin/page.tsx     ← Admin dashboard
├── components/sections/
│   ├── FeaturedProducts.tsx ← Uses useProducts hook
│   └── ExportProducts.tsx   ← Uses useProducts hook
├── hooks/
│   └── useProducts.ts     ← React hook for API
├── lib/
│   └── prisma.ts          ← Prisma client
├── .env.local             ← Environment variables
└── MONGODB_SETUP.md       ← Full setup guide
```

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Products not showing | Check `.env.local` and `NEXT_PUBLIC_API_URL` |
| Admin dashboard 404 | Route might not be created, ensure `/app/admin/page.tsx` exists |
| MongoDB connection error | Verify connection string and IP whitelist |
| "use client" error in components | Add `'use client';` at top of component |
| API not working | Restart dev server with `npm run dev` |

---

## 📞 Support Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Next.js Docs**: https://nextjs.org/docs
- **API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Last Updated:** May 2026
