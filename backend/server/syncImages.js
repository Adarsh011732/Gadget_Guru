// Fetch real product images from Google Shopping via SerpAPI
// and update all products in MongoDB

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';

dotenv.config();

const SERP_API_BASE = 'https://serpapi.com/search.json';

async function fetchProductImage(productName, apiKey) {
  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: productName,
    location: 'India',
    hl: 'en',
    gl: 'in',
    api_key: apiKey,
    num: 3,
  });

  try {
    const res = await fetch(`${SERP_API_BASE}?${params}`);
    if (!res.ok) {
      console.warn(`  ⚠️  API returned ${res.status} for "${productName}"`);
      return null;
    }
    const data = await res.json();
    const results = data.shopping_results || [];

    if (results.length > 0) {
      // Pick the first result with a thumbnail
      for (const item of results) {
        if (item.thumbnail) {
          return {
            thumbnail: item.thumbnail,
            title: item.title,
            source: item.source || '',
            price: item.extracted_price || null,
          };
        }
      }
    }
    return null;
  } catch (err) {
    console.warn(`  ❌ Fetch error for "${productName}":`, err.message);
    return null;
  }
}

async function syncImages() {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey || apiKey === 'your_serpapi_key_here') {
    console.error('❌ SERP_API_KEY not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const products = await Product.find({});
  console.log(`🔍 Fetching real images for ${products.length} products via Google Shopping...\n`);

  let updated = 0;
  let failed = 0;

  for (const product of products) {
    const query = product.name;
    console.log(`📦 ${query}...`);

    const result = await fetchProductImage(query, apiKey);

    if (result && result.thumbnail) {
      await Product.findByIdAndUpdate(product._id, { image: result.thumbnail });
      console.log(`   ✅ Image updated → ${result.thumbnail.substring(0, 80)}...`);
      updated++;
    } else {
      console.log(`   ⚠️  No image found, keeping existing`);
      failed++;
    }

    // Rate limit: 1 second between requests to stay within free tier
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n📊 Results: ${updated} updated, ${failed} unchanged`);
  await mongoose.disconnect();
  console.log('✅ Done!');
}

syncImages();
