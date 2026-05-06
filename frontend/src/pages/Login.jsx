import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, User, ArrowRight, KeyRound, CheckCircle, Send } from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || 'https://YOUR-RENDER-BACKEND.onrender.com';

  const switchMode = (m) => { setMode(m); setError(''); setSuccess(''); };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const otpArr = form.otp.split('');
    otpArr[index] = value;
    setForm({ ...form, otp: otpArr.join('') });
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !form.otp[index] && index > 0) otpRefs[index - 1].current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        const result = await login(form.email, form.password);
        if (result.success) { navigate('/'); return; }
        setError(result.message);
      } else if (mode === 'register') {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        const result = await register(form.name, form.email, form.password);
        if (result.success) { navigate('/'); return; }
        setError(result.message);
      } else if (mode === 'forgot') {
        const res = await fetch(`${API}/api/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email }) });
        const data = await res.json();
        if (data.success) { setSuccess('OTP sent! Check your email.'); setTimeout(() => switchMode('otp'), 1500); }
        else setError(data.message);
      } else if (mode === 'otp') {
        if (form.otp.length < 6) { setError('Enter 6-digit OTP'); setLoading(false); return; }
        const res = await fetch(`${API}/api/auth/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, otp: form.otp }) });
        const data = await res.json();
        if (data.success) { setSuccess('OTP verified!'); setTimeout(() => switchMode('newpass'), 1200); }
        else setError(data.message);
      } else if (mode === 'newpass') {
        if (form.newPassword.length < 6) { setError('Min 6 characters'); setLoading(false); return; }
        const res = await fetch(`${API}/api/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, otp: form.otp, newPassword: form.newPassword }) });
        const data = await res.json();
        if (data.success) { setSuccess('Password reset! Redirecting...'); setTimeout(() => { switchMode('login'); setForm({ ...form, password: '' }); }, 2000); }
        else setError(data.message);
      }
    } catch { setError('Server error. Try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem',
    border: '2px solid #e5e7eb', borderRadius: '12px',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
    background: '#fafafa',
  };
  const iconStyle = {
    position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
    color: '#9ca3af', pointerEvents: 'none',
  };

  const modeConfig = {
    login:    { icon: '⚙️', title: 'GadgetGuru', sub: 'Welcome back! Sign in to continue.' },
    register: { icon: '🚀', title: 'Join GadgetGuru', sub: 'Create your account to get started.' },
    forgot:   { icon: '📧', title: 'Forgot Password', sub: "We'll email you a 6-digit OTP." },
    otp:      { icon: '🔢', title: 'Enter OTP', sub: `Check ${form.email} for your code.` },
    newpass:  { icon: '🔑', title: 'New Password', sub: 'Set a strong new password.' },
  };
  const cfg = modeConfig[mode];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f5f0ff 100%)',
      padding: '1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ background: '#000', color: '#fff', padding: '2.5rem 2rem 2rem', textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}
          >
            {cfg.icon}
          </motion.div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.3rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            {cfg.title}
          </h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>{cfg.sub}</p>
        </div>

        {/* Tab Toggle */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{ display: 'flex', margin: '1.5rem 2rem 0', background: '#f3f4f6', borderRadius: '12px', padding: '4px' }}>
            {['login', 'register'].map(tab => (
              <button key={tab} onClick={() => switchMode(tab)} style={{
                flex: 1, padding: '0.7rem', border: 'none', borderRadius: '10px',
                background: mode === tab ? '#000' : 'transparent',
                color: mode === tab ? '#fff' : '#666',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s',
              }}>
                {tab === 'login'
                  ? <><LogIn size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Login</>
                  : <><UserPlus size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Register</>}
              </button>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2rem' }}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500 }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name (register) */}
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: '1rem', position: 'relative' }}>
                <User size={18} style={iconStyle} />
                <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          {['login', 'register', 'forgot'].includes(mode) && (
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <Mail size={18} style={iconStyle} />
              <input type="email" placeholder="Email address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
          )}

          {/* Password */}
          {['login', 'register'].includes(mode) && (
            <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
              <Lock size={18} style={iconStyle} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password (min. 6 chars)" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} style={{ ...inputStyle, paddingRight: '2.8rem' }}
                onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex',
              }}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          )}

          {/* OTP boxes */}
          {mode === 'otp' && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.2rem' }}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <input key={i} ref={otpRefs[i]} type="text" maxLength={1}
                  value={form.otp[i] || ''} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: 48, height: 56, textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
                    border: '2px solid #e5e7eb', borderRadius: '12px', background: '#fafafa', color: '#000',
                    outline: 'none', fontFamily: 'monospace', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#000'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              ))}
            </div>
          )}

          {/* New password */}
          {mode === 'newpass' && (
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <KeyRound size={18} style={iconStyle} />
              <input type={showPassword ? 'text' : 'password'} placeholder="New password (min. 6 chars)" required value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })} style={{ ...inputStyle, paddingRight: '2.8rem' }}
                onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex',
              }}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          )}

          {/* Forgot password link */}
          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <span onClick={() => switchMode('forgot')} style={{ fontSize: '0.83rem', color: '#555', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}
                onMouseEnter={e => e.target.style.color = '#000'} onMouseLeave={e => e.target.style.color = '#555'}>Forgot password?</span>
            </div>
          )}

          {/* Submit */}
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '1rem', border: 'none', borderRadius: '12px',
              background: loading ? '#555' : '#000', color: '#fff',
              fontSize: '1rem', fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'background 0.2s',
            }}>
            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}>⏳</motion.div>
              : mode === 'login' ? <>Sign In <ArrowRight size={18} /></>
              : mode === 'register' ? <>Create Account <ArrowRight size={18} /></>
              : mode === 'forgot' ? <>Send OTP <Send size={16} /></>
              : mode === 'otp' ? <>Verify OTP <CheckCircle size={16} /></>
              : <>Reset Password <KeyRound size={16} /></>}
          </motion.button>

          {/* Bottom links */}
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#888' }}>
            {mode === 'login' && <>Don't have an account?{' '}<span onClick={() => switchMode('register')} style={{ color: '#000', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Register here</span></>}
            {mode === 'register' && <>Already have an account?{' '}<span onClick={() => switchMode('login')} style={{ color: '#000', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Login here</span></>}
            {['forgot', 'otp', 'newpass'].includes(mode) && <span onClick={() => switchMode('login')} style={{ color: '#000', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>← Back to Login</span>}
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
