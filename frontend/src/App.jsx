import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Cpu, LogOut, User, Send } from 'lucide-react';

const TwitterIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const LinkedinIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const GithubIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;

import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import DecisionSupport from './pages/DecisionSupport';
import Login from './pages/Login';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import './index.css';

// Minimalist Navbar with auth state
const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem 5%', 
      position: 'fixed', 
      top: 0, 
      width: '100%', 
      zIndex: 100, 
      background: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(10px)' 
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', color: '#000' }}>
        <Cpu size={24} /> GadgetGuru
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/discovery" style={{ fontWeight: 500, textDecoration: 'none', color: '#000' }}>Discovery</Link>
        <Link to="/decision-support" style={{ fontWeight: 500, textDecoration: 'none', color: '#000' }}>Decision Support</Link>
        
        {!loading && (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: '#f3f4f6', padding: '0.4rem 0.8rem', borderRadius: '20px',
                fontSize: '0.85rem', fontWeight: 600,
              }}>
                <User size={14} />
                {user.name.split(' ')[0]}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  background: 'none', border: '1.5px solid #e5e7eb', borderRadius: '8px',
                  padding: '0.4rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem',
                  fontWeight: 500, color: '#555', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#000'; e.target.style.color = '#000'; }}
                onMouseLeave={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.color = '#555'; }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                background: '#000', color: '#fff', padding: '0.5rem 1.2rem',
                borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem',
                textDecoration: 'none', transition: 'opacity 0.2s',
              }}
            >
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40vh', fontSize: '1.2rem', color: '#888' }}>Loading...</div>;
  if (!user) return null;
  return children;
};

const Footer = () => (
  <footer style={{ 
    background: 'linear-gradient(145deg, #09090b 0%, #18181b 100%)', 
    color: '#fff', 
    padding: '4rem 5% 2rem', 
    marginTop: 'auto', 
    borderTop: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
  }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Brand Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.4rem', margin: 0, fontWeight: 800, background: 'linear-gradient(90deg, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Cpu size={24} color="#fff" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }} /> GadgetGuru
        </h3>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '280px' }}>
          India's smartest electronics recommendation engine. We match you to the perfect device with real-time pricing and AI insights.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          {[TwitterIcon, LinkedinIcon, GithubIcon].map((Icon, i) => (
            <a key={i} href="#" style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', color: '#fff', 
              transition: 'all 0.3s ease', border: '1px solid rgba(255,255,255,0.1)' 
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links Column */}
      <div>
        <h4 style={{ marginBottom: '1.2rem', color: '#fff', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.5px' }}>Explore</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            { name: 'Home', path: '/' },
            { name: 'Discovery & Compare', path: '/discovery' },
            { name: 'Decision Support Quiz', path: '/decision-support' }
          ].map((link, i) => (
            <Link key={i} to={link.path} style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s', width: 'fit-content' }} 
              onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.transform='translateX(5px)'; }} 
              onMouseLeave={e => { e.target.style.color='#a1a1aa'; e.target.style.transform='translateX(0)'; }}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Support & Legal Column */}
      <div>
        <h4 style={{ marginBottom: '1.2rem', color: '#fff', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.5px' }}>Support</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            { name: 'Contact Us', path: '/contact' },
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' }
          ].map((link, i) => (
            <Link key={i} to={link.path} style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s', width: 'fit-content' }} 
              onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.transform='translateX(5px)'; }} 
              onMouseLeave={e => { e.target.style.color='#a1a1aa'; e.target.style.transform='translateX(0)'; }}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div>
        <h4 style={{ marginBottom: '1.2rem', color: '#fff', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.5px' }}>Stay Updated</h4>
        <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1rem' }}>Get the latest gadget drops and AI insights.</p>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <input type="email" placeholder="Enter your email" style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.8rem', width: '100%', outline: 'none', fontSize: '0.85rem' }} />
          <button style={{ background: '#fff', color: '#000', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
            <Send size={16} />
          </button>
        </div>
      </div>

    </div>
    
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      flexWrap: 'wrap', 
      gap: '1rem', 
      maxWidth: 1200, 
      margin: '0 auto', 
      marginTop: '4rem', 
      paddingTop: '1.5rem', 
      borderTop: '1px solid rgba(255,255,255,0.05)', 
      color: '#52525b', 
      fontSize: '0.85rem',
      fontWeight: 500
    }}>
      <p>© {new Date().getFullYear()} GadgetGuru. All rights reserved.</p>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#a1a1aa'} onMouseLeave={e => e.target.style.color='#52525b'}>Status</span>
        <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#a1a1aa'} onMouseLeave={e => e.target.style.color='#52525b'}>Security</span>
      </div>
    </div>
  </footer>
);

function AppContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <main style={{ paddingTop: '80px', flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
          <Route path="/decision-support" element={<ProtectedRoute><DecisionSupport /></ProtectedRoute>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
