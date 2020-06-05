const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// All books route
router.get('/', async (req, res) => {
  let query = Book.find();

  // Titre
  if (req.query.title) {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }

  // Publié avant
  if (req.query.publishedBefore) {
    // lte = less then or equal
    query = query.lte('publishDate', req.query.publishedBefore);
  }

  // Publié après
  if (req.query.publishedAfter) {
    // lte = greater then or equal
    query = query.gte('publishDate', req.query.publishedAfter);
  }

  try {
    // const books = await Book.find({});
    const books = await query.exec();

    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect('/');
  }
});

// New book route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book());
});

// Create book route
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });

  // Sauvegarde cover
  saveCover(book, req.body.cover);

  // sauvegarder le livre
  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id}`);
  } catch {
    renderNewPage(res, book, true);
  }
});

// Single book
router.get('/:id', async (req, res) => {
  try {
    // Populate va nous donner toutes les informations de l'auteur selon son id
    const book = await Book.findById(req.params.id).populate('author').exec();

    res.render('books/show', { book: book });
  } catch {
    res.redirect('/');
  }
});

// Edit
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch {
    res.redirect('/');
  }
});

// Update book route
router.put('/:id', async (req, res) => {
  let book;

  try {
    book = await Book.findById(req.params.id);

    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;

    if (req.body.cover) {
      saveCover(book, req.body.cover);
    }

    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch {
    if (book) {
      renderEditPage(res, book, true);
    } else {
      res.redirect('/');
    }
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect('/books');
  } catch {
    if (book) {
      res.render('books/show', {
        book: book,
        errorMessage: 'Could not remove book',
      });
    } else {
      res.redirect('/');
    }
  }
});

// fonctions
// function removeBookCover(fileName) {
//   fs.unlink(path.join(uploadPath, fileName), err => {
//     if (err) console.err(err);
//   });
// }

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, 'new', hasError);
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };

    if (hasError) {
      if (form === 'new') {
        params.errorMessage = 'Error creating book';
      } else if (form === 'edit') {
        params.errorMessage = 'Error editing book';
      }
    }

    res.render(`books/${form}`, params);
  } catch {
    res.redirect('/books');
  }
}

function saveCover(book, coverEncoded) {
  if (!coverEncoded) return;

  const cover = JSON.parse(coverEncoded);
  if (cover && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

// exporter le router
module.exports = router;
