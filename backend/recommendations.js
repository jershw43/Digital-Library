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

    // ── Build enriched library list with read status ───────────────────────
    const libraryList = books.map((b) => {
      const status =
        b.status === 'finished'      ? 'completed' :
        b.status === 'reading'       ? 'currently reading' :
        b.status === 'want-to-read'  ? 'want to read' :
                                       'want to read';
      return `- "${b.title}" by ${b.author} [${status}]`;
    }).join('\n');

    // ── Improved prompt ───────────────────────────────────────────────────
    const prompt = `
You are an expert book recommender. A user has the following books in their library with read statuses:

${libraryList}

Recommend exactly 4 books they haven't read yet. Follow these rules strictly in order of priority:

1. SERIES CONTINUATIONS FIRST: If the user has completed a book or trilogy that is part of a series, recommend the next book or trilogy in that same series. If they are currently reading a book in a series, recommend the next book in that series.
2. GENRE MATCH: After covering series continuations, fill remaining slots with books from similar genres or by similar authors.
3. NO DUPLICATES: Never recommend a book already in their library.

Concrete examples to follow:
- If they completed the Mistborn trilogy (The Final Empire, The Well of Ascension, The Hero of Ages), suggest "The Alloy of Law" (Mistborn Era 2, Book 1) by Brandon Sanderson.
- If they are currently reading "Oathbringer" (Stormlight Archive Book 3), suggest "Rhythm of War" (Stormlight Archive Book 4) by Brandon Sanderson.
- If they want to read "The Great Gatsby", suggest similar literary fiction.

Respond ONLY with a valid JSON array, no markdown, no extra text.
Format: [{ "title": "...", "author": "...", "reason": "..." }]
    `.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
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