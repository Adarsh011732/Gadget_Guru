import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllGadgets, scoreProduct } from '../services/productApi';
import { 
  Sparkles, ArrowRight, Activity, Clock, RefreshCw, ChevronLeft,
  Smartphone, Laptop, Tablet, Headphones, Watch,
  Palette, Briefcase, Gamepad2, GraduationCap, Coffee,
  Code, Camera, Zap, Battery, Monitor, Backpack,
  Calendar, Target, Rocket
} from 'lucide-react';

// Category-specific use cases
const USE_CASES_BY_CATEGORY = {
  Mobile:     [
    { label: 'Creative', icon: <Palette size={24} />, sub: 'Photography & content' },
    { label: 'Business', icon: <Briefcase size={24} />, sub: 'Work & productivity' },
    { label: 'Gamer', icon: <Gamepad2 size={24} />, sub: 'Mobile gaming' },
    { label: 'Student', icon: <GraduationCap size={24} />, sub: 'Study & notes' },
    { label: 'Casual', icon: <Coffee size={24} />, sub: 'Daily use & social media' },
  ],
  Laptop:     [
    { label: 'Developer', icon: <Code size={24} />, sub: 'Coding & DevOps' },
    { label: 'Creative', icon: <Palette size={24} />, sub: 'Video/photo editing' },
    { label: 'Gamer', icon: <Gamepad2 size={24} />, sub: 'PC gaming' },
    { label: 'Business', icon: <Briefcase size={24} />, sub: 'Office & presentations' },
    { label: 'Student', icon: <GraduationCap size={24} />, sub: 'College & research' },
  ],
  Tablet:     [
    { label: 'Creative', icon: <Palette size={24} />, sub: 'Drawing & design' },
    { label: 'Student', icon: <GraduationCap size={24} />, sub: 'Notes & reading' },
    { label: 'Business', icon: <Briefcase size={24} />, sub: 'Presentations & email' },
    { label: 'Casual', icon: <Coffee size={24} />, sub: 'Streaming & browsing' },
  ],
  Headphone:  [
    { label: 'Business', icon: <Briefcase size={24} />, sub: 'Calls & meetings' },
    { label: 'Casual', icon: <Coffee size={24} />, sub: 'Music & podcasts' },
    { label: 'Student', icon: <GraduationCap size={24} />, sub: 'Study & focus' },
    { label: 'Creative', icon: <Palette size={24} />, sub: 'Music production' },
  ],
  Smartwatch: [
    { label: 'Business', icon: <Briefcase size={24} />, sub: 'Notifications & schedule' },
    { label: 'Casual', icon: <Coffee size={24} />, sub: 'Health & fitness' },
    { label: 'Student', icon: <GraduationCap size={24} />, sub: 'Time management' },
  ],
};

// Category-specific priorities
const PRIORITIES_BY_CATEGORY = {
  Mobile:     [
    { label: 'Camera', icon: <Camera size={24} /> },
    { label: 'Performance', icon: <Zap size={24} /> },
    { label: 'Battery', icon: <Battery size={24} /> },
    { label: 'Display', icon: <Monitor size={24} /> },
    { label: 'Portability', icon: <Backpack size={24} /> },
  ],
  Laptop:     [
    { label: 'Performance', icon: <Zap size={24} /> },
    { label: 'Display', icon: <Monitor size={24} /> },
    { label: 'Battery', icon: <Battery size={24} /> },
    { label: 'Portability', icon: <Backpack size={24} /> },
  ],
  Tablet:     [
    { label: 'Display', icon: <Monitor size={24} /> },
    { label: 'Performance', icon: <Zap size={24} /> },
    { label: 'Battery', icon: <Battery size={24} /> },
    { label: 'Portability', icon: <Backpack size={24} /> },
  ],
  Headphone:  [
    { label: 'Performance', icon: <Zap size={24} />, sub: 'Sound quality & ANC' },
    { label: 'Battery', icon: <Battery size={24} /> },
    { label: 'Portability', icon: <Backpack size={24} />, sub: 'Size & weight' },
  ],
  Smartwatch: [
    { label: 'Battery', icon: <Battery size={24} /> },
    { label: 'Display', icon: <Monitor size={24} /> },
    { label: 'Performance', icon: <Zap size={24} />, sub: 'Sensors & tracking' },
  ],
};

