import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const Contact = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      style={{ padding: '2.5rem 5%', maxWidth: '700px', margin: '0 auto', minHeight: '50vh' }}
    >
      <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Contact Us</h1>
      <p style={{ color: '#555', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        Have questions about a product or our recommendations? Reach out to us via email.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: '#f9f9f9', padding: '1.2rem', borderRadius: '12px', border: '1px solid #eee' }}>
          <div style={{ background: '#000', color: '#fff', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={20} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>Email Us</h3>
            <a href="mailto:adarshsingh98635@gmail.com" style={{ color: '#555', textDecoration: 'none', fontSize: '1rem' }}>
              adarshsingh98635@gmail.com
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
