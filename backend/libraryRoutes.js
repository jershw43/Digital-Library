const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// ── Inline models ─────────────────────────────────────────────────────────────

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

const userLibrarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, ref: 'Book', required: true },
  addedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['want-to-read', 'reading', 'finished'], default: 'want-to-read' },
  notes: String,
});
userLibrarySchema.index({ userId: 1, bookId: 1 }, { unique: true });
const UserLibrary = mongoose.models.UserLibrary || mongoose.model('UserLibrary', userLibrarySchema);

// ── Inline auth middleware ────────────────────────────────────────────────────

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token — please log in' });
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('JWT verify failed:', err.message, '| JWT_SECRET set:', !!process.env.JWT_SECRET);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ── Shelf name ↔ status enum ──────────────────────────────────────────────────

const shelfToStatus = {
  'Want to Read':      'want-to-read',
  'Currently Reading': 'reading',
  'Finished Reading':  'finished',
};
const statusToShelf = {
  'want-to-read': 'Want to Read',
  'reading':      'Currently Reading',
  'finished':     'Finished Reading',
};

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/library
router.get('/', auth, async (req, res) => {
  try {
    const entries = await UserLibrary.find({ userId: req.userId })
      .populate('bookId')
      .sort({ addedAt: -1 });

    const books = entries.map((e) => ({
      ...e.bookId.toObject(),
      shelf:   statusToShelf[e.status] || 'Want to Read',
      status:  e.status,
      notes:   e.notes || '',
      addedAt: e.addedAt,
    }));
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/library
router.post('/', auth, async (req, res) => {
  const { book, shelf, status} = req.body;
  if (!book?.id) return res.status(400).json({ message: 'Book data is required' });

  const allowed = ['want-to-read', 'reading', 'finished'];
  const bookStatus = allowed.includes(status) ? status : 'want-to-read';

  try {
    await Book.findByIdAndUpdate(
      book.id,
      {
        _id: book.id, title: book.title, author: book.author, year: book.year,
        thumbnail: book.thumbnail, description: book.description,
        publisher: book.publisher,
        pageCount: Number.isFinite(Number(book.pageCount)) ? Number(book.pageCount) : null,
      },
      { upsert: true, new: true }
    );

    const status = shelfToStatus[shelf] || 'want-to-read';
    const entry = new UserLibrary({ userId: req.userId, bookId: book.id, status: bookStatus });
    await entry.save();
    res.status(201).json({ message: `"${book.title}" added to your library!` });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already in your library' });
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/library/:bookId/shelf
router.patch('/:bookId/shelf', auth, async (req, res) => {
  const { shelf } = req.body;
  const status = shelfToStatus[shelf];
  if (!status) return res.status(400).json({ message: `Invalid shelf: ${shelf}` });

  try {
    await UserLibrary.findOneAndUpdate(
      { userId: req.userId, bookId: req.params.bookId },
      { status },
      { new: true }
    );
    res.json({ message: 'Shelf updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/library/:bookId/notes
router.patch('/:bookId/notes', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    await UserLibrary.findOneAndUpdate(
      { userId: req.userId, bookId: req.params.bookId },
      { notes },
      { new: true }
    );
    res.json({ message: 'Notes saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/library/:bookId
router.delete('/:bookId', auth, async (req, res) => {
  try {
    await UserLibrary.findOneAndDelete({ userId: req.userId, bookId: req.params.bookId });
    res.json({ message: 'Book removed from library' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/library/:bookId/status
router.patch('/:bookId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['want-to-read', 'reading', 'finished'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await UserLibrary.findOneAndUpdate(
      { userId: req.userId, bookId: req.params.bookId },
      { status },
      { new: true }
    );

    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;