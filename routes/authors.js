const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

// All authors route
router.get('/', async (req, res) => {
  // Variable for the search option
  let searchOptions = {};
  // Une requête get passe les informations via le mot clé 'query' et non body comme avec post

  // if (req.query.name != null && req.query.name !== '') {
  if (req.query.name) {
    searchOptions.name = new RegExp(req.query.name, 'i'); // i -> insensible à la casse
  }

  try {
    // Empty object will return us all the authors
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect('/');
  }
});

// New author route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

// Create author route
router.post('/', async (req, res) => {
  // Création de l'auteur grâce au modèle créé auparavant
  const author = new Author({
    name: req.body.name,
  });

  // Sauvagarde de l'auteur avec callback function
  try {
    const newAuthor = await author.save();

    res.redirect(`authors/${newAuthor.id}`);
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating an author',
    });
  }
});

// Les routes avec des paramètres (ici :id) doivent être en dessous
// Des routes sans paramètre car il regarde de haut en bas et si par exemple
// La route new est déclarée après la route :id, il pense que new est un paramètre
// Et n'ira donc jamais dans la véritable route new

// Single author route
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();

    res.render('authors/show', { author: author, booksByAuthor: books });
  } catch {
    res.redirect('/');
  }
});

// Edit
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', { author: author });
  } catch {
    res.redirect('/authors');
  }
});

// Update
router.put('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();

    res.redirect(`/authors/${author.id}`);
  } catch {
    if (!author) {
      res.redirect('/');
    } else {
      res.render(`/authors/${author.id}/edit`, {
        author: author,
        errorMessage: 'Error updating an author',
      });
    }
  }
});

// Delete
// Toujours utiliser delete pour supprimer car google va dans chaque page du site
// Donc si get pour supprimer cela va supprimer tous quand google explora le site
router.delete('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();

    res.redirect('/authors');
  } catch {
    if (!author) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

// exporter le router
module.exports = router;
