const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');

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

// ── POST /api/recommendations ─────────────────────────────────────────────────

router.post('/', auth, async (req, res) => {
  try {
    const books = req.body.books || [];

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite-preview-06-17' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();

    const recommendations = JSON.parse(text);
    res.json({ recommendations });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
});

module.exports = router;