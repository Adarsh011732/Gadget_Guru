import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      style={{ padding: '4rem 5%', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Terms of Service</h1>

      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
      </p>

      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Welcome to GadgetGuru. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        By creating an account or using our platform, you confirm that you accept these Terms of Service. If you do not agree, please do not use our services.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Product Pricing & Fluctuation Disclaimer</h2>
      <div style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107', padding: '1rem 1.5rem', borderRadius: '0 8px 8px 0', marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: '#856404', fontWeight: 500 }}>
          <strong>IMPORTANT:</strong> The product prices displayed on GadgetGuru are estimates gathered from various sources. <strong>Prices may fluctuate rapidly</strong> due to market conditions, sales, and retailer updates. We do not guarantee that the price shown on our platform will match the final checkout price on third-party websites.
        </p>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Recommendations Disclaimer</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Our AI-powered recommendations are designed to assist you in your purchasing decisions. However, they are for informational purposes only. We are not responsible if a recommended product does not meet your personal expectations.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. User Conduct</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        You agree to use GadgetGuru only for lawful purposes. You must not attempt to exploit, hack, or disrupt our systems or services.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>5. Third-Party Links</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Our platform may contain links to third-party e-commerce websites. We are not responsible for the content, privacy policies, or practices of any third-party sites.
      </p>
      
      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Contact Us</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        If you have any questions about these Terms, please contact us via the Contact page.
      </p>
    </motion.div>
  );
};

export default TermsOfService;
