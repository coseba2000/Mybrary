const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// pre = lancer une méthode avant quelque chose (ici supprimer pour vérifier que l'auteur n'est lié à aucuns livre)
authorSchema.pre('remove', function (next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error('This author has books still'));
    } else {
      next(); // C'est ok pour continuer et donc supprimer l'auteur
    }
  });
});

module.exports = mongoose.model('Author', authorSchema);
