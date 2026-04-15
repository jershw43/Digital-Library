const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// ── Inline model (mirrors libraryRoutes.js) ───────────────────────────────────

const userLibrarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, ref: 'Book', required: true },
  addedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['want-to-read', 'reading', 'finished'], default: 'want-to-read' },
  notes: String,
});
userLibrarySchema.index({ userId: 1, bookId: 1 }, { unique: true });
const UserLibrary = mongoose.models.UserLibrary || mongoose.model('UserLibrary', userLibrarySchema);

const bookSchema = new mongoose.Schema({
  _id: String,
  title: String,
  author: String,
  year: String,
  thumbnail: String,
  description: String,
  publisher: String,
  pageCount: { type: Number, default: null },
});
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

// ── Inline auth middleware ────────────────────────────────────────────────────

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token — please log in' });
  }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ── Gemini client ─────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── GET /api/recommendations ──────────────────────────────────────────────────

router.get('/', auth, async (req, res) => {
  try {
    const entries = await UserLibrary.find({ userId: req.userId }).populate('bookId');
    const books = entries.map((e) => e.bookId).filter(Boolean);

    if (books.length === 0) {
      return res.json({ recommendations: [], message: 'Add some books to your library first!' });
    }

    const libraryList = books
      .map((b) => `- "${b.title}" by ${b.author}`)
      .join('\n');

    const prompt = `
You are a helpful book recommender. Based on the following books in a user's library, suggest 4 books they haven't read yet.
For each recommendation, provide: title, author, and a one-sentence reason why they'd enjoy it.
Do not give more than one book in a series, and recommend sequels when appropriate.
Keep the genre of the book close to the user's library to better represent the user's interests.
Respond ONLY with a valid JSON array, no markdown, no extra text.
Format: [{ "title": "...", "author": "...", "reason": "..." }]

User's library:
${libraryList}
    `.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const recommendations = JSON.parse(text);
    res.json({ recommendations });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
});

module.exports = router;