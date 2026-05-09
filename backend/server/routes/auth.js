import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendResetOTP } from '../services/mailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_EXPIRES = '7d';

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: error.stack 
    });
  }
});

// ─── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  console.log("Login request received");
  try {
    const { email, password } = req.body;
    console.log("Email from request:", email);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    console.log("User found:", !!user);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // DEBUG: Log stored password hash (temporary for debugging)
    console.log("Stored password hash:", user.password);

    // ─── Legacy Password Format Detection ───
    // Bcrypt hashes typically start with $2a$, $2b$, or $2y$
    const isBcrypt = /^\$2[ayb]\$/.test(user.password);
    if (!isBcrypt) {
      console.warn(`User ${email} has an invalid/old password format`);
      return res.status(400).json({ 
        success: false, 
        message: 'Account uses old password format. Please re-register.' 
      });
    }

    console.log("Checking password bcrypt match...");
    let isMatch = false;
    try {
      isMatch = await user.comparePassword(password);
    } catch (err) {
      console.error("Bcrypt compare error:", err);
      // Don't crash, just treat as no match
      isMatch = false;
    }
    
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    console.log("Generating JWT...");
    if (!JWT_SECRET) {
      console.error("FATAL: JWT_SECRET is missing during login attempt");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const token = generateToken(user._id);
    console.log("Login successful, token generated");

    res.json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login. Please try again later.'
    });
  }
});

// ─── GET /api/auth/me ───────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
});

// ─── POST /api/auth/forgot-password — Send OTP email ────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email' });

    const otp = user.generateResetToken();
    await user.save();

    await sendResetOTP(email, otp, user.name);
    console.log(`📧 OTP sent to ${email}`);

    res.json({ success: true, message: 'OTP sent to your email. Check inbox & spam.' });
  } catch (error) {
    console.error('Mail error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Check mail config.' });
  }
});

// ─── POST /api/auth/verify-otp — Verify OTP ─────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const user = await User.findOne({
      email,
      resetToken: hashedOtp,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    res.json({ success: true, message: 'OTP verified. You can now set a new password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── POST /api/auth/reset-password — Set new password ────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const user = await User.findOne({
      email,
      resetToken: hashedOtp,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
