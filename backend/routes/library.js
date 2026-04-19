const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const UserLibrary = require('../models/UserLibrary');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/library
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await UserLibrary.find({ userId: req.userId })
      .populate('bookId')
      .sort({ addedAt: -1 });

    const books = entries.map((entry) => ({
      ...entry.bookId.toObject(),
      status: entry.status,
      notes: entry.notes || '',
      addedAt: entry.addedAt,
    }));

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/library
router.post('/', authMiddleware, async (req, res) => {
  const { book, status } = req.body;
  if (!book?.id) return res.status(400).json({ message: 'Book data is required' });

  const allowed = ['want-to-read', 'reading', 'finished'];
  const bookStatus = allowed.includes(status) ? status : 'want-to-read';

  try {
    await Book.findByIdAndUpdate(
      book.id,
      {
        _id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        thumbnail: book.thumbnail,
        description: book.description,
        publisher: book.publisher,
        pageCount: Number.isFinite(Number(book.pageCount)) ? Number(book.pageCount) : null,
      },
      { upsert: true, new: true }
    );

    const entry = new UserLibrary({
      userId: req.userId,
      bookId: book.id,
      status: bookStatus,
    });

    await entry.save();
    res.status(201).json({ message: `${book.title} added to your library!` });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already in your library' });
    }
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/library/:bookId/status
router.patch('/:bookId/status', authMiddleware, async (req, res) => {
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

// PATCH /api/library/:bookId/notes
router.patch('/:bookId/notes', authMiddleware, async (req, res) => {
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
router.delete('/:bookId', authMiddleware, async (req, res) => {
  try {
    await UserLibrary.findOneAndDelete({
      userId: req.userId,
      bookId: req.params.bookId,
    });
    res.json({ message: 'Book removed from library' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;