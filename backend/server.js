const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://digital-library-frontend-258f.onrender.com',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Digital Library API is running!' });
});

try {
  const authRoutes = require('./auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Failed to load auth routes:', err.message);
}

try {
  const libraryRoutes = require('./routes/library');
  app.use('/api/library', libraryRoutes);
  console.log('✅ Library routes loaded');
} catch (err) {
  console.error('❌ Failed to load library routes:', err.message);
}

try {
  const recommendationRoutes = require('./recommendations');
  app.use('/api/recommendations', recommendationRoutes);
  console.log('✅ Recommendation routes loaded');
} catch (err) {
  console.error('❌ Failed to load recommendation routes:', err.message);
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});