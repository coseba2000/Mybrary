const express = require('express');
const router = express.Router();
const Author = require('../models/author');

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

    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect(`authors`);
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating an author',
    });
  }
});

// exporter le router
module.exports = router;
