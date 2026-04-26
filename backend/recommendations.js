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

const prompt = `
You are an expert book recommender. A user has the following books in their library with read statuses:

${libraryList}

Recommend exactly 4 books they haven't read yet. Follow these rules strictly in order of priority:

1. SERIES CONTINUATIONS FIRST: If the user has completed or is currently reading a book in a series, recommend the NEXT unread book in that series. Assume they have read all earlier books in the series — e.g. if they are reading Book 3, they have already read Books 1 and 2, so do NOT recommend those.
2. GENRE MATCH: After covering series continuations, fill remaining slots with books from similar genres or by similar authors.
3. NO DUPLICATES: Never recommend a book already in their library.
4. NEVER recommend a book that comes BEFORE the book they are currently reading or have completed in the same series.

Concrete examples:
- User has "Oathbringer" [currently reading] → Oathbringer is Book 3 of the Stormlight Archive. They have already read The Way of Kings (Book 1) and Words of Radiance (Book 2). Recommend "Rhythm of War" (Book 4).
- User has completed the Mistborn trilogy → recommend "The Alloy of Law" (Mistborn Era 2, Book 1), NOT any book from Era 1.
- User has "The Great Gatsby" [want to read] → suggest similar literary fiction.

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