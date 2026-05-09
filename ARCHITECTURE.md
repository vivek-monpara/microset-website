# Architecture & Workflow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MICROSET JK Website                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Next.js Application                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         React Components                    │   │   │
│  │  ├─────────────────────────────────────────────┤   │   │
│  │  │ • FeaturedProducts.tsx                      │   │   │
│  │  │ • ExportProducts.tsx                        │   │   │
│  │  │ • Admin Dashboard (/admin)                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │              ↓ (useProducts hook)                    │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         API Routes (Next.js)                │   │   │
│  │  ├─────────────────────────────────────────────┤   │   │
│  │  │ • POST   /api/products      (Create)        │   │   │
│  │  │ • GET    /api/products      (Read All)      │   │   │
│  │  │ • GET    /api/products/[id] (Read One)      │   │   │
│  │  │ • PUT    /api/products/[id] (Update)        │   │   │
│  │  │ • DELETE /api/products/[id] (Delete)        │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │              ↓ (Prisma ORM)                         │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │       Prisma Client (lib/prisma.ts)        │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓ (Database Driver)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collection: products                                │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  {                                                   │   │
│  │    _id: ObjectId,                                    │   │
│  │    title: "Gold Melting Furnace",                    │   │
│  │    description: "...",                               │   │
│  │    category: "Featured",                             │   │
│  │    price: 15000,                                     │   │
│  │    inStock: true,                                    │   │
│  │    createdAt: ISODate(),                             │   │
│  │    updatedAt: ISODate()                              │   │
│  │  }                                                   │   │
│  │  ... more products ...                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Reading Products (GET Request)

```
User visits website
        ↓
React Component loads (e.g., FeaturedProducts.tsx)
        ↓
useProducts('Featured') hook called
        ↓
fetch('/api/products?category=Featured')
        ↓
Next.js API Route: app/api/products/route.ts
        ↓
prisma.product.findMany({ where: { category: 'Featured' } })
        ↓
Prisma Client sends query to MongoDB
        ↓
MongoDB returns matching documents
        ↓
API returns JSON response
        ↓
Component receives products
        ↓
Component renders <ProductCard> components
        ↓
User sees products on website
```

### Creating Product (POST Request)

```
User clicks "Add Product" in admin panel
        ↓
Admin fills form (title, description, category, etc.)
        ↓
User clicks "Create Product"
        ↓
form.onSubmit event triggered
        ↓
POST request to /api/products with product data
        ↓
Next.js API Route: app/api/products/route.ts
        ↓
Extract body.title, body.description, etc.
        ↓
prisma.product.create({ data: {...} })
        ↓
Prisma Client sends INSERT query to MongoDB
        ↓
MongoDB creates document with auto-generated _id
        ↓
API returns created product with _id
        ↓
Admin dashboard refreshes product list
        ↓
New product appears in table
```

### Updating Product (PUT Request)

```
User clicks "Edit" button for product
        ↓
Admin panel loads product data into form
        ↓
User changes fields (price, description, etc.)
        ↓
User clicks "Update Product"
        ↓
PUT request to /api/products/{productId}
        ↓
Next.js API Route: app/api/products/[id]/route.ts
        ↓
prisma.product.update({ where: { id }, data: {...} })
        ↓
Prisma Client sends UPDATE query to MongoDB
        ↓
MongoDB updates document (updatedAt auto-set)
        ↓
API returns updated product
        ↓
Admin dashboard refreshes
        ↓
User sees changes reflected
```

### Deleting Product (DELETE Request)

```
User clicks "Delete" button
        ↓
System confirms "Are you sure?"
        ↓
User confirms delete
        ↓
DELETE request to /api/products/{productId}
        ↓
Next.js API Route: app/api/products/[id]/route.ts
        ↓
prisma.product.delete({ where: { id } })
        ↓
Prisma Client sends DELETE query to MongoDB
        ↓
MongoDB removes document
        ↓
API returns success message
        ↓
Admin dashboard refreshes
        ↓
Product removed from table
```

---

## Component Dependency Graph

```
Page (app/page.tsx)
    ├── Navbar
    ├── HeroSection
    ├── FeaturedProducts [DB]
    │   ├── useProducts hook
    │   └── ProductCard (multiple)
    ├── WhyChooseUs
    ├── ManufacturingCapabilities
    ├── ExportProducts [DB]
    │   ├── useProducts hook
    │   └── ProductCard (multiple)
    ├── TrustBadges
    ├── WhatsAppCTA
    └── Footer

AdminDashboard (app/admin/page.tsx) [DB]
    ├── Product Form
    │   ├── Input fields
    │   └── Category select
    └── Products Table
        ├── Edit button
        └── Delete button

Legend:
[DB] = Connected to database via API
```

---

## API Call Examples

### Example 1: Fetch All Featured Products

```
REQUEST:
GET /api/products?category=Featured

RESPONSE (JSON):
[
  {
    "id": "664a2c8d9f1b2c3d4e5f6g7h",
    "title": "Gold Melting Furnace",
    "description": "High-capacity electric furnace...",
    "category": "Featured",
    "price": 15000,
    "inStock": true,
    "createdAt": "2024-05-08T10:00:00.000Z",
    "updatedAt": "2024-05-08T10:00:00.000Z"
  },
  {
    "id": "674b3d9e0g2c3d4e5f6g7h8i",
    "title": "Gas Micro Torch",
    "description": "Portable, precise gas torch...",
    "category": "Featured",
    "price": 2500,
    "inStock": true,
    "createdAt": "2024-05-08T10:05:00.000Z",
    "updatedAt": "2024-05-08T10:05:00.000Z"
  }
]
```

