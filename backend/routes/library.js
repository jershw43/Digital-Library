const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const UserLibrary = require('../models/UserLibrary');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/library — get the logged-in user's books
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await UserLibrary.find({ userId: req.userId })
      .populate('bookId')
      .sort({ addedAt: -1 });

    // Return the book objects directly, with the entry status attached
    const books = entries.map((entry) => ({
      ...entry.bookId.toObject(),
      status: entry.status,
      addedAt: entry.addedAt,
    }));

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/library — add a book to the user's library
router.post('/', authMiddleware, async (req, res) => {
  const { book } = req.body;
  if (!book?.id) return res.status(400).json({ message: 'Book data is required' });

  try {
    const existingBook = await Book.findById(book.id);
    if (!existingBook) {
      await Book.create({
        _id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        thumbnail: book.thumbnail,
        description: book.description,
        publisher: book.publisher,
        pageCount: book.pageCount,
      });
    }

    // Link this book to the user (compound index prevents duplicates)
    const entry = new UserLibrary({ userId: req.userId, bookId: book.id });
    await entry.save();

    res.status(201).json({ message: `"${book.title}" added to your library!` });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'This book is already in your library' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/library/:bookId — remove a book from the user's library
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
