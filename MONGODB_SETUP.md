# MongoDB + Prisma Setup Guide

## Overview
This guide will help you set up MongoDB with Prisma ORM to manage products dynamically in your MICROSET JK website.

---

## 📋 Prerequisites
- Node.js 18+ and npm/pnpm installed
- MongoDB account (MongoDB Atlas for cloud, or local MongoDB)
- Basic knowledge of environment variables

---

## 🚀 Step-by-Step Setup

### 1. Install Dependencies

```bash
cd your-project-directory
npm install @prisma/client prisma mongodb
# or if using pnpm
pnpm install @prisma/client prisma mongodb
```

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (choose "M0 Free")
4. Click "Connect" and select "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and database name in the string
7. Paste it in `.env.local` as `DATABASE_URL`

**Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/microset_jk?retryWrites=true&w=majority
```

#### Option B: Local MongoDB
1. [Download and install MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
2. Start MongoDB service
3. Use this connection string in `.env.local`:
```
mongodb://localhost:27017/microset_jk
```

### 3. Initialize Prisma

```bash
# Generate Prisma client
npx prisma generate

# Create database migration (optional for MongoDB)
npx prisma db push
```

### 4. Seed Initial Data (Optional)

Add this to your `package.json` scripts:

```json
{
  "scripts": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Then run:
```bash
npm run seed
```

This will populate your database with sample products.

---

## 📁 Project Structure

```
project/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Initial data
├── app/
│   ├── api/
│   │   └── products/      # API routes
│   │       ├── route.ts   # GET/POST
│   │       └── [id]/
│   │           └── route.ts # GET/PUT/DELETE
│   └── admin/
│       └── page.tsx       # Admin dashboard
├── lib/
│   └── prisma.ts          # Prisma client
├── hooks/
│   └── useProducts.ts     # React hook for fetching products
└── .env.local             # Environment variables
```

---

## 🔌 API Routes

### Get All Products
```
GET /api/products
GET /api/products?category=Featured
```

### Create Product
```
POST /api/products
{
  "title": "Product Name",
  "description": "Description",
  "image": "https://...",
  "price": 5000,
  "category": "Featured",
  "sku": "SKU-001",
  "inStock": true
}
```

### Get Single Product
```
GET /api/products/{id}
```

### Update Product
```
PUT /api/products/{id}
{
  "title": "Updated Name",
  "description": "Updated Description",
  ...
}
```

### Delete Product
```
DELETE /api/products/{id}
```

---

## 🎛️ Admin Dashboard

Access the admin panel at: `http://localhost:3000/admin`

Features:
- ✅ View all products in a table
- ✅ Create new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Filter by category and stock status

---

## 🪝 Using Products in Components

### Basic Hook Usage

```tsx
'use client';

import { useProducts } from '@/hooks/useProducts';

export function MyComponent() {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

### Filter by Category

```tsx
const { products, loading } = useProducts('Featured');
// or
const { products, loading } = useProducts('Export');
```

### Create/Update/Delete Products

```tsx
import { createProduct, updateProduct, deleteProduct } from '@/hooks/useProducts';

// Create
await createProduct({
  title: 'New Product',
  description: 'Description',
  category: 'Featured',
  inStock: true,
});

// Update
await updateProduct(productId, {
  title: 'Updated Name',
  price: 5000,
});

// Delete
await deleteProduct(productId);
```

---

## 🗄️ Database Schema

```prisma
model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  image       String?
  price       Float?
  category    String
  sku         String?  @unique
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Fields:**
- `id`: Unique identifier (MongoDB ObjectId)
- `title`: Product name
- `description`: Product details
- `image`: Product image URL
- `price`: Product price (optional)
- `category`: Product category (Featured, Export, etc.)
- `sku`: Stock Keeping Unit (unique identifier)
- `inStock`: Availability status
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

---

## 🔧 Environment Variables

**`.env.local`:**
```env
# MongoDB Connection String
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/microset_jk"

# Next.js API URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

---

## 🚀 Running the Project

```bash
# Development
npm run dev

# Visit
# Main site: http://localhost:3000
# Admin panel: http://localhost:3000/admin
# API: http://localhost:3000/api/products

# Production build
npm run build
npm run start
```

---

## 🆘 Troubleshooting

### "DATABASE_URL not found"
- Make sure `.env.local` exists in project root
- Restart dev server after adding environment variables

### "Failed to connect to MongoDB"
- Check MongoDB connection string
- Verify MongoDB is running (if local)
- Check IP whitelist in MongoDB Atlas (if cloud)

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Reset Database
```bash
# Delete all products
npx prisma db push --force-reset

# Reseed
npm run seed
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✨ Next Steps

1. ✅ Install dependencies
2. ✅ Set up MongoDB
3. ✅ Configure `.env.local`
4. ✅ Run `npx prisma generate`
5. ✅ Run `npm run seed` (optional)
6. ✅ Access admin dashboard at `/admin`
7. ✅ Start managing products!

---

Happy coding! 🎉
