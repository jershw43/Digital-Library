const mongoose = require('mongoose');

const userLibrarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, ref: 'Book', required: true },
  addedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['want-to-read', 'reading', 'finished'],
    default: 'want-to-read',
  },
  notes: String,
});

// Prevent the same book being added twice by the same user
userLibrarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('UserLibrary', userLibrarySchema);
