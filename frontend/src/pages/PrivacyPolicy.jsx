import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      style={{ padding: '4rem 5%', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Privacy Policy</h1>
      
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
      </p>

      <p style={{ color: '#555', marginBottom: '2rem' }}>
        At GadgetGuru, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our AI-powered recommendation services.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
      <ul style={{ color: '#555', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>Personal Information:</strong> When you register an account, we may collect your name, email address, and password.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Usage Data:</strong> We collect data on your interactions with our recommendation quiz, search queries, and viewed products to improve our AI model.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Device Information:</strong> We may automatically collect device type, browser type, and IP address for analytics and security purposes.</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
      <ul style={{ color: '#555', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>To provide, operate, and maintain our application.</li>
        <li style={{ marginBottom: '0.5rem' }}>To personalize your experience and deliver tailored electronic recommendations.</li>
        <li style={{ marginBottom: '0.5rem' }}>To send you updates, security alerts, and support messages.</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        We implement industry-standard security measures, including password hashing (bcrypt) and secure tokens (JWT), to protect your personal information from unauthorized access or disclosure.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Changes to This Policy</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Contact Us</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        If you have any questions about this Privacy Policy, please contact us via the Contact page.
      </p>
    </motion.div>
  );
};

export default PrivacyPolicy;
