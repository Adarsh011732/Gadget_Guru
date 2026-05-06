// SerpAPI Google Shopping integration
// Fetches real-time prices, store links, ratings from Google Shopping

const SERP_API_BASE = 'https://serpapi.com/search.json';

// Category-wise search queries for Google Shopping India
const CATEGORY_QUERIES = {
  Mobile: [
    'Samsung Galaxy S25 Ultra price India',
    'iPhone 16 Pro Max price India',
    'OnePlus 13 price India',
    'Google Pixel 9 Pro price India',
    'Xiaomi 15 Ultra price India',
    'Nothing Phone 3 price India',
    'iQOO 13 price India',
    'Realme GT 7 Pro price India',
    'Poco F7 Ultra price India',
    'Vivo X200 Pro price India',
    'Samsung Galaxy Z Fold 6 price India',
    'Samsung Galaxy Z Flip 6 price India',
    'iPhone 16 price India',
    'Redmi Note 14 Pro+ price India',
    'Vivo T3 Ultra price India',
    'CMF Phone 2 Pro price India',
    'Samsung Galaxy M55 5G price India',
    'Lava Agni 3 price India',
  ],
  Laptop: [
    'MacBook Air M4 2025 price India',
    'MacBook Pro 14 M4 Pro price India',
    'Dell XPS 16 2026 price India',
    'ASUS ROG Zephyrus G16 2025 price India',
    'Lenovo ThinkPad X1 Carbon Gen 13 price India',
    'HP Pavilion Plus 14 2025 price India',
    'Acer Nitro V 15 RTX 4060 price India',
    'ASUS Vivobook S 15 OLED 2025 price India',
    'MSI Raider 18 HX 2025 price India',
    'Samsung Galaxy Book4 Ultra price India',
    'Lenovo IdeaPad Slim 5 2025 price India',
    'ASUS Zenbook 14 OLED 2025 price India',
    'Acer Swift Go 14 2025 price India',
    'HP Omen 16 2025 price India',
    'Lenovo Legion Pro 7i 2025 price India',
  ],
  Tablet: [
    'iPad Pro M4 price India',
    'iPad Air M3 2025 price India',
    'Samsung Galaxy Tab S10 Ultra price India',
    'OnePlus Pad 2 price India',
    'Samsung Galaxy Tab A9+ price India',
    'Lenovo Tab P12 Pro price India',
    'Xiaomi Pad 7 Pro price India',
    'Samsung Galaxy Tab S9 FE price India',
    'iPad 10th generation price India',
    'Redmi Pad Pro price India',
  ],
  Headphone: [
    'Sony WH-1000XM6 price India',
    'Apple AirPods Max 2025 price India',
    'Bose QuietComfort Ultra Headphones price India',
    'Samsung Galaxy Buds3 Pro price India',
    'Apple AirPods Pro 3 price India',
    'Sennheiser Momentum 4 Wireless price India',
    'Jabra Elite 10 price India',
    'OnePlus Buds 3 Pro price India',
    'boAt Rockerz 551ANC price India',
  ],
  Smartwatch: [
    'Apple Watch Series 10 price India',
    'Samsung Galaxy Watch Ultra price India',
    'Google Pixel Watch 3 price India',
    'Noise ColorFit Pro 6 price India',
    'Amazfit T-Rex 3 price India',
    'Garmin Venu 3S price India',
    'OnePlus Watch 2 price India',
    'Samsung Galaxy Watch FE price India',
    'Fastrack Revoltt FS1 Pro price India',
    'boAt Lunar Oasis price India',
  ],
};

/**
 * Query Google Shopping via SerpAPI for a single product
 */
