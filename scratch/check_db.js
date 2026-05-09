
import mongoose from 'mongoose';
import '../backend/server/config/env.js';
import Product from '../backend/server/models/Product.js';

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({});
  console.log('Total products:', products.length);
  const categories = [...new Set(products.map(p => p.category))];
  console.log('Categories in DB:', categories);
  const firstProduct = products[0];
  if (firstProduct) {
    console.log('First product sample:', {
      name: firstProduct.name,
      category: firstProduct.category,
      basePrice: firstProduct.basePrice,
      rating: firstProduct.rating,
      buyAdvice: firstProduct.buyAdvice
    });
  }
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
