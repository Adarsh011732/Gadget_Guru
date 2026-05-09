import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle } from 'lucide-react';

import LottiePkg from 'lottie-react';
const Lottie = LottiePkg.default ? LottiePkg.default : LottiePkg;
import robotAnimation from '../assets/robot_animation.json';

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
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 5%',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
        gap: '1.75rem'
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
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              background: '#f5f5f5', borderRadius: '50px',
              padding: '0.35rem 0.95rem', fontSize: '0.85rem', fontWeight: 500,
              marginBottom: '1.2rem', color: '#555',
            }}>
              <Sparkles size={14} /> AI-powered electronics advisor
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.8vw, 4.4rem)',
              lineHeight: 1.05,
              marginBottom: '1.1rem',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Find Your Perfect<br />
              <strong style={{ fontStyle: 'italic' }}>Gadget.</strong>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.05rem)',
              color: '#666',
              maxWidth: 470,
              marginBottom: '1.75rem',
              lineHeight: 1.65,
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
              display: 'flex', gap: '0.85rem',
              flexWrap: 'wrap',
            }}
          >
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn btn-primary btn-lg" onClick={() => navigate('/decision-support')}>
              <Sparkles size={20} /> Help Me Choose
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn btn-secondary btn-lg" onClick={() => navigate('/discovery')}>
              <CheckCircle size={20} /> Discovery &amp; Compare
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side Content - 3D Element */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, position: 'relative', height: '520px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              pointerEvents: 'none',
              width: '100%',
              maxWidth: '550px'
            }}
          >
            <Lottie 
              animationData={robotAnimation} 
              loop={true} 
              style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <motion.section
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        style={{
          display: 'flex', justifyContent: 'center', gap: '3rem',
          padding: '1.2rem 5%', background: '#000', color: '#fff',
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
        style={{ textAlign: 'center', padding: '2.5rem 5% 3.5rem', background: '#fff' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '1rem' }}>Ready to find your match?</h2>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Answer 5 quick questions and get AI-powered recommendations with live pricing.
        </p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="btn btn-primary btn-lg" onClick={() => navigate('/decision-support')}>
          <Sparkles size={20} /> Start the Quiz
        </motion.button>
      </motion.section>
    </div>
  );
};

export default Home;