async function searchGoogleShopping(query, apiKey) {
  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: query,
    location: 'India',
    hl: 'en',
    gl: 'in',
    api_key: apiKey,
  });

  const res = await fetch(`${SERP_API_BASE}?${params}`);
  if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`);
  return res.json();
}

/**
 * Parse SerpAPI Google Shopping results into our product format
 */
function parseShoppingResults(data, category) {
  const results = data.shopping_results || [];
  if (!results.length) return null;

  // Group results by source (Amazon, Flipkart, etc.)
  const stores = {};
  const allPrices = [];

  results.slice(0, 10).forEach(item => {
    const price = parsePrice(item.extracted_price || item.price);
    if (!price) return;

    allPrices.push(price);
    const source = detectStore(item.source || item.link || '');
    if (source && !stores[source]) {
      stores[source] = {
        price,
        link: item.link || '',
        discounts: [],
      };
    }
  });

  if (!allPrices.length) return null;

  const topResult = results[0];
  const lowestPrice = Math.min(...allPrices);
  const rating = topResult.rating || null;
  const reviews = topResult.reviews || 0;

  return {
    livePrice: lowestPrice,
    rating: rating ? parseFloat(rating) : null,
    reviews,
    thumbnail: topResult.thumbnail || null,
    stores,
    lastUpdated: new Date(),
  };
}

function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return null;
  const cleaned = String(priceStr).replace(/[₹,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function detectStore(source) {
  const s = source.toLowerCase();
  if (s.includes('amazon')) return 'amazon';
  if (s.includes('flipkart')) return 'flipkart';
  if (s.includes('croma')) return 'croma';
  if (s.includes('reliance') || s.includes('jio')) return 'reliance';
  if (s.includes('vijay') || s.includes('sales')) return 'vijaysales';
  return null;
}

/**
 * Fetch live data for a specific product query
 */
export async function fetchLiveProductData(query, apiKey) {
  try {
    const data = await searchGoogleShopping(query, apiKey);
    return parseShoppingResults(data);
  } catch (err) {
    console.warn(`⚠️  SerpAPI fetch failed for "${query}":`, err.message);
    return null;
  }
}

/**
 * Fetch live data for all products in a category
 */
export async function fetchCategoryLiveData(category, apiKey) {
  const queries = CATEGORY_QUERIES[category] || [];
  const results = [];

  for (const query of queries) {
    const data = await fetchLiveProductData(query, apiKey);
    if (data) {
      results.push({ query, ...data });
    }
    // Small delay to respect rate limits
    await new Promise(r => setTimeout(r, 500));
  }

  return results;
}

/**
 * Auto-detect category from a search query
 */
function detectCategory(query) {
  const q = query.toLowerCase();
  if (/phone|mobile|iphone|galaxy s|pixel|oneplus|redmi|poco|vivo|oppo|realme/i.test(q)) return 'Mobile';
  if (/laptop|macbook|thinkpad|vivobook|zenbook|ideapad|legion|omen|nitro|xps/i.test(q)) return 'Laptop';
  if (/tablet|ipad|tab s|pad pro|pad air/i.test(q)) return 'Tablet';
  if (/headphone|earphone|earbuds|buds|airpods|wh-1000|quietcomfort|tune/i.test(q)) return 'Headphone';
  if (/watch|smartwatch|band|fitbit|garmin|amazfit/i.test(q)) return 'Smartwatch';
  return null;
}

/**
 * Infer budget category from price
 */
function inferBudget(price) {
  if (price <= 30000) return 'Budget';
  if (price <= 80000) return 'Medium';
  return 'High';
}

/**
 * Infer use cases from category and price
 */
function inferUseCases(category, price) {
  const base = ['Casual'];
  if (price <= 30000) base.push('Student');
  if (price >= 50000) base.push('Business');
  if (price >= 100000) base.push('Creative');
  if (category === 'Laptop' && price >= 80000) base.push('Developer');
  if (category === 'Mobile' && price >= 60000) base.push('Creative');
  return [...new Set(base)];
}

/**
 * Search with cache: check cache first, then SerpAPI, then save results
 */
export async function searchAndCache(query, apiKey) {
  // Dynamic imports to avoid circular dependency issues at module level
  const { default: CachedSearch } = await import('../models/CachedSearch.js');
  const { default: Product } = await import('../models/Product.js');

  const normalizedQuery = query.trim().toLowerCase();

  // 1. Check cache for recent results (< 24 hrs)
  const cached = await CachedSearch.findOne({
    query: normalizedQuery,
    expiresAt: { $gt: new Date() },
  }).sort({ fetchedAt: -1 });

  if (cached) {
    console.log(`📦 Cache hit for "${query}" (${cached.results.length} results)`);
    return { source: 'cache', results: cached.results, cachedAt: cached.fetchedAt };
  }

  // 2. Fetch from SerpAPI
  console.log(`🔍 Cache miss — fetching from SerpAPI: "${query}"`);
  let serpData;
  try {
    serpData = await searchGoogleShopping(query, apiKey);
  } catch (err) {
    console.warn(`⚠️  SerpAPI error for "${query}":`, err.message);
    return { source: 'error', results: [], error: err.message };
  }

  const shoppingResults = serpData.shopping_results || [];
  if (!shoppingResults.length) {
    return { source: 'api', results: [] };
  }

  // 3. Parse and normalize results
  const detectedCategory = detectCategory(query);
  const parsedResults = shoppingResults.slice(0, 15).map(item => {
    const price = parsePrice(item.extracted_price || item.price);
    return {
      title: item.title || '',
      price: price || 0,
      source: item.source || '',
      link: item.link || '',
      thumbnail: item.thumbnail || '',
      rating: item.rating ? parseFloat(item.rating) : null,
      reviews: item.reviews || 0,
    };
  }).filter(r => r.price > 0);

  // 4. Save to CachedSearch
  const CACHE_TTL_HOURS = 24;
  await CachedSearch.create({
    query: normalizedQuery,
    category: detectedCategory,
    results: parsedResults,
    fetchedAt: new Date(),
    expiresAt: new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000),
  });

  // 5. Auto-save unique products to Product collection
  let savedCount = 0;
  for (const item of parsedResults.slice(0, 8)) {
    const category = detectedCategory || 'Mobile';
    const productId = `serp_${normalizedQuery.replace(/\s+/g, '_').slice(0, 30)}_${item.price}`;

    const exists = await Product.findOne({ productId });
    if (exists) continue;

    try {
      await Product.create({
        productId,
        name: item.title.slice(0, 120),
        brand: detectBrand(item.title),
        category,
        basePrice: item.price,
        originalPrice: item.price,
        discountPct: 0,
        budgetCategory: inferBudget(item.price),
        useCases: inferUseCases(category, item.price),
        priorities: ['Performance', 'Display'],
        image: item.thumbnail || '',
        overview: `Discovered via search: "${query}". Price from ${item.source || 'online store'}.`,
        specs: {},
        rating: item.rating || 4.0,
        stock: 10,
        dealScore: Math.floor(Math.random() * 30) + 50,
        storePrices: {},
      });
      savedCount++;
    } catch (err) {
      // Duplicate or validation error — skip
    }
  }

  if (savedCount > 0) {
    console.log(`💾 Saved ${savedCount} new products from search "${query}"`);
  }

  return { source: 'api', results: parsedResults, newProducts: savedCount };
}

/**
 * Detect brand from product title
 */
function detectBrand(title) {
  const t = title.toLowerCase();
  const brands = [
    'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Redmi', 'Google', 'Sony', 'Bose',
    'JBL', 'Vivo', 'Oppo', 'Realme', 'Poco', 'Nothing', 'Asus', 'ASUS',
    'Lenovo', 'HP', 'Dell', 'Acer', 'MSI', 'boAt', 'Noise', 'Amazfit',
    'Garmin', 'Fastrack', 'Sennheiser', 'Jabra', 'iQOO', 'Motorola', 'LG',
  ];
  for (const brand of brands) {
    if (t.includes(brand.toLowerCase())) return brand;
  }
  return 'Other';
}

export { CATEGORY_QUERIES };

