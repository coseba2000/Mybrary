const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (req, res) => {
  let books = [];
  try {
    // On les trie par date de création et on les limite à 10
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
  } catch {
    books = [];
  }

  res.render('index', { books: books });
});

// exporter le router
module.exports = router;
