import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Cpu, LogOut, User } from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import DecisionSupport from './pages/DecisionSupport';
import Login from './pages/Login';
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
  <footer style={{ background: '#000', color: '#fff', padding: '4rem 5% 2rem', marginTop: 'auto' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', marginBottom: '1rem' }}><Cpu size={20} /> GadgetGuru</h3>
        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>India's smartest electronics recommendation engine. Tell us your needs, we match you to the best device.</p>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Quick Links</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link>
          <Link to="/discovery" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Discovery</Link>
          <Link to="/decision-support" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Decision Support</Link>
        </div>
      </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #333', color: '#888', fontSize: '0.85rem' }}>
      © 2026 GadgetGuru. All rights reserved.
    </div>
  </footer>
);

function AppContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ paddingTop: '80px', flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
          <Route path="/decision-support" element={<ProtectedRoute><DecisionSupport /></ProtectedRoute>} />
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