// Category-specific budget ranges
const BUDGET_SLIDER_BY_CATEGORY = {
  Mobile:     { min: 5000, max: 150000, step: 1000, default: 30000 },
  Laptop:     { min: 20000, max: 300000, step: 5000, default: 65000 },
  Tablet:     { min: 10000, max: 150000, step: 2000, default: 25000 },
  Headphone:  { min: 1000, max: 80000, step: 500, default: 10000 },
  Smartwatch: { min: 1500, max: 100000, step: 500, default: 10000 },
};

// Build steps dynamically based on selected category
function getSteps(category) {
  const useCaseOptions = USE_CASES_BY_CATEGORY[category] || USE_CASES_BY_CATEGORY.Mobile;
  const priorityOptions = PRIORITIES_BY_CATEGORY[category] || PRIORITIES_BY_CATEGORY.Mobile;
  const sliderConfig = BUDGET_SLIDER_BY_CATEGORY[category] || BUDGET_SLIDER_BY_CATEGORY.Mobile;

  return [
    {
      id: 'category',
      title: 'What type of gadget?',
      subtitle: 'Pick the device category you need',
      options: [
        { label: 'Mobile', icon: <Smartphone size={24} /> },
        { label: 'Laptop', icon: <Laptop size={24} /> },
        { label: 'Tablet', icon: <Tablet size={24} /> },
        { label: 'Headphone', icon: <Headphones size={24} /> },
        { label: 'Smartwatch', icon: <Watch size={24} /> },
      ]
    },
    {
      id: 'useCase',
      title: category ? `How will you use your ${category}?` : 'Primary use case?',
      subtitle: 'This helps us match the right features for you',
      options: useCaseOptions,
    },
    {
      id: 'budget',
      title: category ? `Budget for your ${category}?` : 'Your budget range?',
      subtitle: 'Set your maximum budget',
      isSlider: true,
      sliderConfig: sliderConfig,
    },
    {
      id: 'priorities',
      title: category ? `What matters most in a ${category}?` : 'Top priorities?',
      subtitle: 'Select up to 2 features that matter most',
      options: priorityOptions,
      multi: true
    },
    {
      id: 'timing',
      title: 'How soon do you need it?',
      subtitle: 'This helps us factor in upcoming deals',
      options: [
        { label: 'Now', icon: <Rocket size={24} />, sub: 'Buy immediately' },
        { label: 'Month', icon: <Calendar size={24} />, sub: 'Within a month' },
        { label: 'Flexible', icon: <Target size={24} />, sub: 'Waiting for best deal' },
      ]
    }
  ];
}

