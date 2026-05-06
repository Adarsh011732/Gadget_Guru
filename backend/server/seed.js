import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';

// Import product data
import { mobiles } from '../src/data/mobiles.js';
import { laptops } from '../src/data/laptops.js';
import { tablets, headphones, smartwatches } from '../src/data/accessories.js';

dotenv.config();

const allProducts = [...mobiles, ...laptops, ...tablets, ...headphones, ...smartwatches];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Only delete curated products, keep SerpAPI-discovered ones
    const serpCount = await Product.countDocuments({ productId: /^serp_/ });
    await Product.deleteMany({ productId: { $not: /^serp_/ } });
    console.log(`🗑️  Cleared curated products (kept ${serpCount} SerpAPI-discovered products)`);

    const docs = allProducts.map(p => ({ ...p, productId: p.id }));
    const inserted = await Product.insertMany(docs);
    console.log(`🌱 Seeded ${inserted.length} curated products into database`);

    // Print summary
    const totalCount = await Product.countDocuments();
    const categories = {};
    inserted.forEach(p => { categories[p.category] = (categories[p.category] || 0) + 1; });
    console.log('\n📊 Curated Products Summary:');
    Object.entries(categories).forEach(([cat, count]) => console.log(`   ${cat}: ${count}`));
    console.log(`\n📦 Total products in database: ${totalCount} (${inserted.length} curated + ${serpCount} discovered)`);

    await mongoose.disconnect();
    console.log('\n✅ Done! Database seeded successfully.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
