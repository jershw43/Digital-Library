const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // ← must explicitly allow Authorization
  credentials: true,
}));
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
  const libraryRoutes = require('./routes/library');
  app.use('/api/library', libraryRoutes);
  console.log('✅ Library routes loaded');
} catch (err) {
  console.error('❌ Failed to load library routes:', err.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