### Example 2: Create New Product

```
REQUEST:
POST /api/products
Content-Type: application/json

{
  "title": "Diamond Saw Blade",
  "description": "Premium diamond cutting blade",
  "category": "Hand Tools",
  "price": 1800,
  "sku": "DSB-001",
  "inStock": true
}

RESPONSE (201 Created):
{
  "id": "785c4e0f1h3d4e5f6g7h8i9j",
  "title": "Diamond Saw Blade",
  "description": "Premium diamond cutting blade",
  "category": "Hand Tools",
  "price": 1800,
  "sku": "DSB-001",
  "inStock": true,
  "image": null,
  "createdAt": "2024-05-08T10:10:00.000Z",
  "updatedAt": "2024-05-08T10:10:00.000Z"
}
```

### Example 3: Update Product

```
REQUEST:
PUT /api/products/664a2c8d9f1b2c3d4e5f6g7h
Content-Type: application/json

{
  "price": 16000,
  "inStock": false
}

RESPONSE:
{
  "id": "664a2c8d9f1b2c3d4e5f6g7h",
  "title": "Gold Melting Furnace",
  "description": "High-capacity electric furnace...",
  "category": "Featured",
  "price": 16000,  // Updated
  "inStock": false,  // Updated
  "createdAt": "2024-05-08T10:00:00.000Z",
  "updatedAt": "2024-05-08T10:15:00.000Z"  // Auto-updated
}
```

### Example 4: Delete Product

```
REQUEST:
DELETE /api/products/664a2c8d9f1b2c3d4e5f6g7h

RESPONSE:
{
  "message": "Product deleted successfully"
}
```

---

## Database Schema Relationships

```
┌──────────────────────────────────────┐
│         Product Collection           │
├──────────────────────────────────────┤
│ _id          : ObjectId (Primary Key)│
│ title        : String                │
│ description  : String                │
│ image        : String (Optional)     │
│ price        : Float (Optional)      │
│ category     : String (Indexed)      │
│ sku          : String (Unique Idx)   │
│ inStock      : Boolean               │
│ createdAt    : DateTime (Indexed)    │
│ updatedAt    : DateTime              │
└──────────────────────────────────────┘
        ↓
MongoDB Indexes:
  - category_1 (for quick filtering)
  - createdAt_1 (for sorting)
  - sku_1 (for unique constraint)
```

---

## Environment & Configuration Flow

```
.env.local
    ↓
DATABASE_URL = "mongodb+srv://user:pass@cluster.mongodb.net/db"
    ↓
prisma/schema.prisma reads DATABASE_URL
    ↓
lib/prisma.ts creates Prisma Client instance
    ↓
API routes use prisma.product.* methods
    ↓
Queries executed against MongoDB
    ↓
Results returned to frontend
```

---

## Error Handling Flow

```
User action (fetch/create/update/delete)
    ↓
API call made
    ↓
Try block executes
    ├─ Success → Return 200/201 response
    └─ Error → Catch block
        ↓
        Log error
        ↓
        Return error response (400/404/500)
        ↓
Component displays error message to user
```

---

## Deployment Architecture (Production)

```
┌────────────────────────────────────────────────────────────┐
│                      Vercel / Hosting                      │
├────────────────────────────────────────────────────────────┤
│  Next.js App (Running on Edge/Serverless)                 │
│  ├─ Pages & Components                                     │
│  ├─ API Routes (Serverless Functions)                      │
│  └─ Static Assets                                          │
└────────────────────────────────────────────────────────────┘
              ↓ (HTTPS)
┌────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                    │
├────────────────────────────────────────────────────────────┤
│  • Managed MongoDB service                                  │
│  • Automatic backups                                        │
│  • Replication & failover                                   │
│  • Scalable storage                                         │
└────────────────────────────────────────────────────────────┘
```

---

## File Interaction Diagram

```
When user visits /admin:
    ↓
app/admin/page.tsx (React Component)
    ↓
    Uses: /api/products/route.ts (API)
    Uses: hooks/useProducts.ts (Custom Hook)
    Uses: /components/ui/button.tsx (UI)
    Uses: lib/prisma.ts (Database)
    ↓
    Renders: Product form + table
    Connects to: MongoDB via Prisma

When user creates product:
    ↓
app/admin/page.tsx (Form Submit)
    ↓
POST /api/products/route.ts
    ↓
lib/prisma.ts (prisma.product.create)
    ↓
MongoDB (INSERT)
    ↓
Response back to component
    ↓
Page refreshes, shows new product
```

---

## Security Layers

```
User ↓
  └─ Frontend validation (React Form)
  └─ HTTPS encryption
  └─ Next.js API Route (Server-side)
  └─ Prisma Client (Parameterized queries - prevents SQL injection)
  └─ MongoDB (Document-level security)
  └─ Environment variables (Hidden credentials)
```

---

This architecture provides:
✅ **Separation of Concerns** - Frontend, API, Database
✅ **Type Safety** - Prisma ensures correct types
✅ **Performance** - Indexes on frequently accessed fields
✅ **Scalability** - Can add more products/users easily
✅ **Maintainability** - Clear data flow and structure
✅ **Security** - Parameterized queries, env variables
