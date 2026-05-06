import express from 'express';
import { searchAndCache } from '../services/serpApi.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/search?q=<query>&category=<optional>
// Searches SerpAPI with cache layer, auto-saves new products
router.get('/', async (req, res) => {
  const { q, category } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Query must be at least 2 characters' });
  }

  const apiKey = process.env.SERP_API_KEY;

  // Always search local DB first
  const localResults = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { overview: { $regex: q, $options: 'i' } },
    ],
    ...(category && category !== 'All' ? { category } : {}),
  }).sort({ dealScore: -1 }).limit(20);

  // If no API key, return only local results
  if (!apiKey || apiKey === 'your_serpapi_key_here') {
    return res.json({
      success: true,
      source: 'local',
      count: localResults.length,
      data: localResults,
      liveResults: [],
    });
  }

  // Fetch from SerpAPI with cache
  try {
    const searchQuery = category && category !== 'All'
      ? `${q} ${category} price India buy`
      : `${q} price India buy`;

    const liveData = await searchAndCache(searchQuery, apiKey);

    // Merge: local DB products first, then live API results
    res.json({
      success: true,
      source: liveData.source,
      count: localResults.length,
      data: localResults,
      liveResults: liveData.results || [],
      newProductsSaved: liveData.newProducts || 0,
    });
  } catch (error) {
    // On error, still return local results
    res.json({
      success: true,
      source: 'local-fallback',
      count: localResults.length,
      data: localResults,
      liveResults: [],
      error: error.message,
    });
  }
});

// GET /api/search/stats — shows cache stats
router.get('/stats', async (req, res) => {
  try {
    const { default: CachedSearch } = await import('../models/CachedSearch.js');
    const totalCached = await CachedSearch.countDocuments();
    const totalProducts = await Product.countDocuments();
    const serpProducts = await Product.countDocuments({ productId: /^serp_/ });

    res.json({
      success: true,
      data: {
        cachedSearches: totalCached,
        totalProducts,
        serpDiscoveredProducts: serpProducts,
        curatedProducts: totalProducts - serpProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
