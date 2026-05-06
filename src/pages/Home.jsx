import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle } from 'lucide-react';

// ─── Gadget Items (only electronic gadgets) ──────────────────────────────────
const gadgetItems = [
  { title: 'Mobiles',       img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop', emoji: '📱' },
  { title: 'Laptops',       img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&h=300&fit=crop', emoji: '💻' },
  { title: 'Tablets',       img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop', emoji: '🖥️' },
  { title: 'Headphones',    img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop', emoji: '🎧' },
  { title: 'Smartwatches',  img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop', emoji: '⌚' },
];

// ─── Single Orbital Gadget ───────────────────────────────────────────────────
const OrbitalGadget = ({ item, index, total, progress, radius, ySquish }) => {
  const angleOffset = (index / total) * Math.PI * 2;

  const x = useTransform(progress, v => Math.cos(v + angleOffset) * radius);
  const y = useTransform(progress, v => Math.sin(v + angleOffset) * radius * ySquish);
  // Items in front (sin > 0) appear larger / brighter
  const z = useTransform(progress, v => Math.sin(v + angleOffset));
  const itemScale = useTransform(z, [-1, 0, 1], [0.6, 0.85, 1.1]);
  const itemOpacity = useTransform(z, [-1, 0, 1], [0.3, 0.6, 0.95]);
  const itemZIndex = useTransform(z, [-1, 1], [0, 10]);

  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      style={{
        position: 'absolute',
        x, y,
        scale: itemScale,
        opacity: itemOpacity,
        zIndex: itemZIndex,
        width: 90, height: 90,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid rgba(0,0,0,0.08)',
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 8px 28px rgba(0,0,0,0.2)'
          : '0 2px 10px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s',
        background: '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.22, zIndex: 30 }}
    >
      {!imgError ? (
        <img
          src={item.img}
          alt={item.title}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ fontSize: '2rem' }}>{item.emoji}</div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.72)', color: '#fff',
          fontSize: '0.6rem', fontWeight: 600,
          textAlign: 'center', padding: '0.25rem',
          borderRadius: '0 0 50px 50px',
        }}
      >
        {item.title}
      </motion.div>
    </motion.div>
  );
};

// ─── Revolving Ring ──────────────────────────────────────────────────────────
const RevolvingRing = ({ radius = 240, ySquish = 0.45, speed = 12 }) => {
  const progress = useMotionValue(0);

  useEffect(() => {
    const ctrl = animate(progress, Math.PI * 2, {
      duration: speed,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => ctrl.stop();
  }, [progress, speed]);

  return (
    <div style={{
      position: 'relative',
      width: radius * 2 + 120,
      height: radius * 2 * ySquish + 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'auto',
    }}>
      {/* Dashed orbit ring */}
      <div style={{
        position: 'absolute',
        width: radius * 2 + 20,
        height: radius * 2 * ySquish + 20,
        borderRadius: '50%',
        border: '1.5px dashed rgba(0,0,0,0.06)',
        pointerEvents: 'none',
      }} />

      {gadgetItems.map((item, i) => (
        <OrbitalGadget
          key={i}
          item={item}
          index={i}
          total={gadgetItems.length}
          progress={progress}
          radius={radius}
          ySquish={ySquish}
        />
      ))}
    </div>
  );
};

// ─── Stats Strip ─────────────────────────────────────────────────────────────
const stats = [
  { value: '100+', label: 'Live Products' },
  { value: '5', label: 'Categories' },
  { value: 'AI', label: 'Powered Matching' },
  { value: '2', label: 'Store Price Compare' },
];

// ─── Home Page ───────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Hero + Orbital Animation ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8%',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
        gap: '2rem'
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.025) 0%, transparent 70%)',
          top: '50%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Left Side Content */}
        <div style={{ flex: 1, textAlign: 'left', zIndex: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#f5f5f5', borderRadius: '50px',
              padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 500,
              marginBottom: '1.5rem', color: '#555',
            }}>
              <Sparkles size={14} /> AI-powered electronics advisor
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Find Your Perfect<br />
              <strong style={{ fontStyle: 'italic' }}>Gadget.</strong>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
              color: '#666',
              maxWidth: 500,
              marginBottom: '2rem',
              lineHeight: 1.7,
            }}>
              India's smartest electronics recommendation engine. Tell us your needs,
              we match you to the best device — then tell you <em>exactly when &amp; where to buy</em>.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{
              display: 'flex', gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="btn btn-primary btn-lg" onClick={() => navigate('/decision-support')}>
              <Sparkles size={20} /> Help Me Choose
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="btn btn-secondary btn-lg" onClick={() => navigate('/discovery')}>
              <CheckCircle size={20} /> Discovery &amp; Compare
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side Content - Orbital Animation */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, position: 'relative', height: '600px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              pointerEvents: 'none',
            }}
          >
            <RevolvingRing radius={220} ySquish={0.5} speed={14} />
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <motion.section
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        style={{
          display: 'flex', justifyContent: 'center', gap: '4rem',
          padding: '2.5rem 5%', background: '#000', color: '#fff',
          flexWrap: 'wrap',
        }}
      >
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '0.2rem' }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* ── CTA Section ── */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ textAlign: 'center', padding: '6rem 5%', background: '#fff' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '1rem' }}>Ready to find your match?</h2>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Answer 5 quick questions and get AI-powered recommendations with live pricing.
        </p>
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
          className="btn btn-primary btn-lg" onClick={() => navigate('/decision-support')}>
          <Sparkles size={20} /> Start the Quiz
        </motion.button>
      </motion.section>
    </div>
  );
};

export default Home;
