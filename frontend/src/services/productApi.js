const API = import.meta.env.VITE_API_URL || 'https://gadget-guru-1.onrender.com';
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
  if (!product.category || !answers.category) return 0;
  if (product.category.toLowerCase() !== answers.category.toLowerCase()) return 0;

  // ── 2. Use case match (0–35 points) ──
  const productUseCases = product.useCases || [];
  const userUseCase = answers.useCase;
  
  if (productUseCases.includes(userUseCase)) {
    // Direct match: full points
    score += 35;
  } else if (userUseCase) {
    // Check if there's a related use case overlap
    const relatedMap = {
      'Creative': ['Business', 'Casual'],
      'Business': ['Creative', 'Student'],
      'Gamer': ['Developer', 'Creative'],
      'Student': ['Casual', 'Business'],
      'Casual': ['Student', 'Business'],
      'Developer': ['Gamer', 'Business'],
    };
    const related = relatedMap[userUseCase] || [];
    const hasRelated = productUseCases.some(uc => related.includes(uc));
    if (hasRelated) {
      score += 12; // partial credit
    }
  }

  // ── 3. Budget match (0–30 points) ──
  const productPrice = typeof product.basePrice === 'number' ? product.basePrice : Number(product.basePrice || 0);
  
  if (typeof answers.budget === 'number') {
    if (productPrice > 0 && productPrice <= answers.budget) {
      score += 30; // Within budget
    } else if (productPrice > answers.budget) {
      // Soften penalty: -30 instead of -50
      // This allows products slightly over budget to still show up with lower scores
      score -= 30; 
    }
  } else if (answers.budget) {
    const budgetOrder = ['Budget', 'Medium', 'High'];
    const userBudgetIdx = budgetOrder.indexOf(answers.budget);
    const productBudgetIdx = budgetOrder.indexOf(product.budgetCategory || 'Medium');

    if (userBudgetIdx !== -1 && productBudgetIdx !== -1) {
      if (userBudgetIdx === productBudgetIdx) {
        score += 30;
      } else if (productBudgetIdx < userBudgetIdx) {
        score += 20;
      } else if (productBudgetIdx > userBudgetIdx) {
        score -= 30; // Soften penalty
      }
    }
  }

  // ── 4. Priority match (0–20 points, 10 per match) ──
  const userPriorities = answers.priorities || [];
  const productPriorities = product.priorities || [];
  const priorMatches = userPriorities.filter(p => productPriorities.includes(p)).length;
  score += priorMatches * 10;

  // ── 5. Quality bonuses (0–15 points) ──
  const rating = product.rating || 0;
  const dealScore = product.dealScore || 0;
  const discountPct = product.discountPct || 0;

  if (rating >= 4.7) score += 5;
  else if (rating >= 4.4) score += 3;

  if (dealScore >= 90) score += 5;
  else if (dealScore >= 75) score += 3;

  if (discountPct >= 10) score += 5;
  else if (discountPct >= 5) score += 2;

  // ── 6. Verification Bonus (New) ──
  // Curated products get a small boost over auto-discovered ones
  const isCurated = !product.productId || !product.productId.startsWith('serp_');
  if (isCurated) {
    score += 10;
  }

  return Math.max(0, Math.min(score, 100));
}
