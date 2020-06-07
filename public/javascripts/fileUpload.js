// Aller chercher les styles de ':root'
const rootStyles = window.getComputedStyle(document.documentElement);

// Aller chercher la largeur de book cover (large)
if (rootStyles.getPropertyValue('--book-cover-width-large')) {
  ready();
} else {
  // Sinon on met un event listener pour vérifier quand main.css sera chargé (on lui a donné un id)
  document.getElementById('main-css').addEventListener('load', ready);
}

function ready() {
  const coverWidth = parseFloat(
    rootStyles.getPropertyValue('--book-cover-width-large')
  );
  const coverAspectRatio = parseFloat(
    rootStyles.getPropertyValue('--book-cover-aspect-ratio')
  );
  const coverHeight = coverWidth / coverAspectRatio;

  console.log(coverWidth);
  console.log(coverAspectRatio);
  console.log(coverHeight);

  // Inscrire les plugins utilisés
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );

  // Configuration des options (ici style ratio)
  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight,
  });

  // Convertir tous les input file en tant qu'objets filepond
  FilePond.parse(document.body);
}
