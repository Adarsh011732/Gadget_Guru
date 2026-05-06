const API = import.meta.env.VITE_API_URL || 'https://YOUR-RENDER-BACKEND.onrender.com';
const API_BASE = `${API}/api`;

let cachedProducts = null;

export async function fetchAllGadgets() {
  if (cachedProducts) return cachedProducts;

  try {
    const res = await fetch(`${API_BASE}/products`);
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      cachedProducts = json.data.map(p => ({
        ...p,
        id: p._id || p.productId || p.id,
      }));
      return cachedProducts;
    }
  } catch (err) {
    console.warn('Backend unavailable, using local data fallback:', err.message);
  }

  const [{ mobiles }, { laptops }, { tablets, headphones, smartwatches }] = await Promise.all([
    import('../data/mobiles.js'),
    import('../data/laptops.js'),
    import('../data/accessories.js'),
  ]);
  cachedProducts = [...mobiles, ...laptops, ...tablets, ...headphones, ...smartwatches];
  return cachedProducts;
}

/**
 * Search products via the backend search-and-cache endpoint.
 * Returns both local DB matches and live SerpAPI results.
 */
export async function searchProducts(query, category) {
  try {
    const params = new URLSearchParams({ q: query });
    if (category && category !== 'All') params.set('category', category);

    const res = await fetch(`${API_BASE}/search?${params}`);
    const json = await res.json();

    if (json.success) {
      // If new products were saved, invalidate the local cache
      if (json.newProductsSaved > 0) {
        cachedProducts = null;
      }
      return {
        products: (json.data || []).map(p => ({
          ...p,
          id: p._id || p.productId || p.id,
        })),
        liveResults: json.liveResults || [],
        source: json.source,
        newProductsSaved: json.newProductsSaved || 0,
      };
    }
    return { products: [], liveResults: [], source: 'error' };
  } catch (err) {
    console.warn('Search API error:', err.message);
    return { products: [], liveResults: [], source: 'error' };
  }
}

/**
 * Force cache invalidation (e.g., after live search adds products)
 */
export function invalidateCache() {
  cachedProducts = null;
}

/**
 * Smart scoring: 0–100 scale.
 * Category must match (hard filter, not scored here since we filter externally).
 * Use case match is heavily weighted because it defines the product persona.
 * Budget match is critical — wrong budget should heavily penalize.
 * Priorities give a boost for feature alignment.
 * Rating/deals give minor bonuses.
 */
export function scoreProduct(product, answers) {
  let score = 0;

  // ── 1. Category match (hard requirement, 0 if wrong) ──
  if (product.category !== answers.category) return 0;

  // ── 2. Use case match (0–35 points) ──
  const productUseCases = product.useCases || [];
  if (productUseCases.includes(answers.useCase)) {
    // Direct match: full points
    score += 35;
  } else {
    // Check if there's a related use case overlap
    const relatedMap = {
      'Creative': ['Business', 'Casual'],
      'Business': ['Creative', 'Student'],
      'Gamer': ['Developer', 'Creative'],
      'Student': ['Casual', 'Business'],
      'Casual': ['Student', 'Business'],
      'Developer': ['Gamer', 'Business'],
    };
    const related = relatedMap[answers.useCase] || [];
    const hasRelated = productUseCases.some(uc => related.includes(uc));
    if (hasRelated) {
      score += 12; // partial credit
    }
    // else: 0 points — no match at all
  }

  // ── 3. Budget match (0–30 points) ──
  if (typeof answers.budget === 'number') {
    if (product.basePrice <= answers.budget) {
      score += 30; // Within budget
    } else {
      score -= 50; // Over budget (dealbreaker)
    }
  } else {
    const budgetOrder = ['Budget', 'Medium', 'High'];
    const userBudgetIdx = budgetOrder.indexOf(answers.budget);
    const productBudgetIdx = budgetOrder.indexOf(product.budgetCategory);

    if (userBudgetIdx === productBudgetIdx) {
      score += 30; // exact match
    } else if (productBudgetIdx < userBudgetIdx) {
      score += 20; // product is cheaper than max budget (acceptable)
    } else if (productBudgetIdx > userBudgetIdx) {
      score -= 50; // product is more expensive than budget (dealbreaker)
    }
  }

  // ── 4. Priority match (0–20 points, 10 per match) ──
  const userPriorities = answers.priorities || [];
  const productPriorities = product.priorities || [];
  const priorMatches = userPriorities.filter(p => productPriorities.includes(p)).length;
  score += priorMatches * 10;

  // ── 5. Quality bonuses (0–15 points) ──
  // High rating
  if (product.rating >= 4.7) score += 5;
  else if (product.rating >= 4.4) score += 3;

  // Good deal
  if (product.dealScore >= 90) score += 5;
  else if (product.dealScore >= 75) score += 3;

  // Active discount
  if (product.discountPct >= 10) score += 5;
  else if (product.discountPct >= 5) score += 2;

  return Math.min(score, 100);
}
