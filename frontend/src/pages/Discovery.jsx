import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Square, CheckSquare, Scale, Trash2, Loader, Zap } from 'lucide-react';
import { fetchAllGadgets, searchProducts } from '../services/productApi';

const CATEGORIES = ['All', 'Mobile', 'Laptop', 'Tablet', 'Headphone', 'Smartwatch'];

const CategoryPill = ({ label, active, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    style={{
      padding: '0.5rem 1.25rem',
      borderRadius: '50px',
      border: '1px solid',
      borderColor: active ? '#000' : 'rgba(0,0,0,0.15)',
      background: active ? '#000' : 'transparent',
      color: active ? '#fff' : '#000',
      fontWeight: 500,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
  >
    {label}
  </motion.button>
);

const ProductCard = ({ p, inCompare, onToggleCompare, disabled }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -6 }}
      style={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
      }}
    >
      {/* Image area */}
      <div style={{ height: '200px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {!imgError && p.image ? (
          <img
            src={p.image}
            alt={p.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.75rem' }}
          />
        ) : (
          <div style={{ fontSize: '3.5rem' }}>
            {p.category === 'Mobile' ? '📱' : p.category === 'Laptop' ? '💻' : p.category === 'Tablet' ? '🖥️' : p.category === 'Headphone' ? '🎧' : '⌚'}
          </div>
        )}
        {p.discountPct > 5 && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: '#000', color: '#fff',
            padding: '0.2rem 0.6rem', borderRadius: '50px',
            fontSize: '0.72rem', fontWeight: 700
          }}>
            {p.discountPct}% OFF
          </div>
        )}
        {p.dealScore > 80 && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: '#ff4d00', color: '#fff',
            padding: '0.2rem 0.55rem', borderRadius: '50px',
            fontSize: '0.72rem', fontWeight: 700
          }}>
            🔥 Hot
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{p.category}</div>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>{'★'.repeat(Math.round(p.rating))}</div>
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', lineHeight: 1.3 }}>{p.name}</h3>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' }}>₹{p.basePrice.toLocaleString('en-IN')}</div>
        {p.originalPrice > p.basePrice && (
          <div style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'line-through', marginBottom: '0.4rem' }}>
            ₹{p.originalPrice.toLocaleString('en-IN')}
          </div>
        )}
        <p style={{ fontSize: '0.85rem', color: '#666', flex: 1, marginBottom: '1rem', lineHeight: 1.5 }}>
          {p.overview.length > 90 ? p.overview.slice(0, 90) + '…' : p.overview}
        </p>

        <button
          onClick={() => onToggleCompare(p.id, p.category)}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: '10px',
            border: '1.5px solid #000',
            background: inCompare ? '#000' : '#fff',
            color: inCompare ? '#fff' : '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.4 : 1,
            fontWeight: 500,
            fontSize: '0.9rem',
            transition: 'all 0.2s',
          }}
        >
          {inCompare ? <CheckSquare size={15} /> : <Square size={15} />}
          {inCompare ? 'Added' : 'Compare'}
        </button>
      </div>
    </motion.div>
  );
};