// ─── Result Card ────────────────────────────────────────────────────────────
// ─── Result Card ────────────────────────────────────────────────────────────
const ResultCard = ({ p, idx }) => {
  const [imgError, setImgError] = useState(false);

  // Safe checks for potentially missing data
  const buyAdvice = p.buyAdvice || { status: 'neutral', headline: 'N/A', description: 'No advice available.' };
  const rating = typeof p.rating === 'number' ? p.rating : 0;
  const matchScore = typeof p.matchScore === 'number' ? p.matchScore : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, type: 'spring', stiffness: 80 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        border: '1px solid rgba(0,0,0,0.09)',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {/* Image */}
      <div style={{ background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220, position: 'relative' }}>
        {!imgError && p.image ? (
          <img
            src={p.image}
            alt={p.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
          />
        ) : (
          <div style={{ fontSize: '4rem', textAlign: 'center', padding: '2rem' }}>
            {p.category === 'Mobile' ? '📱' : p.category === 'Laptop' ? '💻' : p.category === 'Tablet' ? '🖥️' : p.category === 'Headphone' ? '🎧' : '⌚'}
          </div>
        )}
        {p.discountPct > 5 && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: '#000', color: '#fff',
            padding: '0.2rem 0.6rem', borderRadius: '50px',
            fontSize: '0.75rem', fontWeight: 700
          }}>
            {p.discountPct}% OFF
          </div>
        )}
        {p.dealScore > 80 && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: '#ff4d00', color: '#fff',
            padding: '0.2rem 0.6rem', borderRadius: '50px',
            fontSize: '0.75rem', fontWeight: 700
          }}>
            🔥 Hot
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>{p.category}</div>
            <h2 style={{ fontSize: '1.3rem', lineHeight: 1.3, marginBottom: 0 }}>{p.name}</h2>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
            <div style={{
              fontSize: '1.6rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #000 60%, #555)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{matchScore}%</div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>AI Fit</div>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem', flex: 1 }}>{p.overview || 'No description available.'}</p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>{'★'.repeat(Math.max(0, Math.round(rating)))}</span>
          <span style={{ fontSize: '0.85rem', color: '#888' }}>{rating}/5</span>
          {p.stock < 15 && <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>• Low Stock</span>}
        </div>

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
              <Activity size={14} /> Deal Score: {p.dealScore || 0}/100
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>Based on price history</div>
          </div>
          <div style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem',
              color: buyAdvice.status === 'buy' ? '#16a34a' : buyAdvice.status === 'wait' ? '#d97706' : '#000'
            }}>
              <Clock size={14} /> {buyAdvice.headline}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>{buyAdvice.description}</div>
          </div>
        </div>

        {/* Price Bar */}
        <div style={{ background: '#000', color: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.1rem' }}>Best Price</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>₹{(p.basePrice || 0).toLocaleString('en-IN')}</div>
            {p.originalPrice > p.basePrice && (
              <div style={{ fontSize: '0.75rem', opacity: 0.5, textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href={`https://www.amazon.in/s?k=${encodeURIComponent(p.name)}`} target="_blank" rel="noopener noreferrer">
              <button style={{ background: '#ff9900', color: '#000', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                Amazon
              </button>
            </a>
            <a href={`https://www.flipkart.com/search?q=${encodeURIComponent(p.name)}`} target="_blank" rel="noopener noreferrer">
              <button style={{ background: '#2874f0', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                Flipkart
              </button>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const DecisionSupport = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({ priorities: [] });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // Prefetch products in background
  useEffect(() => {
    fetchAllGadgets().then(setAllProducts).catch(console.error);
  }, []);

  const handleSelect = (key, val, multi = false) => {
    let newAnswers;
    if (multi) {
      const current = answers[key] || [];
      if (current.includes(val)) {
        newAnswers = { ...answers, [key]: current.filter(x => x !== val) };
      } else if (current.length < 2) {
        newAnswers = { ...answers, [key]: [...current, val] };
      } else {
        newAnswers = answers;
      }
    } else {
      newAnswers = { ...answers, [key]: val };
    }
    setAnswers(newAnswers);

    if (!multi) {
      const dynamicSteps = getSteps(newAnswers.category);
      if (currentStep < dynamicSteps.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
      } else {
        setTimeout(() => runSearch(newAnswers), 300);
      }
    }
  };

  const runSearch = async (finalAnswers = answers) => {
    setLoading(true);
    console.log('Running search with answers:', finalAnswers);
    try {
      // Use cached or fetch fresh
      const products = allProducts.length > 0 ? allProducts : await fetchAllGadgets();
      console.log(`Total products available for matching: ${products.length}`);
      
      const categoryMatches = products
        .filter(p => {
          if (!p.category || !finalAnswers.category) return false;
          return p.category.toLowerCase() === finalAnswers.category.toLowerCase();
        })
        .map(p => ({ ...p, matchScore: scoreProduct(p, finalAnswers) }))
        // Filter out low-score matches (below 15%) to keep quality high
        .filter(p => p.matchScore >= 15)
        .sort((a, b) => b.matchScore - a.matchScore);

      console.log(`Final processed matches: ${categoryMatches.length}`);

      // Show up to 15 best matches
      setResults(categoryMatches.slice(0, 15));
    } catch (err) {
      console.error('Search match error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Results screen ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', gap: '1.5rem' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <RefreshCw size={48} />
        </motion.div>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>Finding the best matches for you…</p>
      </div>
    );
  }

  if (results !== null) {
    return (
      <div style={{ padding: '2rem 5%', minHeight: '100vh', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>
              AI Recommendation <span style={{ color: '#888' }}>Results</span>
            </h1>
            <p style={{ color: '#888' }}>
              {results.length > 0 ? `${results.length} products matched for ${answers.category}` : 'No exact matches found'}
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => { setResults(null); setCurrentStep(0); setAnswers({ priorities: [] }); }}
          >
            <ChevronLeft size={16} /> Start Over
          </button>
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#f5f5f5', borderRadius: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No exact matches found</h3>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>Try a different category or loosen your filters.</p>
            <button className="btn btn-primary" onClick={() => { setResults(null); setCurrentStep(0); setAnswers({ priorities: [] }); }}>
              Try Again
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {results.map((p, idx) => <ResultCard key={p.id} p={p} idx={idx} />)}
          </div>
        )}
      </div>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────
  const steps = getSteps(answers.category);
  const safeCurrentStep = Math.min(currentStep, Math.max(steps.length - 1, 0));
  const step = steps[safeCurrentStep];

  if (!step) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
        <div style={{ maxWidth: 640, textAlign: 'center', background: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>We could not load the quiz properly. Please restart the experience.</p>
          <button className="btn btn-primary" onClick={() => { setCurrentStep(0); setAnswers({ priorities: [] }); setResults(null); }}>
            Restart quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>
        {/* Progress */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#888' }}>Step {currentStep + 1} of {steps.length}</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              style={{ height: '100%', background: '#000', borderRadius: '4px' }}
            />
          </div>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'center' }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                width: i === currentStep ? 24 : 8, height: 8,
                borderRadius: 4,
                background: i <= currentStep ? '#000' : '#ddd',
                transition: 'all 0.4s ease'
              }} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <h2 style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}>{step.title}</h2>
            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem' }}>{step.subtitle}</p>

            {step.isSlider ? (
              <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.09)' }}>
                <div style={{ fontSize: '3rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                  ₹{(answers[step.id] || step.sliderConfig.default).toLocaleString('en-IN')}
                </div>
                <input 
                  type="range" 
                  min={step.sliderConfig.min} 
                  max={step.sliderConfig.max} 
                  step={step.sliderConfig.step}
                  value={answers[step.id] || step.sliderConfig.default}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAnswers({ ...answers, [step.id]: val });
                  }}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#000', height: '8px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontWeight: 600, fontSize: '0.9rem', marginTop: '1rem' }}>
                  <span>₹{step.sliderConfig.min.toLocaleString('en-IN')}</span>
                  <span>₹{step.sliderConfig.max.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: step.options.length <= 3 ? '1fr 1fr 1fr' : '1fr 1fr',
                gap: '1rem'
              }}>
                {step.options.map(opt => {
                  const isSelected = step.multi
                    ? (answers[step.id] || []).includes(opt.label)
                    : answers[step.id] === opt.label;

                  return (
                    <motion.div
                      key={opt.label}
                      onClick={() => handleSelect(step.id, opt.label, step.multi)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '1.25rem 1rem',
                        border: `2px solid ${isSelected ? '#000' : 'rgba(0,0,0,0.09)'}`,
                        borderRadius: '14px',
                        background: isSelected ? '#000' : '#fff',
                        color: isSelected ? '#fff' : '#000',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{opt.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</div>
                      {opt.sub && <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.2rem' }}>{opt.sub}</div>}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              {currentStep > 0 ? (
                <button className="btn btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}

              {(step.multi || step.isSlider) && (
                <button
                  className="btn btn-primary"
                  disabled={step.multi && !(answers[step.id] || []).length}
                  onClick={() => {
                    let updatedAnswers = { ...answers };
                    if (step.isSlider && !updatedAnswers[step.id]) {
                      updatedAnswers[step.id] = step.sliderConfig.default;
                      setAnswers(updatedAnswers);
                    }
                    if (currentStep < steps.length - 1) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      runSearch(updatedAnswers);
                    }
                  }}
                  style={{ opacity: (step.multi && !(answers[step.id] || []).length) ? 0.5 : 1 }}
                >
                  {currentStep === steps.length - 1 ? <><Sparkles size={16} /> Find My Match</> : <>Next <ArrowRight size={16} /></>}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DecisionSupport;
