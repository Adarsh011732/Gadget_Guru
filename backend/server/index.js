import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/products.js';
import syncRoutes from './routes/sync.js';
import authRoutes from './routes/auth.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://needhelp-gadget.netlify.app,http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = origin.toLowerCase();
    const isAllowedNetlify = normalizedOrigin.endsWith('.netlify.app');
    const isAllowedLocal = normalizedOrigin.startsWith('http://localhost') || normalizedOrigin.startsWith('http://127.0.0.1');
    const isExplicitlyAllowed = allowedOrigins.includes(origin);

    if (isAllowedNetlify || isAllowedLocal || isExplicitlyAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked origin: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 GadgetGuru API running on port ${PORT}`);
    console.log(`📦 Products API ready`);
    console.log(`🔐 Auth API ready`);
  });
});