const Discovery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [page, setPage] = useState(1);
  const [liveSearching, setLiveSearching] = useState(false);
  const [liveNotice, setLiveNotice] = useState(null);
  const PER_PAGE = 12;

  useEffect(() => {
    fetchAllGadgets()
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Live search handler — calls SerpAPI with cache
  const handleLiveSearch = async () => {
    if (!search.trim() || search.trim().length < 2) return;
    setLiveSearching(true);
    setLiveNotice(null);
    try {
      const result = await searchProducts(search, activeCategory);
      if (result.newProductsSaved > 0) {
        // Refresh product list to include newly discovered products
        const refreshed = await fetchAllGadgets();
        setProducts(refreshed);
        setLiveNotice(`🔥 Discovered ${result.newProductsSaved} new product${result.newProductsSaved > 1 ? 's' : ''} from live search!`);
      } else if (result.products.length > 0) {
        setLiveNotice(`✅ ${result.products.length} matching products found (source: ${result.source})`);
      } else {
        setLiveNotice('No new products found for this search.');
      }
    } catch (err) {
      setLiveNotice('⚠️ Live search unavailable right now.');
    }
    setLiveSearching(false);
    setTimeout(() => setLiveNotice(null), 5000);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim().length >= 2) {
      handleLiveSearch();
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const pagedProducts = filteredProducts.slice(0, page * PER_PAGE);
  const hasMore = pagedProducts.length < filteredProducts.length;

  const comparedProducts = compareList.map(id => products.find(p => p.id === id)).filter(Boolean);
  const specKeys = new Set();
  comparedProducts.forEach(p => Object.keys(p.specs).forEach(k => specKeys.add(k)));

  const toggleCompare = (id, category) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(c => c !== id));
    } else {
      if (compareList.length > 0 && comparedProducts[0]?.category !== category) return;
      if (compareList.length >= 3) return;
      setCompareList([...compareList, id]);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', gap: '1rem' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader size={40} />
        </motion.div>
        <p style={{ color: '#888' }}>Loading latest products…</p>
      </div>
    );
  }

  if (showCompare) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem 5%', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Comparison</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => { setCompareList([]); setShowCompare(false); }}>
              <Trash2 size={14} /> Clear All
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowCompare(false)}>
              Back to Grid
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>Feature</th>
                {comparedProducts.map(p => (
                  <th key={p.id} style={{ padding: '1.25rem', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.07)', minWidth: 200 }}>
                    <img src={p.image} alt={p.name} onError={e => e.target.style.display = 'none'} style={{ height: 90, objectFit: 'contain', marginBottom: '0.75rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</div>
                    <div style={{ color: '#555', fontWeight: 400, fontSize: '0.9rem' }}>₹{p.basePrice.toLocaleString('en-IN')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.9rem 1.5rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' }}>RATING</td>
                {comparedProducts.map(p => (
                  <td key={p.id} style={{ padding: '0.9rem', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(p.rating))}</span> {p.rating}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '0.9rem 1.5rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>DEAL SCORE</td>
                {comparedProducts.map(p => (
                  <td key={p.id} style={{ padding: '0.9rem', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    {p.dealScore}/100
                  </td>
                ))}
              </tr>
              {Array.from(specKeys).map(spec => (
                <tr key={spec}>
                  <td style={{ padding: '0.9rem 1.5rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fafafa', textTransform: 'uppercase', fontSize: '0.85rem' }}>{spec}</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} style={{ padding: '0.9rem', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem' }}>
                      {p.specs[spec] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ padding: '2rem 5%', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>
          Discovery <span style={{ color: '#888' }}>& Compare</span>
        </h1>
        <div style={{ position: 'relative', minWidth: 280 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search by name, brand, category…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            onKeyDown={handleSearchKeyDown}
            style={{
              width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem',
              borderRadius: '50px', border: '1px solid rgba(0,0,0,0.2)',
              background: 'transparent', outline: 'none',
              fontFamily: 'inherit', fontSize: '0.95rem'
            }}
          />
          {search.trim().length >= 2 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLiveSearch}
              disabled={liveSearching}
              style={{
                position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                background: '#000', color: '#fff',
                border: 'none', borderRadius: '50px',
                padding: '0.5rem 1rem', fontSize: '0.8rem',
                fontWeight: 600, cursor: 'pointer',
                opacity: liveSearching ? 0.5 : 1,
              }}
            >
              {liveSearching ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                  <Loader size={14} />
                </motion.div>
              ) : (
                <Zap size={14} />
              )}
              {liveSearching ? 'Searching…' : 'Live Search'}
            </motion.button>
          )}
        </div>
      </div>

      {/* Live Search Notice */}
      <AnimatePresence>
        {liveNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: '#f0fdf4', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px', padding: '0.75rem 1.25rem',
              marginBottom: '1.5rem', fontSize: '0.9rem',
              fontWeight: 500, color: '#166534',
            }}
          >
            {liveNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {CATEGORIES.map(cat => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => { setActiveCategory(cat); setPage(1); }}
          />
        ))}
        <span style={{ color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          {filteredProducts.length} products
        </span>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '4rem', color: '#888' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>No products found. Try a different search.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {pagedProducts.map(p => {
              const inCompare = compareList.includes(p.id);
              const disabled = compareList.length > 0 && comparedProducts[0]?.category !== p.category && !inCompare;
              return (
                <ProductCard
                  key={p.id}
                  p={p}
                  inCompare={inCompare}
                  disabled={disabled}
                  onToggleCompare={toggleCompare}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Load More */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button className="btn btn-secondary" onClick={() => setPage(page + 1)} style={{ padding: '0.9rem 2.5rem' }}>
            Load More Products
          </button>
        </div>
      )}

      {/* Sticky Compare Bar */}
      <AnimatePresence>
        {compareList.length > 0 && !showCompare && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{
              position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
              background: '#000', color: '#fff',
              padding: '0.85rem 2rem',
              borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '1.5rem',
              zIndex: 100,
              boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>
              {compareList.length} item{compareList.length > 1 ? 's' : ''} selected
            </div>
            <button
              className="btn"
              style={{ background: '#fff', color: '#000', padding: '0.5rem 1.25rem' }}
              onClick={() => setShowCompare(true)}
            >
              <Scale size={16} /> Compare Now
            </button>
            <button
              style={{ background: 'none', color: 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={() => setCompareList([])}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discovery;
