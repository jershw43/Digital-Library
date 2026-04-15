const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);
console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);

const connectDB = require('./config/db');
const app = express();

connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight for all routes

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Digital Library API is running!' });
});

try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Failed to load auth routes:', err.message);
}

try {
  const libraryRoutes = require('./libraryRoutes');
  app.use('/api/library', libraryRoutes);
  console.log('✅ Library routes loaded');
} catch (err) {
  console.error('❌ Failed to load library routes:', err.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});