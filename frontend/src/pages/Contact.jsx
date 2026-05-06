import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      style={{ padding: '4rem 5%', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Contact Us</h1>
      <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
        Have questions about a product, our recommendations, or need assistance? We're here to help! 
        Reach out to us using the contact information below.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
          <div style={{ background: '#000', color: '#fff', padding: '1rem', borderRadius: '50%' }}>
            <Mail size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>Email Us</h3>
            <a href="mailto:adasrshsingh98635@gmail.com" style={{ color: '#555', textDecoration: 'none', fontSize: '1.1rem' }}>
              adasrshsingh98635@gmail.com
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
          <div style={{ background: '#000', color: '#fff', padding: '1rem', borderRadius: '50%' }}>
            <Phone size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>Call Us</h3>
            <a href="tel:9369851231" style={{ color: '#555', textDecoration: 'none', fontSize: '1.1rem' }}>
              +91 9369851231
            </a>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Contact;
