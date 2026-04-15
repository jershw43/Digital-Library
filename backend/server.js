const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

<<<<<<< HEAD
=======
// Load .env explicitly from server.js directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Confirm env loaded — remove these logs once working
console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);
console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);

const connectDB = require('./config/db');
>>>>>>> parent of 6ce091e (Fixed server access to books)
const app = express();

connectDB();

<<<<<<< HEAD
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://digital-library-frontend-258f.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
=======
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
>>>>>>> parent of 6ce091e (Fixed server access to books)
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
