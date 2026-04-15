const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
  const libraryRoutes = require('./Library');
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