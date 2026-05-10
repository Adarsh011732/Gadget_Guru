import './config/env.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/products.js';
import syncRoutes from './routes/sync.js';
import authRoutes from './routes/auth.js';
import searchRoutes from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS Configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://gadget-guru-self.vercel.app', // Explicitly allow the Vercel production domain
  'https://needhelp-gadget.netlify.app', // Explicitly allow the Netlify production domain
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

// Connect to DB
connectDB();

// Only listen if not running on Vercel (Vercel handles the serverless execution)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 GadgetGuru API running on port ${PORT}`);
    console.log(`📦 Products API ready`);
    console.log(`🔐 Auth API ready`);
  });
}

// Export the app for Vercel serverless functions
export default app;
