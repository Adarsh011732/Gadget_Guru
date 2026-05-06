import express from 'express';
import Product from '../models/Product.js';
import { fetchLiveProductData } from '../services/serpApi.js';

const router = express.Router();

// POST /api/sync - Update all products with live Google Shopping data
router.post('/', async (req, res) => {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey || apiKey === 'your_serpapi_key_here') {
    return res.status(400).json({ success: false, message: 'SERP_API_KEY not configured in .env' });
  }

  try {
    const products = await Product.find({});
    let updated = 0;

    for (const product of products) {
      const query = `${product.name} price India buy`;
      const liveData = await fetchLiveProductData(query, apiKey);

      if (liveData) {
        const updateFields = { 'lastSynced': new Date() };

        if (liveData.livePrice) {
          updateFields.basePrice = liveData.livePrice;
        }
        if (liveData.rating) {
          updateFields.rating = liveData.rating;
        }
        if (liveData.thumbnail) {
          updateFields.image = liveData.thumbnail;
        }
        if (liveData.stores) {
          const storePrices = {};
          Object.entries(liveData.stores).forEach(([store, data]) => {
            storePrices[store] = { price: data.price, link: data.link, discounts: [] };
          });
          updateFields.storePrices = storePrices;
        }

        await Product.findByIdAndUpdate(product._id, updateFields);
        updated++;
        console.log(`✅ Synced: ${product.name} → ₹${liveData.livePrice || 'N/A'}`);
      }

      // Rate limit: 500ms between requests
      await new Promise(r => setTimeout(r, 500));
    }

    res.json({ success: true, message: `Synced ${updated}/${products.length} products with live data` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/sync/:id - Sync a single product
router.post('/:id', async (req, res) => {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey || apiKey === 'your_serpapi_key_here') {
    return res.status(400).json({ success: false, message: 'SERP_API_KEY not configured' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const liveData = await fetchLiveProductData(`${product.name} price India buy`, apiKey);
    if (!liveData) {
      return res.json({ success: false, message: 'No live data found for this product' });
    }

    if (liveData.livePrice) product.basePrice = liveData.livePrice;
    if (liveData.rating) product.rating = liveData.rating;
    if (liveData.thumbnail) product.image = liveData.thumbnail;
    product.lastSynced = new Date();
    await product.save();

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
