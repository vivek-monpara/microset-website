import { prisma } from '@/lib/prisma';

const products = [
  // Featured Products
  {
    title: 'Gold Melting Furnace',
    description: 'High-capacity electric furnace for precision gold melting and casting.',
    category: 'Featured',
    sku: 'GMF-001',
    price: 15000,
    inStock: true,
  },
  {
    title: 'Gas Micro Torch',
    description: 'Portable, precise gas torch for jewelry soldering and detailed work.',
    category: 'Featured',
    sku: 'GMT-002',
    price: 2500,
    inStock: true,
  },
  {
    title: 'Micromotor Machine',
    description: 'Professional micromotor for precision grinding, polishing, and shaping.',
    category: 'Featured',
    sku: 'MMM-003',
    price: 8000,
    inStock: true,
  },
  {
    title: 'Digital Weighing Scale',
    description: 'Precision digital scale for accurate gold and jewelry weight measurement.',
    category: 'Featured',
    sku: 'DWS-004',
    price: 3000,
    inStock: true,
  },
  {
    title: 'Jewellery Saw Frame',
    description: 'Premium saw frame for intricate jewelry cutting and design work.',
    category: 'Featured',
    sku: 'JSF-005',
    price: 1200,
    inStock: true,
  },
  {
    title: 'Master Goldsmith Toolkit',
    description: 'Complete toolkit with essential tools for professional goldsmith work.',
    category: 'Featured',
    sku: 'MGT-006',
    price: 18000,
    inStock: true,
  },

  // Export Products
  {
    title: 'Industrial Gold Furnace Pro',
    description: 'Heavy-duty furnace designed for high-volume industrial gold processing and casting operations.',
    category: 'Export',
    sku: 'IGF-007',
    price: 45000,
    inStock: true,
  },
  {
    title: 'Professional Polishing Machine',
    description: 'Advanced polishing equipment for fine jewelry finishing with adjustable speed control.',
    category: 'Export',
    sku: 'PPM-008',
    price: 25000,
    inStock: true,
  },
  {
    title: 'CNC Engraving Machine',
    description: 'Precision CNC machine for detailed engraving and customization on precious metals.',
    category: 'Export',
    sku: 'CNC-009',
    price: 120000,
    inStock: true,
  },
  {
    title: 'Vacuum Casting System',
    description: 'Advanced vacuum casting system for perfect gold jewelry casting with zero impurities.',
    category: 'Export',
    sku: 'VCS-010',
    price: 65000,
    inStock: true,
  },
  {
    title: 'Digital Purity Tester',
    description: 'Certified digital tester for accurate gold purity and alloy composition analysis.',
    category: 'Export',
    sku: 'DPT-011',
    price: 5500,
    inStock: true,
  },
  {
    title: 'Industrial Saw Master',
    description: 'Heavy-duty jewellery saw with precision cutting for intricate designs and patterns.',
    category: 'Export',
    sku: 'ISM-012',
    price: 8500,
    inStock: true,
  },

  // Hand Tools
  {
    title: 'Jeweler\'s Hammer Set',
    description: 'Professional set of jeweler\'s hammers for metalwork and shaping.',
    category: 'Hand Tools',
    sku: 'JHS-013',
    price: 2000,
    inStock: true,
  },
  {
    title: 'Precision Pliers Kit',
    description: 'Complete kit of specialized pliers for jewelry making and repair.',
    category: 'Hand Tools',
    sku: 'PPK-014',
    price: 3500,
    inStock: true,
  },

  // Machinery
  {
    title: 'Electric Casting Machine',
    description: 'Automated casting machine with temperature control and precision settings.',
    category: 'Machinery',
    sku: 'ECM-015',
    price: 55000,
    inStock: true,
  },
];

async function seed() {
  console.log('Starting seed...');

  try {
    // Clear existing products
    await prisma.product.deleteMany({});

    // Create products
    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }

    console.log(`✅ Seeded ${products.length} products successfully!`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
