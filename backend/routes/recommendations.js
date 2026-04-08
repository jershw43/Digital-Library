const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const UserLibrary = require('../models/UserLibrary');
const authMiddleware = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET /api/recommendations
router.get('/', authMiddleware, async (req, res) => {
  try {
    // 1. Fetch the user's library from MongoDB
    const entries = await UserLibrary.find({ userId: req.userId }).populate('bookId');
    const books = entries.map((e) => e.bookId).filter(Boolean);

    if (books.length === 0) {
      return res.json({ recommendations: [], message: 'Add some books to your library first!' });
    }

    // 2. Build a summary of the user's library for Gemini
    const libraryList = books
      .map((b) => `- "${b.title}" by ${b.author}`)
      .join('\n');

    const prompt = `
You are a helpful book recommender. Based on the following books in a user's library, suggest 4 books they haven't read yet. 
For each recommendation, provide: title, author, and a one-sentence reason why they'd enjoy it.
Respond ONLY with a valid JSON array, no markdown, no extra text.
Format: [{ "title": "...", "author": "...", "reason": "..." }]

User's library:
${libraryList}
    `.trim();

    // 3. Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 4. Parse and return
    const recommendations = JSON.parse(text);
    res.json({ recommendations });

  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
});

module.exports = router;