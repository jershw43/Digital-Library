const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  _id: String, // Google Books ID — natural key, no duplicates across users
  title: String,
  author: String,
  year: String,
  thumbnail: String,
  description: String,
  publisher: String,
  pageCount: Number,
});

module.exports = mongoose.model('Book', bookSchema);
