// env development variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Import du fichier contenant les routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

/**
 * Configuration d'express
 */
// On dit quel moteur d'affichage/template on utilise
app.set('view engine', 'ejs');
// On localise l'endroit où vont se trouver les templates
app.set('views', __dirname + '/views');
// On spécifie le fichier qui contiendra le "boiler plate" des templates (ce qui ne change pas => header, footer,..). Chaque fichier va y être injecté
app.set('layout', 'layouts/layout');
// On spécifie l'utilisation d'express layouts
app.use(expressLayouts);
// On dit qu'on utilise methodOverride qui va nous servir via un formulaire d'utiliser d'autres méthode http que post et get (put, delete) et on lui spécifie le paramètre qui va nous permettre de l'utiliser
app.use(methodOverride('_method'));

// On dit a express que notre dossier qui contient les fichiers img,css,js,.. est public
app.use(express.static('public'));
// Librairies qui rend les choses plus facile pour aller chercher la valeur d'un input d'un post dans un requête
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
// app.use(bodyParser.json());

// Configuration base de données (MongoDB)
const mogoose = require('mongoose');
mogoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mogoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Connected to mongoose'));

/**
 * On ne va pas mettre les routes ici car c'est une 'plus grosse application'
 * On utilise le principe MVC (model view controller) et donc nous allons mettre les routes
 * Dans le controller (sur node le dossier controller est plus souvent appelé 'routes')
 */
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

// On dit à l'application quel port elle va utiliser
// process.env.PORT est le serveur qui nous dit le port à utiliser
// Pour le dévelopement en local on le met par défaut à 3000 car aucun serveur ne nous le spécifie
app.listen(process.env.PORT || 3000);
